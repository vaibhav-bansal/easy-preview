# Easy Preview — Project Plan

A web tool to preview any URL (Figma prototypes, localhost, production sites) in specific device viewports, with shareable links that preserve the viewport settings.

---

## Project Decisions

| Decision | Choice |
|----------|--------|
| **App Name** | Easy Preview |
| **Hosting** | Vercel (code on GitHub) |
| **Theme** | System default + manual toggle |
| **Device Frames** | Nice-to-have (secondary) |
| **Draggable Resize** | Priority feature ✓ |

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Structure | Vanilla HTML |
| Styling | Tailwind CSS (via CDN) |
| Components | Material Web (`@material/web`) |
| Icons | Material Symbols (Google Fonts CDN) |
| Fonts | Google Fonts (Roboto) |
| Logic | Vanilla JavaScript |

**No build process. No framework. Just static files.**

---

## Features

### 1. URL Input
- Text input to paste any URL
- Load button to load URL in preview iframe
- Basic URL validation

### 2. Device Selection
| Device | Dimensions |
|--------|------------|
| Android Compact | 412 × 917 |
| Android Medium | 700 × 840 |
| iPhone SE | 320 × 568 |
| iPhone 16 | 393 × 852 |
| iPhone 16 Pro | 402 × 874 |
| iPhone 16 Pro Max | 440 × 956 |
| iPhone 16 Plus | 430 × 932 |
| iPad Mini | 744 × 1133 |
| iPad Pro 11" | 834 × 1194 |
| Custom | User-defined W × H |

### 3. Draggable Viewport Resize (Priority)
- Drag handles on edges/corners to resize viewport
- Live dimension display updates as you drag
- Device dropdown switches to "Custom" when manually resized
- Minimum size constraint (200×300)

### 4. Custom Dimensions
- Editable width (W) and height (H) number inputs
- Auto-populates when device is selected
- Syncs with drag resize

### 5. Orientation Toggle
- Portrait/Landscape toggle button
- Swaps W and H values

### 6. Preview Area
- Centered iframe displaying the loaded URL
- Scrollable if viewport exceeds screen
- Subtle border/shadow to show bounds

### 7. Share/Export
- **Generate Link**: Creates URL with encoded parameters
- **Copy Link**: One-click copy to clipboard
- **Copy Embed Code**: Generates `<iframe>` snippet
- **Full-screen view link**: Direct link without toolbar

### 8. Theme System
- System default (follows OS preference)
- Manual toggle: System → Light → Dark → System
- Preference stored in localStorage

