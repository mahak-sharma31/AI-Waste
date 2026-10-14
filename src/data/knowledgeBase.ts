import { EcoDecisionInfo, QuizQuestion, ResinCode, UpcycleProject, WasteCategory } from '../types';

export const LOW_CONFIDENCE_THRESHOLD = 55;

export const CATEGORY_COLORS: Record<WasteCategory, { bg: string; text: string; border: string; bar: string }> = {
  plastic: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', bar: 'bg-emerald-600' },
  paper: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', bar: 'bg-amber-600' },
  metal: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', bar: 'bg-slate-600' },
  organic: { bg: 'bg-lime-50', text: 'text-lime-800', border: 'border-lime-200', bar: 'bg-lime-600' },
  glass: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200', bar: 'bg-cyan-600' },
  'e-waste': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', bar: 'bg-purple-600' },
  hazardous: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', bar: 'bg-rose-600' },
};

export const ecoDecisionKnowledgeBase: Record<WasteCategory, EcoDecisionInfo> = {
  plastic: {
    title: 'Plastic Waste',
    disposal: [
      'Place clean, dry rigid plastic in your recycling bin only if your local service accepts that specific resin code (1, 2, 5 are most widely accepted).',
      'Soft films, grocery bags, bubble wrap, and styrofoam are frequently rejected in kerbside bins — return films to grocery store drop-offs.',
      'Contaminated plastic with deep food or motor oil residue must go to residual waste unless thoroughly de-greased.'
    ],
    preparation: [
      'Empty all liquid and residue completely.',
      'Rinse lightly with used dishwater or cold water — do not waste litres of warm water.',
      'Separate non-plastic trigger pumps, foil seals, and mixed-material caps when required.',
      'Keep recyclables loose — never tie plastic items inside plastic rubbish sacks.'
    ],
    reuse: [
      'Repurpose heavy-duty tubs or jars for workshop hardware, stationary, or craft bead sorting.',
      'Cut water bottles into self-watering seed starters or mini tabletop greenhouse domes.',
      'Collect clean bottle caps for school STEM art murals or local upcycling drop-offs.'
    ],
    recycling: 'Many plastics can be re-pelletized into fleece, carpeting, or new bottles when clean and sorted. However, multi-layered plastic laminates are currently non-recyclable in standard infrastructure. Follow local guidance.',
    safety: 'Never heat food in non-microwave-safe plastics. Do not reuse containers that previously stored bleach, motor oils, or pesticides for food or pets.'
  },
  paper: {
    title: 'Paper & Cardboard',
    disposal: [
      'Clean, dry corrugated cardboard, newspapers, office paper, and non-glossy mail go into the paper/fibre recycling stream.',
      'Greasy pizza boxes with melted cheese/oil belong in municipal food/compost waste (if accepted) or general waste — never clean paper bins.',
      'Paper cups (PE-lined) and thermal receipts (BPA-coated) are not recyclable in regular paper streams.'
    ],
    preparation: [
      'Break down and flatten boxes completely to conserve space in collection vehicles.',
      'Remove plastic adhesive tape, bubble padding, and metal spiral bindings where easily possible.',
      'Keep fibre strictly dry — wet paper fibres break down prematurely and can contaminate an entire bale.'
    ],
    reuse: [
      'Shred unprinted brown cardboard for garden mulch, carbon-rich compost browns, or pet bedding.',
      'Use blank reverse sides of office printer paper for note-taking and sketches.',
      'Re-use sturdy delivery boxes for home moving, storage organizers, or shipping gifts.'
    ],
    recycling: 'Cardboard can typically be recycled 5 to 7 times before fibres become too short. Clean separation preserves secondary fibre quality.',
    safety: 'Do not burn glossy, chemically treated, or colored wrapping paper in home fireplaces due to toxic fume release.'
  },
  metal: {
    title: 'Metal Waste',
    disposal: [
      'Aluminium beverage cans and steel (tin) food cans are 100% infinitely recyclable in kerbside bins.',
      'Clean aluminium foil trays can be recycled if baled together into a cricket-ball size.',
      'Large scrap metal, pipes, wire, and cookware belong at a Household Waste Recycling Centre (HWRC) or scrap dealer, not regular bins.'
    ],
    preparation: [
      'Empty contents completely.',
      'Give food cans a quick rinse to prevent foul odours and insect contamination.',
      'Tuck sharp can lids inside the can or press them flat so waste handlers are protected from lacerations.'
    ],
    reuse: [
      'Turn clean food tins into durable pencil cups, paintbrush holders, or lantern holders (punched holes).',
      'Use cleaned biscuit tins for sewing kits, first aid, or dry biscuit storage.',
      'Repurpose aluminium tabs for creative chain-mail art or charitable pop-tab donations.'
    ],
    recycling: 'Recycling aluminium saves up to 95% of the energy needed to make new metal from bauxite ore. Steel can be recycled indefinitely without losing strength.',
    safety: 'Watch for sharp ragged edges on open cans. Never puncture, crush, or heat pressurised aerosol cans.'
  },
  organic: {
    title: 'Organic & Food Waste',
    disposal: [
      'Raw fruit and vegetable peelings, coffee grounds, and garden clippings belong in organic compost collections.',
      'Check local municipal rules before adding meat, fish bones, dairy, or cooked oils to residential compost bins.',
      'Never mix plastic produce stickers, twist ties, or tea bags with plastic sealant into organic waste.'
    ],
    preparation: [
      'Peel off adhesive fruit barcode labels before composting.',
      'Drain excess gravies or liquids to avoid anaerobic foul odors and bin leakage.',
      'Use certified home-compostable (EN 13432) or paper bags only if allowed by local collector.'
    ],
    reuse: [
      'Simmer clean vegetable ends (onion skins, celery tips, carrot tops) into a rich homemade vegetable broth.',
      'Scatter used coffee grounds around acid-loving plants (hydrangeas, blueberries) to repel pests.',
      'Start a backyard vermiculture (worm farm) to produce nutrient-rich liquid gold for houseplants.'
    ],
    recycling: 'When organics go to landfills, they decompose anaerobically producing potent methane (CH₄). Composting turns them into humus and nutrient-dense soil amendment.',
    safety: 'Wash hands thoroughly after handling rotting food waste. Do not home-compost pet feces or diseased garden plants.'
  },
  glass: {
    title: 'Glass Containers',
    disposal: [
      'Glass bottles and food jars (flint, amber, green) belong in kerbside glass bins or local bottle banks.',
      'Pyrex, ceramics, drinking glasses, window panes, and mirrors have different melting temperatures and must NOT go into container glass recycling.',
      'Remove metal or plastic corks and lids (often recycled separately in metal bins).'
    ],
    preparation: [
      'Empty all liquid and scrape food chunks.',
      'Rinse lightly; paper bottle labels can stay on (they burn off cleanly during glass smelting).',
      'Do not intentionally break bottles — intact bottles sort more accurately at automated facilities.'
    ],
    reuse: [
      'Glass jars make airtight containers for bulk pantry grains, nuts, jams, and sourdough starter.',
      'Use empty wine or sauce bottles as candle stick holders, flower vases, or olive oil pourers.'
    ],
    recycling: 'Glass is 100% infinitely recyclable with zero loss of purity or quality. Melting cullet requires 30% less energy than raw sand.',
    safety: 'Wrap broken glass in thick newspaper before disposing in general waste to protect sanitation workers.'
  },
  'e-waste': {
    title: 'Electronic Waste (E-Waste)',
    disposal: [
      'NEVER put electronics, cords, circuit boards, or lithium-ion batteries into regular domestic bins.',
      'Take discarded electronics to municipal e-waste drop-off kiosks, retailer take-back bins, or certified WEEE facilities.'
    ],
    preparation: [
      'Perform a factory reset and securely wipe all personal data from memory storage.',
      'Remove detachable batteries and tape the terminals with clear scotch tape before drop-off.',
      'Keep cords and power bricks neatly bundled.'
    ],
    reuse: [
      'Repurpose an old smartphone as a dedicated security camera, desk clock, or audio streamer.',
      'Donate working devices to community digital inclusion programs or schools.'
    ],
    recycling: 'E-waste contains precious gold, copper, silver, and rare earths that can be reclaimed, preventing destructive primary mining.',
    safety: 'Damaged or punctured lithium-ion batteries present severe fire and explosion risks. If a battery is swollen, handle with extreme care in a fireproof vessel.'
  },
  hazardous: {
    title: 'Hazardous Household Waste',
    disposal: [
      'Paint, engine oil, pesticides, solvents, fluorescent CFL tubes, and strong cleaning chemicals require specialist hazardous waste collection.',
      'Never pour down sinks, storm drains, or into household bins.'
    ],
    preparation: [
      'Keep hazardous materials in their original labeled containers.',
      'Ensure caps are securely sealed to prevent leaks during transport.'
    ],
    reuse: [
      'Donate leftover paint cans to community murals or theatre groups.',
      'Use non-toxic alternatives for future household cleaning (vinegar, baking soda).'
    ],
    recycling: 'Specialized chemical treatment neutralizes hazardous compounds or reclaims motor oil for industrial re-refining.',
    safety: 'Wear protective gloves. Keep away from heat sources and out of reach of children and pets.'
  }
};

