import { useState } from "react";

import { Plane, Search, ArrowLeft, Sparkles } from "lucide-react";

import { SearchForm } from "./components/SearchForm";
import { FlightResults } from "./components/FlightResults";
import { FlightAPI } from "./services/api";
import { Flight, SearchParams } from "./types/flight";

function App() {
  const [currentView, setCurrentView] = useState<"search" | "results">(
    "search"
  );
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setSearchParams(params);

    try {
      const result = await FlightAPI.searchFlights();
      setFlights(result.flights || []);
      setCurrentView("results");
    } catch (error) {
      console.error("Error searching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight: Flight) => {
    console.log("Selected flight:", flight);
    alert(`Flight ${flight.segments[0].flightNumber} selected!`);
  };

  const handleBackToSearch = () => {
    setCurrentView("search");
    setFlights([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <header className="relative bg-white/70 backdrop-blur-xl border-b border-white/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentView === "results" && (
                <button
                  onClick={handleBackToSearch}
                  className="p-3 hover:bg-white/60 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                    <Plane className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    SkySearch
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">
                    Discover your perfect journey
                  </p>
                </div>
              </div>
            </div>

            {currentView === "results" && searchParams && (
              <div className="hidden md:flex items-center gap-3 bg-white/60  rounded-xl px-4 py-2 border border-white/40">
                <Search className="h-4 w-4 text-indigo-500" />
                <span className="font-semibold text-gray-800">
                  {searchParams.origin} → {searchParams.destination}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {searchParams.passengers.adults +
                    searchParams.passengers.children +
                    searchParams.passengers.infants}{" "}
                  passenger
                  {searchParams.passengers.adults +
                    searchParams.passengers.children +
                    searchParams.passengers.infants >
                  1
                    ? "s"
                    : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "search" && (
          <div className="space-y-12">
            <div className="text-center space-y-6 py-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full px-4 py-2 mb-4">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  Premium Flight Search Experience
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                Your Journey
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Begins Here
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Search and compare flights from hundreds of airlines worldwide.
                Find the best deals, perfect timing, and premium comfort for
                your next adventure.
              </p>
            </div>

            <SearchForm onSearch={handleSearch} loading={loading} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
              <div className="group text-center space-y-6 p-8 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/25 transition-all duration-300">
                    <Search className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Smart Search
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our intelligent search engine finds the best flights across
                  hundreds of airlines with advanced filtering and sorting
                  options.
                </p>
              </div>

              <div className="group text-center space-y-6 p-8 rounded-2xl bg-white/40  border border-white/50 hover:bg-white/60 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:shadow-emerald-500/25 transition-all duration-300">
                    <Plane className="z-[1] h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Best Prices
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Compare real-time prices across all major airlines and booking
                  platforms to ensure you never miss a great deal.
                </p>
              </div>

              <div className="group text-center space-y-6 p-8 rounded-2xl bg-white/40  border border-white/50 hover:bg-white/60 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:shadow-amber-500/25 transition-all duration-300">
                    <svg
                      className="h-10 w-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  24/7 Support
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Get expert assistance whenever you need it with our dedicated
                  customer support team available around the clock.
                </p>
              </div>
            </div>

            <div className="bg-white/50  rounded-2xl border border-white/60 p-8 mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Trusted by millions of travelers
                </h3>
                <p className="text-gray-600">
                  Join the community of smart travelers who choose SkySearch
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    2M+
                  </div>
                  <div className="text-sm text-gray-600">Flights Booked</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    500+
                  </div>
                  <div className="text-sm text-gray-600">Airlines</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600 mb-1">
                    4.9★
                  </div>
                  <div className="text-sm text-gray-600">User Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === "results" && (
          <div className="space-y-6">
            <FlightResults
              flights={flights}
              onSelectFlight={handleSelectFlight}
              loading={loading}
            />
          </div>
        )}
      </main>

      <footer className="relative bg-white/50  border-t border-white/40 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                SkySearch
              </span>
            </div>
            <p className="text-gray-600 font-medium">&copy; 2025 SkySearch.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
