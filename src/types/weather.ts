/** OpenWeatherMap free-tier API response shapes */

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;        // e.g. "Clear", "Clouds", "Rain"
  description: string; // e.g. "clear sky"
  icon: string;        // e.g. "01d"
}

export interface MainMetrics {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;   // hPa
  humidity: number;   // %
}

export interface Wind {
  speed: number; // m/s
  deg: number;
  gust?: number;
}

export interface Sys {
  country: string;
  sunrise: number; // Unix UTC
  sunset: number;  // Unix UTC
}

export interface CurrentWeather {
  coord: Coordinates;
  weather: WeatherCondition[];
  main: MainMetrics;
  visibility: number; // metres
  wind: Wind;
  clouds: { all: number }; // %
  dt: number;             // Unix UTC
  sys: Sys;
  timezone: number;       // offset seconds from UTC
  name: string;           // city name
}

export interface ForecastItem {
  dt: number;
  main: MainMetrics;
  weather: WeatherCondition[];
  wind: Wind;
  pop: number;         // probability of precipitation 0–1
  dt_txt: string;      // e.g. "2024-07-01 12:00:00"
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

/** Derived / UI types */
export interface DailyForecast {
  date: Date;
  label: string;    // "Mon", "Tue", …
  condition: WeatherCondition;
  tempMin: number;
  tempMax: number;
  pop: number;
}

export type TemperatureUnit = 'metric' | 'imperial';

export type WeatherTheme =
  | 'day-clear'
  | 'day-cloudy'
  | 'day-rainy'
  | 'day-snowy'
  | 'night-clear'
  | 'night-cloudy'
  | 'night-rainy'
  | 'night-snowy';

export interface AppState {
  query: string;
  current: CurrentWeather | null;
  forecast: DailyForecast[];
  unit: TemperatureUnit;
  loading: boolean;
  error: string | null;
  theme: WeatherTheme;
}
