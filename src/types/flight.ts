export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface FlightSegment {
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  flightNumber: string;
  airline: {
    code: string;
    name: string;
    logo?: string;
  };
  aircraft: string;
}

export interface Flight {
  id: string;
  segments: FlightSegment[];
  totalDuration: number;
  stops: number;
  price: {
    amount: number;
    currency: string;
  };
  availability: number;
  bookingClass: "Economy" | "Premium Economy" | "Business" | "First";
  baggage: {
    carry: string;
    checked: string;
  };
}

export interface SearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  tripType: TripType;
  cabinClass: CabinClass;
}

export interface FilterOptions {
  maxPrice?: number;
  airlines?: string[];
  stops?: number[];
  departureTime?: string[];
  duration?: { min: number; max: number };
}

export enum TripType {
  OneWay = "one-way",
  RoundTrip = "round-trip",
}

export enum CabinClass {
  Economy = "economy",
  PremiumEconomy = "premium-economy",
  Business = "business",
  First = "first",
}
