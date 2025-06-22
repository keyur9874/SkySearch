import { useState, useMemo } from "react";

import { ArrowUpDown, Filter as FilterIcon } from "lucide-react";

import { Flight, FilterOptions } from "../types/flight";
import { FlightCard } from "./FlightCard";
import { FlightFilters } from "./FlightFilters";

interface FlightResultsProps {
  flights: Flight[];
  onSelectFlight: (flight: Flight) => void;
  loading?: boolean;
}

type SortOption = "price" | "duration" | "departure" | "stops";

export function FlightResults({
  flights,
  onSelectFlight,
  loading,
}: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>("price");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const filteredAndSortedFlights = useMemo(() => {
    let filtered = [...flights];

    // Apply filters
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (flight) => flight.price.amount <= filters.maxPrice!
      );
    }

    if (filters.airlines?.length) {
      filtered = filtered.filter((flight) =>
        flight.segments.some((segment) =>
          filters.airlines!.includes(segment.airline.code)
        )
      );
    }

    if (filters.stops?.length) {
      filtered = filtered.filter((flight) =>
        filters.stops!.includes(flight.stops)
      );
    }

    // Sort flights
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price.amount - b.price.amount;
        case "duration":
          return a.totalDuration - b.totalDuration;
        case "departure":
          return (
            new Date(a.segments[0].departureTime).getTime() -
            new Date(b.segments[0].departureTime).getTime()
          );
        case "stops":
          return a.stops - b.stops;
        default:
          return 0;
      }
    });

    return filtered;
  }, [flights, filters, sortBy]);

  const clearFilters = () => {
    setFilters({});
  };

  const sortOptions = [
    { value: "price" as const, label: "Price (lowest)" },
    { value: "duration" as const, label: "Duration (shortest)" },
    { value: "departure" as const, label: "Departure time" },
    { value: "stops" as const, label: "Stops (fewest)" },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-pulse"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-32 h-1 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredAndSortedFlights.length} flight
            {filteredAndSortedFlights.length !== 1 ? "s" : ""} found
          </h2>
          <p className="text-gray-600">Choose your preferred flight</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FilterIcon className="h-4 w-4" />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div
          className={`lg:col-span-1 ${
            showFilters ? "block" : "hidden lg:block"
          }`}
        >
          <FlightFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          {filteredAndSortedFlights.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="text-gray-500 mb-4">
                <svg
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33M15 17.75v.01M9 17.75v.01"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No flights found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            filteredAndSortedFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onSelect={onSelectFlight}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