export const RESIN_CODES: ResinCode[] = [
  {
    code: 1,
    symbol: '♳',
    acronym: 'PET / PETE',
    fullName: 'Polyethylene Terephthalate',
    recyclable: true,
    recyclabilityLevel: 'Widely Recycled',
    commonProducts: ['Water & soda bottles', 'Salad dressing bottles', 'Peanut butter jars', 'Food trays'],
    safeForReuse: true,
    safetyBadge: 'Food Safe',
    notes: 'Most commonly recycled plastic worldwide. Picked up by almost all municipal curbside programs. Recycled into polar fleece, tote bags, and new beverage bottles.'
  },
  {
    code: 2,
    symbol: '♴',
    acronym: 'HDPE',
    fullName: 'High-Density Polyethylene',
    recyclable: true,
    recyclabilityLevel: 'Widely Recycled',
    commonProducts: ['Milk jugs', 'Shampoo & soap bottles', 'Detergent bottles', 'Yogurt tubs'],
    safeForReuse: true,
    safetyBadge: 'Food Safe',
    notes: 'Very safe, durable, and resistant to chemicals. Widely accepted kerbside. Remade into picnic tables, detergent bottles, and recycling bins.'
  },
  {
    code: 3,
    symbol: '♵',
    acronym: 'PVC',
    fullName: 'Polyvinyl Chloride',
    recyclable: false,
    recyclabilityLevel: 'Rarely / Specialist',
    commonProducts: ['Plumbing pipes', 'Vinyl flooring', 'Shower curtains', 'Medical tubing', 'Inflatable toys'],
    safeForReuse: false,
    safetyBadge: 'Caution',
    notes: 'Contains chlorine and phthalates. Rarely accepted kerbside. Never burn PVC as it produces hazardous dioxins. Requires industrial hazardous scrap drop-off.'
  },
  {
    code: 4,
    symbol: '♶',
    acronym: 'LDPE',
    fullName: 'Low-Density Polyethylene',
    recyclable: true,
    recyclabilityLevel: 'Limited Recycled',
    commonProducts: ['Grocery plastic bags', 'Bread bags', 'Squeeze bottles', 'Bubble wrap', 'Cling film'],
    safeForReuse: true,
    safetyBadge: 'Food Safe',
    notes: 'Soft films tangle automated sorting machinery in standard kerbside facilities. Best recycled at dedicated grocery store soft-plastic return stations.'
  },
  {
    code: 5,
    symbol: '♷',
    acronym: 'PP',
    fullName: 'Polypropylene',
    recyclable: true,
    recyclabilityLevel: 'Widely Recycled',
    commonProducts: ['Tupperware containers', 'Medicine bottles', 'Takeaway food tubs', 'Straws & syrup bottles'],
    safeForReuse: true,
    safetyBadge: 'Food Safe',
    notes: 'High melting point; safe for hot liquids and dishwasher safe. Accepted in most modern recycling centers. Re-manufactured into car battery casings and pallets.'
  },
  {
    code: 6,
    symbol: '♸',
    acronym: 'PS',
    fullName: 'Polystyrene / Styrofoam',
    recyclable: false,
    recyclabilityLevel: 'Rarely / Specialist',
    commonProducts: ['Styrofoam takeaway boxes', 'Disposable cups & cutlery', 'Packing peanuts', 'Egg cartons'],
    safeForReuse: false,
    safetyBadge: 'Avoid Hot Food',
    notes: 'Fragile, bulky, and difficult to recycle economically. May leach styrene if heated. Many cities now ban expanded polystyrene.'
  },
  {
    code: 7,
    symbol: '♹',
    acronym: 'OTHER / PLA',
    fullName: 'Other Plastics & Bioplastics',
    recyclable: false,
    recyclabilityLevel: 'Rarely / Specialist',
    commonProducts: ['Baby bottles', 'Large water coolers', 'Safety goggles', 'PLA bioplastics', 'Multi-layer packaging'],
    safeForReuse: false,
    safetyBadge: 'Caution',
    notes: 'A catch-all category for blended resins, polycarbonate (BPA), and PLA cornstarch bioplastics. Do not mix PLA with regular plastic recycling as it ruins the melt.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'A clean, empty aluminium beverage can should usually be placed where?',
    options: ['Metal recycling bin (curbside)', 'Organic / compost bin', 'General landfill rubbish', 'Hazardous collection only'],
    answer: 0,
    explain: 'Aluminium cans are 100% infinitely recyclable and should go into metal recycling bins where kerbside collection exists.',
    category: 'metal',
    difficulty: 'Beginner'
  },
  {
    id: 2,
    question: 'What should you do with a takeaway pizza box that has heavy grease and cheese stains?',
    options: ['Tear away clean lid for paper recycling; discard greasy base into compost or general waste', 'Put entire greasy box into clean office paper recycling', 'Rinse the box with warm water until soaked', 'Put it in plastic recycling'],
    answer: 0,
    explain: 'Food oil and grease cannot be washed out of cardboard fibres during paper pulping. The clean top lid can be recycled, while the greasy base goes to compost or residual waste.',
    category: 'paper',
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    question: 'Before recycling an empty yogurt or peanut butter tub, what is the best practice?',
    options: ['Fill it with water and freeze it', 'Scrape out residue and give it a quick light rinse', 'Run it through an intensive 2-hour dishwasher cycle', 'Leave all food inside to provide weight'],
    answer: 1,
    explain: 'A quick scrape and light rinse with existing rinse water is ideal. You do not need pristine sterile containers, but food chunks attract pests and contaminate recycling batches.',
    category: 'plastic',
    difficulty: 'Beginner'
  },
  {
    id: 4,
    question: 'Why should soft plastic film bags (LDPE #4) NOT be placed loose in standard curbside recycling bins?',
    options: ['They are poisonous to touch', 'They wrap around and jam the rotating sorting gears at recovery facilities', 'They are heavier than glass', 'They cause fire immediately on contact with air'],
    answer: 1,
    explain: 'Soft plastic films tangle around mechanical sorting drums (trommels) causing factory shutdowns. They should be returned to supermarket collection points instead.',
    category: 'plastic',
    difficulty: 'Intermediate'
  },
  {
    id: 5,
    question: 'How long does a typical single-use plastic water bottle take to decompose in a landfill?',
    options: ['2 to 5 years', 'About 25 years', 'Around 450 years', '10,000 years'],
    answer: 2,
    explain: 'PET plastic takes approximately 450 years to break down in a landfill, fragmenting into microplastics rather than biodegrading naturally.',
    category: 'plastic',
    difficulty: 'Intermediate'
  },
  {
    id: 6,
    question: 'Can broken drinking glasses, window glass, or ceramic mugs be recycled with regular glass food jars?',
    options: ['Yes, all glass is completely identical', 'No, they have different melting points and will ruin new container glass melts', 'Only if painted blue', 'Yes, but only in the organic bin'],
    answer: 1,
    explain: 'Drinking glasses, Pyrex, ceramics, and window panes have different melting chemistries. Mixing them with bottle glass causes structural defects in newly blown bottles.',
    category: 'glass',
    difficulty: 'Pro'
  },
  {
    id: 7,
    question: 'What is the correct protocol for disposing of a dead laptop or lithium-ion phone battery?',
    options: ['Throw it in regular curbside trash', 'Drop it off at a certified battery or e-waste recycling kiosk with taped terminals', 'Bury it in garden soil for fertilizer', 'Crush it with a hammer before throwing it out'],
    answer: 1,
    explain: 'Lithium-ion batteries present severe fire risks in trash compactor trucks. Always take them to designated battery drop-off bins with terminals taped.',
    category: 'e-waste',
    difficulty: 'Beginner'
  },
  {
    id: 8,
    question: 'Which of the following plastic resin identification codes is considered the safest and most widely accepted for food packaging?',
    options: ['#3 PVC (Polyvinyl Chloride)', '#6 PS (Polystyrene)', '#2 HDPE & #5 Polypropylene (PP)', '#7 Other (Mixed Resins)'],
    answer: 2,
    explain: 'Both #2 HDPE (milk jugs, detergent) and #5 PP (Tupperware, yogurt lids) have high chemical stability and are widely accepted by recyclers.',
    category: 'plastic',
    difficulty: 'Pro'
  },
  {
    id: 9,
    question: 'When organic waste (food scraps) rots inside an anaerobic landfill without oxygen, what potent greenhouse gas does it produce?',
    options: ['Oxygen (O₂)', 'Methane (CH₄)', 'Helium (He)', 'Nitrogen (N₂)'],
    answer: 1,
    explain: 'Anaerobic decomposition in landfills produces methane (CH₄), which traps over 28 times more atmospheric heat than CO₂ over 100 years. Composting avoids this.',
    category: 'organic',
    difficulty: 'Intermediate'
  },
  {
    id: 10,
    question: 'Why are thermal register receipts from shops typically not recyclable in paper bins?',
    options: ['They are too colorful', 'They are coated with thermal reactive chemicals (like BPA or BPS)', 'They are made of metal foil', 'They are heavier than wood'],
    answer: 1,
    explain: 'Most shiny cash register receipts are coated with bisphenols (BPA/BPS) that react to heat. Recycling them introduces hormone-disrupting chemicals into recycled tissue products.',
    category: 'paper',
    difficulty: 'Pro'
  }
];

