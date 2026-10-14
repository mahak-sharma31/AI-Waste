// High-resolution, zero-latency vector illustrations for demo presets
// Replaces external URLs to ensure instant loading, zero CORS issues, and 100% correct items.

export const PRESET_PLASTIC_BOTTLE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e8f4f8"/>
      <stop offset="100%" stop-color="#d0e8f2"/>
    </linearGradient>
    <linearGradient id="bottleBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#bce3f5" stop-opacity="0.85"/>
      <stop offset="30%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="70%" stop-color="#bce3f5" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#7ec4e8" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="cap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1d6fa5"/>
      <stop offset="50%" stop-color="#3aa0e4"/>
      <stop offset="100%" stop-color="#185680"/>
    </linearGradient>
    <linearGradient id="water" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#a8ddf5" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#69bfe6" stop-opacity="0.75"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#163528" flood-opacity="0.15"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="24" fill="url(#bg)"/>

  <!-- Floor shadow -->
  <ellipse cx="200" cy="355" rx="65" ry="14" fill="#000000" opacity="0.12"/>

  <!-- Bottle Group -->
  <g filter="url(#shadow)">
    <!-- Blue Cap -->
    <rect x="175" y="48" width="50" height="26" rx="4" fill="url(#cap)"/>
    <line x1="183" y1="48" x2="183" y2="74" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
    <line x1="193" y1="48" x2="193" y2="74" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
    <line x1="203" y1="48" x2="203" y2="74" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
    <line x1="213" y1="48" x2="213" y2="74" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
    <rect x="171" y="74" width="58" height="8" rx="2" fill="#185680"/>

    <!-- Bottle Neck -->
    <path d="M178,82 L178,110 Q178,135 152,155 L144,325 Q144,345 168,348 L232,348 Q256,345 256,325 L248,155 Q222,135 222,110 L222,82 Z" fill="url(#bottleBody)" stroke="#74b9de" stroke-width="2"/>

    <!-- Water Inside -->
    <path d="M147,210 Q200,205 253,210 L251,324 Q251,342 230,344 L170,344 Q149,342 149,324 Z" fill="url(#water)"/>

    <!-- Horizontal Bottle Ribs -->
    <path d="M148,225 Q200,220 252,225" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M147,255 Q200,250 253,255" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M146,285 Q200,280 254,285" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.7"/>

    <!-- Bottle Label -->
    <rect x="146" y="160" width="108" height="46" rx="4" fill="#ffffff" opacity="0.9" stroke="#7ec4e8" stroke-width="1"/>
    <text x="200" y="180" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#1d6fa5" text-anchor="middle">PURE WATER</text>
    <text x="200" y="195" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#3aa0e4" text-anchor="middle">500ml · 100% #1 PET</text>

    <!-- Plastic Resin Badge -->
    <circle cx="200" cy="316" r="14" fill="#ffffff" stroke="#1d6fa5" stroke-width="1.5"/>
    <text x="200" y="321" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#1d6fa5" text-anchor="middle">♳</text>

    <!-- Highlight Reflection -->
    <path d="M156,120 Q160,145 154,320" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8"/>
  </g>

  <!-- Tag Pill -->
  <rect x="120" y="366" width="160" height="24" rx="12" fill="#1f4d36"/>
  <text x="200" y="382" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#b8e0c2" text-anchor="middle">PLASTIC · #1 PET</text>
</svg>
`)}`;

