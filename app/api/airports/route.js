// Airports is a JSON file with the following structure:
// {
//     "00AK": {
//         "icao": "00AK",
//         "iata": "",
//         "name": "Lowell Field",
//         "city": "Anchor Point",
//         "state": "Alaska",
//         "country": "US",
//         "elevation": 450,
//         "lat": 59.94919968,
//         "lon": -151.695999146,
//         "tz": "America\/Anchorage"
//     },
//     "00AL": {
//         "icao": "00AL",
//         "iata": "",
//         "name": "Epps Airpark",
//         "city": "Harvest",
//         "state": "Alabama",
//         "country": "US",
//         "elevation": 820,
//         "lat": 34.8647994995,
//         "lon": -86.7703018188,
//         "tz": "America\/Chicago"
//     },
// }

import airports from './data.json';

const firstTenAirports = Object.values(airports).slice(0, 10);

// Memoization cache
const memoCache = new Map();

// Returns a list of airports that match the given query
export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    // If no query is provided, return the first 10 airports
    if (!query?.length) {
        return Response.json(firstTenAirports);
    }

    // Check if the result is already memoized
    if (memoCache.has(query)) {
        return Response.json(memoCache.get(query));
    }


    // If a query is provided, return all airports that match the query
    const queryRegex = new RegExp(query, 'i');
    const matchingAirports = Object.values(airports)
        .filter((airport) => {
            return (
                queryRegex.test(airport.name) || 
                queryRegex.test(airport.city) || 
                queryRegex.test(airport.state) || 
                queryRegex.test(airport.country) || 
                // queryRegex.test(airport.tz) ||
                // queryRegex.test(airport.icao) ||
                queryRegex.test(airport.iata)
            );
        }).slice(0, 10);

    // Memoize the result for future use
    memoCache.set(query, matchingAirports);

    return Response.json(matchingAirports);   
}