### 9. Header Actions
- **GitHub Icon**: Links to repository ([github.com/vaibhav-bansal/easy-preview](https://github.com/vaibhav-bansal/easy-preview))
- **Feedback Button**: Opens feedback form modal
- **Theme Toggle**: Light/Dark/System toggle

### 10. Feedback Form
A modal form to collect user feedback.

| Field | Type | Required | Details |
|-------|------|----------|---------|
| Full Name | Text input | ✓ | User's name |
| Email | Email input | ✓ | Contact email |
| Star Rating | 1-5 stars | ✓ | Overall experience rating |
| Category | Dropdown | ✓ | See categories below |
| Message | Textarea | ✓ | Dynamic placeholder based on category |

**Feedback Categories:**
| Category | Placeholder Text |
|----------|------------------|
| General Query | "Ask us anything or share your thoughts..." |
| Feature Request | "Describe the feature you'd like to see..." |
| Collaboration | "Tell us how you'd like to contribute..." |
| Bug Report | "Describe what's not working correctly..." |

**Submission:** Form data can be sent to a service like Formspree, Google Forms, or stored locally for MVP.

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Easy Preview                    [GitHub] [Feedback] [Theme]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────┐  ┌──────┐              │
│  │ Enter URL...                            │  │ Load │              │
│  └─────────────────────────────────────────┘  └──────┘              │
│                                                                     │
│  ┌──────────────────┐  W ┌──────┐  H ┌──────┐  [⟳] [📋 Share]      │
│  │ iPhone 16 Pro  ▼ │    │ 402  │    │ 874  │                       │
│  └──────────────────┘    └──────┘    └──────┘                       │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────────┐                          │
│                    │                     │                          │
│                    │                     │                          │
│                    │    PREVIEW IFRAME   │                          │
│                    │    (402 × 874)      │  ← Draggable edges       │
│                    │                     │                          │
│                    │                     │                          │
│                    └─────────────────────┘                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Share Dialog (Modal)

```
┌────────────────────────────────────────────────┐
│  Share Preview                           ✕     │
├────────────────────────────────────────────────┤
│                                                │
│  Preview Link                                  │
│  ┌──────────────────────────────────┐ [Copy]   │
│  │ https://easypreview.app/?url=... │          │
│  └──────────────────────────────────┘          │
│                                                │
│  Embed Code                                    │
│  ┌──────────────────────────────────┐ [Copy]   │
│  │ <iframe src="..." width="402"   │          │
│  │  height="874"></iframe>         │          │
│  └──────────────────────────────────┘          │
│                                                │
│  ┌────────────────────────────────────────┐    │
│  │ 🔗 Open Full-Screen Preview            │    │
│  └────────────────────────────────────────┘    │
│                                                │
└────────────────────────────────────────────────┘
```

---

## Feedback Dialog (Modal)

```
┌────────────────────────────────────────────────┐
│  Send Feedback                           ✕     │
├────────────────────────────────────────────────┤
│                                                │
│  Full Name *                                   │
│  ┌──────────────────────────────────────────┐  │
│  │ Enter your name                          │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  Email *                                       │
│  ┌──────────────────────────────────────────┐  │
│  │ Enter your email                         │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  Rating *                                      │
│  ☆ ☆ ☆ ☆ ☆  (1-5 stars, clickable)            │
│                                                │
│  Category *                                    │
│  ┌──────────────────────────────────────────┐  │
│  │ Select category                        ▼ │  │
│  └──────────────────────────────────────────┘  │
│  Options: General Query | Feature Request |   │
│           Collaboration | Bug Report          │
│                                                │
│  Message *                                     │
│  ┌──────────────────────────────────────────┐  │
│  │ (placeholder changes based on category) │  │
│  │                                          │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│             [Cancel]  [Submit Feedback]        │
│                                                │
└────────────────────────────────────────────────┘
```

---

## URL Structure for Sharing

```
https://easy-preview.vercel.app/?url=<encoded_url>&device=<device_id>&w=<width>&h=<height>&orientation=<portrait|landscape>
```

**Example:**
```
https://easy-preview.vercel.app/?url=https%3A%2F%2Ffigma.com%2Fproto%2Fxxx&device=iphone16promax&w=440&h=956&orientation=portrait
```

---

## File Structure

```
easy-preview/
├── index.html              ← Main app
├── css/
│   └── styles.css          ← Custom styles + drag handles
├── js/
│   ├── app.js              ← Main logic
│   ├── devices.js          ← Device presets
│   ├── resizer.js          ← Draggable resize logic
│   ├── theme.js            ← Dark/light/system theme
│   └── feedback.js         ← Feedback form logic
├── embed.html              ← Minimal full-screen view
├── plan.md                 ← This plan document
├── README.md
├── .gitignore
└── vercel.json             ← Vercel config (if needed)
```

---

## Feature Priority

| Priority | Feature |
|----------|---------|
| 🔴 Must have | URL input, device dropdown, preview iframe |
| 🔴 Must have | Draggable resize handles |
| 🔴 Must have | Custom W×H inputs (sync with drag) |
| 🔴 Must have | Share link generation + copy |
| 🔴 Must have | GitHub repository link |
| 🔴 Must have | Feedback form |
| 🟡 Should have | Orientation toggle |
| 🟡 Should have | Embed code generation |
| 🟡 Should have | Dark/Light/System theme |
| 🟢 Nice to have | Device bezels/frames |
| 🟢 Nice to have | Full-screen embed view |

---

## Development Phases

| Phase | Features | Effort |
|-------|----------|--------|
| **Phase 1** | Basic structure: URL input, device dropdown, iframe, load button, header with GitHub link | ~1.5 hr |
| **Phase 2** | Draggable resize handles with live dimension sync | ~2 hr |
| **Phase 3** | Custom dimension inputs (W×H), orientation toggle | ~1 hr |
| **Phase 4** | Share modal: generate link, copy link, copy embed code | ~1.5 hr |
| **Phase 5** | Feedback form modal with all fields + form submission | ~1.5 hr |
| **Phase 6** | Theme system (system/light/dark) with toggle | ~1 hr |
| **Phase 7** | Polish: responsive layout, edge cases, README | ~1 hr |

**Total estimated: ~9.5 hours**

---

## User Flows

### Flow 1: Basic Preview
1. User opens Easy Preview
2. Pastes Figma prototype URL
3. Selects "iPhone 16 Pro Max" from dropdown
4. Clicks "Load"
5. Sees preview at 440×956

### Flow 2: Drag to Resize
1. User has preview loaded
2. Drags right edge of viewport
3. Width updates in real-time
4. Device dropdown changes to "Custom"
5. W input field shows new value

### Flow 3: Share with Team
1. User has preview loaded
2. Clicks "Share" button
3. Modal opens with generated link
4. Clicks "Copy Link"
5. Pastes in Slack/Notion/docs
6. Teammate opens link → sees exact same view

### Flow 4: Embed in Documentation
1. User clicks "Share"
2. Copies "Embed Code"
3. Pastes `<iframe>` in internal wiki/Notion
4. Documentation shows live preview at correct viewport

### Flow 5: Submit Feedback
1. User clicks "Feedback" icon in header
2. Feedback modal opens
3. User fills in:
   - Full Name
   - Email
   - Star rating (clicks 1-5 stars)
   - Category (selects from dropdown)
   - Message (placeholder updates based on category)
4. Clicks "Submit Feedback"
5. Form is submitted (via Formspree or similar)
6. Success message shown, modal closes

### Flow 6: View GitHub Repository
1. User clicks GitHub icon in header
2. Opens https://github.com/vaibhav-bansal/easy-preview in new tab

---

## Technical Components

| Component | Library/Approach |
|-----------|------------------|
| Device dropdown | `<md-select>` from Material Web |
| URL input | `<md-outlined-text-field>` |
| Dimension inputs | `<md-outlined-text-field type="number">` |
| Load button | `<md-filled-button>` |
| Share button | `<md-outlined-button>` |
| Orientation toggle | `<md-icon-button>` |
| Share modal | `<md-dialog>` |
| Copy buttons | `<md-filled-tonal-button>` + `navigator.clipboard` |
| Theme toggle | `<md-icon-button>` |
| GitHub link | `<md-icon-button>` with Material Symbols icon |
| Feedback button | `<md-icon-button>` or `<md-outlined-button>` |
| Feedback modal | `<md-dialog>` |
| Feedback form fields | `<md-outlined-text-field>`, `<md-select>` |
| Star rating | Custom component or emoji/icon based |
| Form submission | Formspree / Google Forms / mailto fallback |
| Layout | Tailwind CSS utilities |
| Preview frame | Native `<iframe>` |
| Drag handles | Custom CSS + vanilla JS |

---

## Deployment

- **Repository**: GitHub
- **Hosting**: Vercel (auto-deploy on push to main)
- **Domain**: `easy-preview.vercel.app` (or custom domain later)

No build step needed — Vercel serves static files directly.

---

## Notes

- Figma prototype URLs confirmed to work in iframes ✓
- This is a static site — no backend required
- All logic runs client-side
- Shareable links encode all settings in URL parameters
- GitHub repository: https://github.com/vaibhav-bansal/easy-preview
- Feedback form submission options:
  - **Formspree** (free tier: 50 submissions/month) — easiest setup
  - **Google Forms** (free, unlimited) — embed or redirect
  - **mailto:** link — fallback, opens email client

