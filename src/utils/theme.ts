import type { CurrentWeather, WeatherTheme } from '../types/weather.js';

export function deriveTheme(weather: CurrentWeather): WeatherTheme {
  const now = Date.now() / 1000;
  const isNight = now < weather.sys.sunrise || now > weather.sys.sunset;
  const timeOfDay = isNight ? 'night' : 'day';
  const id = weather.weather[0]?.id ?? 800;

  let condition: 'clear' | 'cloudy' | 'rainy' | 'snowy';
  if (id === 800) condition = 'clear';
  else if (id >= 801 && id <= 804) condition = 'cloudy';
  else if ((id >= 300 && id < 600) || (id >= 200 && id < 300)) condition = 'rainy';
  else if (id >= 600 && id < 700) condition = 'snowy';
  else condition = 'cloudy';

  return `${timeOfDay}-${condition}` as WeatherTheme;
}

export const THEME_GRADIENTS: Record<WeatherTheme, string> = {
  'day-clear':   'from-sky-400 via-blue-500 to-indigo-600',
  'day-cloudy':  'from-slate-400 via-blue-400 to-slate-500',
  'day-rainy':   'from-slate-600 via-blue-700 to-slate-800',
  'day-snowy':   'from-blue-200 via-sky-300 to-indigo-300',
  'night-clear': 'from-indigo-950 via-violet-900 to-slate-900',
  'night-cloudy':'from-slate-800 via-slate-700 to-slate-900',
  'night-rainy': 'from-slate-900 via-blue-900 to-slate-950',
  'night-snowy': 'from-indigo-900 via-blue-800 to-slate-800',
};
