/**
 * Snippit - Radar Mode Data & Chart
 * ==================================
 * Contains location data with radar characteristics for Radar mode.
 * Each location has values for 7 axes that describe its characteristics.
 * 
 * Radar Axes (0-100 scale):
 * - climate: 0 = Hot, 100 = Cold
 * - elevation: 0 = Flat, 100 = Mountainous
 * - coastal: 0 = Inland, 100 = Coastal
 * - latitude: 0 = Equator, 100 = Polar
 * - urban: 0 = Rural, 100 = Mega-city
 * - rainfall: 0 = Dry, 100 = Wet
 * - remoteness: 0 = Isolated, 100 = Central
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
            climate: 85,      // Cold
            elevation: 15,    // Relatively flat
            coastal: 95,      // Very coastal
            latitude: 80,     // Near polar
            urban: 45,        // Small city
            rainfall: 65,     // Moderate-wet
            remoteness: 25    // Fairly isolated
        }
    },
    {
        name: 'Dubai, UAE',
        fact: 'Dubai transformed from a small fishing village to a global metropolis in just a few decades.',
        lat: 25.2048,
        lng: 55.2708,
        radar: {
            climate: 5,       // Very hot
            elevation: 5,     // Very flat
            coastal: 90,      // Coastal
            latitude: 25,     // Near equator
            urban: 95,        // Mega-city
            rainfall: 5,      // Very dry
            remoteness: 85    // Very central (hub)
        }
    },
    {
        name: 'Kathmandu, Nepal',
        fact: 'Kathmandu Valley contains seven UNESCO World Heritage Sites within a 15km radius.',
        lat: 27.7172,
        lng: 85.3240,
        radar: {
            climate: 55,      // Moderate
            elevation: 90,    // Very mountainous
            coastal: 5,       // Very inland
            latitude: 30,     // Subtropical
            urban: 70,        // Large city
            rainfall: 70,     // Wet (monsoon)
            remoteness: 40    // Somewhat isolated
        }
    },
    {
        name: 'Singapore',
        fact: 'Singapore is one of only three surviving city-states in the world.',
        lat: 1.3521,
        lng: 103.8198,
        radar: {
            climate: 10,      // Hot tropical
            elevation: 5,     // Very flat
            coastal: 100,     // Island nation
            latitude: 5,      // On the equator
            urban: 100,       // Mega-city
            rainfall: 85,     // Very wet
            remoteness: 95    // Major global hub
        }
    },
    {
        name: 'La Paz, Bolivia',
        fact: 'La Paz is the highest capital city in the world at about 3,640 meters above sea level.',
        lat: -16.4897,
        lng: -68.1193,
        radar: {
            climate: 50,      // Cool due to altitude
            elevation: 95,    // Very high altitude
            coastal: 5,       // Landlocked
            latitude: 20,     // Tropical latitude
            urban: 65,        // Large city
            rainfall: 45,     // Moderate
            remoteness: 30    // Fairly isolated
        }
    },
    {
        name: 'Sydney, Australia',
        fact: 'The Sydney Opera House took 16 years to build and cost 14 times its original budget.',
        lat: -33.8688,
        lng: 151.2093,
        radar: {
            climate: 35,      // Warm temperate
            elevation: 15,    // Coastal plains
            coastal: 95,      // Harbor city
            latitude: 40,     // Mid-latitude
            urban: 90,        // Major city
            rainfall: 50,     // Moderate
            remoteness: 60    // Moderate connectivity
        }
    },
    {
        name: 'Ulaanbaatar, Mongolia',
        fact: 'Ulaanbaatar is the coldest capital city in the world with winter temperatures dropping to -40°C.',
        lat: 47.8864,
        lng: 106.9057,
        radar: {
            climate: 95,      // Extremely cold
            elevation: 70,    // High plateau
            coastal: 0,       // Very landlocked
            latitude: 55,     // Mid-high latitude
            urban: 55,        // Medium city
            rainfall: 15,     // Very dry
            remoteness: 15    // Very isolated
        }
    },
    {
        name: 'Mumbai, India',
        fact: 'Mumbai\'s local railway carries over 7.5 million passengers daily, making it the busiest railway in the world.',
        lat: 19.0760,
        lng: 72.8777,
        radar: {
            climate: 15,      // Hot tropical
            elevation: 5,     // Coastal flat
            coastal: 95,      // Peninsula
            latitude: 22,     // Tropical
            urban: 100,       // Mega-city
            rainfall: 90,     // Monsoon - very wet
            remoteness: 85    // Major hub
        }
    },
    {
        name: 'Tromsø, Norway',
        fact: 'Tromsø experiences polar night from November to January and midnight sun from May to July.',
        lat: 69.6492,
        lng: 18.9553,
        radar: {
            climate: 90,      // Very cold
            elevation: 40,    // Fjord/mountain mix
            coastal: 85,      // Fjord coast
            latitude: 90,     // Arctic
            urban: 30,        // Small city
            rainfall: 55,     // Moderate
            remoteness: 20    // Remote
        }
    },
    {
        name: 'Lima, Peru',
        fact: 'Lima is one of the driest capital cities despite being on the coast, receiving less than 2cm of rain annually.',
        lat: -12.0464,
        lng: -77.0428,
        radar: {
            climate: 30,      // Mild/warm
            elevation: 10,    // Coastal
            coastal: 95,      // Pacific coast
            latitude: 15,     // Tropical
            urban: 85,        // Large city
            rainfall: 5,      // Extremely dry
            remoteness: 55    // Moderate
        }
    },
    {
        name: 'Lhasa, Tibet',
        fact: 'Lhasa sits at 3,650m elevation and is known as the "Place of the Gods".',
        lat: 29.6500,
        lng: 91.1000,
        radar: {
            climate: 65,      // Cold due to altitude
            elevation: 100,   // Extremely high
            coastal: 0,       // Very inland
            latitude: 35,     // Mid-latitude
            urban: 40,        // Small city
            rainfall: 25,     // Semi-arid
            remoteness: 10    // Very isolated
        }
    },
    {
        name: 'Manaus, Brazil',
        fact: 'Manaus is a city of 2 million people in the heart of the Amazon rainforest, accessible mainly by boat or plane.',
        lat: -3.1190,
        lng: -60.0217,
        radar: {
            climate: 10,      // Hot tropical
            elevation: 10,    // Lowland
            coastal: 25,      // River inland
            latitude: 5,      // Equatorial
            urban: 70,        // Large city
            rainfall: 95,     // Extremely wet
            remoteness: 15    // Very isolated
        }
    },
    {
        name: 'Tokyo, Japan',
        fact: 'The Greater Tokyo Area is the most populous metropolitan area in the world with over 37 million people.',
        lat: 35.6762,
        lng: 139.6503,
        radar: {
            climate: 45,      // Temperate
            elevation: 20,    // Coastal plain
            coastal: 80,      // Bay area
            latitude: 42,     // Mid-latitude
            urban: 100,       // Mega-city
            rainfall: 65,     // Moderate-wet
            remoteness: 90    // Major global hub
        }
    },
    {
        name: 'Nairobi, Kenya',
        fact: 'Nairobi is the only capital city in the world with a national park within its boundaries.',
        lat: -1.2921,
        lng: 36.8219,
        radar: {
            climate: 35,      // Mild (highland)
            elevation: 70,    // High plateau
            coastal: 5,       // Inland
            latitude: 5,      // Equatorial
            urban: 75,        // Large city
            rainfall: 45,     // Moderate
            remoteness: 50    // Regional hub
        }
    },
    {
        name: 'Longyearbyen, Svalbard',
        fact: 'Longyearbyen is one of the northernmost settlements in the world, where it\'s illegal to die (no cemetery due to permafrost).',
        lat: 78.2232,
        lng: 15.6267,
        radar: {
            climate: 100,     // Arctic cold
            elevation: 30,    // Mountainous terrain
            coastal: 75,      // Fjord coast
            latitude: 100,    // Near North Pole
            urban: 10,        // Tiny settlement
            rainfall: 20,     // Arctic desert
            remoteness: 5     // Extremely isolated
        }
    },
    {
        name: 'Cairo, Egypt',
        fact: 'Cairo is the largest city in Africa and the Arab world, and has been continuously inhabited for over 1,000 years.',
        lat: 30.0444,
        lng: 31.2357,
        radar: {
            climate: 10,      // Hot desert
            elevation: 10,    // Nile valley
            coastal: 40,      // Near Mediterranean
            latitude: 35,     // Subtropical
            urban: 95,        // Mega-city
            rainfall: 5,      // Very dry
            remoteness: 80    // Major hub
        }
    },
    {
        name: 'Vancouver, Canada',
        fact: 'Vancouver is consistently ranked as one of the most livable cities in the world.',
        lat: 49.2827,
        lng: -123.1207,
        radar: {
            climate: 55,      // Mild/cool
            elevation: 50,    // Mountains nearby
            coastal: 90,      // Pacific coast
            latitude: 55,     // Northern temperate
            urban: 80,        // Large city
            rainfall: 75,     // Rainy
            remoteness: 65    // Well connected
        }
    },
    {
        name: 'Alice Springs, Australia',
        fact: 'Alice Springs is almost exactly in the center of Australia, over 1,500km from the nearest major city.',
        lat: -23.6980,
        lng: 133.8807,
        radar: {
            climate: 15,      // Hot desert
            elevation: 55,    // Desert plateau
            coastal: 0,       // Very inland
            latitude: 28,     // Subtropical
            urban: 20,        // Small town
            rainfall: 10,     // Very dry
            remoteness: 5     // Extremely isolated
        }
    },
    {
        name: 'Amsterdam, Netherlands',
        fact: 'Amsterdam has more canals than Venice and more bridges than Paris.',
        lat: 52.3676,
        lng: 4.9041,
        radar: {
            climate: 55,      // Cool temperate
            elevation: 0,     // Below sea level
            coastal: 75,      // Near North Sea
            latitude: 58,     // Northern Europe
            urban: 80,        // Major city
            rainfall: 60,     // Moderate-wet
            remoteness: 95    // Very central (Europe)
        }
    },
    {
        name: 'Cape Town, South Africa',
        fact: 'Table Mountain is one of the oldest mountains in the world at approximately 600 million years old.',
        lat: -33.9249,
        lng: 18.4241,
        radar: {
            climate: 40,      // Mediterranean
            elevation: 65,    // Mountain backdrop
            coastal: 95,      // Peninsula
            latitude: 40,     // Mid-latitude
            urban: 75,        // Large city
            rainfall: 35,     // Seasonal
            remoteness: 45    // Moderate
        }
    },
    {
        name: 'Ushuaia, Argentina',
        fact: 'Ushuaia is the southernmost city in the world, often called "The End of the World".',
        lat: -54.8019,
        lng: -68.3030,
        radar: {
            climate: 75,      // Cold subpolar
            elevation: 55,    // Mountainous coast
            coastal: 90,      // Beagle Channel
            latitude: 70,     // Subantarctic
            urban: 25,        // Small city
            rainfall: 55,     // Moderate
            remoteness: 10    // Very isolated
        }
    },
    {
        name: 'Timbuktu, Mali',
        fact: 'Once a major trading hub on trans-Saharan caravan routes, Timbuktu is now synonymous with remoteness.',
        lat: 16.7666,
        lng: -3.0026,
        radar: {
            climate: 5,       // Hot desert
            elevation: 20,    // Sahel lowlands
            coastal: 0,       // Very inland
            latitude: 20,     // Tropical
            urban: 15,        // Small town
            rainfall: 10,     // Very dry
            remoteness: 5     // Extremely isolated
        }
    },
    {
        name: 'Helsinki, Finland',
        fact: 'Helsinki is known as the "Daughter of the Baltic" and has the world\'s largest sea fortress.',
        lat: 60.1699,
        lng: 24.9384,
        radar: {
            climate: 85,      // Cold
            elevation: 15,    // Low coastal
            coastal: 85,      // Baltic Sea
            latitude: 75,     // Northern
            urban: 70,        // Large city
            rainfall: 50,     // Moderate
            remoteness: 70    // Well connected
        }
    },
    {
        name: 'Phoenix, Arizona',
        fact: 'Phoenix is the hottest major city in the United States, with temperatures exceeding 100°F for months.',
        lat: 33.4484,
        lng: -112.0740,
        radar: {
            climate: 0,       // Extremely hot
            elevation: 35,    // Desert plateau
            coastal: 0,       // Very inland
            latitude: 38,     // Subtropical
            urban: 85,        // Large city
            rainfall: 5,      // Very dry
            remoteness: 75    // Well connected
        }
    },
    {
        name: 'Bergen, Norway',
        fact: 'Bergen is known as the "City of Seven Mountains" and receives over 2,250mm of rain annually.',
        lat: 60.3913,
        lng: 5.3221,
        radar: {
            climate: 70,      // Cool oceanic
            elevation: 60,    // Fjord mountains
            coastal: 95,      // Fjord coast
            latitude: 75,     // Northern
            urban: 50,        // Medium city
            rainfall: 95,     // Extremely wet
            remoteness: 45    // Moderate
        }
    },
    {
        name: 'Quito, Ecuador',
        fact: 'Quito sits at 2,850m elevation on the equator, giving it eternal spring weather.',
        lat: -0.1807,
        lng: -78.4678,
        radar: {
            climate: 55,      // Cool due to altitude
            elevation: 85,    // High Andes
            coastal: 15,      // Inland but near coast
            latitude: 5,      // On the equator
            urban: 75,        // Large city
            rainfall: 60,     // Moderate-wet
            remoteness: 50    // Regional hub
        }
    },
    {
        name: 'Istanbul, Turkey',
        fact: 'Istanbul is the only city in the world that spans two continents: Europe and Asia.',
        lat: 41.0082,
        lng: 28.9784,
        radar: {
            climate: 45,      // Temperate
            elevation: 30,    // Hilly coastal
            coastal: 90,      // Bosphorus Strait
            latitude: 48,     // Mid-latitude
            urban: 95,        // Mega-city
            rainfall: 50,     // Moderate
            remoteness: 90    // Major crossroads
        }
    },
    {
        name: 'Anchorage, Alaska',
        fact: 'Anchorage is home to nearly 40% of Alaska\'s entire population.',
        lat: 61.2181,
        lng: -149.9003,
        radar: {
            climate: 85,      // Cold subarctic
            elevation: 45,    // Coastal mountains
            coastal: 80,      // Cook Inlet
            latitude: 78,     // Subarctic
            urban: 50,        // Medium city
            rainfall: 45,     // Moderate
            remoteness: 20    // Isolated
        }
    },
    {
        name: 'Marrakech, Morocco',
        fact: 'Marrakech is known as the "Red City" for its distinctive sandstone buildings.',
        lat: 31.6295,
        lng: -7.9811,
        radar: {
            climate: 15,      // Hot semi-arid
            elevation: 50,    // Foothills
            coastal: 20,      // Interior
            latitude: 36,     // Subtropical
            urban: 70,        // Large city
            rainfall: 15,     // Dry
            remoteness: 65    // Regional hub
        }
    },
    {
        name: 'Yakutsk, Russia',
        fact: 'Yakutsk is the coldest major city on Earth, with winter temperatures below -40°C.',
        lat: 62.0355,
        lng: 129.6755,
        radar: {
            climate: 100,     // Extreme continental cold
            elevation: 40,    // River valley
            coastal: 0,       // Very inland
            latitude: 78,     // Subarctic
            urban: 50,        // Medium city
            rainfall: 20,     // Very dry
            remoteness: 10    // Very isolated
        }
    },
    {
        name: 'Honolulu, Hawaii',
        fact: 'Honolulu is the most isolated major city in the world, over 2,000 miles from the nearest continent.',
        lat: 21.3099,
        lng: -157.8581,
        radar: {
            climate: 20,      // Tropical warm
            elevation: 15,    // Coastal plain
            coastal: 100,     // Island
            latitude: 25,     // Tropical
            urban: 75,        // Large city
            rainfall: 65,     // Moderate-wet
            remoteness: 5     // Extremely isolated
        }
    },
    {
        name: 'Buenos Aires, Argentina',
        fact: 'Buenos Aires is known as the "Paris of South America" for its European architecture and culture.',
        lat: -34.6037,
        lng: -58.3816,
        radar: {
            climate: 35,      // Humid subtropical
            elevation: 10,    // Coastal plain
            coastal: 70,      // Río de la Plata
            latitude: 40,     // Mid-latitude
            urban: 95,        // Mega-city
            rainfall: 55,     // Moderate
            remoteness: 70    // Regional hub
        }
    },
    {
        name: 'Addis Ababa, Ethiopia',
        fact: 'Addis Ababa is the diplomatic capital of Africa, hosting the African Union headquarters.',
        lat: 9.0320,
        lng: 38.7469,
        radar: {
            climate: 50,      // Highland temperate
            elevation: 85,    // High plateau
            coastal: 0,       // Very inland
            latitude: 12,     // Tropical
            urban: 80,        // Large city
            rainfall: 60,     // Moderate (monsoon)
            remoteness: 55    // Regional hub
        }
    },
    {
        name: 'Nuuk, Greenland',
        fact: 'Nuuk is the world\'s smallest capital city by population and the most northern capital in North America.',
        lat: 64.1814,
        lng: -51.6941,
        radar: {
            climate: 90,      // Arctic cold
            elevation: 35,    // Fjord coast
            coastal: 90,      // Atlantic coast
            latitude: 80,     // Subarctic
            urban: 15,        // Small town
            rainfall: 40,     // Moderate
            remoteness: 5     // Extremely isolated
        }
    },
    {
        name: 'Bangkok, Thailand',
        fact: 'Bangkok\'s full ceremonial name is the longest city name in the world at 168 letters.',
        lat: 13.7563,
        lng: 100.5018,
        radar: {
            climate: 10,      // Hot tropical
            elevation: 5,     // River delta
            coastal: 50,      // Near Gulf
            latitude: 16,     // Tropical
            urban: 95,        // Mega-city
            rainfall: 85,     // Very wet (monsoon)
            remoteness: 85    // Major hub
        }
    },
    {
        name: 'Denver, Colorado',
        fact: 'Denver is exactly one mile (1,609m) above sea level, earning it the nickname "The Mile High City".',
        lat: 39.7392,
        lng: -104.9903,
        radar: {
            climate: 50,      // Continental
            elevation: 75,    // High plains/mountains
            coastal: 0,       // Very inland
            latitude: 46,     // Mid-latitude
            urban: 80,        // Large city
            rainfall: 20,     // Semi-arid
            remoteness: 75    // Well connected
        }
    },
    {
        name: 'Perth, Australia',
        fact: 'Perth is the most isolated major city in the world, over 2,000km from the nearest city.',
        lat: -31.9505,
        lng: 115.8605,
        radar: {
            climate: 30,      // Mediterranean
            elevation: 10,    // Coastal plain
            coastal: 90,      // Indian Ocean
            latitude: 36,     // Mid-latitude
            urban: 75,        // Large city
            rainfall: 35,     // Dry summer
            remoteness: 5     // Extremely isolated
        }
    },
    {
        name: 'Bogotá, Colombia',
        fact: 'Bogotá is the third-highest capital city in the world at 2,640m elevation.',
        lat: 4.7110,
        lng: -74.0721,
        radar: {
            climate: 55,      // Cool due to altitude
            elevation: 80,    // High Andes plateau
            coastal: 10,      // Inland mountain
            latitude: 8,      // Near equator
            urban: 90,        // Mega-city
            rainfall: 70,     // Wet
            remoteness: 70    // Regional hub
        }
    },
    {
        name: 'Nunavut, Canada',
        fact: 'Iqaluit is the capital of Canada\'s newest territory and experiences 24-hour daylight in summer.',
        lat: 63.7467,
        lng: -68.5170,
        radar: {
            climate: 95,      // Arctic cold
            elevation: 25,    // Arctic coastal
            coastal: 85,      // Frobisher Bay
            latitude: 82,     // Arctic
            urban: 12,        // Small town
            rainfall: 25,     // Arctic desert
            remoteness: 5     // Extremely isolated
        }
    },
    {
        name: 'Vienna, Austria',
        fact: 'Vienna has been ranked the world\'s most livable city multiple times.',
        lat: 48.2082,
        lng: 16.3738,
        radar: {
            climate: 60,      // Continental temperate
            elevation: 25,    // Danube basin
            coastal: 0,       // Very inland
            latitude: 55,     // Mid-latitude
            urban: 80,        // Major city
            rainfall: 50,     // Moderate
            remoteness: 95    // Very central (Europe)
        }
    },
    {
        name: 'Casablanca, Morocco',
        fact: 'Casablanca is home to the Hassan II Mosque, which has the world\'s tallest minaret.',
        lat: 33.5731,
        lng: -7.5898,
        radar: {
            climate: 30,      // Mediterranean
            elevation: 10,    // Coastal
            coastal: 95,      // Atlantic coast
            latitude: 38,     // Subtropical
            urban: 85,        // Large city
            rainfall: 30,     // Dry
            remoteness: 70    // Well connected
        }
    },
    {
        name: 'Vladivostok, Russia',
        fact: 'Vladivostok is Russia\'s largest Pacific port and the terminus of the Trans-Siberian Railway.',
        lat: 43.1155,
        lng: 131.8855,
        radar: {
            climate: 70,      // Cold continental
            elevation: 40,    // Hilly coast
            coastal: 90,      // Pacific Ocean
            latitude: 50,     // Mid-latitude
            urban: 60,        // Medium-large city
            rainfall: 50,     // Moderate
            remoteness: 35    // Isolated but connected
        }
    },
    {
        name: 'Mexico City, Mexico',
        fact: 'Mexico City is built on the ruins of the Aztec capital Tenochtitlan and sits on a former lakebed.',
        lat: 19.4326,
        lng: -99.1332,
        radar: {
            climate: 45,      // Mild highland
            elevation: 85,    // High valley
            coastal: 5,       // Very inland
            latitude: 22,     // Tropical
            urban: 100,       // Mega-city
            rainfall: 55,     // Moderate
            remoteness: 80    // Major hub
        }
    },
    {
        name: 'Zanzibar, Tanzania',
        fact: 'Zanzibar was once the world\'s largest producer of cloves and a major slave trading hub.',
        lat: -6.1659,
        lng: 39.2026,
        radar: {
            climate: 15,      // Hot tropical
            elevation: 5,     // Island lowland
            coastal: 100,     // Island
            latitude: 8,      // Near equator
            urban: 35,        // Medium town
            rainfall: 80,     // Wet tropical
            remoteness: 30    // Island isolation
        }
    },
    {
        name: 'Montevideo, Uruguay',
        fact: 'Montevideo has one of the highest quality of life rankings in South America.',
        lat: -34.9011,
        lng: -56.1645,
        radar: {
            climate: 40,      // Temperate
            elevation: 10,    // Coastal plain
            coastal: 90,      // Río de la Plata
            latitude: 40,     // Mid-latitude
            urban: 75,        // Large city
            rainfall: 50,     // Moderate
            remoteness: 60    // Regional hub
        }
    },
    {
        name: 'Kyoto, Japan',
        fact: 'Kyoto was Japan\'s capital for over 1,000 years and has over 2,000 temples and shrines.',
        lat: 35.0116,
        lng: 135.7681,
        radar: {
            climate: 45,      // Temperate
            elevation: 35,    // Basin with mountains
            coastal: 30,      // Inland but near sea
            latitude: 42,     // Mid-latitude
            urban: 75,        // Large city
            rainfall: 70,     // Humid subtropical
            remoteness: 85    // Well connected
        }
    },
    {
        name: 'Reykjavik, Iceland',
        fact: 'Reykjavik uses geothermal energy to heat nearly all of its buildings.',
        lat: 64.1466,
        lng: -21.9426,
        radar: {
            climate: 80,      // Cool oceanic
            elevation: 15,    // Coastal plain
            coastal: 95,      // Atlantic coast
            latitude: 80,     // Subarctic
            urban: 45,        // Medium city
            rainfall: 65,     // Moderate-wet
            remoteness: 25    // Isolated
        }
    },
    {
        name: 'Medellín, Colombia',
        fact: 'Medellín is known as the "City of Eternal Spring" for its year-round mild weather.',
        lat: 6.2476,
        lng: -75.5658,
        radar: {
            climate: 50,      // Mild highland
            elevation: 75,    // Andean valley
            coastal: 10,      // Inland mountain
            latitude: 8,      // Near equator
            urban: 85,        // Large city
            rainfall: 75,     // Wet tropical
            remoteness: 65    // Regional hub
        }
    },
    {
        name: 'Lisbon, Portugal',
        fact: 'Lisbon is one of the oldest cities in Western Europe, predating Rome by centuries.',
        lat: 38.7223,
        lng: -9.1393,
        radar: {
            climate: 35,      // Mediterranean
            elevation: 40,    // Hilly coast
            coastal: 95,      // Atlantic coast
            latitude: 45,     // Mid-latitude
            urban: 80,        // Large city
            rainfall: 40,     // Dry summer
            remoteness: 80    // Well connected
        }
    },
    {
        name: 'Punta Arenas, Chile',
        fact: 'Punta Arenas is the southernmost continental city in Chile and a gateway to Antarctica.',
        lat: -53.1638,
        lng: -70.9171,
        radar: {
            climate: 75,      // Cold oceanic
            elevation: 20,    // Coastal plains
            coastal: 90,      // Strait of Magellan
            latitude: 68,     // Subantarctic
            urban: 30,        // Medium city
            rainfall: 45,     // Moderate
            remoteness: 15    // Very isolated
        }
    },
    {
        name: 'Wellington, New Zealand',
        fact: 'Wellington is the southernmost capital city in the world and the windiest city on Earth.',
        lat: -41.2865,
        lng: 174.7762,
        radar: {
            climate: 55,      // Cool temperate
            elevation: 40,    // Hilly coast
            coastal: 95,      // Harbor
            latitude: 48,     // Mid-latitude
            urban: 65,        // Large city
            rainfall: 65,     // Wet
            remoteness: 20    // Very isolated
        }
    },
    {
        name: 'Cusco, Peru',
        fact: 'Cusco was the historic capital of the Inca Empire and sits at 3,400m elevation.',
        lat: -13.5319,
        lng: -71.9675,
        radar: {
            climate: 60,      // Cool highland
            elevation: 90,    // High Andes
            coastal: 5,       // Very inland
            latitude: 16,     // Tropical
            urban: 55,        // Medium city
            rainfall: 40,     // Semi-arid
            remoteness: 35    // Isolated
        }
    },
    {
        name: 'Tbilisi, Georgia',
        fact: 'Tbilisi has been inhabited since the 4th millennium BC and sits at the crossroads of Europe and Asia.',
        lat: 41.7151,
        lng: 44.8271,
        radar: {
            climate: 50,      // Continental
            elevation: 55,    // Valley in mountains
            coastal: 10,      // Inland
            latitude: 48,     // Mid-latitude
            urban: 70,        // Large city
            rainfall: 45,     // Moderate
            remoteness: 55    // Regional hub
        }
    },
    {
        name: 'Dakar, Senegal',
        fact: 'Dakar is the westernmost point of the African continent.',
        lat: 14.7167,
        lng: -17.4677,
        radar: {
            climate: 20,      // Hot tropical
            elevation: 10,    // Coastal plain
            coastal: 95,      // Atlantic peninsula
            latitude: 18,     // Tropical
            urban: 75,        // Large city
            rainfall: 35,     // Dry season
            remoteness: 60    // Regional hub
        }
    },
    {
        name: 'Fairbanks, Alaska',
        fact: 'Fairbanks experiences temperature extremes from -50°C in winter to +35°C in summer.',
        lat: 64.8378,
        lng: -147.7164,
        radar: {
            climate: 95,      // Extreme continental
            elevation: 40,    // River valley
            coastal: 0,       // Very inland
            latitude: 81,     // Subarctic
            urban: 25,        // Small city
            rainfall: 20,     // Very dry
            remoteness: 15    // Very isolated
        }
    },
    {
        name: 'Riga, Latvia',
        fact: 'Riga\'s Old Town is a UNESCO World Heritage Site with over 800 Art Nouveau buildings.',
        lat: 56.9496,
        lng: 24.1052,
        radar: {
            climate: 75,      // Continental cold
            elevation: 10,    // Coastal plain
            coastal: 75,      // Baltic Sea
            latitude: 70,     // Northern
            urban: 65,        // Large city
            rainfall: 50,     // Moderate
            remoteness: 80    // Well connected
        }
    },
    {
        name: 'Kathmandu, Nepal',
        fact: 'Kathmandu Valley is surrounded by the Himalayas with four UNESCO World Heritage Sites.',
        lat: 27.7172,
        lng: 85.3240,
        radar: {
            climate: 55,      // Mild highland
            elevation: 85,    // Himalayan valley
            coastal: 0,       // Very inland
            latitude: 32,     // Subtropical
            urban: 75,        // Large city
            rainfall: 75,     // Monsoon wet
            remoteness: 40    // Isolated
        }
    },
    {
        name: 'Christchurch, New Zealand',
        fact: 'Christchurch is known as the "Garden City" and was rebuilt after devastating earthquakes in 2011.',
        lat: -43.5321,
        lng: 172.6362,
        radar: {
            climate: 55,      // Temperate oceanic
            elevation: 15,    // Canterbury Plains
            coastal: 80,      // Pacific coast
            latitude: 50,     // Mid-latitude
            urban: 60,        // Large city
            rainfall: 50,     // Moderate
            remoteness: 20    // Very isolated
        }
    },
    {
        name: 'Ouagadougou, Burkina Faso',
        fact: 'Ouagadougou hosts Africa\'s largest film festival, FESPACO.',
        lat: 12.3714,
        lng: -1.5197,
        radar: {
            climate: 10,      // Hot semi-arid
            elevation: 30,    // Plateau
            coastal: 0,       // Very inland
            latitude: 15,     // Tropical
            urban: 65,        // Large city
            rainfall: 30,     // Dry
            remoteness: 45    // Moderate
        }
    },
    {
        name: 'Tallinn, Estonia',
        fact: 'Tallinn has one of the best-preserved medieval Old Towns in Europe.',
        lat: 59.4370,
        lng: 24.7536,
        radar: {
            climate: 80,      // Cold continental
            elevation: 15,    // Coastal plain
            coastal: 85,      // Baltic Sea
            latitude: 74,     // Northern
            urban: 60,        // Large city
            rainfall: 50,     // Moderate
            remoteness: 75    // Well connected
        }
    },
    {
        name: 'Guadalajara, Mexico',
        fact: 'Guadalajara is the birthplace of mariachi music and tequila.',
        lat: 20.6597,
        lng: -103.3496,
        radar: {
            climate: 40,      // Subtropical highland
            elevation: 70,    // High plateau
            coastal: 15,      // Inland
            latitude: 24,     // Tropical
            urban: 85,        // Large city
            rainfall: 50,     // Moderate
            remoteness: 75    // Well connected
        }
    },
    {
        name: 'Hobart, Australia',
        fact: 'Hobart is Australia\'s second-oldest capital and gateway to Antarctica.',
        lat: -42.8821,
        lng: 147.3272,
        radar: {
            climate: 60,      // Cool oceanic
            elevation: 35,    // Coastal hills
            coastal: 90,      // Derwent River
            latitude: 50,     // Mid-latitude
            urban: 40,        // Medium city
            rainfall: 55,     // Moderate
            remoteness: 25    // Isolated
        }
    },
    {
        name: 'Yerevan, Armenia',
        fact: 'Yerevan is one of the world\'s oldest continuously inhabited cities, founded in 782 BC.',
        lat: 40.1792,
        lng: 44.4991,
        radar: {
            climate: 55,      // Continental
            elevation: 65,    // Highland plateau
            coastal: 0,       // Very inland
            latitude: 46,     // Mid-latitude
            urban: 70,        // Large city
            rainfall: 25,     // Semi-arid
            remoteness: 50    // Regional hub
        }
    },
    {
        name: 'Porto, Portugal',
        fact: 'Porto is famous for Port wine and its stunning Douro River valley.',
        lat: 41.1579,
        lng: -8.6291,
        radar: {
            climate: 40,      // Mediterranean
            elevation: 40,    // Hilly coast
            coastal: 90,      // Atlantic coast
            latitude: 48,     // Mid-latitude
            urban: 70,        // Large city
            rainfall: 60,     // Wet winter
            remoteness: 75    // Well connected
        }
    },
    {
        name: 'Karachi, Pakistan',
        fact: 'Karachi is Pakistan\'s largest city and was the original capital.',
        lat: 24.8607,
        lng: 67.0011,
        radar: {
            climate: 15,      // Hot desert
            elevation: 10,    // Coastal plain
            coastal: 95,      // Arabian Sea
            latitude: 28,     // Subtropical
            urban: 100,       // Mega-city
            rainfall: 15,     // Very dry
            remoteness: 75    // Major hub
        }
    },
    {
        name: 'Antananarivo, Madagascar',
        fact: 'Antananarivo sits atop a series of hills and is known as the "City of a Thousand".',
        lat: -18.8792,
        lng: 47.5079,
        radar: {
            climate: 45,      // Subtropical highland
            elevation: 75,    // High plateau
            coastal: 20,      // Interior island
            latitude: 22,     // Tropical
            urban: 65,        // Large city
            rainfall: 65,     // Wet season
            remoteness: 30    // Island isolation
        }
    },
    {
        name: 'Kuala Lumpur, Malaysia',
        fact: 'The Petronas Twin Towers were the world\'s tallest buildings from 1998 to 2004.',
        lat: 3.1390,
        lng: 101.6869,
        radar: {
            climate: 10,      // Hot tropical
            elevation: 15,    // River valley
            coastal: 40,      // Near coast
            latitude: 5,      // Near equator
            urban: 95,        // Mega-city
            rainfall: 95,     // Extremely wet
            remoteness: 90    // Major hub
        }
    },
    {
        name: 'Santiago, Chile',
        fact: 'Santiago sits in a valley surrounded by the snow-capped Andes mountains.',
        lat: -33.4489,
        lng: -70.6693,
        radar: {
            climate: 45,      // Mediterranean
            elevation: 60,    // Andean valley
            coastal: 20,      // Inland near coast
            latitude: 38,     // Mid-latitude
            urban: 90,        // Mega-city
            rainfall: 30,     // Dry summer
            remoteness: 65    // Regional hub
        }
    },
    {
        name: 'Reykjanes, Iceland',
        fact: 'The Reykjanes Peninsula is home to the famous Blue Lagoon geothermal spa.',
        lat: 63.8757,
        lng: -22.6761,
        radar: {
            climate: 80,      // Cold oceanic
            elevation: 25,    // Coastal lava fields
            coastal: 100,     // Peninsula
            latitude: 80,     // Subarctic
            urban: 15,        // Rural
            rainfall: 70,     // Wet
            remoteness: 20    // Isolated
        }
    },
    {
        name: 'Salvador, Brazil',
        fact: 'Salvador was Brazil\'s first capital and is the center of Afro-Brazilian culture.',
        lat: -12.9714,
        lng: -38.5014,
        radar: {
            climate: 20,      // Hot tropical
            elevation: 20,    // Coastal hills
            coastal: 95,      // Atlantic coast
            latitude: 15,     // Tropical
            urban: 80,        // Large city
            rainfall: 80,     // Very wet
            remoteness: 65    // Regional hub
        }
    },
    {
        name: 'Krakow, Poland',
        fact: 'Krakow\'s Old Town was the first UNESCO World Heritage Site listed.',
        lat: 50.0647,
        lng: 19.9450,
        radar: {
            climate: 65,      // Continental temperate
            elevation: 30,    // River valley
            coastal: 0,       // Very inland
            latitude: 56,     // Mid-latitude
            urban: 70,        // Large city
            rainfall: 50,     // Moderate
            remoteness: 85    // Well connected
        }
    },
    {
        name: 'Tromsø, Norway',
        fact: 'Tromsø is known as the "Paris of the North" and has midnight sun for months.',
        lat: 69.6492,
        lng: 18.9553,
        radar: {
            climate: 85,      // Subarctic
            elevation: 35,    // Coastal mountains
            coastal: 90,      // Fjord coast
            latitude: 88,     // Arctic
            urban: 35,        // Medium city
            rainfall: 60,     // Moderate
            remoteness: 25    // Isolated
        }
    },
    {
        name: 'Puebla, Mexico',
        fact: 'Puebla is known for its Talavera pottery and mole poblano cuisine.',
        lat: 19.0414,
        lng: -98.2063,
        radar: {
            climate: 45,      // Subtropical highland
            elevation: 75,    // High valley
            coastal: 10,      // Inland
            latitude: 22,     // Tropical
            urban: 75,        // Large city
            rainfall: 50,     // Moderate
            remoteness: 80    // Well connected
        }
    },
    {
        name: 'Tashkent, Uzbekistan',
        fact: 'Tashkent is Central Asia\'s largest city and was rebuilt after a 1966 earthquake.',
        lat: 41.2995,
        lng: 69.2401,
        radar: {
            climate: 55,      // Continental
            elevation: 50,    // Plateau
            coastal: 0,       // Very inland
            latitude: 48,     // Mid-latitude
            urban: 80,        // Large city
            rainfall: 25,     // Semi-arid
            remoteness: 60    // Regional hub
        }
    },
    {
        name: 'Harare, Zimbabwe',
        fact: 'Harare is known as the "Sunshine City" for its pleasant climate year-round.',
        lat: -17.8252,
        lng: 31.0335,
        radar: {
            climate: 45,      // Subtropical highland
            elevation: 75,    // High plateau
            coastal: 0,       // Very inland
            latitude: 21,     // Tropical
            urban: 70,        // Large city
            rainfall: 45,     // Moderate
            remoteness: 45    // Moderate
        }
    },
    {
        name: 'Taipei, Taiwan',
        fact: 'Taipei 101 was the world\'s tallest building from 2004 to 2010.',
        lat: 25.0330,
        lng: 121.5654,
        radar: {
            climate: 30,      // Humid subtropical
            elevation: 25,    // Basin
            coastal: 70,      // Near coast
            latitude: 28,     // Subtropical
            urban: 95,        // Mega-city
            rainfall: 90,     // Very wet
            remoteness: 85    // Major hub
        }
    },
    {
        name: 'Cartagena, Colombia',
        fact: 'Cartagena\'s walled Old Town is one of the best-preserved colonial cities in the Americas.',
        lat: 10.3910,
        lng: -75.4794,
        radar: {
            climate: 15,      // Hot tropical
            elevation: 5,     // Coastal plain
            coastal: 100,     // Caribbean coast
            latitude: 12,     // Tropical
            urban: 65,        // Large city
            rainfall: 60,     // Moderate-wet
            remoteness: 55    // Regional hub
        }
    },
    {
        name: 'Dubrovnik, Croatia',
        fact: 'Dubrovnik\'s Old Town is a UNESCO site and filming location for Game of Thrones.',
        lat: 42.6507,
        lng: 18.0944,
        radar: {
            climate: 40,      // Mediterranean
            elevation: 35,    // Coastal hills
            coastal: 95,      // Adriatic coast
            latitude: 49,     // Mid-latitude
            urban: 30,        // Medium city
            rainfall: 55,     // Moderate
            remoteness: 60    // Well connected
        }
    },
    {
        name: 'Almaty, Kazakhstan',
        fact: 'Almaty sits at the foothills of the Trans-Ili Alatau mountains and was Kazakhstan\'s capital.',
        lat: 43.2220,
        lng: 76.8512,
        radar: {
            climate: 60,      // Continental
            elevation: 70,    // Mountain foothills
            coastal: 0,       // Very inland
            latitude: 50,     // Mid-latitude
            urban: 75,        // Large city
            rainfall: 35,     // Semi-arid
            remoteness: 55    // Regional hub
        }
    },
    {
        name: 'Darwin, Australia',
        fact: 'Darwin is Australia\'s northernmost capital and closest to Asia.',
        lat: -12.4634,
        lng: 130.8456,
        radar: {
            climate: 15,      // Hot tropical
            elevation: 10,    // Coastal plain
            coastal: 90,      // Timor Sea
            latitude: 15,     // Tropical
            urban: 35,        // Medium city
            rainfall: 75,     // Wet season monsoon
            remoteness: 20    // Very isolated
        }
    },
    {
        name: 'Oaxaca, Mexico',
        fact: 'Oaxaca is the culinary capital of Mexico and home to ancient Zapotec ruins.',
        lat: 17.0654,
        lng: -96.7236,
        radar: {
            climate: 40,      // Subtropical highland
            elevation: 70,    // Valley in mountains
            coastal: 15,      // Inland near coast
            latitude: 20,     // Tropical
            urban: 55,        // Medium city
            rainfall: 45,     // Moderate
            remoteness: 55    // Regional hub
        }
    },
    {
        name: 'Split, Croatia',
        fact: 'Split was built around the Roman Emperor Diocletian\'s 4th-century palace.',
        lat: 43.5081,
        lng: 16.4402,
        radar: {
            climate: 40,      // Mediterranean
            elevation: 30,    // Coastal hills
            coastal: 95,      // Adriatic coast
            latitude: 50,     // Mid-latitude
            urban: 50,        // Medium city
            rainfall: 50,     // Moderate
            remoteness: 70    // Well connected
        }
    },
    {
        name: 'Asmara, Eritrea',
        fact: 'Asmara has one of the world\'s finest collections of Italian modernist architecture.',
        lat: 15.3229,
        lng: 38.9251,
        radar: {
            climate: 45,      // Highland tropical
            elevation: 80,    // High plateau
            coastal: 15,      // Inland near coast
            latitude: 18,     // Tropical
            urban: 50,        // Medium city
            rainfall: 30,     // Semi-arid
            remoteness: 30    // Isolated
        }
    },
    {
        name: 'Edinburgh, Scotland',
        fact: 'Edinburgh\'s Old and New Towns are UNESCO World Heritage Sites.',
        lat: 55.9533,
        lng: -3.1883,
        radar: {
            climate: 70,      // Cool oceanic
            elevation: 40,    // Hilly terrain
            coastal: 65,      // North Sea
            latitude: 68,     // Northern
            urban: 70,        // Large city
            rainfall: 65,     // Wet
            remoteness: 85    // Well connected
        }
    },
    {
        name: 'Chiang Mai, Thailand',
        fact: 'Chiang Mai is surrounded by mountains and has over 300 Buddhist temples.',
        lat: 18.7883,
        lng: 98.9853,
        radar: {
            climate: 25,      // Warm tropical highland
            elevation: 50,    // Valley in mountains
            coastal: 0,       // Very inland
            latitude: 22,     // Tropical
            urban: 60,        // Large city
            rainfall: 75,     // Monsoon wet
            remoteness: 65    // Regional hub
        }
    },
    {
        name: 'Valparaíso, Chile',
        fact: 'Valparaíso is built on 42 hills overlooking the Pacific Ocean.',
        lat: -33.0472,
        lng: -71.6127,
        radar: {
            climate: 40,      // Mediterranean
            elevation: 55,    // Steep coastal hills
            coastal: 100,     // Pacific coast
            latitude: 38,     // Mid-latitude
            urban: 55,        // Medium city
            rainfall: 30,     // Dry summer
            remoteness: 60    // Well connected
        }
    },
    {
        name: 'Brasília, Brazil',
        fact: 'Brasília was built from scratch in just 41 months to be Brazil\'s new capital.',
        lat: -15.8267,
        lng: -47.9218,
        radar: {
            climate: 30,      // Tropical savanna
            elevation: 65,    // Central plateau
            coastal: 0,       // Very inland
            latitude: 18,     // Tropical
            urban: 85,        // Large city
            rainfall: 70,     // Wet season
            remoteness: 70    // Well connected
        }
    },
    {
        name: 'Muscat, Oman',
        fact: 'Muscat is surrounded by dramatic mountains and the Arabian Sea.',
        lat: 23.5880,
        lng: 58.3829,
        radar: {
            climate: 10,      // Hot desert
            elevation: 40,    // Coastal mountains
            coastal: 95,      // Gulf of Oman
            latitude: 27,     // Subtropical
            urban: 65,        // Large city
            rainfall: 5,      // Very dry
            remoteness: 60    // Regional hub
        }
    },
    {
        name: 'Irkutsk, Russia',
        fact: 'Irkutsk is known as the "Paris of Siberia" and sits near Lake Baikal.',
        lat: 52.2978,
        lng: 104.2964,
        radar: {
            climate: 90,      // Extreme continental
            elevation: 45,    // River valley
            coastal: 0,       // Very inland
            latitude: 58,     // Northern
            urban: 60,        // Large city
            rainfall: 35,     // Semi-arid
            remoteness: 30    // Isolated
        }
    },
    {
        name: 'Tunis, Tunisia',
        fact: 'Tunis was built near the ruins of ancient Carthage.',
        lat: 36.8065,
        lng: 10.1815,
        radar: {
            climate: 35,      // Mediterranean
            elevation: 20,    // Coastal hills
            coastal: 90,      // Mediterranean Sea
            latitude: 43,     // Mid-latitude
            urban: 75,        // Large city
            rainfall: 35,     // Dry summer
            remoteness: 70    // Well connected
        }
    },
    {
        name: 'Hanoi, Vietnam',
        fact: 'Hanoi is over 1,000 years old and known for its Old Quarter and lakes.',
        lat: 21.0285,
        lng: 105.8542,
        radar: {
            climate: 35,      // Humid subtropical
            elevation: 20,    // River delta
            coastal: 35,      // Inland near coast
            latitude: 24,     // Tropical
            urban: 85,        // Large city
            rainfall: 80,     // Very wet monsoon
            remoteness: 80    // Well connected
        }
    },
    {
        name: 'Granada, Spain',
        fact: 'Granada is home to the Alhambra, one of the finest examples of Islamic architecture.',
        lat: 37.1773,
        lng: -3.5986,
        radar: {
            climate: 40,      // Mediterranean
            elevation: 60,    // Sierra Nevada foothills
            coastal: 25,      // Inland near coast
            latitude: 43,     // Mid-latitude
            urban: 50,        // Medium city
            rainfall: 35,     // Semi-arid
            remoteness: 75    // Well connected
        }
    },
    {
        name: 'Windhoek, Namibia',
        fact: 'Windhoek sits at 1,700m elevation in the semi-arid highlands of central Namibia.',
        lat: -22.5597,
        lng: 17.0832,
        radar: {
            climate: 40,      // Semi-arid highland
            elevation: 75,    // High plateau
            coastal: 5,       // Very inland
            latitude: 26,     // Subtropical
            urban: 50,        // Medium city
            rainfall: 20,     // Dry
            remoteness: 35    // Isolated
        }
    },
    {
        name: 'Cologne, Germany',
        fact: 'Cologne\'s cathedral took 632 years to complete and survived WWII bombings.',
        lat: 50.9375,
        lng: 6.9603,
        radar: {
            climate: 60,      // Temperate oceanic
            elevation: 20,    // Rhine valley
            coastal: 15,      // Inland
            latitude: 57,     // Mid-latitude
            urban: 75,        // Large city
            rainfall: 60,     // Moderate-wet
            remoteness: 95    // Very central Europe
        }
    },
    {
        name: 'Havana, Cuba',
        fact: 'Havana\'s Old Town is the largest colonial city center in Latin America.',
        lat: 23.1136,
        lng: -82.3666,
        radar: {
            climate: 20,      // Hot tropical
            elevation: 10,    // Coastal plain
            coastal: 95,      // Caribbean coast
            latitude: 26,     // Tropical
            urban: 80,        // Large city
            rainfall: 65,     // Wet season
            remoteness: 50    // Island isolation
        }
    },
    {
        name: 'Queenstown, New Zealand',
        fact: 'Queenstown is known as the adventure capital of the world.',
        lat: -45.0312,
        lng: 168.6626,
        radar: {
            climate: 60,      // Cool oceanic
            elevation: 60,    // Alpine lakes
            coastal: 20,      // Inland
            latitude: 52,     // Mid-latitude
            urban: 25,        // Small city
            rainfall: 45,     // Moderate
            remoteness: 20    // Very isolated
        }
    },
    {
        name: 'Luanda, Angola',
        fact: 'Luanda is one of the most expensive cities in the world for expatriates.',
        lat: -8.8383,
        lng: 13.2344,
        radar: {
            climate: 20,      // Hot tropical
            elevation: 15,    // Coastal plain
            coastal: 95,      // Atlantic coast
            latitude: 10,     // Near equator
            urban: 80,        // Large city
            rainfall: 40,     // Semi-arid
            remoteness: 50    // Regional hub
        }
    },
    {
        name: 'Reims, France',
        fact: 'Reims Cathedral is where French kings were crowned for over 1,000 years.',
        lat: 49.2583,
        lng: 4.0317,
        radar: {
            climate: 60,      // Temperate oceanic
            elevation: 25,    // Plains
            coastal: 20,      // Inland
            latitude: 55,     // Mid-latitude
            urban: 55,        // Medium city
            rainfall: 55,     // Moderate
            remoteness: 90    // Well connected
        }
    },
    {
        name: 'Sapporo, Japan',
        fact: 'Sapporo hosts one of Japan\'s largest snow festivals with massive ice sculptures.',
        lat: 43.0642,
        lng: 141.3469,
        radar: {
            climate: 75,      // Cold continental
            elevation: 25,    // Coastal plain
            coastal: 50,      // Near Sea of Japan
            latitude: 50,     // Mid-latitude
            urban: 75,        // Large city
            rainfall: 70,     // Snowy wet
            remoteness: 70    // Well connected
        }
    },
    {
        name: 'Jaipur, India',
        fact: 'Jaipur is known as the "Pink City" for its distinctive rose-colored buildings.',
        lat: 26.9124,
        lng: 75.7873,
        radar: {
            climate: 15,      // Hot semi-arid
            elevation: 45,    // Aravalli hills
            coastal: 0,       // Very inland
            latitude: 31,     // Subtropical
            urban: 80,        // Large city
            rainfall: 35,     // Monsoon dry
            remoteness: 80    // Well connected
        }
    },
    {
        name: 'Bergen, Norway',
        fact: 'Bergen is surrounded by seven mountains and is Europe\'s rainiest city.',
        lat: 60.3913,
        lng: 5.3221,
        radar: {
            climate: 65,      // Cool oceanic
            elevation: 55,    // Fjord mountains
            coastal: 95,      // North Sea fjords
            latitude: 75,     // Northern
            urban: 55,        // Medium city
            rainfall: 100,    // Extremely wet
            remoteness: 60    // Well connected
        }
    },
    {
        name: 'Canberra, Australia',
        fact: 'Canberra was purpose-built to be Australia\'s capital in 1913.',
        lat: -35.2809,
        lng: 149.1300,
        radar: {
            climate: 45,      // Temperate
            elevation: 60,    // Highland valley
            coastal: 10,      // Inland
            latitude: 41,     // Mid-latitude
            urban: 60,        // Large city
            rainfall: 40,     // Moderate
            remoteness: 65    // Well connected
        }
    },
    {
        name: 'Doha, Qatar',
        fact: 'Doha transformed from a small fishing village to a modern metropolis in just decades.',
        lat: 25.2854,
        lng: 51.5310,
        radar: {
            climate: 5,       // Extremely hot desert
            elevation: 5,     // Coastal flat
            coastal: 95,      // Persian Gulf
            latitude: 28,     // Subtropical
            urban: 90,        // Mega-city
            rainfall: 5,      // Extremely dry
            remoteness: 80    // Major hub
        }
    },
    {
        name: 'Ulan Bator, Mongolia',
        fact: 'Ulan Bator is the coldest national capital in the world.',
        lat: 47.8864,
        lng: 106.9057,
        radar: {
            climate: 100,     // Extreme continental cold
            elevation: 70,    // High plateau
            coastal: 0,       // Very inland
            latitude: 54,     // Mid-latitude
            urban: 60,        // Large city
            rainfall: 15,     // Very dry
            remoteness: 20    // Very isolated
        }
    },
    {
        name: 'Zanzibar City, Tanzania',
        fact: 'Stone Town in Zanzibar is a UNESCO site with Swahili, Arab, and European influences.',
        lat: -6.1659,
        lng: 39.2026,
        radar: {
            climate: 20,      // Hot tropical
            elevation: 5,     // Island coast
            coastal: 100,     // Island
            latitude: 8,      // Near equator
            urban: 40,        // Medium city
            rainfall: 85,     // Very wet
            remoteness: 35    // Island isolation
        }
    },
    {
        name: 'Salzburg, Austria',
        fact: 'Salzburg is Mozart\'s birthplace and the setting for The Sound of Music.',
        lat: 47.8095,
        lng: 13.0550,
        radar: {
            climate: 60,      // Alpine temperate
            elevation: 55,    // Alpine valley
            coastal: 0,       // Very inland
            latitude: 54,     // Mid-latitude
            urban: 50,        // Medium city
            rainfall: 70,     // Wet
            remoteness: 85    // Well connected
        }
    },
    {
        name: 'Bali, Indonesia',
        fact: 'Bali is known as the "Island of the Gods" with thousands of Hindu temples.',
        lat: -8.4095,
        lng: 115.1889,
        radar: {
            climate: 15,      // Hot tropical
            elevation: 50,    // Volcanic mountains
            coastal: 100,     // Island
            latitude: 10,     // Near equator
            urban: 45,        // Medium city
            rainfall: 90,     // Very wet
            remoteness: 60    // Island tourism hub
        }
    },
    {
        name: 'Seville, Spain',
        fact: 'Seville is home to the world\'s largest Gothic cathedral.',
        lat: 37.3891,
        lng: -5.9845,
        radar: {
            climate: 25,      // Hot Mediterranean
            elevation: 15,    // River valley
            coastal: 30,      // Inland near coast
            latitude: 43,     // Mid-latitude
            urban: 70,        // Large city
            rainfall: 30,     // Dry
            remoteness: 80    // Well connected
        }
    },
    {
        name: 'Bern, Switzerland',
        fact: 'Bern\'s Old Town is a UNESCO World Heritage Site with medieval arcades.',
        lat: 46.9481,
        lng: 7.4474,
        radar: {
            climate: 60,      // Alpine temperate
            elevation: 60,    // Alpine foothills
            coastal: 0,       // Very inland
            latitude: 53,     // Mid-latitude
            urban: 50,        // Medium city
            rainfall: 65,     // Moderate-wet
            remoteness: 90    // Very central Europe
        }
    },
    {
        name: 'Amman, Jordan',
        fact: 'Amman is built on seven hills and was once the ancient city of Philadelphia.',
        lat: 31.9454,
        lng: 35.9284,
        radar: {
            climate: 35,      // Hot Mediterranean
            elevation: 60,    // Highland plateau
            coastal: 20,      // Inland near coast
            latitude: 36,     // Subtropical
            urban: 75,        // Large city
            rainfall: 25,     // Semi-arid
            remoteness: 70    // Regional hub
        }
    },
    {
        name: 'Cork, Ireland',
        fact: 'Cork is built on an island in the River Lee and is Ireland\'s second-largest city.',
        lat: 51.8985,
        lng: -8.4756,
        radar: {
            climate: 65,      // Cool oceanic
            elevation: 20,    // River valley
            coastal: 80,      // Near Atlantic
            latitude: 58,     // Northern
            urban: 50,        // Medium city
            rainfall: 80,     // Very wet
            remoteness: 70    // Well connected
        }
    },
    {
        name: 'Fez, Morocco',
        fact: 'Fez has the world\'s oldest continuously operating university, founded in 859 AD.',
        lat: 34.0181,
        lng: -5.0078,
        radar: {
            climate: 40,      // Hot Mediterranean
            elevation: 50,    // Highland valley
            coastal: 20,      // Inland
            latitude: 39,     // Subtropical
            urban: 65,        // Large city
            rainfall: 35,     // Semi-arid
            remoteness: 65    // Regional hub
        }
    },
    {
        name: 'Casablanca, Morocco',
        fact: 'Casablanca\'s Hassan II Mosque has the world\'s tallest minaret at 210 meters.',
        lat: 33.5731,
        lng: -7.5898,
        radar: {
            climate: 35,      // Mediterranean
            elevation: 10,    // Coastal plain
            coastal: 95,      // Atlantic coast
            latitude: 38,     // Subtropical
            urban: 90,        // Mega-city
            rainfall: 30,     // Dry
            remoteness: 75    // Major hub
        }
    },
    {
        name: 'Sarajevo, Bosnia',
        fact: 'Sarajevo hosted the 1984 Winter Olympics and is known for its religious diversity.',
        lat: 43.8563,
        lng: 18.4131,
        radar: {
            climate: 60,      // Continental
            elevation: 60,    // Mountain valley
            coastal: 15,      // Inland near coast
            latitude: 50,     // Mid-latitude
            urban: 55,        // Medium city
            rainfall: 55,     // Moderate
            remoteness: 60    // Regional hub
        }
    },
    {
        name: 'Cuzco, Peru',
        fact: 'Cuzco was the capital of the Inca Empire and means "navel of the world".',
        lat: -13.5319,
        lng: -71.9675,
        radar: {
            climate: 55,      // Cool highland
            elevation: 95,    // Very high Andes
            coastal: 5,       // Very inland
            latitude: 16,     // Tropical
            urban: 60,        // Large city
            rainfall: 35,     // Semi-arid
            remoteness: 40    // Isolated
        }
    },
    {
        name: 'Reykjavík, Iceland',
        fact: 'Reykjavík means "smoky bay" from the geothermal steam Vikings saw.',
        lat: 64.1466,
        lng: -21.9426,
        radar: {
            climate: 75,      // Cold oceanic
            elevation: 15,    // Coastal plain
            coastal: 95,      // Atlantic coast
            latitude: 80,     // Subarctic
            urban: 50,        // Medium city
            rainfall: 70,     // Wet
            remoteness: 25    // Isolated
        }
    },
    {
        name: 'Abu Dhabi, UAE',
        fact: 'Abu Dhabi sits on an island and has the world\'s fastest roller coaster.',
        lat: 24.4539,
        lng: 54.3773,
        radar: {
            climate: 5,       // Extremely hot desert
            elevation: 5,     // Island flat
            coastal: 95,      // Persian Gulf
            latitude: 27,     // Subtropical
            urban: 90,        // Mega-city
            rainfall: 5,      // Extremely dry
            remoteness: 85    // Major hub
        }
    },
    {
        name: 'Guangzhou, China',
        fact: 'Guangzhou has been a major trading port for over 2,000 years.',
        lat: 23.1291,
        lng: 113.2644,
        radar: {
            climate: 25,      // Humid subtropical
            elevation: 15,    // River delta
            coastal: 60,      // Pearl River
            latitude: 26,     // Tropical
            urban: 100,       // Mega-city
            rainfall: 85,     // Very wet monsoon
            remoteness: 90    // Major hub
        }
    },
    {
        name: 'Lagos, Nigeria',
        fact: 'Lagos is Africa\'s largest city by population and a major economic hub.',
        lat: 6.5244,
        lng: 3.3792,
        radar: {
            climate: 20,      // Hot tropical
            elevation: 5,     // Coastal lagoon
            coastal: 95,      // Atlantic coast
            latitude: 8,      // Near equator
            urban: 100,       // Mega-city
            rainfall: 80,     // Very wet
            remoteness: 75    // Major hub
        }
    },
    {
        name: 'Vilnius, Lithuania',
        fact: 'Vilnius has one of Europe\'s largest Old Towns and over 1,200 medieval buildings.',
        lat: 54.6872,
        lng: 25.2797,
        radar: {
            climate: 75,      // Continental cold
            elevation: 20,    // River valley
            coastal: 30,      // Inland
            latitude: 67,     // Northern
            urban: 60,        // Large city
            rainfall: 50,     // Moderate
            remoteness: 75    // Well connected
        }
    }
];

// Radar chart axis labels (in order, starting from top, going clockwise)
const radarAxes = [
    { key: 'climate', labelLow: 'Hot', labelHigh: 'Cold' },
    { key: 'elevation', labelLow: 'Flat', labelHigh: 'Mountainous' },
    { key: 'coastal', labelLow: 'Inland', labelHigh: 'Coastal' },
    { key: 'latitude', labelLow: 'Equator', labelHigh: 'Polar' },
    { key: 'urban', labelLow: 'Rural', labelHigh: 'Mega-city' },
    { key: 'rainfall', labelLow: 'Dry', labelHigh: 'Wet' },
    { key: 'remoteness', labelLow: 'Isolated', labelHigh: 'Central' }
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
            <span class="radar-legend-arrow">→</span>
            <span class="radar-legend-label">${axis.labelHigh}</span>
        </div>`
    ).join('');
}
