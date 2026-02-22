import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useWeather } from '../context/WeatherContext.js';

export default function SearchBar(): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const { loading, error, search } = useWeather();

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      search(trimmed);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <form onSubmit={handleFormSubmit} className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a city..."
          className="w-full rounded-full glass py-3 pl-5 pr-14 text-white placeholder-white/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-white/40 focus:scale-[1.02]"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 text-white animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-white" />
          )}
        </button>
      </form>
      {error !== null && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
