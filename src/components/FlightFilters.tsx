import { Filter, X, Plane, Clock, DollarSign } from "lucide-react";
import { FilterOptions } from "../types/flight";

interface FlightFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export function FlightFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: FlightFiltersProps) {
  const airlines = [
    { code: "AA", name: "American Airlines", color: "from-red-500 to-red-600" },
    { code: "UA", name: "United Airlines", color: "from-blue-500 to-blue-600" },
    { code: "DL", name: "Delta Air Lines", color: "from-red-600 to-blue-600" },
    {
      code: "SW",
      name: "Southwest Airlines",
      color: "from-orange-500 to-red-500",
    },
    {
      code: "B6",
      name: "JetBlue Airways",
      color: "from-blue-400 to-indigo-500",
    },
  ];

  const stops = [
    {
      value: 0,
      label: "Nonstop",
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
    },
    {
      value: 1,
      label: "1 stop",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 border-yellow-200",
    },
    {
      value: 2,
      label: "2+ stops",
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
    },
  ];

  const departureTimeRanges = [
    {
      value: "early-morning",
      label: "Early morning",
      time: "12:00 AM - 5:59 AM",
      icon: "🌙",
    },
    {
      value: "morning",
      label: "Morning",
      time: "6:00 AM - 11:59 AM",
      icon: "🌅",
    },
    {
      value: "afternoon",
      label: "Afternoon",
      time: "12:00 PM - 5:59 PM",
      icon: "☀️",
    },
    {
      value: "evening",
      label: "Evening",
      time: "6:00 PM - 11:59 PM",
      icon: "🌆",
    },
  ];

  const handleAirlineChange = (airlineCode: string, checked: boolean) => {
    const currentAirlines = filters.airlines || [];
    const newAirlines = checked
      ? [...currentAirlines, airlineCode]
      : currentAirlines.filter((code) => code !== airlineCode);

    onFiltersChange({ ...filters, airlines: newAirlines });
  };

  const handleStopsChange = (stopCount: number, checked: boolean) => {
    const currentStops = filters.stops || [];
    const newStops = checked
      ? [...currentStops, stopCount]
      : currentStops.filter((count) => count !== stopCount);

    onFiltersChange({ ...filters, stops: newStops });
  };

  const handleDepartureTimeChange = (timeRange: string, checked: boolean) => {
    const currentTimes = filters.departureTime || [];
    const newTimes = checked
      ? [...currentTimes, timeRange]
      : currentTimes.filter((time) => time !== timeRange);

    onFiltersChange({ ...filters, departureTime: newTimes });
  };

  const hasActiveFilters =
    (filters.airlines?.length || 0) > 0 ||
    (filters.stops?.length || 0) > 0 ||
    (filters.departureTime?.length || 0) > 0 ||
    filters.maxPrice !== undefined;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-blue-500 hover:text-blue-600 text-sm font-semibold flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-green-500" />
            <h4 className="font-semibold text-gray-900">Max Price</h4>
          </div>
          <div className="px-2">
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={filters.maxPrice || 2000}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  maxPrice: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                  ((filters.maxPrice || 2000) - 100) / 19
                }%, #e5e7eb ${
                  ((filters.maxPrice || 2000) - 100) / 19
                }%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>$100</span>
              <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                ${filters.maxPrice || 2000}
              </span>
              <span>$2000+</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-4 w-4 text-blue-500" />
            <h4 className="font-semibold text-gray-900">Airlines</h4>
          </div>
          <div className="space-y-3">
            {airlines.map((airline) => (
              <label
                key={airline.code}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.airlines?.includes(airline.code) || false}
                    onChange={(e) =>
                      handleAirlineChange(airline.code, e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      filters.airlines?.includes(airline.code)
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 group-hover:border-blue-400"
                    }`}
                  >
                    {filters.airlines?.includes(airline.code) && (
                      <svg
                        className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div
                  className={`w-4 h-4 bg-gradient-to-r ${airline.color} rounded-full`}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {airline.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-purple-500" />
            <h4 className="font-semibold text-gray-900">Stops</h4>
          </div>
          <div className="space-y-3">
            {stops.map((stop) => (
              <label
                key={stop.value}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.stops?.includes(stop.value) || false}
                    onChange={(e) =>
                      handleStopsChange(stop.value, e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      filters.stops?.includes(stop.value)
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 group-hover:border-blue-400"
                    }`}
                  >
                    {filters.stops?.includes(stop.value) && (
                      <svg
                        className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-lg border text-xs font-medium ${stop.bgColor} ${stop.color}`}
                >
                  {stop.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-orange-500" />
            <h4 className="font-semibold text-gray-900">Departure Time</h4>
          </div>
          <div className="space-y-3">
            {departureTimeRanges.map((range) => (
              <label
                key={range.value}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={
                      filters.departureTime?.includes(range.value) || false
                    }
                    onChange={(e) =>
                      handleDepartureTimeChange(range.value, e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                      filters.departureTime?.includes(range.value)
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 group-hover:border-blue-400"
                    }`}
                  >
                    {filters.departureTime?.includes(range.value) && (
                      <svg
                        className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="text-2xl">{range.icon}</div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    {range.label}
                  </div>
                  <div className="text-xs text-gray-500">{range.time}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
