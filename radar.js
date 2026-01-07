/**
 * Snippit - Radar Mode Data & Chart
 * ==================================
 * Contains location data with radar characteristics for Radar mode.
 * Each location has values for 10 axes that describe its characteristics.
 * 
 * Radar Axes (0-100 scale):
 * - temperature: 0 = Hot, 100 = Cold
 * - terrain: 0 = Flat, 100 = Mountainous
 * - coast: 0 = Inland, 100 = Coastal
 * - latitude: 0 = Equator, 100 = Polar
 * - population: 0 = Rural, 100 = Urban
 * - precipitation: 0 = Arid, 100 = Rainy
 * - accessibility: 100 = Remote, 100 = Accessible
 * - development: 0 = Developing, 100 = Developed
 * - tourism: 0 = Unexplored, 100 = Tourist Hub
 * - wealth: 0 = Poor, 100 = Wealthy
 * 
 * Used by: app.js (Radar mode)
 */

// Radar mode dataset
// Each item has coordinates, a name, and radar values for the 7 axes.
const radarLocations = [
    {
        name: 'Reykjavik, Iceland',
        fact: 'Reykjavik is the northernmost capital of a sovereign state and is known for its geothermal activity.',
        lat: 64.1466,
        lng: -21.9426,
        radar: {
            temperature: 85,      // Cold
            terrain: 15,    // Relatively flat
            coast: 95,      // Very coastal
            latitude: 80,     // Near polar
            population: 45,        // Small city
            precipitation: 65,     // Moderate-wet
            accessibility: 75,    // Fairly isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Dubai, UAE',
        fact: 'Dubai transformed from a small fishing village to a global metropolis in just a few decades.',
        lat: 25.2048,
        lng: 55.2708,
        radar: {
            temperature: 5,       // Very hot
            terrain: 5,     // Very flat
            coast: 90,      // Coastal
            latitude: 25,     // Near equator
            population: 95,        // Mega-city
            precipitation: 5,      // Very dry
            accessibility: 15,    // Very central (hub)
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Kathmandu, Nepal',
        fact: 'Kathmandu Valley contains seven UNESCO World Heritage Sites within a 15km radius.',
        lat: 27.7172,
        lng: 85.3240,
        radar: {
            temperature: 55,      // Moderate
            terrain: 90,    // Very mountainous
            coast: 5,       // Very inland
            latitude: 30,     // Subtropical
            population: 70,        // Large city
            precipitation: 70,     // Wet (monsoon)
            accessibility: 60,    // Somewhat isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Singapore',
        fact: 'Singapore is one of only three surviving city-states in the world.',
        lat: 1.3521,
        lng: 103.8198,
        radar: {
            temperature: 10,      // Hot tropical
            terrain: 5,     // Very flat
            coast: 100,     // Island nation
            latitude: 5,      // On the equator
            population: 100,       // Mega-city
            precipitation: 85,     // Very wet
            accessibility: 5,    // Major global hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'La Paz, Bolivia',
        fact: 'La Paz is the highest capital city in the world at about 3,640 meters above sea level.',
        lat: -16.4897,
        lng: -68.1193,
        radar: {
            temperature: 50,      // Cool due to altitude
            terrain: 95,    // Very high altitude
            coast: 5,       // Landlocked
            latitude: 20,     // Tropical latitude
            population: 65,        // Large city
            precipitation: 45,     // Moderate
            accessibility: 70,    // Fairly isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Sydney, Australia',
        fact: 'The Sydney Opera House took 16 years to build and cost 14 times its original budget.',
        lat: -33.8688,
        lng: 151.2093,
        radar: {
            temperature: 35,      // Warm temperate
            terrain: 15,    // Coastal plains
            coast: 95,      // Harbor city
            latitude: 40,     // Mid-latitude
            population: 90,        // Major city
            precipitation: 50,     // Moderate
            accessibility: 40,    // Moderate connectivity
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Ulaanbaatar, Mongolia',
        fact: 'Ulaanbaatar is the coldest capital city in the world with winter temperatures dropping to -40Â°C.',
        lat: 47.8864,
        lng: 106.9057,
        radar: {
            temperature: 95,      // Extremely cold
            terrain: 70,    // High plateau
            coast: 0,       // Very landlocked
            latitude: 55,     // Mid-high latitude
            population: 55,        // Medium city
            precipitation: 15,     // Very dry
            accessibility: 85,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Mumbai, India',
        fact: 'Mumbai\'s local railway carries over 7.5 million passengers daily, making it the busiest railway in the world.',
        lat: 19.0760,
        lng: 72.8777,
        radar: {
            temperature: 15,      // Hot tropical
            terrain: 5,     // Coastal flat
            coast: 95,      // Peninsula
            latitude: 22,     // Tropical
            population: 100,       // Mega-city
            precipitation: 90,     // Monsoon - very wet
            accessibility: 15,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'TromsÃ¸, Norway',
        fact: 'TromsÃ¸ experiences polar night from November to January and midnight sun from May to July.',
        lat: 69.6492,
        lng: 18.9553,
        radar: {
            temperature: 90,      // Very cold
            terrain: 40,    // Fjord/mountain mix
            coast: 85,      // Fjord coast
            latitude: 90,     // Arctic
            population: 30,        // Small city
            precipitation: 55,     // Moderate
            accessibility: 80,    // Remote
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Lima, Peru',
        fact: 'Lima is one of the driest capital cities despite being on the coast, receiving less than 2cm of rain annually.',
        lat: -12.0464,
        lng: -77.0428,
        radar: {
            temperature: 30,      // Mild/warm
            terrain: 10,    // Coastal
            coast: 95,      // Pacific coast
            latitude: 15,     // Tropical
            population: 85,        // Large city
            precipitation: 5,      // Extremely dry
            accessibility: 45,    // Moderate
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Lhasa, Tibet',
        fact: 'Lhasa sits at 3,650m elevation and is known as the "Place of the Gods".',
        lat: 29.6500,
        lng: 91.1000,
        radar: {
            temperature: 65,      // Cold due to altitude
            terrain: 100,   // Extremely high
            coast: 0,       // Very inland
            latitude: 35,     // Mid-latitude
            population: 40,        // Small city
            precipitation: 25,     // Semi-arid
            accessibility: 90,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Manaus, Brazil',
        fact: 'Manaus is a city of 2 million people in the heart of the Amazon rainforest, accessible mainly by boat or plane.',
        lat: -3.1190,
        lng: -60.0217,
        radar: {
            temperature: 10,      // Hot tropical
            terrain: 10,    // Lowland
            coast: 25,      // River inland
            latitude: 5,      // Equatorial
            population: 70,        // Large city
            precipitation: 95,     // Extremely wet
            accessibility: 85,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Tokyo, Japan',
        fact: 'The Greater Tokyo Area is the most populous metropolitan area in the world with over 37 million people.',
        lat: 35.6762,
        lng: 139.6503,
        radar: {
            temperature: 45,      // Temperate
            terrain: 20,    // Coastal plain
            coast: 80,      // Bay area
            latitude: 42,     // Mid-latitude
            population: 100,       // Mega-city
            precipitation: 65,     // Moderate-wet
            accessibility: 10,    // Major global hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Nairobi, Kenya',
        fact: 'Nairobi is the only capital city in the world with a national park within its boundaries.',
        lat: -1.2921,
        lng: 36.8219,
        radar: {
            temperature: 35,      // Mild (highland)
            terrain: 70,    // High plateau
            coast: 5,       // Inland
            latitude: 5,      // Equatorial
            population: 75,        // Large city
            precipitation: 45,     // Moderate
            accessibility: 50,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Longyearbyen, Svalbard',
        fact: 'Longyearbyen is one of the northernmost settlements in the world, where it\'s illegal to die (no cemetery due to permafrost).',
        lat: 78.2232,
        lng: 15.6267,
        radar: {
            temperature: 100,     // Arctic cold
            terrain: 30,    // Mountainous terrain
            coast: 75,      // Fjord coast
            latitude: 100,    // Near North Pole
            population: 10,        // Tiny settlement
            precipitation: 20,     // Arctic desert
            accessibility: 95,    // Extremely isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Cairo, Egypt',
        fact: 'Cairo is the largest city in Africa and the Arab world, and has been continuously inhabited for over 1,000 years.',
        lat: 30.0444,
        lng: 31.2357,
        radar: {
            temperature: 10,      // Hot desert
            terrain: 10,    // Nile valley
            coast: 40,      // Near Mediterranean
            latitude: 35,     // Subtropical
            population: 95,        // Mega-city
            precipitation: 5,      // Very dry
            accessibility: 20,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Vancouver, Canada',
        fact: 'Vancouver is consistently ranked as one of the most livable cities in the world.',
        lat: 49.2827,
        lng: -123.1207,
        radar: {
            temperature: 55,      // Mild/cool
            terrain: 50,    // Mountains nearby
            coast: 90,      // Pacific coast
            latitude: 55,     // Northern temperate
            population: 80,        // Large city
            precipitation: 75,     // Rainy
            accessibility: 35,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Alice Springs, Australia',
        fact: 'Alice Springs is almost exactly in the center of Australia, over 1,500km from the nearest major city.',
        lat: -23.6980,
        lng: 133.8807,
        radar: {
            temperature: 15,      // Hot desert
            terrain: 55,    // Desert plateau
            coast: 0,       // Very inland
            latitude: 28,     // Subtropical
            population: 20,        // Small town
            precipitation: 10,     // Very dry
            accessibility: 95,    // Extremely isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Amsterdam, Netherlands',
        fact: 'Amsterdam has more canals than Venice and more bridges than Paris.',
        lat: 52.3676,
        lng: 4.9041,
        radar: {
            temperature: 55,      // Cool temperate
            terrain: 0,     // Below sea level
            coast: 75,      // Near North Sea
            latitude: 58,     // Northern Europe
            population: 80,        // Major city
            precipitation: 60,     // Moderate-wet
            accessibility: 5,    // Very central (Europe)
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Cape Town, South Africa',
        fact: 'Table Mountain is one of the oldest mountains in the world at approximately 600 million years old.',
        lat: -33.9249,
        lng: 18.4241,
        radar: {
            temperature: 40,      // Mediterranean
            terrain: 65,    // Mountain backdrop
            coast: 95,      // Peninsula
            latitude: 40,     // Mid-latitude
            population: 75,        // Large city
            precipitation: 35,     // Seasonal
            accessibility: 55,    // Moderate
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Ushuaia, Argentina',
        fact: 'Ushuaia is the southernmost city in the world, often called "The End of the World".',
        lat: -54.8019,
        lng: -68.3030,
        radar: {
            temperature: 75,      // Cold subpolar
            terrain: 55,    // Mountainous coast
            coast: 90,      // Beagle Channel
            latitude: 70,     // Subantarctic
            population: 25,        // Small city
            precipitation: 55,     // Moderate
            accessibility: 90,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Timbuktu, Mali',
        fact: 'Once a major trading hub on trans-Saharan caravan routes, Timbuktu is now synonymous with remoteness.',
        lat: 16.7666,
        lng: -3.0026,
        radar: {
            temperature: 5,       // Hot desert
            terrain: 20,    // Sahel lowlands
            coast: 0,       // Very inland
            latitude: 20,     // Tropical
            population: 15,        // Small town
            precipitation: 10,     // Very dry
            accessibility: 95,    // Extremely isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Helsinki, Finland',
        fact: 'Helsinki is known as the "Daughter of the Baltic" and has the world\'s largest sea fortress.',
        lat: 60.1699,
        lng: 24.9384,
        radar: {
            temperature: 85,      // Cold
            terrain: 15,    // Low coastal
            coast: 85,      // Baltic Sea
            latitude: 75,     // Northern
            population: 70,        // Large city
            precipitation: 50,     // Moderate
            accessibility: 30,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Phoenix, Arizona',
        fact: 'Phoenix is the hottest major city in the United States, with temperatures exceeding 100Â°F for months.',
        lat: 33.4484,
        lng: -112.0740,
        radar: {
            temperature: 0,       // Extremely hot
            terrain: 35,    // Desert plateau
            coast: 0,       // Very inland
            latitude: 38,     // Subtropical
            population: 85,        // Large city
            precipitation: 5,      // Very dry
            accessibility: 25,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Bergen, Norway',
        fact: 'Bergen is known as the "City of Seven Mountains" and receives over 2,250mm of rain annually.',
        lat: 60.3913,
        lng: 5.3221,
        radar: {
            temperature: 70,      // Cool oceanic
            terrain: 60,    // Fjord mountains
            coast: 95,      // Fjord coast
            latitude: 75,     // Northern
            population: 50,        // Medium city
            precipitation: 95,     // Extremely wet
            accessibility: 55,    // Moderate
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Quito, Ecuador',
        fact: 'Quito sits at 2,850m elevation on the equator, giving it eternal spring weather.',
        lat: -0.1807,
        lng: -78.4678,
        radar: {
            temperature: 55,      // Cool due to altitude
            terrain: 85,    // High Andes
            coast: 15,      // Inland but near coast
            latitude: 5,      // On the equator
            population: 75,        // Large city
            precipitation: 60,     // Moderate-wet
            accessibility: 50,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Istanbul, Turkey',
        fact: 'Istanbul is the only city in the world that spans two continents: Europe and Asia.',
        lat: 41.0082,
        lng: 28.9784,
        radar: {
            temperature: 45,      // Temperate
            terrain: 30,    // Hilly coastal
            coast: 90,      // Bosphorus Strait
            latitude: 48,     // Mid-latitude
            population: 95,        // Mega-city
            precipitation: 50,     // Moderate
            accessibility: 10,    // Major crossroads
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Anchorage, Alaska',
        fact: 'Anchorage is home to nearly 40% of Alaska\'s entire population.',
        lat: 61.2181,
        lng: -149.9003,
        radar: {
            temperature: 85,      // Cold subarctic
            terrain: 45,    // Coastal mountains
            coast: 80,      // Cook Inlet
            latitude: 78,     // Subarctic
            population: 50,        // Medium city
            precipitation: 45,     // Moderate
            accessibility: 80,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Marrakech, Morocco',
        fact: 'Marrakech is known as the "Red City" for its distinctive sandstone buildings.',
        lat: 31.6295,
        lng: -7.9811,
        radar: {
            temperature: 15,      // Hot semi-arid
            terrain: 50,    // Foothills
            coast: 20,      // Interior
            latitude: 36,     // Subtropical
            population: 70,        // Large city
            precipitation: 15,     // Dry
            accessibility: 35,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Yakutsk, Russia',
        fact: 'Yakutsk is the coldest major city on Earth, with winter temperatures below -40Â°C.',
        lat: 62.0355,
        lng: 129.6755,
        radar: {
            temperature: 100,     // Extreme continental cold
            terrain: 40,    // River valley
            coast: 0,       // Very inland
            latitude: 78,     // Subarctic
            population: 50,        // Medium city
            precipitation: 20,     // Very dry
            accessibility: 90,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Honolulu, Hawaii',
        fact: 'Honolulu is the most isolated major city in the world, over 2,000 miles from the nearest continent.',
        lat: 21.3099,
        lng: -157.8581,
        radar: {
            temperature: 20,      // Tropical warm
            terrain: 15,    // Coastal plain
            coast: 100,     // Island
            latitude: 25,     // Tropical
            population: 75,        // Large city
            precipitation: 65,     // Moderate-wet
            accessibility: 95,    // Extremely isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Buenos Aires, Argentina',
        fact: 'Buenos Aires is known as the "Paris of South America" for its European architecture and culture.',
        lat: -34.6037,
        lng: -58.3816,
        radar: {
            temperature: 35,      // Humid subtropical
            terrain: 10,    // Coastal plain
            coast: 70,      // RÃ­o de la Plata
            latitude: 40,     // Mid-latitude
            population: 95,        // Mega-city
            precipitation: 55,     // Moderate
            accessibility: 30,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Addis Ababa, Ethiopia',
        fact: 'Addis Ababa is the diplomatic capital of Africa, hosting the African Union headquarters.',
        lat: 9.0320,
        lng: 38.7469,
        radar: {
            temperature: 50,      // Highland temperate
            terrain: 85,    // High plateau
            coast: 0,       // Very inland
            latitude: 12,     // Tropical
            population: 80,        // Large city
            precipitation: 60,     // Moderate (monsoon)
            accessibility: 45,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Nuuk, Greenland',
        fact: 'Nuuk is the world\'s smallest capital city by population and the most northern capital in North America.',
        lat: 64.1814,
        lng: -51.6941,
        radar: {
            temperature: 90,      // Arctic cold
            terrain: 35,    // Fjord coast
            coast: 90,      // Atlantic coast
            latitude: 80,     // Subarctic
            population: 15,        // Small town
            precipitation: 40,     // Moderate
            accessibility: 95,    // Extremely isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Bangkok, Thailand',
        fact: 'Bangkok\'s full ceremonial name is the longest city name in the world at 168 letters.',
        lat: 13.7563,
        lng: 100.5018,
        radar: {
            temperature: 10,      // Hot tropical
            terrain: 5,     // River delta
            coast: 50,      // Near Gulf
            latitude: 16,     // Tropical
            population: 95,        // Mega-city
            precipitation: 85,     // Very wet (monsoon)
            accessibility: 15,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Denver, Colorado',
        fact: 'Denver is exactly one mile (1,609m) above sea level, earning it the nickname "The Mile High City".',
        lat: 39.7392,
        lng: -104.9903,
        radar: {
            temperature: 50,      // Continental
            terrain: 75,    // High plains/mountains
            coast: 0,       // Very inland
            latitude: 46,     // Mid-latitude
            population: 80,        // Large city
            precipitation: 20,     // Semi-arid
            accessibility: 25,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Perth, Australia',
        fact: 'Perth is the most isolated major city in the world, over 2,000km from the nearest city.',
        lat: -31.9505,
        lng: 115.8605,
        radar: {
            temperature: 30,      // Mediterranean
            terrain: 10,    // Coastal plain
            coast: 90,      // Indian Ocean
            latitude: 36,     // Mid-latitude
            population: 75,        // Large city
            precipitation: 35,     // Dry summer
            accessibility: 95,    // Extremely isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'BogotÃ¡, Colombia',
        fact: 'BogotÃ¡ is the third-highest capital city in the world at 2,640m elevation.',
        lat: 4.7110,
        lng: -74.0721,
        radar: {
            temperature: 55,      // Cool due to altitude
            terrain: 80,    // High Andes plateau
            coast: 10,      // Inland mountain
            latitude: 8,      // Near equator
            population: 90,        // Mega-city
            precipitation: 70,     // Wet
            accessibility: 30,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Nunavut, Canada',
        fact: 'Iqaluit is the capital of Canada\'s newest territory and experiences 24-hour daylight in summer.',
        lat: 63.7467,
        lng: -68.5170,
        radar: {
            temperature: 95,      // Arctic cold
            terrain: 25,    // Arctic coastal
            coast: 85,      // Frobisher Bay
            latitude: 82,     // Arctic
            population: 12,        // Small town
            precipitation: 25,     // Arctic desert
            accessibility: 95,    // Extremely isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Vienna, Austria',
        fact: 'Vienna has been ranked the world\'s most livable city multiple times.',
        lat: 48.2082,
        lng: 16.3738,
        radar: {
            temperature: 60,      // Continental temperate
            terrain: 25,    // Danube basin
            coast: 0,       // Very inland
            latitude: 55,     // Mid-latitude
            population: 80,        // Major city
            precipitation: 50,     // Moderate
            accessibility: 5,    // Very central (Europe)
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Casablanca, Morocco',
        fact: 'Casablanca is home to the Hassan II Mosque, which has the world\'s tallest minaret.',
        lat: 33.5731,
        lng: -7.5898,
        radar: {
            temperature: 30,      // Mediterranean
            terrain: 10,    // Coastal
            coast: 95,      // Atlantic coast
            latitude: 38,     // Subtropical
            population: 85,        // Large city
            precipitation: 30,     // Dry
            accessibility: 30,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Vladivostok, Russia',
        fact: 'Vladivostok is Russia\'s largest Pacific port and the terminus of the Trans-Siberian Railway.',
        lat: 43.1155,
        lng: 131.8855,
        radar: {
            temperature: 70,      // Cold continental
            terrain: 40,    // Hilly coast
            coast: 90,      // Pacific Ocean
            latitude: 50,     // Mid-latitude
            population: 60,        // Medium-large city
            precipitation: 50,     // Moderate
            accessibility: 65,    // Isolated but connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Mexico City, Mexico',
        fact: 'Mexico City is built on the ruins of the Aztec capital Tenochtitlan and sits on a former lakebed.',
        lat: 19.4326,
        lng: -99.1332,
        radar: {
            temperature: 45,      // Mild highland
            terrain: 85,    // High valley
            coast: 5,       // Very inland
            latitude: 22,     // Tropical
            population: 100,       // Mega-city
            precipitation: 55,     // Moderate
            accessibility: 20,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Zanzibar, Tanzania',
        fact: 'Zanzibar was once the world\'s largest producer of cloves and a major slave trading hub.',
        lat: -6.1659,
        lng: 39.2026,
        radar: {
            temperature: 15,      // Hot tropical
            terrain: 5,     // Island lowland
            coast: 100,     // Island
            latitude: 8,      // Near equator
            population: 35,        // Medium town
            precipitation: 80,     // Wet tropical
            accessibility: 70,    // Island isolation
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Montevideo, Uruguay',
        fact: 'Montevideo has one of the highest quality of life rankings in South America.',
        lat: -34.9011,
        lng: -56.1645,
        radar: {
            temperature: 40,      // Temperate
            terrain: 10,    // Coastal plain
            coast: 90,      // RÃ­o de la Plata
            latitude: 40,     // Mid-latitude
            population: 75,        // Large city
            precipitation: 50,     // Moderate
            accessibility: 40,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Kyoto, Japan',
        fact: 'Kyoto was Japan\'s capital for over 1,000 years and has over 2,000 temples and shrines.',
        lat: 35.0116,
        lng: 135.7681,
        radar: {
            temperature: 45,      // Temperate
            terrain: 35,    // Basin with mountains
            coast: 30,      // Inland but near sea
            latitude: 42,     // Mid-latitude
            population: 75,        // Large city
            precipitation: 70,     // Humid subtropical
            accessibility: 15,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Reykjavik, Iceland',
        fact: 'Reykjavik uses geothermal energy to heat nearly all of its buildings.',
        lat: 64.1466,
        lng: -21.9426,
        radar: {
            temperature: 80,      // Cool oceanic
            terrain: 15,    // Coastal plain
            coast: 95,      // Atlantic coast
            latitude: 80,     // Subarctic
            population: 45,        // Medium city
            precipitation: 65,     // Moderate-wet
            accessibility: 75,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'MedellÃ­n, Colombia',
        fact: 'MedellÃ­n is known as the "City of Eternal Spring" for its year-round mild weather.',
        lat: 6.2476,
        lng: -75.5658,
        radar: {
            temperature: 50,      // Mild highland
            terrain: 75,    // Andean valley
            coast: 10,      // Inland mountain
            latitude: 8,      // Near equator
            population: 85,        // Large city
            precipitation: 75,     // Wet tropical
            accessibility: 35,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Lisbon, Portugal',
        fact: 'Lisbon is one of the oldest cities in Western Europe, predating Rome by centuries.',
        lat: 38.7223,
        lng: -9.1393,
        radar: {
            temperature: 35,      // Mediterranean
            terrain: 40,    // Hilly coast
            coast: 95,      // Atlantic coast
            latitude: 45,     // Mid-latitude
            population: 80,        // Large city
            precipitation: 40,     // Dry summer
            accessibility: 20,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Punta Arenas, Chile',
        fact: 'Punta Arenas is the southernmost continental city in Chile and a gateway to Antarctica.',
        lat: -53.1638,
        lng: -70.9171,
        radar: {
            temperature: 75,      // Cold oceanic
            terrain: 20,    // Coastal plains
            coast: 90,      // Strait of Magellan
            latitude: 68,     // Subantarctic
            population: 30,        // Medium city
            precipitation: 45,     // Moderate
            accessibility: 85,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Wellington, New Zealand',
        fact: 'Wellington is the southernmost capital city in the world and the windiest city on Earth.',
        lat: -41.2865,
        lng: 174.7762,
        radar: {
            temperature: 55,      // Cool temperate
            terrain: 40,    // Hilly coast
            coast: 95,      // Harbor
            latitude: 48,     // Mid-latitude
            population: 65,        // Large city
            precipitation: 65,     // Wet
            accessibility: 80,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Cusco, Peru',
        fact: 'Cusco was the historic capital of the Inca Empire and sits at 3,400m elevation.',
        lat: -13.5319,
        lng: -71.9675,
        radar: {
            temperature: 60,      // Cool highland
            terrain: 90,    // High Andes
            coast: 5,       // Very inland
            latitude: 16,     // Tropical
            population: 55,        // Medium city
            precipitation: 40,     // Semi-arid
            accessibility: 65,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Tbilisi, Georgia',
        fact: 'Tbilisi has been inhabited since the 4th millennium BC and sits at the crossroads of Europe and Asia.',
        lat: 41.7151,
        lng: 44.8271,
        radar: {
            temperature: 50,      // Continental
            terrain: 55,    // Valley in mountains
            coast: 10,      // Inland
            latitude: 48,     // Mid-latitude
            population: 70,        // Large city
            precipitation: 45,     // Moderate
            accessibility: 45,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Dakar, Senegal',
        fact: 'Dakar is the westernmost point of the African continent.',
        lat: 14.7167,
        lng: -17.4677,
        radar: {
            temperature: 20,      // Hot tropical
            terrain: 10,    // Coastal plain
            coast: 95,      // Atlantic peninsula
            latitude: 18,     // Tropical
            population: 75,        // Large city
            precipitation: 35,     // Dry season
            accessibility: 40,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Fairbanks, Alaska',
        fact: 'Fairbanks experiences temperature extremes from -50Â°C in winter to +35Â°C in summer.',
        lat: 64.8378,
        lng: -147.7164,
        radar: {
            temperature: 95,      // Extreme continental
            terrain: 40,    // River valley
            coast: 0,       // Very inland
            latitude: 81,     // Subarctic
            population: 25,        // Small city
            precipitation: 20,     // Very dry
            accessibility: 85,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Riga, Latvia',
        fact: 'Riga\'s Old Town is a UNESCO World Heritage Site with over 800 Art Nouveau buildings.',
        lat: 56.9496,
        lng: 24.1052,
        radar: {
            temperature: 75,      // Continental cold
            terrain: 10,    // Coastal plain
            coast: 75,      // Baltic Sea
            latitude: 70,     // Northern
            population: 65,        // Large city
            precipitation: 50,     // Moderate
            accessibility: 20,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Kathmandu, Nepal',
        fact: 'Kathmandu Valley is surrounded by the Himalayas with four UNESCO World Heritage Sites.',
        lat: 27.7172,
        lng: 85.3240,
        radar: {
            temperature: 55,      // Mild highland
            terrain: 85,    // Himalayan valley
            coast: 0,       // Very inland
            latitude: 32,     // Subtropical
            population: 75,        // Large city
            precipitation: 75,     // Monsoon wet
            accessibility: 60,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Christchurch, New Zealand',
        fact: 'Christchurch is known as the "Garden City" and was rebuilt after devastating earthquakes in 2011.',
        lat: -43.5321,
        lng: 172.6362,
        radar: {
            temperature: 55,      // Temperate oceanic
            terrain: 15,    // Canterbury Plains
            coast: 80,      // Pacific coast
            latitude: 50,     // Mid-latitude
            population: 60,        // Large city
            precipitation: 50,     // Moderate
            accessibility: 80,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Ouagadougou, Burkina Faso',
        fact: 'Ouagadougou hosts Africa\'s largest film festival, FESPACO.',
        lat: 12.3714,
        lng: -1.5197,
        radar: {
            temperature: 10,      // Hot semi-arid
            terrain: 30,    // Plateau
            coast: 0,       // Very inland
            latitude: 15,     // Tropical
            population: 65,        // Large city
            precipitation: 30,     // Dry
            accessibility: 55,    // Moderate
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Tallinn, Estonia',
        fact: 'Tallinn has one of the best-preserved medieval Old Towns in Europe.',
        lat: 59.4370,
        lng: 24.7536,
        radar: {
            temperature: 80,      // Cold continental
            terrain: 15,    // Coastal plain
            coast: 85,      // Baltic Sea
            latitude: 74,     // Northern
            population: 60,        // Large city
            precipitation: 50,     // Moderate
            accessibility: 25,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Guadalajara, Mexico',
        fact: 'Guadalajara is the birthplace of mariachi music and tequila.',
        lat: 20.6597,
        lng: -103.3496,
        radar: {
            temperature: 40,      // Subtropical highland
            terrain: 70,    // High plateau
            coast: 15,      // Inland
            latitude: 24,     // Tropical
            population: 85,        // Large city
            precipitation: 50,     // Moderate
            accessibility: 25,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Hobart, Australia',
        fact: 'Hobart is Australia\'s second-oldest capital and gateway to Antarctica.',
        lat: -42.8821,
        lng: 147.3272,
        radar: {
            temperature: 60,      // Cool oceanic
            terrain: 35,    // Coastal hills
            coast: 90,      // Derwent River
            latitude: 50,     // Mid-latitude
            population: 40,        // Medium city
            precipitation: 55,     // Moderate
            accessibility: 75,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Yerevan, Armenia',
        fact: 'Yerevan is one of the world\'s oldest continuously inhabited cities, founded in 782 BC.',
        lat: 40.1792,
        lng: 44.4991,
        radar: {
            temperature: 55,      // Continental
            terrain: 65,    // Highland plateau
            coast: 0,       // Very inland
            latitude: 46,     // Mid-latitude
            population: 70,        // Large city
            precipitation: 25,     // Semi-arid
            accessibility: 50,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Porto, Portugal',
        fact: 'Porto is famous for Port wine and its stunning Douro River valley.',
        lat: 41.1579,
        lng: -8.6291,
        radar: {
            temperature: 40,      // Mediterranean
            terrain: 40,    // Hilly coast
            coast: 90,      // Atlantic coast
            latitude: 48,     // Mid-latitude
            population: 70,        // Large city
            precipitation: 60,     // Wet winter
            accessibility: 25,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Karachi, Pakistan',
        fact: 'Karachi is Pakistan\'s largest city and was the original capital.',
        lat: 24.8607,
        lng: 67.0011,
        radar: {
            temperature: 15,      // Hot desert
            terrain: 10,    // Coastal plain
            coast: 95,      // Arabian Sea
            latitude: 28,     // Subtropical
            population: 100,       // Mega-city
            precipitation: 15,     // Very dry
            accessibility: 25,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Antananarivo, Madagascar',
        fact: 'Antananarivo sits atop a series of hills and is known as the "City of a Thousand".',
        lat: -18.8792,
        lng: 47.5079,
        radar: {
            temperature: 45,      // Subtropical highland
            terrain: 75,    // High plateau
            coast: 20,      // Interior island
            latitude: 22,     // Tropical
            population: 65,        // Large city
            precipitation: 65,     // Wet season
            accessibility: 70,    // Island isolation
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Kuala Lumpur, Malaysia',
        fact: 'The Petronas Twin Towers were the world\'s tallest buildings from 1998 to 2004.',
        lat: 3.1390,
        lng: 101.6869,
        radar: {
            temperature: 10,      // Hot tropical
            terrain: 15,    // River valley
            coast: 40,      // Near coast
            latitude: 5,      // Near equator
            population: 95,        // Mega-city
            precipitation: 95,     // Extremely wet
            accessibility: 10,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Santiago, Chile',
        fact: 'Santiago sits in a valley surrounded by the snow-capped Andes mountains.',
        lat: -33.4489,
        lng: -70.6693,
        radar: {
            temperature: 45,      // Mediterranean
            terrain: 60,    // Andean valley
            coast: 20,      // Inland near coast
            latitude: 38,     // Mid-latitude
            population: 90,        // Mega-city
            precipitation: 30,     // Dry summer
            accessibility: 35,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Reykjanes, Iceland',
        fact: 'The Reykjanes Peninsula is home to the famous Blue Lagoon geothermal spa.',
        lat: 63.8757,
        lng: -22.6761,
        radar: {
            temperature: 80,      // Cold oceanic
            terrain: 25,    // Coastal lava fields
            coast: 100,     // Peninsula
            latitude: 80,     // Subarctic
            population: 15,        // Rural
            precipitation: 70,     // Wet
            accessibility: 80,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Salvador, Brazil',
        fact: 'Salvador was Brazil\'s first capital and is the center of Afro-Brazilian culture.',
        lat: -12.9714,
        lng: -38.5014,
        radar: {
            temperature: 20,      // Hot tropical
            terrain: 20,    // Coastal hills
            coast: 95,      // Atlantic coast
            latitude: 15,     // Tropical
            population: 80,        // Large city
            precipitation: 80,     // Very wet
            accessibility: 35,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Krakow, Poland',
        fact: 'Krakow\'s Old Town was the first UNESCO World Heritage Site listed.',
        lat: 50.0647,
        lng: 19.9450,
        radar: {
            temperature: 65,      // Continental temperate
            terrain: 30,    // River valley
            coast: 0,       // Very inland
            latitude: 56,     // Mid-latitude
            population: 70,        // Large city
            precipitation: 50,     // Moderate
            accessibility: 15,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'TromsÃ¸, Norway',
        fact: 'TromsÃ¸ is known as the "Paris of the North" and has midnight sun for months.',
        lat: 69.6492,
        lng: 18.9553,
        radar: {
            temperature: 85,      // Subarctic
            terrain: 35,    // Coastal mountains
            coast: 90,      // Fjord coast
            latitude: 88,     // Arctic
            population: 35,        // Medium city
            precipitation: 60,     // Moderate
            accessibility: 75,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Puebla, Mexico',
        fact: 'Puebla is known for its Talavera pottery and mole poblano cuisine.',
        lat: 19.0414,
        lng: -98.2063,
        radar: {
            temperature: 45,      // Subtropical highland
            terrain: 75,    // High valley
            coast: 10,      // Inland
            latitude: 22,     // Tropical
            population: 75,        // Large city
            precipitation: 50,     // Moderate
            accessibility: 20,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Tashkent, Uzbekistan',
        fact: 'Tashkent is Central Asia\'s largest city and was rebuilt after a 1966 earthquake.',
        lat: 41.2995,
        lng: 69.2401,
        radar: {
            temperature: 55,      // Continental
            terrain: 50,    // Plateau
            coast: 0,       // Very inland
            latitude: 48,     // Mid-latitude
            population: 80,        // Large city
            precipitation: 25,     // Semi-arid
            accessibility: 40,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Harare, Zimbabwe',
        fact: 'Harare is known as the "Sunshine City" for its pleasant climate year-round.',
        lat: -17.8252,
        lng: 31.0335,
        radar: {
            temperature: 45,      // Subtropical highland
            terrain: 75,    // High plateau
            coast: 0,       // Very inland
            latitude: 21,     // Tropical
            population: 70,        // Large city
            precipitation: 45,     // Moderate
            accessibility: 55,    // Moderate
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Taipei, Taiwan',
        fact: 'Taipei 101 was the world\'s tallest building from 2004 to 2010.',
        lat: 25.0330,
        lng: 121.5654,
        radar: {
            temperature: 30,      // Humid subtropical
            terrain: 25,    // Basin
            coast: 70,      // Near coast
            latitude: 28,     // Subtropical
            population: 95,        // Mega-city
            precipitation: 90,     // Very wet
            accessibility: 15,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Cartagena, Colombia',
        fact: 'Cartagena\'s walled Old Town is one of the best-preserved colonial cities in the Americas.',
        lat: 10.3910,
        lng: -75.4794,
        radar: {
            temperature: 15,      // Hot tropical
            terrain: 5,     // Coastal plain
            coast: 100,     // Caribbean coast
            latitude: 12,     // Tropical
            population: 65,        // Large city
            precipitation: 60,     // Moderate-wet
            accessibility: 45,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Dubrovnik, Croatia',
        fact: 'Dubrovnik\'s Old Town is a UNESCO site and filming location for Game of Thrones.',
        lat: 42.6507,
        lng: 18.0944,
        radar: {
            temperature: 40,      // Mediterranean
            terrain: 35,    // Coastal hills
            coast: 95,      // Adriatic coast
            latitude: 49,     // Mid-latitude
            population: 30,        // Medium city
            precipitation: 55,     // Moderate
            accessibility: 40,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Almaty, Kazakhstan',
        fact: 'Almaty sits at the foothills of the Trans-Ili Alatau mountains and was Kazakhstan\'s capital.',
        lat: 43.2220,
        lng: 76.8512,
        radar: {
            temperature: 60,      // Continental
            terrain: 70,    // Mountain foothills
            coast: 0,       // Very inland
            latitude: 50,     // Mid-latitude
            population: 75,        // Large city
            precipitation: 35,     // Semi-arid
            accessibility: 45,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Darwin, Australia',
        fact: 'Darwin is Australia\'s northernmost capital and closest to Asia.',
        lat: -12.4634,
        lng: 130.8456,
        radar: {
            temperature: 15,      // Hot tropical
            terrain: 10,    // Coastal plain
            coast: 90,      // Timor Sea
            latitude: 15,     // Tropical
            population: 35,        // Medium city
            precipitation: 75,     // Wet season monsoon
            accessibility: 80,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Oaxaca, Mexico',
        fact: 'Oaxaca is the culinary capital of Mexico and home to ancient Zapotec ruins.',
        lat: 17.0654,
        lng: -96.7236,
        radar: {
            temperature: 40,      // Subtropical highland
            terrain: 70,    // Valley in mountains
            coast: 15,      // Inland near coast
            latitude: 20,     // Tropical
            population: 55,        // Medium city
            precipitation: 45,     // Moderate
            accessibility: 45,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Split, Croatia',
        fact: 'Split was built around the Roman Emperor Diocletian\'s 4th-century palace.',
        lat: 43.5081,
        lng: 16.4402,
        radar: {
            temperature: 40,      // Mediterranean
            terrain: 30,    // Coastal hills
            coast: 95,      // Adriatic coast
            latitude: 50,     // Mid-latitude
            population: 50,        // Medium city
            precipitation: 50,     // Moderate
            accessibility: 30,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Asmara, Eritrea',
        fact: 'Asmara has one of the world\'s finest collections of Italian modernist architecture.',
        lat: 15.3229,
        lng: 38.9251,
        radar: {
            temperature: 45,      // Highland tropical
            terrain: 80,    // High plateau
            coast: 15,      // Inland near coast
            latitude: 18,     // Tropical
            population: 50,        // Medium city
            precipitation: 30,     // Semi-arid
            accessibility: 70,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Edinburgh, Scotland',
        fact: 'Edinburgh\'s Old and New Towns are UNESCO World Heritage Sites.',
        lat: 55.9533,
        lng: -3.1883,
        radar: {
            temperature: 70,      // Cool oceanic
            terrain: 40,    // Hilly terrain
            coast: 65,      // North Sea
            latitude: 68,     // Northern
            population: 70,        // Large city
            precipitation: 65,     // Wet
            accessibility: 15,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Chiang Mai, Thailand',
        fact: 'Chiang Mai is surrounded by mountains and has over 300 Buddhist temples.',
        lat: 18.7883,
        lng: 98.9853,
        radar: {
            temperature: 25,      // Warm tropical highland
            terrain: 50,    // Valley in mountains
            coast: 0,       // Very inland
            latitude: 22,     // Tropical
            population: 60,        // Large city
            precipitation: 75,     // Monsoon wet
            accessibility: 35,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'ValparaÃ­so, Chile',
        fact: 'ValparaÃ­so is built on 42 hills overlooking the Pacific Ocean.',
        lat: -33.0472,
        lng: -71.6127,
        radar: {
            temperature: 40,      // Mediterranean
            terrain: 55,    // Steep coastal hills
            coast: 100,     // Pacific coast
            latitude: 38,     // Mid-latitude
            population: 55,        // Medium city
            precipitation: 30,     // Dry summer
            accessibility: 40,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'BrasÃ­lia, Brazil',
        fact: 'BrasÃ­lia was built from scratch in just 41 months to be Brazil\'s new capital.',
        lat: -15.8267,
        lng: -47.9218,
        radar: {
            temperature: 30,      // Tropical savanna
            terrain: 65,    // Central plateau
            coast: 0,       // Very inland
            latitude: 18,     // Tropical
            population: 85,        // Large city
            precipitation: 70,     // Wet season
            accessibility: 30,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Muscat, Oman',
        fact: 'Muscat is surrounded by dramatic mountains and the Arabian Sea.',
        lat: 23.5880,
        lng: 58.3829,
        radar: {
            temperature: 10,      // Hot desert
            terrain: 40,    // Coastal mountains
            coast: 95,      // Gulf of Oman
            latitude: 27,     // Subtropical
            population: 65,        // Large city
            precipitation: 5,      // Very dry
            accessibility: 40,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Irkutsk, Russia',
        fact: 'Irkutsk is known as the "Paris of Siberia" and sits near Lake Baikal.',
        lat: 52.2978,
        lng: 104.2964,
        radar: {
            temperature: 90,      // Extreme continental
            terrain: 45,    // River valley
            coast: 0,       // Very inland
            latitude: 58,     // Northern
            population: 60,        // Large city
            precipitation: 35,     // Semi-arid
            accessibility: 70,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Tunis, Tunisia',
        fact: 'Tunis was built near the ruins of ancient Carthage.',
        lat: 36.8065,
        lng: 10.1815,
        radar: {
            temperature: 35,      // Mediterranean
            terrain: 20,    // Coastal hills
            coast: 90,      // Mediterranean Sea
            latitude: 43,     // Mid-latitude
            population: 75,        // Large city
            precipitation: 35,     // Dry summer
            accessibility: 30,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Hanoi, Vietnam',
        fact: 'Hanoi is over 1,000 years old and known for its Old Quarter and lakes.',
        lat: 21.0285,
        lng: 105.8542,
        radar: {
            temperature: 35,      // Humid subtropical
            terrain: 20,    // River delta
            coast: 35,      // Inland near coast
            latitude: 24,     // Tropical
            population: 85,        // Large city
            precipitation: 80,     // Very wet monsoon
            accessibility: 20,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Granada, Spain',
        fact: 'Granada is home to the Alhambra, one of the finest examples of Islamic architecture.',
        lat: 37.1773,
        lng: -3.5986,
        radar: {
            temperature: 40,      // Mediterranean
            terrain: 60,    // Sierra Nevada foothills
            coast: 25,      // Inland near coast
            latitude: 43,     // Mid-latitude
            population: 50,        // Medium city
            precipitation: 35,     // Semi-arid
            accessibility: 25,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Windhoek, Namibia',
        fact: 'Windhoek sits at 1,700m elevation in the semi-arid highlands of central Namibia.',
        lat: -22.5597,
        lng: 17.0832,
        radar: {
            temperature: 40,      // Semi-arid highland
            terrain: 75,    // High plateau
            coast: 5,       // Very inland
            latitude: 26,     // Subtropical
            population: 50,        // Medium city
            precipitation: 20,     // Dry
            accessibility: 65,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Cologne, Germany',
        fact: 'Cologne\'s cathedral took 632 years to complete and survived WWII bombings.',
        lat: 50.9375,
        lng: 6.9603,
        radar: {
            temperature: 60,      // Temperate oceanic
            terrain: 20,    // Rhine valley
            coast: 15,      // Inland
            latitude: 57,     // Mid-latitude
            population: 75,        // Large city
            precipitation: 60,     // Moderate-wet
            accessibility: 5,    // Very central Europe
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Havana, Cuba',
        fact: 'Havana\'s Old Town is the largest colonial city center in Latin America.',
        lat: 23.1136,
        lng: -82.3666,
        radar: {
            temperature: 20,      // Hot tropical
            terrain: 10,    // Coastal plain
            coast: 95,      // Caribbean coast
            latitude: 26,     // Tropical
            population: 80,        // Large city
            precipitation: 65,     // Wet season
            accessibility: 50,    // Island isolation
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Queenstown, New Zealand',
        fact: 'Queenstown is known as the adventure capital of the world.',
        lat: -45.0312,
        lng: 168.6626,
        radar: {
            temperature: 60,      // Cool oceanic
            terrain: 60,    // Alpine lakes
            coast: 20,      // Inland
            latitude: 52,     // Mid-latitude
            population: 25,        // Small city
            precipitation: 45,     // Moderate
            accessibility: 80,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Luanda, Angola',
        fact: 'Luanda is one of the most expensive cities in the world for expatriates.',
        lat: -8.8383,
        lng: 13.2344,
        radar: {
            temperature: 20,      // Hot tropical
            terrain: 15,    // Coastal plain
            coast: 95,      // Atlantic coast
            latitude: 10,     // Near equator
            population: 80,        // Large city
            precipitation: 40,     // Semi-arid
            accessibility: 50,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Reims, France',
        fact: 'Reims Cathedral is where French kings were crowned for over 1,000 years.',
        lat: 49.2583,
        lng: 4.0317,
        radar: {
            temperature: 60,      // Temperate oceanic
            terrain: 25,    // Plains
            coast: 20,      // Inland
            latitude: 55,     // Mid-latitude
            population: 55,        // Medium city
            precipitation: 55,     // Moderate
            accessibility: 10,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Sapporo, Japan',
        fact: 'Sapporo hosts one of Japan\'s largest snow festivals with massive ice sculptures.',
        lat: 43.0642,
        lng: 141.3469,
        radar: {
            temperature: 75,      // Cold continental
            terrain: 25,    // Coastal plain
            coast: 50,      // Near Sea of Japan
            latitude: 50,     // Mid-latitude
            population: 75,        // Large city
            precipitation: 70,     // Snowy wet
            accessibility: 30,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Jaipur, India',
        fact: 'Jaipur is known as the "Pink City" for its distinctive rose-colored buildings.',
        lat: 26.9124,
        lng: 75.7873,
        radar: {
            temperature: 15,      // Hot semi-arid
            terrain: 45,    // Aravalli hills
            coast: 0,       // Very inland
            latitude: 31,     // Subtropical
            population: 80,        // Large city
            precipitation: 35,     // Monsoon dry
            accessibility: 20,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Bergen, Norway',
        fact: 'Bergen is surrounded by seven mountains and is Europe\'s rainiest city.',
        lat: 60.3913,
        lng: 5.3221,
        radar: {
            temperature: 65,      // Cool oceanic
            terrain: 55,    // Fjord mountains
            coast: 95,      // North Sea fjords
            latitude: 75,     // Northern
            population: 55,        // Medium city
            precipitation: 100,    // Extremely wet
            accessibility: 40,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Canberra, Australia',
        fact: 'Canberra was purpose-built to be Australia\'s capital in 1913.',
        lat: -35.2809,
        lng: 149.1300,
        radar: {
            temperature: 45,      // Temperate
            terrain: 60,    // Highland valley
            coast: 10,      // Inland
            latitude: 41,     // Mid-latitude
            population: 60,        // Large city
            precipitation: 40,     // Moderate
            accessibility: 35,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Doha, Qatar',
        fact: 'Doha transformed from a small fishing village to a modern metropolis in just decades.',
        lat: 25.2854,
        lng: 51.5310,
        radar: {
            temperature: 5,       // Extremely hot desert
            terrain: 5,     // Coastal flat
            coast: 95,      // Persian Gulf
            latitude: 28,     // Subtropical
            population: 90,        // Mega-city
            precipitation: 5,      // Extremely dry
            accessibility: 20,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Ulan Bator, Mongolia',
        fact: 'Ulan Bator is the coldest national capital in the world.',
        lat: 47.8864,
        lng: 106.9057,
        radar: {
            temperature: 100,     // Extreme continental cold
            terrain: 70,    // High plateau
            coast: 0,       // Very inland
            latitude: 54,     // Mid-latitude
            population: 60,        // Large city
            precipitation: 15,     // Very dry
            accessibility: 80,    // Very isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Zanzibar City, Tanzania',
        fact: 'Stone Town in Zanzibar is a UNESCO site with Swahili, Arab, and European influences.',
        lat: -6.1659,
        lng: 39.2026,
        radar: {
            temperature: 20,      // Hot tropical
            terrain: 5,     // Island coast
            coast: 100,     // Island
            latitude: 8,      // Near equator
            population: 40,        // Medium city
            precipitation: 85,     // Very wet
            accessibility: 65,    // Island isolation
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Salzburg, Austria',
        fact: 'Salzburg is Mozart\'s birthplace and the setting for The Sound of Music.',
        lat: 47.8095,
        lng: 13.0550,
        radar: {
            temperature: 60,      // Alpine temperate
            terrain: 55,    // Alpine valley
            coast: 0,       // Very inland
            latitude: 54,     // Mid-latitude
            population: 50,        // Medium city
            precipitation: 70,     // Wet
            accessibility: 15,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Bali, Indonesia',
        fact: 'Bali is known as the "Island of the Gods" with thousands of Hindu temples.',
        lat: -8.4095,
        lng: 115.1889,
        radar: {
            temperature: 15,      // Hot tropical
            terrain: 50,    // Volcanic mountains
            coast: 100,     // Island
            latitude: 10,     // Near equator
            population: 45,        // Medium city
            precipitation: 90,     // Very wet
            accessibility: 40,    // Island tourism hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Seville, Spain',
        fact: 'Seville is home to the world\'s largest Gothic cathedral.',
        lat: 37.3891,
        lng: -5.9845,
        radar: {
            temperature: 25,      // Hot Mediterranean
            terrain: 15,    // River valley
            coast: 30,      // Inland near coast
            latitude: 43,     // Mid-latitude
            population: 70,        // Large city
            precipitation: 30,     // Dry
            accessibility: 20,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Bern, Switzerland',
        fact: 'Bern\'s Old Town is a UNESCO World Heritage Site with medieval arcades.',
        lat: 46.9481,
        lng: 7.4474,
        radar: {
            temperature: 60,      // Alpine temperate
            terrain: 60,    // Alpine foothills
            coast: 0,       // Very inland
            latitude: 53,     // Mid-latitude
            population: 50,        // Medium city
            precipitation: 65,     // Moderate-wet
            accessibility: 10,    // Very central Europe
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Amman, Jordan',
        fact: 'Amman is built on seven hills and was once the ancient city of Philadelphia.',
        lat: 31.9454,
        lng: 35.9284,
        radar: {
            temperature: 35,      // Hot Mediterranean
            terrain: 60,    // Highland plateau
            coast: 20,      // Inland near coast
            latitude: 36,     // Subtropical
            population: 75,        // Large city
            precipitation: 25,     // Semi-arid
            accessibility: 30,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Cork, Ireland',
        fact: 'Cork is built on an island in the River Lee and is Ireland\'s second-largest city.',
        lat: 51.8985,
        lng: -8.4756,
        radar: {
            temperature: 65,      // Cool oceanic
            terrain: 20,    // River valley
            coast: 80,      // Near Atlantic
            latitude: 58,     // Northern
            population: 50,        // Medium city
            precipitation: 80,     // Very wet
            accessibility: 30,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Fez, Morocco',
        fact: 'Fez has the world\'s oldest continuously operating university, founded in 859 AD.',
        lat: 34.0181,
        lng: -5.0078,
        radar: {
            temperature: 40,      // Hot Mediterranean
            terrain: 50,    // Highland valley
            coast: 20,      // Inland
            latitude: 39,     // Subtropical
            population: 65,        // Large city
            precipitation: 35,     // Semi-arid
            accessibility: 35,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Casablanca, Morocco',
        fact: 'Casablanca\'s Hassan II Mosque has the world\'s tallest minaret at 210 meters.',
        lat: 33.5731,
        lng: -7.5898,
        radar: {
            temperature: 35,      // Mediterranean
            terrain: 10,    // Coastal plain
            coast: 95,      // Atlantic coast
            latitude: 38,     // Subtropical
            population: 90,        // Mega-city
            precipitation: 30,     // Dry
            accessibility: 25,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Sarajevo, Bosnia',
        fact: 'Sarajevo hosted the 1984 Winter Olympics and is known for its religious diversity.',
        lat: 43.8563,
        lng: 18.4131,
        radar: {
            temperature: 60,      // Continental
            terrain: 60,    // Mountain valley
            coast: 15,      // Inland near coast
            latitude: 50,     // Mid-latitude
            population: 55,        // Medium city
            precipitation: 55,     // Moderate
            accessibility: 40,    // Regional hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Cuzco, Peru',
        fact: 'Cuzco was the capital of the Inca Empire and means "navel of the world".',
        lat: -13.5319,
        lng: -71.9675,
        radar: {
            temperature: 55,      // Cool highland
            terrain: 95,    // Very high Andes
            coast: 5,       // Very inland
            latitude: 16,     // Tropical
            population: 60,        // Large city
            precipitation: 35,     // Semi-arid
            accessibility: 60,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'ReykjavÃ­k, Iceland',
        fact: 'ReykjavÃ­k means "smoky bay" from the geothermal steam Vikings saw.',
        lat: 64.1466,
        lng: -21.9426,
        radar: {
            temperature: 75,      // Cold oceanic
            terrain: 15,    // Coastal plain
            coast: 95,      // Atlantic coast
            latitude: 80,     // Subarctic
            population: 50,        // Medium city
            precipitation: 70,     // Wet
            accessibility: 75,    // Isolated
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Abu Dhabi, UAE',
        fact: 'Abu Dhabi sits on an island and has the world\'s fastest roller coaster.',
        lat: 24.4539,
        lng: 54.3773,
        radar: {
            temperature: 5,       // Extremely hot desert
            terrain: 5,     // Island flat
            coast: 95,      // Persian Gulf
            latitude: 27,     // Subtropical
            population: 90,        // Mega-city
            precipitation: 5,      // Extremely dry
            accessibility: 15,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Guangzhou, China',
        fact: 'Guangzhou has been a major trading port for over 2,000 years.',
        lat: 23.1291,
        lng: 113.2644,
        radar: {
            temperature: 25,      // Humid subtropical
            terrain: 15,    // River delta
            coast: 60,      // Pearl River
            latitude: 26,     // Tropical
            population: 100,       // Mega-city
            precipitation: 85,     // Very wet monsoon
            accessibility: 10,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Lagos, Nigeria',
        fact: 'Lagos is Africa\'s largest city by population and a major economic hub.',
        lat: 6.5244,
        lng: 3.3792,
        radar: {
            temperature: 20,      // Hot tropical
            terrain: 5,     // Coastal lagoon
            coast: 95,      // Atlantic coast
            latitude: 8,      // Near equator
            population: 100,       // Mega-city
            precipitation: 80,     // Very wet
            accessibility: 25,    // Major hub
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    },
    {
        name: 'Vilnius, Lithuania',
        fact: 'Vilnius has one of Europe\'s largest Old Towns and over 1,200 medieval buildings.',
        lat: 54.6872,
        lng: 25.2797,
        radar: {
            temperature: 75,      // Continental cold
            terrain: 20,    // River valley
            coast: 30,      // Inland
            latitude: 67,     // Northern
            population: 60,        // Large city
            precipitation: 50,     // Moderate
            accessibility: 25,    // Well connected
            development: 50,   // Default
            tourism: 50,       // Default
            wealth: 50         // Default
        }
    }
];

// Radar chart axis labels (in order, starting from top, going clockwise)
const radarAxes = [
    { key: 'temperature', labelLow: '', labelHigh: 'Temperature' },
    { key: 'terrain', labelLow: '', labelHigh: 'Mountainous' },
    { key: 'coast', labelLow: '', labelHigh: 'Coastal' },
    { key: 'latitude', labelLow: '', labelHigh: 'Polar' },
    { key: 'population', labelLow: '', labelHigh: 'Urban' },
    { key: 'precipitation', labelLow: '', labelHigh: 'Rainy' },
    { key: 'accessibility', labelLow: '', labelHigh: 'Accessible' },
    { key: 'development', labelLow: '', labelHigh: 'Developed' },
    { key: 'tourism', labelLow: '', labelHigh: 'Tourism' },
    { key: 'wealth', labelLow: '', labelHigh: 'Wealth' }
];

/**
 * Draw a radar chart on the given canvas for the given location data.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on
 * @param {Object} radarData - Object with values for each axis (0-100)
 */
function drawRadarChart(canvas, radarData) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size for high DPI
    const size = Math.min(canvas.parentElement.clientWidth - 32, 320);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) - 40;
    const numAxes = radarAxes.length;
    const angleStep = (2 * Math.PI) / numAxes;
    const startAngle = -Math.PI / 2; // Start from top
    
    ctx.clearRect(0, 0, size, size);
    
    // Draw background circles (grid)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius * i) / 4, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw axis lines and labels
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '11px Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < numAxes; i++) {
        const angle = startAngle + i * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Draw axis line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Draw label
        const labelRadius = radius + 22;
        const labelX = centerX + labelRadius * Math.cos(angle);
        const labelY = centerY + labelRadius * Math.sin(angle);
        
        const axis = radarAxes[i];
        ctx.fillText(axis.labelHigh, labelX, labelY);
    }
    
    // Calculate all data points first
    const dataPoints = [];
    for (let i = 0; i < numAxes; i++) {
        const axis = radarAxes[i];
        const value = (radarData[axis.key] || 0) / 100;
        const angle = startAngle + i * angleStep;
        const x = centerX + radius * value * Math.cos(angle);
        const y = centerY + radius * value * Math.sin(angle);
        dataPoints.push({ x, y });
    }
    
    // Draw smooth curved polygon with adaptive rounding
    // Uses quadratic curves at corners, with rounding proportional to edge lengths
    ctx.beginPath();
    const cornerRatio = 0.2; // How much of each edge to use for the curve (0-0.5)
    
    for (let i = 0; i < numAxes; i++) {
        const curr = dataPoints[i];
        const next = dataPoints[(i + 1) % numAxes];
        
        // Calculate distance to next point
        const dx = next.x - curr.x;
        const dy = next.y - curr.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Adaptive corner radius based on edge length (smaller for short edges)
        const cornerLen = Math.min(dist * cornerRatio, 15);
        
        if (i === 0) {
            // Start partway along first edge
            const startX = curr.x + (dx / dist) * cornerLen;
            const startY = curr.y + (dy / dist) * cornerLen;
            ctx.moveTo(startX, startY);
        }
        
        // Line to before the next corner
        const beforeNextX = next.x - (dx / dist) * cornerLen;
        const beforeNextY = next.y - (dy / dist) * cornerLen;
        ctx.lineTo(beforeNextX, beforeNextY);
        
        // Curve around the corner using quadratic bezier
        const nextNext = dataPoints[(i + 2) % numAxes];
        const dx2 = nextNext.x - next.x;
        const dy2 = nextNext.y - next.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        const cornerLen2 = Math.min(dist2 * cornerRatio, 15);
        
        const afterNextX = next.x + (dx2 / dist2) * cornerLen2;
        const afterNextY = next.y + (dy2 / dist2) * cornerLen2;
        
        ctx.quadraticCurveTo(next.x, next.y, afterNextX, afterNextY);
    }
    ctx.closePath();
    
    // Fill with cobalt blue
    ctx.fillStyle = 'rgba(0, 71, 171, 0.35)';
    ctx.fill();
    
    // Stroke with cobalt blue
    ctx.strokeStyle = 'rgba(0, 71, 171, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

/**
 * Update the legend showing what each axis represents
 * @param {HTMLElement} legendEl - The legend container element
 */
function updateRadarLegend(legendEl) {
    if (!legendEl) return;
    
    legendEl.innerHTML = radarAxes.map(axis => 
        `<div class="radar-legend-item">
            <span class="radar-legend-label">${axis.labelLow}</span>
            <span class="radar-legend-arrow">â†’</span>
            <span class="radar-legend-label">${axis.labelHigh}</span>
        </div>`
    ).join('');
}
