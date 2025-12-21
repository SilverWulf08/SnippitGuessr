// Questions mode dataset
// Each item is a prompt + the real-world location (lat/lng) that answers it.
// Keep this file similar to locations.js: a single global array.

const questions = [
    {
        question: 'Where was Ada Lovelace born?',
        answer: 'London, United Kingdom',
        fact: 'Ada Lovelace (1815–1852) is often called the first computer programmer for her notes on Charles Babbage\'s Analytical Engine.',
        lat: 51.5074,
        lng: -0.1278
    },
    {
        question: 'Where was Albert Einstein born?',
        answer: 'Ulm, Germany',
        fact: 'Einstein was born in Ulm in 1879; his family later moved to Munich.',
        lat: 48.3984,
        lng: 9.9916
    },
    {
        question: 'Where was Nelson Mandela born?',
        answer: 'Mvezo, South Africa',
        fact: 'Mandela was born in the village of Mvezo in the Eastern Cape and later studied in nearby Mthatha.',
        lat: -31.6119,
        lng: 28.7203
    },
    {
        question: 'Where did the first modern Olympic Games take place (1896)?',
        answer: 'Athens, Greece',
        fact: 'The 1896 Games revived the ancient Olympic tradition and were held in the Panathenaic Stadium.',
        lat: 37.9838,
        lng: 23.7275
    },
    {
        question: 'Where did the Wright brothers achieve the first powered flight (1903)?',
        answer: 'Kitty Hawk, North Carolina, USA',
        fact: 'The first powered flight took place near Kitty Hawk at the Kill Devil Hills dunes in December 1903.',
        lat: 36.0646,
        lng: -75.7050
    },
    {
        question: 'Where was penicillin discovered (1928)?',
        answer: 'London, United Kingdom',
        fact: 'Alexander Fleming noticed the antibiotic effect of Penicillium mold while working at St Mary\'s Hospital in London.',
        lat: 51.5176,
        lng: -0.1739
    },
    {
        question: 'Where is the ancient city of Machu Picchu located?',
        answer: 'Machu Picchu, Peru',
        fact: 'Machu Picchu is an Inca citadel built in the 15th century and later abandoned during the Spanish conquest period.',
        lat: -13.1631,
        lng: -72.5450
    },
    {
        question: 'Where did the 1969 Moon landing mission (Apollo 11) launch from?',
        answer: 'Kennedy Space Center, Florida, USA',
        fact: 'Apollo 11 launched from Launch Complex 39A, built specifically for the Saturn V and the Moon missions.',
        lat: 28.5729,
        lng: -80.6490
    },
    {
        question: 'Where is the Taj Mahal located?',
        answer: 'Agra, India',
        fact: 'The Taj Mahal was commissioned in 1632 by Mughal emperor Shah Jahan as a mausoleum for Mumtaz Mahal.',
        lat: 27.1751,
        lng: 78.0421
    },
    {
        question: 'Where is the Colosseum located?',
        answer: 'Rome, Italy',
        fact: 'The Colosseum (1st century AD) could hold tens of thousands of spectators for public spectacles in ancient Rome.',
        lat: 41.8902,
        lng: 12.4922
    },
    {
        question: 'Where did the eruption of Mount Vesuvius bury Pompeii (79 AD)?',
        answer: 'Pompeii, Italy',
        fact: 'Ash and pumice from Vesuvius preserved buildings and even plaster casts of people, creating a unique time capsule.',
        lat: 40.7497,
        lng: 14.4869
    },
    {
        question: 'Where did the Boston Tea Party take place?',
        answer: 'Boston, Massachusetts, USA',
        fact: 'In 1773, protesters dumped tea into Boston Harbor in opposition to British taxation, escalating colonial tensions.',
        lat: 42.3601,
        lng: -71.0589
    },
    {
        question: 'Where did the French Revolution begin with the storming of the Bastille (1789)?',
        answer: 'Paris, France',
        fact: 'The Bastille was a medieval fortress-prison; its storming became a symbol of revolution and is commemorated on 14 July.',
        lat: 48.8566,
        lng: 2.3522
    },
    {
        question: 'Where is sushi commonly associated with developing into its modern form (nigiri)?',
        answer: 'Tokyo, Japan',
        fact: 'Nigiri sushi is closely linked to Edo (old Tokyo) as a fast food for a growing city in the 1800s.',
        lat: 35.6762,
        lng: 139.6503
    },
    {
        question: 'Where is pizza (as we know it today) commonly associated with originating?',
        answer: 'Naples, Italy',
        fact: 'Naples popularized the flatbread-with-toppings style that evolved into modern pizza; the Margherita story is tied to 1889.',
        lat: 40.8518,
        lng: 14.2681
    },
    {
        question: 'Where did the dish paella originate?',
        answer: 'Valencia, Spain',
        fact: 'Traditional paella developed around Valencia\'s rice-growing regions and was often cooked outdoors over an open fire.',
        lat: 39.4699,
        lng: -0.3763
    },
    {
        question: 'Where did cacao (chocolate) become a major cultural food tradition long before Europe?',
        answer: 'Mesoamerica (near modern Mexico)',
        fact: 'The Maya and Aztecs used cacao in drinks and rituals; cacao beans were even used as a form of currency in some contexts.',
        lat: 19.4326,
        lng: -99.1332
    },
    {
        question: 'Where is the Great Pyramid of Giza located?',
        answer: 'Giza, Egypt',
        fact: 'The Great Pyramid is the oldest of the Seven Wonders of the Ancient World and was built for Pharaoh Khufu around 2600 BC.',
        lat: 29.9792,
        lng: 31.1342
    },
    {
        question: 'Where can you find the Great Wall of China (one famous section near Beijing)?',
        answer: 'Near Beijing, China',
        fact: 'The “Great Wall” is a network of fortifications built over centuries; popular restored sections near Beijing include Mutianyu and Badaling.',
        lat: 40.4319,
        lng: 116.5704
    },
    {
        question: 'Where did the Titanic sink?',
        answer: 'North Atlantic Ocean (near 41.73°N, 49.95°W)',
        fact: 'The wreck lies about 3.8 km deep; it was discovered in 1985 and is slowly deteriorating due to corrosion and bacteria.',
        lat: 41.7325,
        lng: -49.9469
    },
    {
        question: 'Where is the Sydney Opera House located?',
        answer: 'Sydney, Australia',
        fact: 'Its shell-like design by Jørn Utzon became an icon of modern architecture and a UNESCO World Heritage Site.',
        lat: -33.8568,
        lng: 151.2153
    },
    {
        question: 'Where is the Statue of Liberty located?',
        answer: 'New York City, USA',
        fact: 'A gift from France, the statue was dedicated in 1886 and stands on Liberty Island in New York Harbor.',
        lat: 40.6892,
        lng: -74.0445
    },
    {
        question: 'Where was the Rosetta Stone discovered?',
        answer: 'Rashid (Rosetta), Egypt',
        fact: 'The Rosetta Stone helped scholars decipher Egyptian hieroglyphs because it contains the same text in three scripts.',
        lat: 31.4022,
        lng: 30.4175
    },
    {
        question: 'Where did the first successful printing press (Gutenberg) operate?',
        answer: 'Mainz, Germany',
        fact: 'Johannes Gutenberg\'s movable-type printing press in the mid-1400s accelerated the spread of books and ideas across Europe.',
        lat: 49.9929,
        lng: 8.2473
    },
    {
        question: 'Where was Marie Curie born?',
        answer: 'Warsaw, Poland',
        fact: 'Curie later moved to Paris, where she pioneered research on radioactivity and won two Nobel Prizes.',
        lat: 52.2297,
        lng: 21.0122
    },
    {
        question: 'Where was Frida Kahlo born?',
        answer: 'Coyoacán (Mexico City), Mexico',
        fact: 'Frida Kahlo\'s Casa Azul (Blue House) in Coyoacán is now a museum dedicated to her life and art.',
        lat: 19.3550,
        lng: -99.1620
    },
    {
        question: 'Where did the Beatles make their famous first live US TV appearance (Ed Sullivan Show studio)?',
        answer: 'New York City, USA',
        fact: 'Their 1964 appearance helped ignite “Beatlemania” in the United States and drew one of the largest TV audiences of its era.',
        lat: 40.7580,
        lng: -73.9855
    },
    {
        question: 'Where was the first ever FIFA World Cup held (1930)?',
        answer: 'Montevideo, Uruguay',
        fact: 'Uruguay hosted (and won) the 1930 tournament; the final was played at Estadio Centenario in Montevideo.',
        lat: -34.9011,
        lng: -56.1645
    },
    {
        question: 'Where did the “Silicon Valley” tech hub develop?',
        answer: 'San Jose area, California, USA',
        fact: 'The region grew from university research and electronics manufacturing into a global center for software and venture capital.',
        lat: 37.3382,
        lng: -121.8863
    },
    {
        question: 'Where did the 1989 fall of the Berlin Wall take place?',
        answer: 'Berlin, Germany',
        fact: 'The wall divided East and West Berlin from 1961 to 1989 and became a powerful symbol of the Cold War.',
        lat: 52.5200,
        lng: 13.4050
    },

    {
        question: 'Where is Petra, the “rose-red city” carved into rock, located?',
        answer: 'Petra, Jordan',
        fact: 'Petra was a major Nabataean trading hub; its rock-cut architecture and water systems were engineering marvels for a desert city.',
        lat: 30.3285,
        lng: 35.4444
    },
    {
        question: 'Where is Angkor Wat located?',
        answer: 'Siem Reap area, Cambodia',
        fact: 'Originally a Hindu temple and later a Buddhist site, Angkor Wat is the largest religious monument in the world by area.',
        lat: 13.4125,
        lng: 103.8670
    },
    {
        question: 'Where is the ancient Incan city of Cusco located?',
        answer: 'Cusco, Peru',
        fact: 'Cusco was the historic capital of the Inca Empire; many colonial buildings were built atop Incan stone foundations.',
        lat: -13.5319,
        lng: -71.9675
    },
    {
        question: 'Where is the Alhambra palace-fortress located?',
        answer: 'Granada, Spain',
        fact: 'The Alhambra is famous for its intricate Islamic art, geometric patterns, and courtyards—built largely during the Nasrid dynasty.',
        lat: 37.1761,
        lng: -3.5881
    },
    {
        question: 'Where is Chichén Itzá located?',
        answer: 'Yucatán, Mexico',
        fact: 'El Castillo (the Kukulcán pyramid) is aligned so that during equinoxes, shadows form a serpent-like shape on the staircase.',
        lat: 20.6843,
        lng: -88.5678
    },
    {
        question: 'Where is the “Moai” statue culture from?',
        answer: 'Rapa Nui (Easter Island), Chile',
        fact: 'The moai were carved by Polynesian settlers; their transport and construction remain a fascinating engineering mystery.',
        lat: -27.1127,
        lng: -109.3497
    },
    {
        question: 'Where is the “Gateway to the Sahara” city of Timbuktu located?',
        answer: 'Timbuktu, Mali',
        fact: 'Timbuktu became a center of learning and trade in West Africa, with historic manuscripts preserved for centuries.',
        lat: 16.7666,
        lng: -3.0026
    },
    {
        question: 'Where is the Suez Canal located?',
        answer: 'Egypt (between the Mediterranean and the Red Sea)',
        fact: 'Opened in 1869, the Suez Canal dramatically shortened shipping routes between Europe and Asia by avoiding the Cape of Good Hope.',
        lat: 30.0150,
        lng: 32.5800
    },
    {
        question: 'Where is the Panama Canal located?',
        answer: 'Panama (connecting Atlantic and Pacific)',
        fact: 'The canal uses locks to lift ships up to Gatun Lake; it transformed global trade by linking two oceans.',
        lat: 9.0800,
        lng: -79.6800
    },
    {
        question: 'Where did the first successful human heart transplant take place (1967)?',
        answer: 'Cape Town, South Africa',
        fact: 'Dr. Christiaan Barnard performed the first successful transplant at Groote Schuur Hospital in Cape Town.',
        lat: -33.9479,
        lng: 18.4614
    },
    {
        question: 'Where is the Chernobyl nuclear disaster site located?',
        answer: 'Near Pripyat/Chernobyl, Ukraine',
        fact: 'The 1986 disaster led to the creation of an exclusion zone; Pripyat remains one of the most famous abandoned cities.',
        lat: 51.3890,
        lng: 30.0990
    },
    {
        question: 'Where is the “Meeting of Waters,” where two rivers flow side-by-side without mixing for kilometers?',
        answer: 'Near Manaus, Brazil',
        fact: 'Near Manaus, the dark Rio Negro and sandy Solimões run side by side because of differences in temperature, speed, and density.',
        lat: -3.0980,
        lng: -59.9500
    },
    {
        question: 'Where is the Serengeti ecosystem located?',
        answer: 'Tanzania (bordering Kenya)',
        fact: 'The Serengeti is famous for the Great Migration of wildebeest and zebras—one of Earth\'s largest wildlife movements.',
        lat: -2.3333,
        lng: 34.8333
    },
    {
        question: 'Where is the Galápagos Islands archipelago located?',
        answer: 'Ecuador (Pacific Ocean)',
        fact: 'The Galápagos helped inspire Charles Darwin\'s ideas on evolution; many species there are found nowhere else.',
        lat: -0.9538,
        lng: -90.9656
    },
    {
        question: 'Where is the “Northern Lights” city of Tromsø located?',
        answer: 'Tromsø, Norway',
        fact: 'Tromsø lies well above the Arctic Circle and is a popular base for aurora viewing and polar research.',
        lat: 69.6492,
        lng: 18.9553
    },
    {
        question: 'Where is the largest coral reef system on Earth located?',
        answer: 'Great Barrier Reef, Australia',
        fact: 'The Great Barrier Reef is so large it can be seen from space; it\'s a vast ecosystem vulnerable to warming and bleaching.',
        lat: -18.2871,
        lng: 147.6992
    },
    {
        question: 'Where is the “Door to Hell” burning gas crater located?',
        answer: 'Derweze, Turkmenistan',
        fact: 'The Darvaza gas crater has been burning for decades after a drilling accident, creating an eerie natural flame pit.',
        lat: 40.2526,
        lng: 58.4399
    },
    {
        question: 'Where is the Dead Sea located?',
        answer: 'Between Israel/West Bank and Jordan',
        fact: 'The Dead Sea is one of the saltiest bodies of water on Earth and sits at the lowest land elevation on the planet.',
        lat: 31.5590,
        lng: 35.4732
    },
    {
        question: 'Where is Mount Kilimanjaro located?',
        answer: 'Tanzania',
        fact: 'Kilimanjaro is Africa\'s highest mountain and one of the world\'s tallest free-standing volcanoes.',
        lat: -3.0674,
        lng: 37.3556
    },
    {
        question: 'Where is the “Ring of Fire” volcano belt most famously visible as a country of many active volcanoes?',
        answer: 'Indonesia',
        fact: 'Indonesia sits on major tectonic plate boundaries and has more active volcanoes than any other country.',
        lat: -6.2088,
        lng: 106.8456
    },
    {
        question: 'Where is the ancient city of Carthage located (near its ruins today)?',
        answer: 'Near Tunis, Tunisia',
        fact: 'Carthage was a powerful Phoenician city-state and Rome\'s rival in the Punic Wars; its ruins lie near modern Tunis.',
        lat: 36.8529,
        lng: 10.3230
    },
    {
        question: 'Where is the “cradle of jazz” city often associated with the genre\'s early development?',
        answer: 'New Orleans, Louisiana, USA',
        fact: 'New Orleans blended African, Caribbean, and European musical traditions—helping jazz emerge in the early 1900s.',
        lat: 29.9511,
        lng: -90.0715
    },
    {
        question: 'Where is the ancient library city of Alexandria located?',
        answer: 'Alexandria, Egypt',
        fact: 'Ancient Alexandria was a major center of learning in the Mediterranean; the famous Lighthouse of Alexandria once stood here.',
        lat: 31.2001,
        lng: 29.9187
    },
    {
        question: 'Where is the “Stone Town” UNESCO heritage area located?',
        answer: 'Zanzibar City, Tanzania',
        fact: 'Stone Town reflects centuries of Swahili, Arab, Persian, Indian, and European influence in architecture and trade.',
        lat: -6.1659,
        lng: 39.2026
    },
    {
        question: 'Where is the Atacama Desert located?',
        answer: 'Northern Chile',
        fact: 'Parts of the Atacama are among the driest places on Earth; the clear skies also make it a prime astronomy location.',
        lat: -23.6975,
        lng: -70.4170
    },
    {
        question: 'Where is the ancient city of Kyoto located?',
        answer: 'Kyoto, Japan',
        fact: 'Kyoto was Japan\'s imperial capital for over 1,000 years and is known for temples, gardens, and traditional districts.',
        lat: 35.0116,
        lng: 135.7681
    },
    {
        question: 'Where is the “City of Canals” that historically powered European trade and art?',
        answer: 'Venice, Italy',
        fact: 'Built on a lagoon, Venice grew into a maritime republic with immense influence on Mediterranean trade for centuries.',
        lat: 45.4408,
        lng: 12.3155
    },
    {
        question: 'Where is the Hubble Space Telescope control center located?',
        answer: 'Baltimore, Maryland, USA',
        fact: 'The Space Telescope Science Institute in Baltimore schedules Hubble observations and processes its scientific data.',
        lat: 39.3299,
        lng: -76.6205
    },
    {
        question: 'Where is the “Blue Lagoon” geothermal spa located?',
        answer: 'Near Grindavík, Iceland',
        fact: 'The Blue Lagoon formed in a lava field from geothermal plant runoff; its milky-blue water is rich in minerals like silica.',
        lat: 63.8804,
        lng: -22.4495
    },
    {
        question: 'Where is the Golden Gate Bridge located?',
        answer: 'San Francisco, USA',
        fact: 'Opened in 1937, the Golden Gate Bridge is one of the world’s most recognizable suspension bridges.',
        lat: 37.8199,
        lng: -122.4783
    },
    {
        question: 'Where is the Space Needle located?',
        answer: 'Seattle, USA',
        fact: 'The Space Needle was built for the 1962 World’s Fair and became a symbol of Seattle.',
        lat: 47.6205,
        lng: -122.3493
    },
    {
        question: 'Where is the White House located?',
        answer: 'Washington, D.C., USA',
        fact: 'The White House has been the official residence of US presidents since 1800.',
        lat: 38.8977,
        lng: -77.0365
    },
    {
        question: 'Where is the Liberty Bell located?',
        answer: 'Philadelphia, USA',
        fact: 'The Liberty Bell is associated with American independence and is famous for its large crack.',
        lat: 39.9496,
        lng: -75.1503
    },
    {
        question: 'Where is the Gateway Arch located?',
        answer: 'St. Louis, Missouri, USA',
        fact: 'The 192-meter stainless-steel arch is a monument to westward expansion in the United States.',
        lat: 38.6247,
        lng: -90.1848
    },
    {
        question: 'Where is the CN Tower located?',
        answer: 'Toronto, Canada',
        fact: 'The CN Tower was once the world’s tallest free-standing structure and remains a major Toronto landmark.',
        lat: 43.6426,
        lng: -79.3871
    },
    {
        question: 'Where is the historic fortified district of Old Québec located?',
        answer: 'Québec City, Canada',
        fact: 'Québec’s fortifications are among the best-preserved in North America and are a UNESCO World Heritage site.',
        lat: 46.8139,
        lng: -71.2080
    },
    {
        question: 'Where is “Panama hat” weaving traditionally associated with (despite the name)?',
        answer: 'Cuenca, Ecuador',
        fact: 'Panama hats are traditionally made from toquilla straw in Ecuador; the name spread through global trade routes.',
        lat: -2.9001,
        lng: -79.0059
    },
    {
        question: 'Where are Iguazú Falls located?',
        answer: 'On the Argentina–Brazil border',
        fact: 'Iguazú is made up of hundreds of waterfalls; the most famous section is the dramatic “Devil’s Throat.”',
        lat: -25.6953,
        lng: -54.4367
    },
    {
        question: 'Where is the Salar de Uyuni salt flat located?',
        answer: 'Uyuni area, Bolivia',
        fact: 'Salar de Uyuni is the world’s largest salt flat and can form a mirror-like surface after rain.',
        lat: -20.1338,
        lng: -67.4891
    },
    {
        question: 'Where is the Christ the Redeemer statue located?',
        answer: 'Rio de Janeiro, Brazil',
        fact: 'The statue stands atop Corcovado Mountain and is one of the New Seven Wonders of the World.',
        lat: -22.9519,
        lng: -43.2105
    },
    {
        question: 'Where is Table Mountain located?',
        answer: 'Cape Town, South Africa',
        fact: 'Table Mountain’s flat summit overlooks Cape Town and is part of a unique biodiversity hotspot.',
        lat: -33.9628,
        lng: 18.4098
    },
    {
        question: 'Where is the city of Marrakech located?',
        answer: 'Marrakech, Morocco',
        fact: 'Marrakech’s old medina is famous for its markets, courtyards, and centuries-old city walls.',
        lat: 31.6295,
        lng: -7.9811
    },
    {
        question: 'Where are the rock-hewn churches of Lalibela located?',
        answer: 'Lalibela, Ethiopia',
        fact: 'Lalibela is known for monolithic churches carved from rock, connected by tunnels and trenches.',
        lat: 12.0316,
        lng: 39.0476
    },
    {
        question: 'Where are Victoria Falls located?',
        answer: 'On the Zambia–Zimbabwe border',
        fact: 'Locally called “The Smoke That Thunders,” Victoria Falls is one of the largest waterfall curtains on Earth.',
        lat: -17.9243,
        lng: 25.8560
    },
    {
        question: 'Where is the Okavango Delta located?',
        answer: 'Botswana',
        fact: 'The Okavango is an inland delta where a river spreads into wetlands instead of reaching the sea.',
        lat: -19.2610,
        lng: 23.6170
    },
    {
        question: 'Where is Mount Fuji located?',
        answer: 'Japan',
        fact: 'Mount Fuji is a near-perfect volcanic cone and a cultural icon that has inspired art for centuries.',
        lat: 35.3606,
        lng: 138.7274
    },
    {
        question: 'Where is the Fushimi Inari Shrine (famous for its red torii gates) located?',
        answer: 'Kyoto, Japan',
        fact: 'The shrine is dedicated to Inari, associated with rice and prosperity, and its trails pass thousands of torii gates.',
        lat: 34.9671,
        lng: 135.7727
    },
    {
        question: 'Where is the Terracotta Army located?',
        answer: 'Xi’an, China',
        fact: 'Thousands of life-sized clay soldiers were buried to guard China’s first emperor, Qin Shi Huang.',
        lat: 34.3853,
        lng: 109.2786
    },
    {
        question: 'Where is the Forbidden City located?',
        answer: 'Beijing, China',
        fact: 'The Forbidden City served as the imperial palace for centuries and contains one of the world’s largest palace complexes.',
        lat: 39.9163,
        lng: 116.3972
    },
    {
        question: 'Where is the Great Blue Hole located?',
        answer: 'Belize (Caribbean Sea)',
        fact: 'This giant marine sinkhole is a famous diving site formed from collapsed limestone caves.',
        lat: 17.3150,
        lng: -87.5340
    },
    {
        question: 'Where is the Sagrada Família located?',
        answer: 'Barcelona, Spain',
        fact: 'Antoni Gaudí’s basilica has been under construction for generations and blends Gothic and Art Nouveau influences.',
        lat: 41.4036,
        lng: 2.1744
    },
    {
        question: 'Where is the Eiffel Tower located?',
        answer: 'Paris, France',
        fact: 'Built for the 1889 World’s Fair, the Eiffel Tower became an enduring symbol of Paris.',
        lat: 48.8584,
        lng: 2.2945
    },
    {
        question: 'Where is Neuschwanstein Castle located?',
        answer: 'Near Füssen, Germany',
        fact: 'Commissioned by King Ludwig II, Neuschwanstein inspired the look of many “storybook” castles in popular culture.',
        lat: 47.5576,
        lng: 10.7498
    },
    {
        question: 'Where is the Matterhorn located?',
        answer: 'On the Switzerland–Italy border',
        fact: 'The Matterhorn’s pyramidal peak is one of the most photographed mountains in the Alps.',
        lat: 45.9763,
        lng: 7.6586
    },
    {
        question: 'Where is the Blue Mosque (Sultan Ahmed Mosque) located?',
        answer: 'Istanbul, Turkey',
        fact: 'The mosque is famous for its blue Iznik tiles and its position facing the Hagia Sophia across a historic square.',
        lat: 41.0055,
        lng: 28.9768
    },
    {
        question: 'Where is the Acropolis located?',
        answer: 'Athens, Greece',
        fact: 'The Acropolis is a hilltop citadel with ancient temples and sweeping views over Athens.',
        lat: 37.9715,
        lng: 23.7257
    },
    {
        question: 'Where is the Leaning Tower of Pisa located?',
        answer: 'Pisa, Italy',
        fact: 'The tower leans because of soft ground beneath its foundation, but it has been stabilized to prevent collapse.',
        lat: 43.7230,
        lng: 10.3966
    },
    {
        question: 'Where is Mont Saint-Michel located?',
        answer: 'Normandy, France',
        fact: 'Mont Saint-Michel is a tidal island crowned by a medieval abbey that can become isolated at high tide.',
        lat: 48.6360,
        lng: -1.5115
    },
    {
        question: 'Where is the Giant’s Causeway located?',
        answer: 'Northern Ireland, United Kingdom',
        fact: 'The site is known for thousands of hexagonal basalt columns formed by ancient volcanic activity.',
        lat: 55.2408,
        lng: -6.5116
    },
    {
        question: 'Where is the city of Dubrovnik located?',
        answer: 'Dubrovnik, Croatia',
        fact: 'Dubrovnik is a walled coastal city on the Adriatic, famous for its limestone streets and sea views.',
        lat: 42.6507,
        lng: 18.0944
    },
    {
        question: 'Where are the ancient ruins of Ephesus located?',
        answer: 'Near Selçuk, Turkey',
        fact: 'Ephesus was a major Greek and Roman city; its Library of Celsus is one of the most iconic ancient facades.',
        lat: 37.9390,
        lng: 27.3410
    },
    {
        question: 'Where is Cappadocia (known for “fairy chimneys”) located?',
        answer: 'Central Turkey',
        fact: 'Cappadocia’s landscapes include volcanic rock formations and historic cave dwellings and churches.',
        lat: 38.6431,
        lng: 34.8270
    },
    {
        question: 'Where is the city of Samarkand located?',
        answer: 'Samarkand, Uzbekistan',
        fact: 'Samarkand was a key Silk Road city, known for its blue-tiled architecture and trade history.',
        lat: 39.6542,
        lng: 66.9597
    },
    {
        question: 'Where is the city of Baku located?',
        answer: 'Baku, Azerbaijan',
        fact: 'Baku sits on the Caspian Sea and blends an old walled city with modern architecture.',
        lat: 40.4093,
        lng: 49.8671
    },
    {
        question: 'Where are the ruins of Persepolis located?',
        answer: 'Near Shiraz, Iran',
        fact: 'Persepolis was a ceremonial capital of the Achaemenid Empire and features detailed stone reliefs and stairways.',
        lat: 29.9356,
        lng: 52.8916
    },
    {
        question: 'Where is Wadi Rum located?',
        answer: 'Jordan',
        fact: 'Wadi Rum is a protected desert valley known for towering sandstone formations and star-filled night skies.',
        lat: 29.5764,
        lng: 35.4196
    },
    {
        question: 'Where is the city of Muscat located?',
        answer: 'Muscat, Oman',
        fact: 'Muscat is a coastal capital with mountains close to the sea and a long maritime trading history.',
        lat: 23.5880,
        lng: 58.3829
    },
    {
        question: 'Where is the Burj Khalifa located?',
        answer: 'Dubai, United Arab Emirates',
        fact: 'At over 800 meters tall, the Burj Khalifa is the world’s tallest building.',
        lat: 25.1972,
        lng: 55.2744
    },
    {
        question: 'Where is the source of the Nile commonly associated with in Uganda (a popular reference point)?',
        answer: 'Jinja, Uganda',
        fact: 'A well-known “Source of the Nile” marker is near Jinja on Lake Victoria’s outlet, though the river has multiple headwaters.',
        lat: 0.4310,
        lng: 33.2060
    },
    {
        question: 'Where is the city of Kigali located?',
        answer: 'Kigali, Rwanda',
        fact: 'Kigali is often noted for its hilly terrain and rapid post-1990s development.',
        lat: -1.9441,
        lng: 30.0619
    },
    {
        question: 'Where is the city of Accra located?',
        answer: 'Accra, Ghana',
        fact: 'Accra is a coastal capital on the Gulf of Guinea and a major cultural and economic center in West Africa.',
        lat: 5.6037,
        lng: -0.1870
    },
    {
        question: 'Where is the ancient city of Jericho located?',
        answer: 'Jericho, West Bank',
        fact: 'Jericho is often described as one of the world’s oldest continually inhabited places.',
        lat: 31.8720,
        lng: 35.4436
    },
    {
        question: 'Where is the Western Wall located?',
        answer: 'Jerusalem',
        fact: 'The Western Wall is a sacred site associated with the ancient Jewish Temple complex in Jerusalem.',
        lat: 31.7767,
        lng: 35.2345
    },
    {
        question: 'Where is the city of Doha located?',
        answer: 'Doha, Qatar',
        fact: 'Doha grew rapidly in the late 20th and early 21st centuries and is a major Gulf business hub.',
        lat: 25.2854,
        lng: 51.5310
    },
    {
        question: 'Where is the city of Tbilisi located?',
        answer: 'Tbilisi, Georgia',
        fact: 'Tbilisi lies on the Mtkvari (Kura) River and has been a crossroads between Europe and Asia for centuries.',
        lat: 41.7151,
        lng: 44.8271
    },
    {
        question: 'Where is the city of Yerevan located?',
        answer: 'Yerevan, Armenia',
        fact: 'Yerevan is among the world’s oldest continuously inhabited cities and sits near views of Mount Ararat.',
        lat: 40.1872,
        lng: 44.5152
    },
    {
        question: 'Where are the ruins of ancient Babylon located?',
        answer: 'Near Hillah, Iraq',
        fact: 'Babylon was a major Mesopotamian city, associated with the Hanging Gardens legend and impressive ancient architecture.',
        lat: 32.5364,
        lng: 44.4200
    },
    {
        question: 'Where is Jaipur (the “Pink City”) located?',
        answer: 'Jaipur, India',
        fact: 'Jaipur is known for its planned streets, historic forts, and rose-colored buildings in parts of the old city.',
        lat: 26.9124,
        lng: 75.7873
    },
    {
        question: 'Where is the capital city of Bhutan located?',
        answer: 'Thimphu, Bhutan',
        fact: 'Thimphu is one of the world’s few capitals without traffic lights in its central areas.',
        lat: 27.4728,
        lng: 89.6390
    },
    {
        question: 'Where is the city of Vientiane located?',
        answer: 'Vientiane, Laos',
        fact: 'Vientiane sits on the Mekong River across from Thailand and is known for Buddhist monuments.',
        lat: 17.9757,
        lng: 102.6331
    },
    {
        question: 'Where is Borobudur (a huge Buddhist temple) located?',
        answer: 'Central Java, Indonesia',
        fact: 'Borobudur is one of the largest Buddhist temples in the world, built around the 8th–9th centuries.',
        lat: -7.6079,
        lng: 110.2038
    },
    {
        question: 'Where is the city of Perth located?',
        answer: 'Perth, Australia',
        fact: 'Perth is one of the world’s most isolated major cities and sits on the Swan River near the Indian Ocean.',
        lat: -31.9505,
        lng: 115.8605
    },
    {
        question: 'Where is the city of Hobart located?',
        answer: 'Hobart, Australia',
        fact: 'Hobart is Tasmania’s capital and is known for its harbor, historic warehouses, and nearby Mount Wellington.',
        lat: -42.8821,
        lng: 147.3272
    },
    {
        question: 'Where is the city of Auckland located?',
        answer: 'Auckland, New Zealand',
        fact: 'Auckland is built around harbors and volcanic cones and is New Zealand’s largest city.',
        lat: -36.8485,
        lng: 174.7633
    },
    {
        question: 'Where is the city of Suva located?',
        answer: 'Suva, Fiji',
        fact: 'Suva is a Pacific island capital with a major port and a large university presence.',
        lat: -18.1416,
        lng: 178.4419
    },
    {
        question: 'Where is the city of Nuuk located?',
        answer: 'Nuuk, Greenland',
        fact: 'Nuuk is Greenland’s capital and sits on a fjord system near rugged mountains and coastal waters.',
        lat: 64.1814,
        lng: -51.6941
    },
    {
        question: 'Where is Tórshavn located?',
        answer: 'Tórshavn, Faroe Islands',
        fact: 'Tórshavn is one of the world’s smallest capitals and sits in a North Atlantic archipelago with dramatic cliffs.',
        lat: 62.0079,
        lng: -6.7906
    },
    {
        question: 'Where is the city of Belfast located?',
        answer: 'Belfast, United Kingdom',
        fact: 'Belfast is known for its shipbuilding history and was the city where the RMS Titanic was constructed.',
        lat: 54.5973,
        lng: -5.9301
    },
    {
        question: 'Where is the city of Valletta located?',
        answer: 'Valletta, Malta',
        fact: 'Valletta is a fortified city built by the Knights of St. John and is one of Europe’s smallest capital cities.',
        lat: 35.8989,
        lng: 14.5146
    },
    {
        question: 'Where is the city of Nicosia located?',
        answer: 'Nicosia, Cyprus',
        fact: 'Nicosia is often described as Europe’s last divided capital, with a UN buffer zone running through the city.',
        lat: 35.1856,
        lng: 33.3823
    },
    {
        question: 'Where is the city of Sarajevo located?',
        answer: 'Sarajevo, Bosnia and Herzegovina',
        fact: 'Sarajevo hosted the 1984 Winter Olympics and has a history shaped by multiple empires and cultures.',
        lat: 43.8563,
        lng: 18.4131
    },
    {
        question: 'Where is the city of Belgrade located?',
        answer: 'Belgrade, Serbia',
        fact: 'Belgrade sits at the confluence of the Danube and Sava rivers and has been strategically important for centuries.',
        lat: 44.7866,
        lng: 20.4489
    },
    {
        question: 'Where is the city of Sofia located?',
        answer: 'Sofia, Bulgaria',
        fact: 'Sofia is one of Europe’s oldest cities and is known for a mix of Roman ruins and Orthodox churches.',
        lat: 42.6977,
        lng: 23.3219
    },
    {
        question: 'Where is the city of Skopje located?',
        answer: 'Skopje, North Macedonia',
        fact: 'Skopje lies on the Vardar River and was heavily rebuilt after a major 1963 earthquake.',
        lat: 41.9973,
        lng: 21.4280
    },
    {
        question: 'Where is the city of Tirana located?',
        answer: 'Tirana, Albania',
        fact: 'Tirana is a compact capital known for colorful buildings and a rapidly changing cityscape.',
        lat: 41.3275,
        lng: 19.8187
    },
    {
        question: 'Where is the city of Chișinău located?',
        answer: 'Chișinău, Moldova',
        fact: 'Chișinău is a green city with many parks and is the cultural and economic center of Moldova.',
        lat: 47.0105,
        lng: 28.8638
    },
    {
        question: 'Where is the city of Minsk located?',
        answer: 'Minsk, Belarus',
        fact: 'Minsk was heavily rebuilt after World War II and features broad avenues and Soviet-era architecture.',
        lat: 53.9006,
        lng: 27.5590
    },
    {
        question: 'Where is Saint Petersburg located?',
        answer: 'Saint Petersburg, Russia',
        fact: 'Founded by Peter the Great, the city is known for canals, imperial palaces, and the “White Nights” summer twilight.',
        lat: 59.9311,
        lng: 30.3609
    },
    {
        question: 'Where is the city of Kazan located?',
        answer: 'Kazan, Russia',
        fact: 'Kazan is a major cultural center on the Volga River and is known for its blend of Tatar and Russian heritage.',
        lat: 55.7961,
        lng: 49.1064
    },
    {
        question: 'Where is the city of Novosibirsk located?',
        answer: 'Novosibirsk, Russia',
        fact: 'Novosibirsk grew with the Trans-Siberian Railway and is one of Siberia’s largest cities.',
        lat: 55.0084,
        lng: 82.9357
    },
    {
        question: 'Where is the city of Vladivostok located?',
        answer: 'Vladivostok, Russia',
        fact: 'Vladivostok is a Pacific port city and the eastern terminus of the Trans-Siberian Railway.',
        lat: 43.1155,
        lng: 131.8855
    },
    {
        question: 'Where is Lake Baikal located?',
        answer: 'Siberia, Russia',
        fact: 'Lake Baikal is the world’s deepest freshwater lake and holds a large share of Earth’s unfrozen freshwater.',
        lat: 53.5587,
        lng: 108.1650
    },
    {
        question: 'Where is the city of Ulaanbaatar located?',
        answer: 'Ulaanbaatar, Mongolia',
        fact: 'Ulaanbaatar is Mongolia’s capital and is known for its mix of modern buildings and traditional ger districts.',
        lat: 47.8864,
        lng: 106.9057
    },
    {
        question: 'Where is the city of Almaty located?',
        answer: 'Almaty, Kazakhstan',
        fact: 'Almaty sits near the Tian Shan mountains and was Kazakhstan’s capital until the late 1990s.',
        lat: 43.2383,
        lng: 76.9453
    },
    {
        question: 'Where is Astana (Kazakhstan’s capital) located?',
        answer: 'Astana, Kazakhstan',
        fact: 'Astana is known for futuristic architecture and extreme seasonal temperature swings.',
        lat: 51.1605,
        lng: 71.4704
    },
    {
        question: 'Where is the city of Tashkent located?',
        answer: 'Tashkent, Uzbekistan',
        fact: 'Tashkent is Central Asia’s largest city and a key stop on historic trade routes.',
        lat: 41.2995,
        lng: 69.2401
    },
    {
        question: 'Where is the city of Bishkek located?',
        answer: 'Bishkek, Kyrgyzstan',
        fact: 'Bishkek sits near mountain ranges and is a gateway for exploring Kyrgyzstan’s high-altitude landscapes.',
        lat: 42.8746,
        lng: 74.5698
    },
    {
        question: 'Where is the city of Siem Reap located?',
        answer: 'Siem Reap, Cambodia',
        fact: 'Siem Reap is the main hub for visiting Angkor’s temples, including Angkor Wat and Bayon.',
        lat: 13.3671,
        lng: 103.8448
    },
    {
        question: 'Where is the city of Cebu located?',
        answer: 'Cebu City, Philippines',
        fact: 'Cebu is a major Philippine island hub with a long history of maritime trade and travel.',
        lat: 10.3157,
        lng: 123.8854
    },
    {
        question: 'Where is the city of Davao located?',
        answer: 'Davao City, Philippines',
        fact: 'Davao lies on Mindanao and is one of the Philippines’ largest cities by land area.',
        lat: 7.1907,
        lng: 125.4553
    },
    {
        question: 'Where is the city of Kaohsiung located?',
        answer: 'Kaohsiung, Taiwan',
        fact: 'Kaohsiung is a major port city in southern Taiwan with a large harbor and modern waterfront districts.',
        lat: 22.6273,
        lng: 120.3014
    },
    {
        question: 'Where is the city of Busan located?',
        answer: 'Busan, South Korea',
        fact: 'Busan is South Korea’s major seaport and is known for beaches, seafood markets, and a large film festival.',
        lat: 35.1796,
        lng: 129.0756
    },
    {
        question: 'Where is the city of Fukuoka located?',
        answer: 'Fukuoka, Japan',
        fact: 'Fukuoka is a major city on Kyushu, known for food culture and being a gateway to nearby Asian countries.',
        lat: 33.5904,
        lng: 130.4017
    },
    {
        question: 'Where is the city of Nagoya located?',
        answer: 'Nagoya, Japan',
        fact: 'Nagoya is a major industrial city and a key transport hub between Tokyo and Osaka.',
        lat: 35.1815,
        lng: 136.9066
    },
    {
        question: 'Where is the city of Adelaide located?',
        answer: 'Adelaide, Australia',
        fact: 'Adelaide is known for its festivals and nearby wine regions such as the Barossa Valley.',
        lat: -34.9285,
        lng: 138.6007
    },
    {
        question: 'Where is the Great Ocean Road located?',
        answer: 'Victoria, Australia',
        fact: 'The Great Ocean Road is a scenic coastal drive known for dramatic cliffs and formations like the Twelve Apostles.',
        lat: -38.3300,
        lng: 144.3240
    },
    {
        question: 'Where is the city of Cairns located?',
        answer: 'Cairns, Australia',
        fact: 'Cairns is a popular base for trips to tropical rainforests and the Great Barrier Reef.',
        lat: -16.9186,
        lng: 145.7781
    },
    {
        question: 'Where is the city of Maputo located?',
        answer: 'Maputo, Mozambique',
        fact: 'Maputo is a coastal capital with Portuguese colonial influence and a large natural harbor.',
        lat: -25.9692,
        lng: 32.5732
    },
    {
        question: 'Where is the city of Harare located?',
        answer: 'Harare, Zimbabwe',
        fact: 'Harare is Zimbabwe’s largest city and sits on a high plateau, giving it a milder climate than many tropical lowlands.',
        lat: -17.8252,
        lng: 31.0335
    },
    {
        question: 'Where is the city of Lusaka located?',
        answer: 'Lusaka, Zambia',
        fact: 'Lusaka is a fast-growing city in south-central Africa and a major transport hub within Zambia.',
        lat: -15.3875,
        lng: 28.3228
    },
    {
        question: 'Where is the city of Addis Ababa located?',
        answer: 'Addis Ababa, Ethiopia',
        fact: 'Addis Ababa is one of Africa’s highest-elevation capitals and hosts the headquarters of the African Union.',
        lat: 8.9806,
        lng: 38.7578
    },
    {
        question: 'Where is the city of Abidjan located?',
        answer: 'Abidjan, Côte d’Ivoire',
        fact: 'Abidjan is a major economic center in West Africa, built around lagoons and coastal districts.',
        lat: 5.3599,
        lng: -4.0083
    },
    {
        question: 'Where is the city of Algiers located?',
        answer: 'Algiers, Algeria',
        fact: 'Algiers sits on the Mediterranean and is known for its historic Casbah and white hillside buildings.',
        lat: 36.7538,
        lng: 3.0588
    },
    {
        question: 'Where is the Hassan II Mosque located?',
        answer: 'Casablanca, Morocco',
        fact: 'The Hassan II Mosque stands partly over the Atlantic Ocean and is among the largest mosques in the world.',
        lat: 33.6084,
        lng: -7.6326
    },
    {
        question: 'Where is the island of Santorini located?',
        answer: 'Santorini, Greece',
        fact: 'Santorini is a volcanic island known for whitewashed towns perched on caldera cliffs.',
        lat: 36.3932,
        lng: 25.4615
    },
    {
        question: 'Where is the island of Madeira located?',
        answer: 'Madeira (Portugal)',
        fact: 'Madeira is a mountainous Atlantic island known for its mild climate, hiking trails, and terraced landscapes.',
        lat: 32.7607,
        lng: -16.9595
    },
    {
        question: 'Where is the “Tiger’s Nest” monastery (Paro Taktsang) located?',
        answer: 'Paro, Bhutan',
        fact: 'Paro Taktsang is dramatically built into a cliffside and is one of Bhutan’s most famous sacred sites.',
        lat: 27.4916,
        lng: 89.3635
    },
    {
        question: 'Where is Teotihuacan (with the Pyramid of the Sun) located?',
        answer: 'Near Mexico City, Mexico',
        fact: 'Teotihuacan was a major ancient city in Mesoamerica; its origins are still debated by historians.',
        lat: 19.6925,
        lng: -98.8438
    },
    {
        question: 'Where is Reykjavík located?',
        answer: 'Reykjavík, Iceland',
        fact: 'Reykjavík is often described as the world’s northernmost capital city of a sovereign state.',
        lat: 64.1466,
        lng: -21.9426
    }
];
