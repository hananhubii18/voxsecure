# 🗳️ VoteSecure — Digital Democracy Platform
### General Election 2026 | Srinagar Constituency | Front-End Simulation

---

## 📌 Project Overview

**VoteSecure** is a creative, fully interactive front-end simulation of a real-world online voting system. Built entirely with **HTML, CSS, JavaScript, and jQuery**, it replicates the complete lifecycle of a democratic election — from voter registration to live result visualization — in a single, self-contained HTML file.

The system is designed with a modern editorial aesthetic, smooth animations, robust client-side validation, and a role-based access control system that restricts administrative functions to authorised personnel only.

---

## 🚀 How to Run

1. Download `voting-system.html`
2. Open it in any modern browser — Chrome, Firefox, Edge, or Safari
3. No installation, no build tools, no internet connection required after the fonts load

---

## 🗺️ Application Flow

```
Home → Register → Vote → Results
                              ↑
                         🔐 Admin Login (separate route)
```

The application has **5 pages**, navigated via the top header tabs:

| Page | Purpose |
|---|---|
| Home | Landing page with live vote count stats |
| Register | Voter registration with full validation |
| Vote | Cast a single vote for one candidate |
| Results | Live results, charts, and winner display |
| 🔐 Admin | Restricted login portal for administrators only |

---

## ✅ Features

### 1. Voter Registration
- **5 validated fields**: Full Name, Date of Birth, Voter ID, Mobile Number, Email
- **Age check**: Voter must be at least 18 years old
- **Voter ID validation**: Must follow the format `ABC1234567` — exactly 3 uppercase letters + 7 digits
- **Mobile validation**: Must be a valid Indian 10-digit number starting with 6–9
- **Duplicate detection**: Re-registering with the same Voter ID skips to the voting page
- Auto-uppercase formatting on the Voter ID input field
- Inline red error messages per field with border highlighting
- Progress step bar updates as the user moves through the flow

### 2. Voting Page
- 5 candidate cards in a responsive grid layout
- Each card shows: party colour banner, initials avatar, party name, candidate name, biography, and policy tags
- Smooth hover lift animation and gold shimmer overlay on cards
- **One vote per voter**: Once a vote is cast, all other vote buttons are disabled
- Confirmation modal before the vote is finalised — with a Cancel option
- Voted card turns green with a ✓ badge
- A banner appears confirming which candidate received the vote
- `votePop` click animation on the Vote button

### 3. Results Page
- **Winner card** with a pulsing gold border highlighting the current leader
- Full ranked results list with animated progress bars and live percentages
- Total votes counter
- ★ **Unique Element** — Live Voter Turnout Donut Chart *(see below)*
- **Refresh Results** button to re-render the latest tally
- Admin Control Panel section — **only visible to logged-in administrators**

### 4. 🔐 Admin-Only Reset System

> **The Reset Election function is exclusively accessible to administrators. Regular voters and candidates have zero visibility of this feature.**

#### How it works:

| Step | Action |
|---|---|
| 1 | Admin clicks the **🔐 Admin** tab in the navigation bar |
| 2 | A dedicated **Admin Login Page** loads — separate from all voter-facing pages |
| 3 | Admin enters username and password |
| 4 | Wrong credentials trigger a **shake animation** and error message |
| 5 | Correct credentials start an **admin session** |
| 6 | A red **"Admin Active" pulsing pill** appears in the header |
| 7 | The **Admin Control Panel** with Reset button appears inside the Results page |
| 8 | Admin can reset all votes and registrations from the Control Panel |
| 9 | Clicking the pill or the nav tab **logs out** the admin — the panel disappears immediately |

#### Security layers:
- The Reset button is **not rendered in the DOM** for regular users — it only appears inside the `admin-dashboard` panel which requires a `.visible` class set by JS session state
- The Reset button handler has a **hard JS guard**: `if (!isAdminLoggedIn) return` — even if someone manipulates the DOM, the function will not execute without an active session
- The Admin tab is visually distinct (red-tinted) and never gets highlighted as an active voter step

