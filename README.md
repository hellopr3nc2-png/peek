# Peek

> A beautiful, lightweight Markdown editor with live preview.

![Peek Screenshot](screenshots/screenshot.png)

Peek is a minimal, elegant, and fast Markdown editor that runs entirely in your browser. No backend, no accounts, no friction — just write and see your Markdown come to life.

## ✨ Features

- **Live Preview** — See your Markdown render instantly as you type
- **Split-Screen Layout** — Editor on the left, preview on the right (resizable on desktop)
- **Light & Dark Mode** — Automatic system preference detection with manual toggle
- **Auto-save** — Your work is automatically saved to localStorage
- **Copy & Download** — One-click copy to clipboard or download as `.md`
- **Beautiful Typography** — JetBrains Mono for editing, Inter for preview
- **Full GFM Support** — Headings, bold, italic, strikethrough, blockquotes, lists, task lists, tables, code blocks, horizontal rules, links, and images
- **Keyboard Friendly** — Tab inserts spaces, Ctrl/Cmd+S to download, Ctrl/Cmd+Shift+C to copy
- **Responsive Design** — Works beautifully on desktop and mobile
- **Zero Dependencies** — Pure client-side, no backend required

## 📸 Screenshots

| Light Mode | Dark Mode |
|------------|-----------|
| ![Light](screenshots/light.png) | ![Dark](screenshots/dark.png) |

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/peek.git
cd peek

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🛠 Development

```bash
# Run the dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## 📦 Build

The production build is output to the `dist/` directory:

```bash
npm run build
```

You can then serve the `dist/` folder with any static file server.

## 🏗 Tech Stack

| Technology | Purpose |
|-----------|---------|
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Vite](https://vitejs.dev/) | Next-gen build tool |
| [Marked.js](https://marked.js.org/) | Markdown parser (loaded via CDN) |
| [Inter](https://rsms.me/inter/) | Preview typography |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | Editor typography |

## 📁 Project Structure

```
peek/
├── index.html              # Entry HTML
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── src/
    ├── main.ts             # Application logic
    ├── style.css           # Global styles
    ├── vite-env.d.ts       # Vite type declarations
    ├── components/         # UI components (extensible)
    ├── utils/              # Utility functions (extensible)
    └── assets/             # Static assets
```

## 🎨 Design Philosophy

Peek is inspired by the design language of [Linear](https://linear.app), [Raycast](https://raycast.com), [Vercel](https://vercel.com), and [Notion](https://notion.so):

- **Whitespace** — Generous spacing for readability
- **Subtlety** — Animations are gentle, never jarring
- **Glassmorphism** — Frosted glass header for depth
- **Typography** — Excellent font choices with careful line-height tuning
- **Micro-interactions** — Every button press, every hover, every transition is intentional

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Insert 2 spaces (in editor) |
| `Ctrl/Cmd + S` | Download as `document.md` |
| `Ctrl/Cmd + Shift + C` | Copy Markdown to clipboard |

## 📝 License

MIT © [Your Name]
