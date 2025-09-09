# 🧠 PERZEPT-ENGINE INTEGRATION

## ✅ **Was wurde implementiert:**

### 1. **Zentrale Perzept-Engine** (`/src/lib/stores/perzeptEngine.js`)
- **DataPerzept Klasse** - Repräsentiert einzelne Daten-Perzepte
- **PerzeptEngine Store** - Globaler Store für alle Perzepte
- **Cross-Snack Communication** - Perzepte können zwischen Snacks übertragen werden
- **Auto-Cleanup** - Alte Perzepte werden automatisch entfernt
- **Derived Stores** - totalIntensity, activeSnacks, dominantPerzept

### 2. **Snack-Spezifische Perzept-Generierung**

#### Cookie Roulette
```javascript
// Generiert Perzepte bei:
- danger: Beim Trigger-Pull (Gefahrenlevel)
- surveillance: Bei Tracker-Aktivierung (Überwachungslevel)
- anxiety: Beim Cylinder-Spin (Angstwert)
```

#### Primordial Soup
```javascript
// Generiert Perzepte bei:
- emergence: Bei Operator-Auswahl (Komplexität)
- mixture: Beim Mischen von Operatoren (Anzahl)
- transformation: Bei der Katalyse (Veränderung)
```

### 3. **Perzept-Visualisierung** (`/src/lib/components/PerzeptVisualizer.svelte`)
- **Echtzeit-Visualisierung** aller aktiven Perzepte
- **Partikel-System** mit Trails und Glow-Effekten
- **Verbindungslinien** zwischen Perzepten desselben Snacks
- **Live-Statistiken** (Total Intensity, Active Snacks, Dominant Perzept)
- **Canvas-basiert** für Performance

### 4. **Homepage-Integration**
- Perzept-Visualizer ist jetzt auf der Homepage sichtbar
- Zeigt Live-Datenflüsse zwischen allen Snacks
- User können sehen, wie ihre Aktionen das System beeinflussen

## 🎯 **Wie es funktioniert:**

### Perzept-Lebenszyklus
1. **Generierung** - Snack erzeugt Perzept bei User-Interaktion
2. **Update** - Perzept-Werte ändern sich basierend auf Aktivität
3. **Visualisierung** - Perzepte werden als Partikel dargestellt
4. **Transfer** - Perzepte können zwischen Snacks wandern
5. **Decay** - Perzepte verlieren über Zeit an Intensität
6. **Cleanup** - Alte/schwache Perzepte werden entfernt

### Perzept-Eigenschaften
```javascript
{
  id: Unique identifier
  source: Datenquelle (z.B. "danger", "rhythm")
  type: Kategorie (z.B. "risk", "flow")
  snack: Ursprungs-Snack
  intensity: 0-1 (Stärke des Perzepts)
  affect: Kumulative Veränderung
  vector: {x, y} (Bewegungsrichtung)
  trace: [] (Historie der Werte)
  decay: 0.95 (Abbau-Rate)
}
```

## 🚀 **Nächste Schritte:**

### 1. **Weitere Snack-Integration**
- [ ] Scroll Yoga - Rhythm & Harmony Perzepte
- [ ] Error Oracle - Glitch & Prophecy Perzepte
- [ ] Neue Snacks automatisch mit Perzept-Support

### 2. **Advanced Features**
- [ ] **Perzept-Resonanz** - Verstärkung bei ähnlichen Perzepten
- [ ] **Perzept-Interferenz** - Gegensätzliche Perzepte schwächen sich
- [ ] **Perzept-Ketten** - Sequenzen erzeugen neue Effekte
- [ ] **Perzept-Archive** - Speichern von Sessions

### 3. **Multi-User Perzepts**
- [ ] Shared Perzept Field - Alle User teilen einen Raum
- [ ] Perzept Trading - User können Perzepte austauschen
- [ ] Collective Patterns - Emergente Muster aus vielen Usern

### 4. **External Data Sources**
- [ ] Weather API → Environment Perzepts
- [ ] News API → Zeitgeist Perzepts
- [ ] Crypto Prices → Volatility Perzepts
- [ ] Social Media → Viral Perzepts

## 💡 **Verwendung in neuen Snacks:**

```javascript
// In jedem neuen Snack:
import { snackPerzepts } from '$lib/stores/perzeptEngine.js';

// Perzept generieren:
snackPerzepts.mySnack = {
  myMetric: (value) => perzeptEngine.add('myMetric', 'type', 'my-snack', value)
};

// Bei User-Interaktion:
function onUserAction() {
  snackPerzepts.mySnack.myMetric(measurementValue);
}
```

## 🎨 **Philosophischer Hintergrund:**

Die Perzept-Engine macht **Datenflüsse sichtbar und spürbar**. Jede User-Interaktion erzeugt Wellen im Datenfeld, die sich ausbreiten und andere Bereiche beeinflussen.

**"Daten sind nicht isoliert - sie resonieren, interferieren und transformieren sich gegenseitig."**

Die Engine ist inspiriert von:
- **Deleuze & Guattari** - Rhizomatische Verbindungen
- **Karen Barad** - Intra-action und Entanglement
- **Gilbert Simondon** - Transduktion und Individuation

## 📊 **Impact:**

- User sehen ihre **digitale Aura** in Echtzeit
- Snacks sind nicht mehr isoliert, sondern **kommunizieren**
- Das System wird zum **lebenden Organismus**
- Jede Session ist **einzigartig und unreproducible**

---

**Die Perzept-Engine ist der Herzschlag von Data Snack V4!** 🌐
