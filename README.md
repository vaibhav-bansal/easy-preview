# Easy Preview

A web tool to preview any URL (Figma prototypes, localhost, production sites) in specific device viewports, with shareable links that preserve the viewport settings

## Quick Start

⚠️ **Important**: This app uses ES modules, so it **must be served over HTTP/HTTPS**. Opening `index.html` directly with `file://` protocol will not work.

### Option 1: Python HTTP Server (Recommended)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Option 2: Node.js http-server

```bash
npx http-server -p 8000
```

Then open: `http://localhost:8000`

### Option 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

### Option 4: Vercel (for deployment)

```bash
vercel
```

## Limitations

⚠️ **CSP/X-Frame-Options Restrictions**: Some websites (like `claude.com`, `google.com`, `facebook.com`) have security headers (`Content-Security-Policy: frame-ancestors` or `X-Frame-Options`) that prevent them from being embedded in iframes. This is a security feature to protect users from clickjacking attacks.

**What happens when a site is blocked:**
- The app will detect the restriction and show a helpful error message
- You can click "Open in New Tab" to view the site directly
- This is a browser security feature and cannot be bypassed from client-side code

**Sites that typically work:**
- Figma prototypes
- Most localhost development servers
- Sites that allow embedding (no CSP/X-Frame-Options restrictions)

## Development

No build process required! Just edit the files and refresh your browser.

## Tech Stack

- **HTML/CSS/JS** - Vanilla, no frameworks
- **Tailwind CSS 4.1** - Utility-first CSS framework (loaded via CDN)
- **Inline SVG Icons** - Custom SVG icons for UI elements

## Project Status

- ✅ Phase 1: Basic structure (URL input, device dropdown, preview)
- ⏳ Phase 2: Draggable resize handles
- ⏳ Phase 3: Custom dimensions, orientation toggle
- ⏳ Phase 4: Share functionality
- ⏳ Phase 5: Feedback form
- ⏳ Phase 6: Theme system
- ⏳ Phase 7: Polish

## License

MIT

