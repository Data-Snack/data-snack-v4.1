# 🍴 SNACK CATALOG - Detailed Specifications

## 🍲 01. PRIMORDIAL SOUP ✅
**Status**: Implemented
**Plateau**: Meta (All)
**Route**: `/kitchen/primordial-soup`

### Concept
Der Ur-Snack. Users mixen Operatoren und erzeugen einzigartige Reality-Signaturen.

### Features
- Operator Selection System
- Visual Synthesis Animation
- Unique Reality Code Generation
- Archetype Assignment

---

## 🍪 02. COOKIE CONSENT ROULETTE ✅
**Status**: Implemented
**Plateau**: APPARATE
**Route**: `/kitchen/cookie-roulette`

### Concept
Ein Cookie-Consent-Dialog als Russian Roulette. Jeder Klick hat Konsequenzen.

### Features
- **6 Kammern** mit verschiedenen Tracking-Levels
- **Visuell**: Revolver-Trommel dreht sich
- **Sound**: Klick-Geräusche, Trommel-Rotation
- **Resultat**: Zeigt live welche Tracker aktiviert wurden
- **Education**: Erklärt was jeder Tracker wirklich macht

### Technical
```javascript
const chambers = [
  { level: 'ESSENTIAL', impact: 'minimal' },
  { level: 'ANALYTICS', impact: 'moderate' },
  { level: 'MARKETING', impact: 'heavy' },
  { level: 'SOCIAL', impact: 'invasive' },
  { level: 'ADVERTISING', impact: 'extreme' },
  { level: 'TOTAL_SURVEILLANCE', impact: 'apocalyptic' }
];
```

---

## 🧘 03. SCROLL YOGA ✅
**Status**: Implemented
**Plateau**: KÖRPER
**Route**: `/kitchen/scroll-yoga`

### Concept
Scrolling als meditative Praxis. Der Browser wird zum Yoga-Studio.

### Features
- **Scroll-Tracking** mit Geschwindigkeit und Rhythmus
- **Breathing Guide** synchronisiert mit Scroll-Speed
- **Asanas**: Verschiedene Scroll-Patterns als Übungen
- **Score**: Harmonie zwischen Bewegung und Atmung
- **Visualization**: Mandala das sich mit Scroll formt

### Positions
1. **Mountain Scroll** - Langsam und stetig
2. **Wave Scroll** - Wellenförmige Bewegung
3. **Pulse Scroll** - Rhythmisches Stoppen
4. **Infinite Scroll** - Endlos-Meditation
5. **Reverse Scroll** - Gegen die Zeit

---

## 🔮 04. ERROR ORACLE ✅
**Status**: Implemented
**Plateau**: FEHLER
**Route**: `/kitchen/error-oracle`

### Concept
404-Seiten und Error Messages als Orakel. Jeder Fehler eine Prophezeiung.

### Features
- **Error Collection**: Sammelt alle Browser-Errors
- **Interpretation Engine**: Deutet Errors als Zeichen
- **Tarot-Style Cards**: Jeder Error-Type eine Karte
- **Daily Reading**: Basierend auf User-Errors
- **Glitch Aesthetics**: Visuell corrupted

### Error Types as Arcana
```javascript
const errorArcana = {
  '404': 'The Lost Path',
  '500': 'The Tower (Server Falls)',
  'CORS': 'The Boundary',
  'TypeError': 'The Fool',
  'NetworkError': 'The Hermit',
  'SyntaxError': 'The Broken Word'
};
```

---

## ⏰ 05. DOOMSCROLLING TIMER
**Status**: Concept
**Plateau**: ZEIT
**Route**: `/kitchen/doom-timer`

### Concept
Visualisiert die Zeit die in endlosen Feeds verloren geht.

### Features
- **Life Clock**: Zeigt verbleibende Lebenszeit
- **Scroll Decay**: Content wird älter während du scrollst
- **Time Dilation**: Zeit vergeht unterschiedlich schnell
- **Lost Hours**: Akkumulierte Scroll-Zeit
- **Generational Waste**: Hochrechnung auf Lebenszeit

---

## 🗣️ 06. ECHO CHAMBER SIMULATOR
**Status**: Concept
**Plateau**: GEMEINSCHAFT
**Route**: `/kitchen/echo-chamber`

### Concept
Erlebe wie Meinungen in Filterblasen mutieren.

### Features
- **Input**: User gibt Statement ein
- **Echo Process**: Statement wird iterativ verzerrt
- **Amplification**: Emotionen werden verstärkt
- **Polarization**: Meinungen driften auseinander
- **Visualization**: Netzwerk-Graph der Echoes

---

## 🧬 07. DATA DNA SEQUENCER
**Status**: Idea
**Plateau**: KÖRPER
**Route**: `/kitchen/data-dna`

### Concept
Browser-History und Cookies als DNA-Sequenz visualisiert.

---

## 🎭 08. PRIVACY THEATER
**Status**: Idea
**Plateau**: APPARATE
**Route**: `/kitchen/privacy-theater`

### Concept
Privacy Policies als absurdes Theater-Stück performed.

---

## 🌀 09. ALGORITHMIC ANXIETY
**Status**: Idea
**Plateau**: FEHLER
**Route**: `/kitchen/algo-anxiety`

### Concept
Recommendation Algorithms erzeugen zunehmend paranoide Vorschläge.

---

## 🔄 10. INFINITE RECURSION
**Status**: Idea
**Plateau**: ZEIT
**Route**: `/kitchen/infinite-recursion`

### Concept
Eine Seite die sich selbst endlos lädt und dabei mutiert.

---

## Implementation Priority

### Wave 1 (Current Sprint)
1. Cookie Consent Roulette
2. Scroll Yoga
3. Error Oracle

### Wave 2
4. Doomscrolling Timer
5. Echo Chamber Simulator
6. Data DNA Sequencer

### Wave 3
7. Privacy Theater
8. Algorithmic Anxiety
9. Infinite Recursion
10. Community Snacks

## Snack Template Structure

```svelte
<!-- /routes/kitchen/[snack-name]/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import SnackContainer from '$lib/components/SnackContainer.svelte';
  
  // Snack Logic
  let phase = 'INIT';
  let data = {};
  
  // Operator Integration
  const operators = [];
  
  // Visualization
  let canvas;
  
  // Results
  let analysis = {};
</script>

<SnackContainer {phase}>
  <!-- Snack Content -->
</SnackContainer>
```

---

*Each snack is a ritual. Each ritual reveals reality.*