export const PRESET_ALUMINIUM_CAN = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="canBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5eef0"/>
      <stop offset="100%" stop-color="#e2dadf"/>
    </linearGradient>
    <linearGradient id="metalRim" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9aa0a6"/>
      <stop offset="25%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#c4c7c5"/>
      <stop offset="80%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#757775"/>
    </linearGradient>
    <linearGradient id="canBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b31b25"/>
      <stop offset="25%" stop-color="#ea2837"/>
      <stop offset="50%" stop-color="#ff6b76"/>
      <stop offset="75%" stop-color="#ea2837"/>
      <stop offset="100%" stop-color="#800f17"/>
    </linearGradient>
    <filter id="canShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#163528" flood-opacity="0.15"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="24" fill="url(#canBg)"/>

  <!-- Shadow -->
  <ellipse cx="200" cy="355" rx="65" ry="14" fill="#000000" opacity="0.15"/>

  <!-- Can Group -->
  <g filter="url(#canShadow)">
    <!-- Top Rim Oval -->
    <ellipse cx="200" cy="95" rx="58" ry="16" fill="url(#metalRim)"/>
    <ellipse cx="200" cy="94" rx="48" ry="12" fill="#80868b"/>
    <ellipse cx="200" cy="93" rx="44" ry="10" fill="#dadce0"/>

    <!-- Pull Tab -->
    <ellipse cx="200" cy="92" rx="14" ry="6" fill="#bdc1c6" stroke="#5f6368" stroke-width="1"/>
    <circle cx="200" cy="92" r="2.5" fill="#3c4043"/>
    <rect x="196" y="93" width="8" height="12" rx="2" fill="#9aa0a6"/>

    <!-- Upper Taper -->
    <path d="M142,95 L135,120 L265,120 L258,95 Z" fill="url(#metalRim)"/>

    <!-- Main Cylinder Body -->
    <rect x="135" y="120" width="130" height="205" fill="url(#canBody)"/>

    <!-- Metallic Sheen Highlights -->
    <rect x="175" y="120" width="18" height="205" fill="#ffffff" opacity="0.35"/>
    <rect x="198" y="120" width="6" height="205" fill="#ffffff" opacity="0.5"/>

    <!-- Soda Brand Graphic -->
    <ellipse cx="200" cy="210" rx="45" ry="45" fill="#ffffff" opacity="0.15"/>
    <path d="M145,185 Q200,235 255,185" stroke="#ffffff" stroke-width="12" fill="none" opacity="0.9"/>
    <text x="200" y="215" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">COLA</text>
    <text x="200" y="235" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">ALUMINIUM 330ml</text>

    <!-- Infinite Recycle Emblem -->
    <circle cx="200" cy="275" r="16" fill="#ffffff"/>
    <text x="200" y="281" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" fill="#b31b25" text-anchor="middle">♻</text>

    <!-- Bottom Taper & Rim -->
    <path d="M135,325 L144,342 L256,342 L265,325 Z" fill="url(#metalRim)"/>
    <ellipse cx="200" cy="342" rx="56" ry="10" fill="url(#metalRim)"/>
  </g>

  <!-- Tag Pill -->
  <rect x="110" y="366" width="180" height="24" rx="12" fill="#1f4d36"/>
  <text x="200" y="382" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#b8e0c2" text-anchor="middle">METAL · AL SODA CAN</text>
</svg>
`)}`;

export const PRESET_CARDBOARD_BOX = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="paperBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbf7ed"/>
      <stop offset="100%" stop-color="#eee2ce"/>
    </linearGradient>
    <linearGradient id="kraftTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4a36a"/>
      <stop offset="100%" stop-color="#c18e54"/>
    </linearGradient>
    <linearGradient id="kraftLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b6834b"/>
      <stop offset="100%" stop-color="#9a6932"/>
    </linearGradient>
    <linearGradient id="kraftRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a8743c"/>
      <stop offset="100%" stop-color="#885724"/>
    </linearGradient>
    <filter id="boxShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="10" flood-color="#163528" flood-opacity="0.18"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="24" fill="url(#paperBg)"/>

  <!-- Shadow -->
  <polygon points="200,365 340,295 200,260 60,295" fill="#000000" opacity="0.12"/>

  <!-- 3D Cardboard Box -->
  <g filter="url(#boxShadow)">
    <!-- Top Flaps Face -->
    <polygon points="200,85 330,150 200,215 70,150" fill="url(#kraftTop)"/>

    <!-- Left Face -->
    <polygon points="70,150 200,215 200,340 70,270" fill="url(#kraftLeft)"/>

    <!-- Right Face -->
    <polygon points="200,215 330,150 330,270 200,340" fill="url(#kraftRight)"/>

    <!-- Sealing Tape along Top Flaps -->
    <polygon points="190,90 210,80 210,210 190,220" fill="#edd6a6" opacity="0.85"/>
    <polygon points="70,150 200,215 200,222 70,157" fill="#edd6a6" opacity="0.6"/>

    <!-- Shipping Label on Left Face -->
    <polygon points="90,195 150,225 150,275 90,245" fill="#ffffff" opacity="0.95"/>
    <line x1="98" y1="210" x2="142" y2="232" stroke="#333333" stroke-width="3"/>
    <line x1="98" y1="222" x2="135" y2="240" stroke="#666666" stroke-width="2"/>
    <line x1="98" y1="230" x2="125" y2="243" stroke="#666666" stroke-width="2"/>

    <!-- Barcode -->
    <line x1="102" y1="242" x2="102" y2="256" stroke="#111111" stroke-width="2"/>
    <line x1="106" y1="244" x2="106" y2="258" stroke="#111111" stroke-width="3"/>
    <line x1="112" y1="247" x2="112" y2="261" stroke="#111111" stroke-width="1.5"/>
    <line x1="116" y1="249" x2="116" y2="263" stroke="#111111" stroke-width="2.5"/>
    <line x1="122" y1="252" x2="122" y2="266" stroke="#111111" stroke-width="2"/>

    <!-- Fragile / Recycle Stamp on Right Face -->
    <g transform="translate(225, 235) skewY(26)">
      <!-- Mobius loop symbol -->
      <circle cx="25" cy="20" r="18" fill="none" stroke="#3d2105" stroke-width="2.5" opacity="0.6"/>
      <text x="25" y="26" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#3d2105" text-anchor="middle" opacity="0.7">PAP</text>
    </g>
  </g>

  <!-- Tag Pill -->
  <rect x="110" y="366" width="180" height="24" rx="12" fill="#1f4d36"/>
  <text x="200" y="382" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#b8e0c2" text-anchor="middle">PAPER · CARDBOARD BOX</text>
