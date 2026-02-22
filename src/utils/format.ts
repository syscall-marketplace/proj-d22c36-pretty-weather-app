import type { TemperatureUnit } from '../types/weather.js';

export function formatTemp(temp: number, unit: TemperatureUnit): string {
  if (unit === 'metric') return `${Math.round(temp)}°C`;
  return `${Math.round(temp)}°F`;
}

export function formatWindSpeed(ms: number, unit: TemperatureUnit): string {
  if (unit === 'metric') return `${Math.round(ms)} m/s`;
  return `${Math.round(ms * 2.237)} mph`;
}

export function formatTime(unix: number, timezoneOffset: number): string {
  const local = new Date((unix + timezoneOffset) * 1000);
  return local.toUTCString().slice(17, 22); // HH:MM
}

export function weatherIconUrl(iconCode: string, size: '2x' | '4x' = '2x'): string {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}
