import { Plane, Clock, Luggage, Star, Wifi, Coffee } from "lucide-react";
import { format } from "date-fns";

import { Flight, FlightSegment } from "../types/flight";

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm");
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStopsText = (stops: number) => {
    if (stops === 0) return "Nonstop";
    if (stops === 1) return "1 stop";
    return `${stops} stops`;
  };

  const getAirlineColor = (airlineCode: string) => {
    const colors = {
      AA: "from-red-500 to-red-600",
      UA: "from-blue-500 to-blue-600",
      DL: "from-red-600 to-blue-600",
      SW: "from-orange-500 to-red-500",
      B6: "from-blue-400 to-indigo-500",
    };
    return (
      colors[airlineCode as keyof typeof colors] || "from-gray-500 to-gray-600"
    );
  };

  const renderSegment = (segment: FlightSegment, isLast: boolean) => (
    <div
      key={`${segment.flightNumber}-${segment.departureTime}`}
      className="relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(segment.departureTime)}
            </div>
            <div className="text-sm font-medium text-gray-600">
              {segment.origin.code}
            </div>
            <div className="text-xs text-gray-500">{segment.origin.city}</div>
          </div>

          <div className="flex-1 relative px-6">
            <div className="flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div className="relative bg-white px-3">
                <div
                  className={`p-2 bg-gradient-to-r ${getAirlineColor(
                    segment.airline.code
                  )} rounded-full shadow-lg`}
                >
                  <Plane className="h-4 w-4 text-white transform rotate-90" />
                </div>
              </div>
            </div>
            <div className="text-xs text-center text-gray-600 mt-2 font-medium">
              {formatDuration(segment.duration)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(segment.arrivalTime)}
            </div>
            <div className="text-sm font-medium text-gray-600">
              {segment.destination.code}
            </div>
            <div className="text-xs text-gray-500">
              {segment.destination.city}
            </div>
          </div>
        </div>

        <div className="ml-8 text-right">
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-3 h-3 bg-gradient-to-r ${getAirlineColor(
                segment.airline.code
              )} rounded-full`}
            ></div>
            <div className="text-sm font-semibold text-gray-900">
              {segment.airline.name}
            </div>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {segment.flightNumber} • {segment.aircraft}
          </div>
        </div>
      </div>

      {!isLast && flight.segments.length > 1 && (
        <div className="mt-6 mb-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-4 py-2">
            <Clock className="h-4 w-4" />
            Layover in {segment.destination.city}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:bg-white/90 hover:border-blue-200/50">
      <div className="space-y-6">
        {flight.segments.map((segment, index) =>
          renderSegment(segment, index === flight.segments.length - 1)
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                {formatDuration(flight.totalDuration)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  flight.stops === 0
                    ? "bg-green-500"
                    : flight.stops === 1
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="font-medium">{getStopsText(flight.stops)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Luggage className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{flight.baggage.carry}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-gray-400">
              <Wifi className="h-4 w-4" />
              <Coffee className="h-4 w-4" />
              <Star className="h-4 w-4" />
            </div>

            <div className="text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  ${flight.price.amount}
                </span>
                <span className="text-sm text-gray-500">USD</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {flight.bookingClass}
              </div>
            </div>

            <button
              onClick={() => onSelect(flight)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
            >
              Select Flight
            </button>
          </div>
        </div>

        {flight.availability <= 5 && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-medium">
              Only {flight.availability} seat
              {flight.availability > 1 ? "s" : ""} left at this price
            </span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>✓ Free cancellation within 24h</span>
            <span>✓ Price includes taxes & fees</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">4.2 airline rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}
