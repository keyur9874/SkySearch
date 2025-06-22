import React, { useState, useRef, useEffect } from "react";

import { Plane, Users, ArrowLeftRight, MapPin, Sparkles } from "lucide-react";
import { format } from "date-fns";

import { FlightAPI } from "../services/api";
import { Airport, CabinClass, SearchParams, TripType } from "../types/flight";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [tripType, setTripType] = useState<TripType>(TripType.RoundTrip);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [cabinClass, setCabinClass] = useState<CabinClass>(CabinClass.Economy);

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    Airport[]
  >([]);

  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const passengerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        originRef.current &&
        !originRef.current.contains(event.target as Node)
      ) {
        setShowOriginSuggestions(false);
      }
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target as Node)
      ) {
        setShowDestinationSuggestions(false);
      }
      if (
        passengerRef.current &&
        !passengerRef.current.contains(event.target as Node)
      ) {
        setShowPassengerDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchAirports = async (
    query: string,
    type: "origin" | "destination"
  ) => {
    if (query.length < 2) return;

    try {
      const result = await FlightAPI.getAirports(query);
      if (type === "origin") {
        setOriginSuggestions(result.airports);
        setShowOriginSuggestions(true);
      } else {
        setDestinationSuggestions(result.airports);
        setShowDestinationSuggestions(true);
      }
    } catch (error) {
      console.error("Error searching airports:", error);
    }
  };

  const swapOriginDestination = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      origin,
      destination,
      departDate,
      returnDate: tripType === TripType.RoundTrip ? returnDate : undefined,
      passengers,
      tripType,
      cabinClass,
    });
  };

  const totalPassengers =
    passengers.adults + passengers.children + passengers.infants;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-3xl blur-3xl"></div>

      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/50 p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Plane className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Search Flights
            </h1>
            <p className="text-sm text-gray-600">Find your perfect journey</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-full px-3 py-1">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-amber-700">
                Best Price Guarantee
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mb-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="radio"
                name="tripType"
                value={TripType.RoundTrip}
                checked={tripType === TripType.RoundTrip}
                onChange={(e) => setTripType(e.target.value as TripType)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                  tripType === TripType.RoundTrip
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 group-hover:border-blue-400"
                }`}
              >
                {tripType === TripType.RoundTrip && (
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                )}
              </div>
            </div>
            <span className="text-gray-700 font-medium">Round trip</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="radio"
                name="tripType"
                value={TripType.OneWay}
                checked={tripType === TripType.OneWay}
                onChange={(e) => setTripType(e.target.value as TripType)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                  tripType === TripType.OneWay
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 group-hover:border-blue-400"
                }`}
              >
                {tripType === TripType.OneWay && (
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                )}
              </div>
            </div>
            <span className="text-gray-700 font-medium">One way</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-5 relative" ref={originRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                From
              </label>
              <div className="relative group">
                <MapPin className="z-[1] absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => {
                    setOrigin(e.target.value);
                    searchAirports(e.target.value, "origin");
                  }}
                  onFocus={() =>
                    origin.length >= 2 && setShowOriginSuggestions(true)
                  }
                  placeholder="Enter city or airport"
                  className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md"
                  required
                />
              </div>
              {showOriginSuggestions && originSuggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                  {originSuggestions.map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => {
                        setOrigin(`${airport.city} (${airport.code})`);
                        setShowOriginSuggestions(false);
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                    >
                      <div className="font-semibold text-gray-900">
                        {airport.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {airport.city}, {airport.country} ({airport.code})
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-center">
              <button
                type="button"
                onClick={swapOriginDestination}
                className="p-3 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <ArrowLeftRight className="h-5 w-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
              </button>
            </div>

            <div className="md:col-span-5 relative" ref={destinationRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                To
              </label>
              <div className="relative group">
                <MapPin className="z-[1] absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    searchAirports(e.target.value, "destination");
                  }}
                  onFocus={() =>
                    destination.length >= 2 &&
                    setShowDestinationSuggestions(true)
                  }
                  placeholder="Enter city or airport"
                  className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md"
                  required
                />
              </div>
              {showDestinationSuggestions &&
                destinationSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                    {destinationSuggestions.map((airport) => (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => {
                          setDestination(`${airport.city} (${airport.code})`);
                          setShowDestinationSuggestions(false);
                        }}
                        className="w-full text-left px-6 py-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                      >
                        <div className="font-semibold text-gray-900">
                          {airport.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {airport.city}, {airport.country} ({airport.code})
                        </div>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Departure
              </label>
              <div className="relative group">
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="w-full pl-4 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 shadow-sm hover:shadow-md"
                  required
                />
              </div>
            </div>

            {tripType === TripType.RoundTrip && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Return
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departDate || format(new Date(), "yyyy-MM-dd")}
                    className="w-full pl-4 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 shadow-sm hover:shadow-md"
                    required
                  />
                </div>
              </div>
            )}

            <div className="relative backdrop-blur-none" ref={passengerRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Passengers
              </label>
              <button
                type="button"
                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md group"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400 group-focus:text-blue-500 transition-colors" />
                  <span className="text-gray-900 font-medium">
                    {totalPassengers} passenger{totalPassengers > 1 ? "s" : ""}
                  </span>
                </div>
                <svg
                  className="h-4 w-4 text-gray-400 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showPassengerDropdown && (
                <div className="z-[100] absolute z-20 w-full min-w-[250px] mt-2 bg-white/95 backdrop-blur-none border border-gray-200 rounded-2xl shadow-2xl p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-900 font-medium">
                          Adults
                        </span>
                        <div className="text-sm text-gray-500">12+ years</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setPassengers((prev) => ({
                              ...prev,
                              adults: Math.max(1, prev.adults - 1),
                            }))
                          }
                          className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">
                          {passengers.adults}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setPassengers((prev) => ({
                              ...prev,
                              adults: Math.min(9, prev.adults + 1),
                            }))
                          }
                          className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-900 font-medium">
                          Children
                        </span>
                        <div className="text-sm text-gray-500">2-11 years</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setPassengers((prev) => ({
                              ...prev,
                              children: Math.max(0, prev.children - 1),
                            }))
                          }
                          className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">
                          {passengers.children}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setPassengers((prev) => ({
                              ...prev,
                              children: Math.min(9, prev.children + 1),
                            }))
                          }
                          className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-900 font-medium">
                          Infants
                        </span>
                        <div className="text-sm text-gray-500">
                          Under 2 years
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setPassengers((prev) => ({
                              ...prev,
                              infants: Math.max(0, prev.infants - 1),
                            }))
                          }
                          className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">
                          {passengers.infants}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setPassengers((prev) => ({
                              ...prev,
                              infants: Math.min(
                                passengers.adults,
                                prev.infants + 1
                              ),
                            }))
                          }
                          className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Class
              </label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as any)}
                className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 shadow-sm hover:shadow-md"
              >
                <option value="economy">Economy</option>
                <option value="premium-economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-12 py-4 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching flights...
                </>
              ) : (
                <>
                  <Plane className="h-5 w-5" />
                  Search Flights
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
