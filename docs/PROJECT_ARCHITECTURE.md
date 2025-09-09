# DATA SNACK V4 - Project Architecture

## Core Philosophy
**The Abstract Machine as Interface**

Not a visualization of theory, but theory as operative diagram. The interface doesn't represent the machine - it IS the machine.

## Current State

### Live Routes
```
/                      → Homepage with boot sequence
/abstract-machine      → Operative diagram (intensities & speeds)
/wunschmaschine       → D3 force graph version (backup)
/wunschmaschine-pure  → Pure Svelte version (backup)
/map                  → Dynamic Cartography
/kitchen/
  ├── primordial-soup → Meta-snack generator
  ├── cookie-roulette → Russian roulette with privacy
  ├── scroll-yoga     → Meditation through scrolling
  └── error-oracle    → Error divination system
```

### Core Concepts

#### 1. INTENSITIES not POSITIONS
- No fixed coordinates
- Movement generates position, not vice versa
- Speed and force are primary

#### 2. OPERATIONS not REPRESENTATIONS
```javascript
// WRONG
const machine = { nodes: [], edges: [] }

// RIGHT
const machine = {
  connect: () => { /* process */ },
  deterritorialize: () => { /* force */ },
  lineOfFlight: () => { /* escape */ }
}
```

#### 3. ASSEMBLAGE not STRUCTURE
- User is part of the machine
- Interface changes through interaction
- No distinction between observer/observed

## The Cookie Roulette Formula™

Why Cookie Roulette works:
1. **Physical Metaphor** - Abstract concept → Concrete danger
2. **Immediate Consequences** - Every click has weight
3. **Dark Humor** - Makes horror shareable
4. **Educational Payload** - Reveals hidden mechanics

### Next Snacks (Same Formula)
- **Captcha Combat** - Fighting game against AI tests
- **Permission Jenga** - Tower of privacy permissions
- **Fingerprint Fighter** - Street Fighter with browser fingerprinting
- **ToS Speedrun** - 74,000 words as platformer

## Technical Stack

### Dependencies
```json
{
  "svelte": "^4.2.7",
  "@sveltejs/kit": "^2.0.0",
  "d3": "^7.8.5",
  "@supabase/supabase-js": "^2.39.0"
}
```

### Key Patterns

#### Canvas-based Rendering
```javascript
// Abstract Machine uses direct canvas manipulation
ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Trails
ctx.createRadialGradient(); // Force fields
requestAnimationFrame(render); // Smooth animation
```

#### State as Process
```javascript
// State emerges from operations
field.time += 0.01;
intensity.vector.x += force;
position = vector * time; // Position is derivative
```

#### Auto-Operations
```javascript
// Machine operates itself
setInterval(() => {
  if (Math.random() > 0.3) {
    operations[random]();
  }
}, 2000);
```

## Theoretical Foundation

### From Deleuze & Guattari
- **Abstract Machine**: Diagram of forces, not structure
- **Rhizome**: No center, any point connects to any other
- **Deterritorialization**: Breaking existing connections
- **Line of Flight**: Escape to new assemblages
- **Body without Organs**: Smooth space of potential

### Implementation Mapping
```
Theory              → Code
─────────────────────────────
Intensities         → field.intensities (Map)
Flows               → field.flows (Array)
Deterritorialize    → abstractMachine.deterritorialize()
Stratify            → abstractMachine.stratify()
Smooth (BwO)        → abstractMachine.smooth()
```

## Next Steps

### Priority 1: More Cookie-Style Snacks
- Use the proven formula
- Physical metaphors for abstract concepts
- Immediate, visceral consequences

### Priority 2: Integrate Abstract Machine
- Make it the navigation system
- Each snack creates intensities
- User paths modify the field

### Priority 3: Archive System
```javascript
// Trajectories not screenshots
{
  version: "ds-v4",
  events: [
    { t: 0, op: "connect", args: {} },
    { t: 320, op: "deterritorialize" }
  ],
  meta: { 
    title: "Session #42",
    intensities: 47,
    duration: 3200
  }
}
```

## Philosophy Summary

**"Make the invisible visible, the abstract concrete, and the boring terrifying."**

Every interface element should:
1. Operate, not represent
2. Process, not display
3. Become, not be

The user doesn't use the interface - they participate in the assemblage.

---

*The interface is not about the machine. The interface IS the machine.*
