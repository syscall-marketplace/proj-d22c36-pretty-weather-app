import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AppState, TemperatureUnit } from '../types/weather.js';
import { fetchCurrentWeather, fetchForecast } from '../services/weatherApi.js';
import { deriveTheme } from '../utils/theme.js';

const STORAGE_KEY = 'weatherlens-last-city';

interface WeatherContextValue extends AppState {
  search: (city: string) => void;
  setUnit: (u: TemperatureUnit) => void;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    query: '',
    current: null,
    forecast: [],
    unit: 'metric',
    loading: false,
    error: null,
    theme: 'day-clear',
  });

  const unitRef = useRef(state.unit);
  unitRef.current = state.unit;

  const search = useCallback((city: string) => {
    const unit = unitRef.current;
    setState((prev) => ({ ...prev, query: city, loading: true, error: null }));

    Promise.all([
      fetchCurrentWeather(city, unit),
      fetchForecast(city, unit),
    ])
      .then(([current, forecast]) => {
        const theme = deriveTheme(current);
        setState((prev) => ({
          ...prev,
          current,
          forecast,
          theme,
          loading: false,
          error: null,
        }));
        localStorage.setItem(STORAGE_KEY, city);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to fetch weather data';
        setState((prev) => ({ ...prev, loading: false, error: message }));
      });
  }, []);

  const setUnit = useCallback(
    (u: TemperatureUnit) => {
      setState((prev) => ({ ...prev, unit: u }));
      unitRef.current = u;
      if (state.current) {
        const city = state.query || state.current.name;
        setState((prev) => ({ ...prev, loading: true, error: null }));

        Promise.all([
          fetchCurrentWeather(city, u),
          fetchForecast(city, u),
        ])
          .then(([current, forecast]) => {
            const theme = deriveTheme(current);
            setState((prev) => ({
              ...prev,
              current,
              forecast,
              theme,
              loading: false,
              error: null,
            }));
          })
          .catch((err: unknown) => {
            const message =
              err instanceof Error ? err.message : 'Failed to fetch weather data';
            setState((prev) => ({ ...prev, loading: false, error: message }));
          });
      }
    },
    [state.current, state.query],
  );

  useEffect(() => {
    const savedCity = localStorage.getItem(STORAGE_KEY) || 'London';
    search(savedCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WeatherContext.Provider value={{ ...state, search, setUnit }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather(): WeatherContextValue {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within a WeatherProvider');
  return ctx;
}
