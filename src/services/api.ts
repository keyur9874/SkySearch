export class FlightAPI {
  static async searchFlights() {
    return {
      flights: [
        {
          id: "1",
          segments: [
            {
              origin: {
                code: "JFK",
                name: "John F. Kennedy International",
                city: "New York",
                country: "USA",
              },
              destination: {
                code: "LAX",
                name: "Los Angeles International",
                city: "Los Angeles",
                country: "USA",
              },
              departureTime: "2024-03-15T08:00:00Z",
              arrivalTime: "2024-03-15T14:30:00Z",
              duration: 390,
              flightNumber: "AA123",
              airline: { code: "AA", name: "American Airlines" },
              aircraft: "Boeing 737-800",
            },
          ],
          totalDuration: 390,
          stops: 0,
          price: { amount: 299, currency: "USD" },
          availability: 12,
          bookingClass: "Economy" as const,
          baggage: { carry: "1 x 22lbs", checked: "1 x 50lbs" },
        },
        {
          id: "2",
          segments: [
            {
              origin: {
                code: "JFK",
                name: "John F. Kennedy International",
                city: "New York",
                country: "USA",
              },
              destination: {
                code: "DEN",
                name: "Denver International",
                city: "Denver",
                country: "USA",
              },
              departureTime: "2024-03-15T10:15:00Z",
              arrivalTime: "2024-03-15T13:45:00Z",
              duration: 270,
              flightNumber: "UA456",
              airline: { code: "UA", name: "United Airlines" },
              aircraft: "Airbus A320",
            },
            {
              origin: {
                code: "DEN",
                name: "Denver International",
                city: "Denver",
                country: "USA",
              },
              destination: {
                code: "LAX",
                name: "Los Angeles International",
                city: "Los Angeles",
                country: "USA",
              },
              departureTime: "2024-03-15T15:30:00Z",
              arrivalTime: "2024-03-15T16:45:00Z",
              duration: 135,
              flightNumber: "UA789",
              airline: { code: "UA", name: "United Airlines" },
              aircraft: "Boeing 757-200",
            },
          ],
          totalDuration: 525,
          stops: 1,
          price: { amount: 245, currency: "USD" },
          availability: 8,
          bookingClass: "Economy" as const,
          baggage: { carry: "1 x 22lbs", checked: "1 x 50lbs" },
        },
      ],
    };
  }

  static async getAirports(query: string) {
    return {
      airports: [
        {
          code: "JFK",
          name: "John F. Kennedy International",
          city: "New York",
          country: "USA",
        },
        {
          code: "LAX",
          name: "Los Angeles International",
          city: "Los Angeles",
          country: "USA",
        },
        {
          code: "ORD",
          name: "O'Hare International",
          city: "Chicago",
          country: "USA",
        },
        {
          code: "DFW",
          name: "Dallas/Fort Worth International",
          city: "Dallas",
          country: "USA",
        },
      ].filter(
        (airport) =>
          airport.name.toLowerCase().includes(query.toLowerCase()) ||
          airport.city.toLowerCase().includes(query.toLowerCase()) ||
          airport.code.toLowerCase().includes(query.toLowerCase())
      ),
    };
  }
}