</svg>
`)}`;

export const PRESET_BANANA_PEEL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="orgBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbfbee"/>
      <stop offset="100%" stop-color="#ecf5dc"/>
    </linearGradient>
    <linearGradient id="bananaYellow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff159"/>
      <stop offset="50%" stop-color="#ffd000"/>
      <stop offset="100%" stop-color="#d69b00"/>
    </linearGradient>
    <linearGradient id="innerPeel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffceb"/>
      <stop offset="100%" stop-color="#faecc0"/>
    </linearGradient>
    <filter id="peelShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#163528" flood-opacity="0.15"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="24" fill="url(#orgBg)"/>

  <!-- Shadow -->
  <ellipse cx="200" cy="345" rx="100" ry="20" fill="#000000" opacity="0.14"/>

  <!-- Banana Peel Group -->
  <g filter="url(#peelShadow)">
    <!-- Crown / Stem Tip -->
    <path d="M194,110 L206,110 L203,135 L197,135 Z" fill="#4a3000"/>
    <ellipse cx="200" cy="110" rx="6" ry="3" fill="#2d1c00"/>

    <!-- Left Peel Petal -->
    <path d="M197,135 Q140,160 85,260 Q65,295 90,305 Q125,295 155,245 Q180,200 198,150 Z" fill="url(#bananaYellow)" stroke="#b58400" stroke-width="1.5"/>
    <!-- Left Peel Inner Side -->
    <path d="M197,135 Q150,175 110,270 Q130,270 155,235 Q180,195 198,150 Z" fill="url(#innerPeel)"/>

    <!-- Right Peel Petal -->
    <path d="M203,135 Q260,160 315,260 Q335,295 310,305 Q275,295 245,245 Q220,200 202,150 Z" fill="url(#bananaYellow)" stroke="#b58400" stroke-width="1.5"/>
    <!-- Right Peel Inner Side -->
    <path d="M203,135 Q250,175 290,270 Q270,270 245,235 Q220,195 202,150 Z" fill="url(#innerPeel)"/>

    <!-- Center Front Flap -->
    <path d="M195,145 Q180,210 185,280 Q190,340 200,340 Q210,340 215,280 Q220,210 205,145 Z" fill="url(#bananaYellow)" stroke="#b58400" stroke-width="1.5"/>
    <!-- Bottom Tip Brown Speck -->
    <ellipse cx="200" cy="338" rx="5" ry="3" fill="#3a2400"/>

    <!-- Natural Banana Ripe Brown Freckles/Spots -->
    <ellipse cx="140" cy="245" rx="3" ry="2" fill="#523908" opacity="0.75"/>
    <ellipse cx="152" cy="230" rx="2" ry="3" fill="#523908" opacity="0.75"/>
    <ellipse cx="170" cy="270" rx="3.5" ry="2" fill="#523908" opacity="0.75"/>
    <ellipse cx="260" cy="245" rx="3" ry="2" fill="#523908" opacity="0.75"/>
    <ellipse cx="248" cy="230" rx="2" ry="3" fill="#523908" opacity="0.75"/>
    <ellipse cx="230" cy="270" rx="3.5" ry="2" fill="#523908" opacity="0.75"/>
    <ellipse cx="198" cy="250" rx="3" ry="1.5" fill="#523908" opacity="0.75"/>
    <ellipse cx="202" cy="290" rx="2.5" ry="2" fill="#523908" opacity="0.75"/>

    <!-- Green Apple / Produce Leaf Accent -->
    <g transform="translate(100, 270) rotate(-25)">
      <path d="M0,0 Q18,-15 36,0 Q18,15 0,0 Z" fill="#559933" stroke="#336611" stroke-width="1"/>
      <line x1="0" y1="0" x2="36" y2="0" stroke="#336611" stroke-width="1"/>
    </g>
  </g>

  <!-- Tag Pill -->
  <rect x="105" y="366" width="190" height="24" rx="12" fill="#1f4d36"/>
  <text x="200" y="382" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#b8e0c2" text-anchor="middle">ORGANIC · BANANA PEEL</text>
</svg>
`)}`;