export const UPCYCLE_PROJECTS: UpcycleProject[] = [
  {
    id: 'upcycle-1',
    title: 'Self-Watering Herb Planter',
    category: 'plastic',
    difficulty: 'Easy',
    time: '15 mins',
    description: 'Transform an empty 1.5L or 2L plastic bottle into a self-wicking indoor planter perfect for fresh basil or mint.',
    materials: ['Clean 2L plastic bottle', 'Box cutter / scissors', 'Cotton twine or shoelace', 'Potting mix & seeds'],
    steps: [
      'Carefully cut the bottle horizontally about 1/3 down from the top.',
      'Punch a small hole in the cap and thread a 15cm cotton string through, leaving 5cm hanging into the bottom reservoir.',
      'Screw cap on, invert the top funnel upside down into the bottom base.',
      'Fill the bottom base with water, add soil and plant seeds into the top funnel. The string wicks water automatically!'
    ],
    ecoBenefit: 'Diverts 1 plastic bottle and eliminates daily manual over-watering.'
  },
  {
    id: 'upcycle-2',
    title: 'Desktop Supply Organizer Tin',
    category: 'metal',
    difficulty: 'Easy',
    time: '20 mins',
    description: 'Upcycle steel soup or coffee cans into chic minimalist containers for pens, paintbrushes, or makeup brushes.',
    materials: ['Empty tin can', 'Sanding block or pliers', 'Jute twine or acrylic paint', 'Glue'],
    steps: [
      'Remove labels and smooth any rough inner rim edges using pliers or fine sandpaper.',
      'Wrap tightly with natural jute twine using hot glue or paint with two coats of water-based paint.',
      'Optional: Glue 3-4 cans together in a pyramid or cluster for a modular desk organizer.'
    ],
    ecoBenefit: 'Infinite reuse of durable steel without industrial remelting.'
  },
  {
    id: 'upcycle-3',
    title: 'Biodegradable Seed Starter Pods',
    category: 'paper',
    difficulty: 'Easy',
    time: '10 mins',
    description: 'Turn cardboard egg cartons or toilet paper tubes into plantable nursery pots that go directly into garden beds.',
    materials: ['Cardboard egg carton or toilet roll tubes', 'Scissors', 'Soil & vegetable seeds'],
    steps: [
      'Cut individual egg cups or snip four 1cm bottom cuts into toilet rolls and fold the flaps inward to create a base.',
      'Fill each cup with seedling soil and plant 1-2 seeds.',
      'When roots appear, plant the entire cardboard pod directly into garden soil — it biodegrades naturally in weeks!'
    ],
    ecoBenefit: 'Replaces plastic nursery seedling trays with 100% biodegradable fibre.'
  },
  {
    id: 'upcycle-4',
    title: 'Airtight Glass Pantry Storage Jars',
    category: 'glass',
    difficulty: 'Easy',
    time: '15 mins',
    description: 'Strip commercial sticky labels effortlessly from pasta and pickle jars for uniform bulk grain and spice storage.',
    materials: ['Used glass jars', 'Baking soda & cooking oil', 'Warm soapy water', 'Chalkboard labels / paint pen'],
    steps: [
      'Mix 1 tbsp baking soda and 1 tbsp cooking oil into a paste.',
      'Smear the paste over stubborn sticky label residue and let sit for 10 minutes.',
      'Wipe off clean with a cloth and wash with warm soap. The glue dissolves effortlessly!',
      'Label lid with chalk or marker for bulk lentils, oats, seeds, and spices.'
    ],
    ecoBenefit: 'Eliminates reliance on plastic Tupperware containers and extends zero-waste kitchen habits.'
  }
];

