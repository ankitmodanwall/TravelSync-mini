export type TravelSuggestion = {
  id: string;
  title: string;
  country: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  topAttractions: string[];
  bestTimeToVisit: string;
  aiRecommended?: boolean;
};

export const travelSuggestions: TravelSuggestion[] = [
  {
    id: 'suggestion-1',
    title: 'Kyoto',
    country: 'Japan',
    description:
      'Experience the heart of traditional Japan in Kyoto, a city of geishas, temples, and tranquil gardens. Autumn paints the city in fiery colors, making it a breathtaking sight.',
    imageUrl: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d',
    imageHint: 'Kyoto shrine',
    topAttractions: [
      'Kinkaku-ji (Golden Pavilion)',
      'Fushimi Inari-taisha Shrine',
      'Arashiyama Bamboo Grove',
      "Gion Geisha District",
    ],
    bestTimeToVisit: 'Spring (March-May) for cherry blossoms and Autumn (October-November) for fall colors.',
    aiRecommended: true,
  },
  {
    id: 'suggestion-2',
    title: 'Amalfi Coast',
    country: 'Italy',
    description:
      "A stunning coastline of cliffside villages, azure waters, and vibrant lemon groves. The Amalfi Coast is a dream for lovers of scenic drives, delicious food, and Mediterranean charm.",
    imageUrl: 'https://images.unsplash.com/photo-1584721295315-59a79e6d0fa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageHint: 'Amalfi Coast',
    topAttractions: [
      'Positano Village',
      'Boat trip to Capri',
      'Hike the Path of the Gods',
      'Explore the town of Ravello',
    ],
    bestTimeToVisit: 'Spring (April-June) and Fall (September-October) for pleasant weather and fewer crowds.',
  },
  {
    id: 'suggestion-3',
    title: 'Banff National Park',
    country: 'Canada',
    description:
      "Canada's oldest national park, boasting turquoise glacial lakes, majestic peaks, and abundant wildlife. A paradise for hikers, photographers, and nature lovers.",
    imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce',
    imageHint: 'Banff lake',
    topAttractions: [
      'Lake Louise & Moraine Lake',
      'Drive the Icefields Parkway',
      'Ride the Banff Gondola',
      'Wildlife spotting tours',
    ],
    bestTimeToVisit: 'Summer (June-August) for hiking and warm weather, or Winter (December-March) for skiing and snow sports.',
  },
  {
    id: 'suggestion-4',
    title: 'Cairo',
    country: 'Egypt',
    description:
      'Step back in time in the land of the Pharaohs. Cairo is a bustling metropolis that serves as the gateway to the Pyramids of Giza, the Sphinx, and countless ancient treasures.',
    imageUrl: 'https://images.unsplash.com/photo-1600913248959-c1752bdd05e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageHint: 'Cairo pyramids',
    topAttractions: [
      'Pyramids of Giza and the Sphinx',
      'The Egyptian Museum',
      'Khan el-Khalili Bazaar',
      'Nile River cruise',
    ],
    bestTimeToVisit: 'Fall (September-November) and Spring (March-May) to avoid the intense summer heat.',
  },
  {
    id: 'suggestion-5',
    title: 'Queenstown',
    country: 'New Zealand',
    description:
      'Nestled on the shores of Lake Wakatipu, Queenstown is the adventure capital of the world. From bungee jumping to skiing, it offers adrenaline-pumping activities set against a backdrop of breathtaking alpine scenery.',
    imageUrl: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageHint: 'Queenstown lake',
    topAttractions: [
      'Bungee Jumping at Kawarau Bridge',
      'Milford Sound Cruise',
      'Skiing at The Remarkables',
      "Gondola to Bob's Peak",
    ],
    bestTimeToVisit: 'Summer (December-February) for hiking and water sports, or Winter (June-August) for snow activities.',
    aiRecommended: true,
  },
  {
    id: 'suggestion-6',
    title: 'Chiang Mai',
    country: 'Thailand',
    description:
      'A city of misty mountains, colorful hill tribes, and golden temples. Chiang Mai is a hub for spirituality and adventure, offering everything from elephant sanctuaries to vibrant night markets.',
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526',
    imageHint: 'Chiang Mai temple',
    topAttractions: [
      'Visit Doi Suthep temple',
      'Explore the Old City walls and moats',
      'Spend a day at an ethical elephant sanctuary',
      'Shop at the Night Bazaar',
    ],
    bestTimeToVisit: 'The cool, dry season from November to February is the most pleasant.',
  },
  {
    id: 'suggestion-7',
    title: 'Marrakech',
    country: 'Morocco',
    description:
      'Get lost in the vibrant chaos of Marrakech. This city is a sensory overload with its bustling souks, aromatic spices, stunning riads, and the lively Jemaa el-Fnaa square.',
    imageUrl: 'https://images.unsplash.com/photo-1730993175478-b634849f6536?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageHint: 'Marrakech market',
    topAttractions: [
      'Jemaa el-Fnaa square',
      'Jardin Majorelle',
      'Bahia Palace',
      'Shopping in the souks',
    ],
    bestTimeToVisit: 'Spring (March-May) and Autumn (September-November) offer comfortable temperatures for exploring.',
  },
  {
    id: 'suggestion-8',
    title: 'Iceland',
    country: 'The Land of Fire and Ice',
    description:
      'A world of dramatic landscapes, where volcanoes, glaciers, geysers, and waterfalls coexist. Chase the Northern Lights in winter or enjoy the midnight sun in summer.',
    imageUrl: 'https://images.unsplash.com/photo-1693667627180-4f3285dbc403?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageHint: 'Iceland waterfall',
    topAttractions: [
      'The Blue Lagoon',
      'The Golden Circle route (Gullfoss, Geysir, Þingvellir)',
      'Jökulsárlón Glacier Lagoon',
      'See the Northern Lights (Aurora Borealis)',
    ],
    bestTimeToVisit: 'Summer (June-August) for milder weather and long days. Winter (October-March) for the best chance to see the Northern Lights.',
    aiRecommended: true,
  },
];
