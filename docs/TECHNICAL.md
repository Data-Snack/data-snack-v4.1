# 🔧 TECHNICAL DOCUMENTATION

## Project Structure

```
data-snack-v4/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte      # Global layout with Matrix & Terminal
│   │   ├── +page.svelte         # Homepage with boot sequence
│   │   └── kitchen/
│   │       ├── primordial-soup/ # First snack
│   │       ├── cookie-roulette/ # Next implementation
│   │       └── [snack]/         # Dynamic routes for snacks
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Matrix.svelte    # Matrix rain background
│   │   │   ├── DataOrb.svelte   # Animated data visualization
│   │   │   ├── Terminal.svelte  # Hidden terminal interface
│   │   │   ├── Navigation.svelte # Plateau-based navigation
│   │   │   └── Cartography.svelte # Dynamic map
│   │   ├── stores/
│   │   │   ├── user.js          # User state & progress
│   │   │   └── reality.js       # Reality generation state
│   │   └── utils/
│   │       ├── operators.js     # Operator logic
│   │       └── tracking.js      # Analytics implementation
│   └── app.css                  # Global styles (Cyberpunk theme)
```

## Component Architecture

### Core Components

#### `Matrix.svelte`
- Binary rain effect
- Performance optimized with requestAnimationFrame
- Responsive canvas sizing

#### `DataOrb.svelte`
- WebGL/Canvas visualization
- Represents data as living entity
- Reacts to user interactions

#### `Terminal.svelte`
- Hidden developer console (Konami code activated)
- Direct access to Reality Engine
- Debug commands

#### `Navigation.svelte`
- Non-linear, rhizomatic structure
- Plateau-based organization
- Dynamic path generation

#### `Cartography.svelte`
- D3.js powered map
- Shows user journey through snacks
- Community paths overlay

## State Management

### Stores

```javascript
// stores/user.js
export const userStore = writable({
  id: null,
  realitySignature: null,
  completedSnacks: [],
  dataProfile: {},
  operators: []
});

// stores/reality.js
export const realityStore = writable({
  currentPlateau: null,
  activeOperators: [],
  temperature: 273,
  entropy: 0,
  phase: 'STABLE'
});
```

## Visual Design System

### CSS Variables
```css
:root {
  /* Primary Palette */
  --cyan: #00ffff;
  --magenta: #ff00ff;
  --yellow: #ffff00;
  --green: #00ff88;
  --red: #ff0040;
  
  /* System Colors */
  --bg-void: #000000;
  --bg-surface: #0a0a0a;
  --text-primary: #ffffff;
  --text-secondary: #888888;
}
```

### Animation Library
```css
/* Glitch Effect */
@keyframes glitch {
  /* Multi-layer text displacement */
}

/* Neon Glow */
.neon {
  text-shadow: 0 0 10px currentColor;
}

/* Holographic */
.holo {
  background: linear-gradient(45deg, var(--cyan), var(--magenta));
  -webkit-background-clip: text;
}
```

## Performance Optimization

### Critical Strategies
1. **Lazy Loading**: Snacks loaded on-demand
2. **Canvas Optimization**: OffscreenCanvas where possible
3. **CSS Containment**: Isolate heavy animations
4. **Web Workers**: For data processing
5. **Virtual Scrolling**: For large data sets

### Metrics to Track
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Cumulative Layout Shift < 0.1
- Frame Rate: Target 60fps for animations

## Browser APIs Used

### Current
- Canvas API (2D & WebGL)
- Web Storage API
- Performance API
- Intersection Observer

### Planned
- Web Audio API (Sound design)
- WebRTC (Multiplayer snacks)
- WebXR (AR/VR experiments)
- Web Workers (Heavy computation)
- WebAssembly (Performance critical)

## Security Considerations

### Data Handling
- No sensitive data in localStorage
- Sanitize all user inputs
- CORS properly configured
- CSP headers implemented

### Privacy
- Transparent tracking disclosure
- Opt-in for all analytics
- Data deletion on request
- GDPR compliant

## Deployment

### Vercel Configuration
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

### Environment Variables
```env
PUBLIC_SUPABASE_URL=xxx
PUBLIC_SUPABASE_ANON_KEY=xxx
PRIVATE_ANALYTICS_KEY=xxx
```

## Testing Strategy

### Unit Tests
- Component logic
- Operator calculations
- State management

### Integration Tests
- User flows through snacks
- Data persistence
- API interactions

### E2E Tests
- Complete snack experiences
- Cross-browser compatibility
- Performance benchmarks

## Accessibility

### Standards
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Reduced motion options

### Features
- High contrast mode toggle
- Font size controls
- Animation pause button
- Alternative text for visuals

## Development Workflow

### Branch Strategy
```
main
├── develop
│   ├── feature/cookie-roulette
│   ├── feature/scroll-yoga
│   └── feature/sound-design
└── hotfix/critical-bug
```

### Commit Convention
```
feat: Add cookie consent roulette
fix: Resolve matrix rain performance
docs: Update snack catalog
style: Refine neon glow effect
refactor: Optimize operator logic
test: Add reality store tests
chore: Update dependencies
```

## API Design (Future)

### RESTful Endpoints
```
GET    /api/snacks           # List all snacks
GET    /api/snacks/:id       # Get snack details
POST   /api/reality          # Generate reality signature
GET    /api/user/:id/journey # Get user's journey
POST   /api/community/path   # Share path
```

### WebSocket Events
```javascript
// Real-time collaboration
socket.on('operator:selected', (data) => {});
socket.on('reality:shifted', (data) => {});
socket.on('community:pulse', (data) => {});
```

## Performance Monitoring

### Custom Analytics
```javascript
// Track snack engagement
trackEvent('snack:started', { 
  snack: 'cookie-roulette',
  plateau: 'apparate' 
});

// Track operator usage
trackEvent('operator:applied', {
  operator: 'NOISE',
  context: 'primordial-soup'
});

// Track reality generation
trackEvent('reality:generated', {
  signature: 'REALITY_EMNO_xxx',
  operators: ['EMBODIMENT', 'NOISE']
});
```

## Future Integrations

### Phase 1
- Supabase (Auth & Database)
- Vercel Analytics
- Sentry (Error tracking)

### Phase 2
- Stripe (Premium features)
- SendGrid (Email notifications)
- Cloudinary (Media optimization)

### Phase 3
- OpenAI API (AI-generated snacks)
- Twilio (SMS notifications)
- Discord (Community integration)

---

*Code is poetry. Bugs are jazz.*