import {
  PRESET_PLASTIC_BOTTLE,
  PRESET_ALUMINIUM_CAN,
  PRESET_CARDBOARD_BOX,
  PRESET_BANANA_PEEL,
} from './presetImages';

export const DEMO_PRESETS = [
  {
    name: 'Plastic Water Bottle',
    category: 'plastic' as WasteCategory,
    categoryLabel: 'Plastic Waste',
    materialDetail: '#1 PET (Polyethylene Terephthalate)',
    confidence: 96,
    cleanlinessStatus: 'Clean & Empty',
    decompositionTime: '450 years',
    co2DivertedKg: 0.08,
    imageUrl: PRESET_PLASTIC_BOTTLE,
    item_name: 'Clear PET Plastic Water Bottle',
  },
  {
    name: 'Aluminium Soda Can',
    category: 'metal' as WasteCategory,
    categoryLabel: 'Metal Waste',
    materialDetail: 'Aluminium Alloy (100% Recyclable)',
    confidence: 95,
    cleanlinessStatus: 'Needs light rinse',
    decompositionTime: '200 years',
    co2DivertedKg: 0.17,
    imageUrl: PRESET_ALUMINIUM_CAN,
    item_name: 'Aluminium Drink Soda Can',
  },
  {
    name: 'Corrugated Cardboard Box',
    category: 'paper' as WasteCategory,
    categoryLabel: 'Paper & Cardboard',
    materialDetail: 'Unbleached Kraft Corrugated Fibreboard',
    confidence: 97,
    cleanlinessStatus: 'Clean & Flattened',
    decompositionTime: '2 months',
    co2DivertedKg: 0.12,
    imageUrl: PRESET_CARDBOARD_BOX,
    item_name: 'Kraft Corrugated Cardboard Box',
  },
  {
    name: 'Organic Banana Peel & Scraps',
    category: 'organic' as WasteCategory,
    categoryLabel: 'Organic Waste',
    materialDetail: 'Compostable Plant Biomass (Food Scrap)',
    confidence: 94,
    cleanlinessStatus: 'Organic Fruit Scraps',
    decompositionTime: '2 - 4 weeks',
    co2DivertedKg: 0.25,
    imageUrl: PRESET_BANANA_PEEL,
    item_name: 'Fresh Banana Peel & Fruit Scrap',
  },
];
