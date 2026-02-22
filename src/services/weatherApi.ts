import axios from 'axios';
import type {
  CurrentWeather,
  DailyForecast,
  ForecastItem,
  ForecastResponse,
  TemperatureUnit,
  WeatherCondition,
} from '../types/weather.js';

const API_BASE = 'https://api.openweathermap.org/data/2.5';

function getApiKey(): string {
  const key = import.meta.env.VITE_OWM_API_KEY as string | undefined;
  if (!key) throw new Error('Missing VITE_OWM_API_KEY environment variable');
  return key;
}

export async function fetchCurrentWeather(
  city: string,
  unit: TemperatureUnit,
): Promise<CurrentWeather> {
  const { data } = await axios.get<CurrentWeather>(`${API_BASE}/weather`, {
    params: { q: city, units: unit, appid: getApiKey() },
  });
  return data;
}

export async function fetchForecast(
  city: string,
  unit: TemperatureUnit,
): Promise<DailyForecast[]> {
  const { data } = await axios.get<ForecastResponse>(`${API_BASE}/forecast`, {
    params: { q: city, units: unit, cnt: 40, appid: getApiKey() },
  });
  return groupByDay(data.list, data.city.timezone);
}

function groupByDay(items: ForecastItem[], timezoneOffset: number): DailyForecast[] {
  const dayMap = new Map<string, ForecastItem[]>();

  for (const item of items) {
    const localMs = (item.dt + timezoneOffset) * 1000;
    const d = new Date(localMs);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    const bucket = dayMap.get(key);
    if (bucket) {
      bucket.push(item);
    } else {
      dayMap.set(key, [item]);
    }
  }

  const days: DailyForecast[] = [];

  for (const [, slots] of dayMap) {
    let tempMin = Infinity;
    let tempMax = -Infinity;
    let maxPop = 0;
    const conditionCount = new Map<string, { count: number; condition: WeatherCondition }>();

    for (const slot of slots) {
      if (slot.main.temp_min < tempMin) tempMin = slot.main.temp_min;
      if (slot.main.temp_max > tempMax) tempMax = slot.main.temp_max;
      if (slot.pop > maxPop) maxPop = slot.pop;

      const cond = slot.weather[0];
      if (cond) {
        const existing = conditionCount.get(cond.main);
        if (existing) {
          existing.count++;
        } else {
          conditionCount.set(cond.main, { count: 1, condition: cond });
        }
      }
    }

    let dominantCondition = slots[0].weather[0];
    let highestCount = 0;
    for (const [, entry] of conditionCount) {
      if (entry.count > highestCount) {
        highestCount = entry.count;
        dominantCondition = entry.condition;
      }
    }

    const localMs = (slots[0].dt + timezoneOffset) * 1000;
    const date = new Date(localMs);
    const label = date.toLocaleDateString('en-US', {
      weekday: 'short',
      timeZone: 'UTC',
    });

    days.push({
      date,
      label,
      condition: dominantCondition,
      tempMin,
      tempMax,
      pop: maxPop,
    });
  }

  return days;
}