**Demo credentials:**
```
Username : admin
Password : admin123
```

---

## ★ Unique Element: Live Voter Turnout Donut Chart

> This feature is not present in any earlier version of this project and is the designated unique element.

Located on the **Results Page**, the **Live Voter Turnout Donut Chart** is a pure SVG-based animated circular chart that visualises participation in real time.

### Donut Chart Segments

| Segment | Colour | Meaning |
|---|---|---|
| Gold arc | `#c9a84c` | Voters who have cast their vote |
| Blue arc | `#1b4f8a` | Registered voters who have not yet voted |
| Background ring | `#ede9de` | Represents the full registered pool |

### How it works
- Rendered using raw `<svg>` with `stroke-dasharray` and `stroke-dashoffset` on `<circle>` elements — no external chart library
- A CSS transition (`1.2s cubic-bezier`) animates the arcs smoothly on every refresh
- The centre displays the **turnout percentage**: votes cast ÷ registered voters × 100
- A legend alongside the donut shows exact counts for: Voted, Total Registered, and Not Yet Voted

### Companion: Vote Share Bar Chart
A horizontal animated bar chart sits beside the donut chart and shows each candidate's proportional share of the total vote. Each candidate has a distinct colour, and bars animate in on load with a smooth fill transition.

Together, these two charts form a **civic dashboard** — an at-a-glance overview of both participation rate and candidate standings that updates live on every refresh.

---

## 🔑 Voter ID Format


| Rule | Detail |
|---|---|
| Total length | Exactly 10 characters |
| Format | 3 uppercase letters + 7 digits |
| Valid examples | `ABC1234567`, `JKL9876543`, `XYZ0000001` |
| Input behaviour | Auto-converts to uppercase, strips invalid characters |
| Validation regex | `/^[A-Z]{3}\d{7}$/` |

---

## 💾 Data Storage

All data is stored in the browser's **LocalStorage** — nothing is ever transmitted to any server.

| Key | Type | Contents |
|---|---|---|
| `vs_voters` | Array | Registered voter objects (name, dob, voterId, mobile, email, id) |
| `vs_votes` | Object | Maps Voter ID → Candidate ID for each cast vote |

---

## 🎨 Design System

| Element | Choice |
|---|---|
| Display font | Bebas Neue — editorial, high-impact headers |
| Body font | DM Sans — clean, readable body copy |
| Monospace font | Space Mono — labels, codes, badges |
| Primary palette | Ink `#0a0a0f`, Paper `#f5f2eb`, Gold `#c9a84c` |
| Accent colours | Red `#c0392b`, Green `#1a7a4a`, Blue `#1b4f8a` |
| Aesthetic | Editorial / newspaper-meets-brutalism |
| Background | Paper texture with SVG noise overlay |
| Animations | CSS keyframes — fadeUp, scaleIn, pulse-border, shake, votePop, blink |

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Semantic structure, single-file architecture |
| CSS3 | Custom properties, Grid, Flexbox, keyframe animations |
| JavaScript ES6+ | Validation, LocalStorage, DOM manipulation, session state |
| jQuery 3.7.1 (CDN) | Event handling, dynamic DOM updates |
| SVG | Donut chart rendering (unique element) |
| Google Fonts | Bebas Neue, DM Sans, Space Mono |

---



## ⚠️ Simulation Disclaimer

> This is a **front-end simulation only**, built for educational and portfolio purposes.

All data lives in the browser's LocalStorage and is never sent anywhere. A real-world, legally compliant voting system would require:

- Secure backend server with an encrypted, audited database
- Server-side session management and cryptographic authentication
- End-to-end encrypted vote transmission
- Independent election observers and immutable audit trails
- Paper ballot backup systems
- Full compliance with national election laws and cybersecurity regulations

---

*VoteSecure — Built for Educational Purposes | Data stored locally | © 2026*
