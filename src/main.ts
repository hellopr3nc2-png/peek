/* ───────────────────────────────────────────────
   Peek — Main Application Logic
   ─────────────────────────────────────────────── */

// Marked is loaded via CDN as a UMD global
declare const marked: {
  parse: (text: string, options?: Record<string, unknown>) => string;
};

// ── Types ───────────────────────────────────────
interface AppState {
  markdown: string;
  theme: 'light' | 'dark';
}

// ── DOM References ──────────────────────────────
const splash = document.getElementById('splash') as HTMLDivElement;
const app = document.getElementById('app') as HTMLDivElement;
const editor = document.getElementById('editor') as HTMLTextAreaElement;
const preview = document.getElementById('preview') as HTMLDivElement;
const emptyState = document.getElementById('empty-state') as HTMLDivElement;
const editorMeta = document.getElementById('editor-meta') as HTMLSpanElement;
const previewMeta = document.getElementById('preview-meta') as HTMLSpanElement;
const btnCopy = document.getElementById('btn-copy') as HTMLButtonElement;
const btnDownload = document.getElementById('btn-download') as HTMLButtonElement;
const btnTheme = document.getElementById('btn-theme') as HTMLButtonElement;
const iconSun = document.getElementById('icon-sun') as SVGElement;
const iconMoon = document.getElementById('icon-moon') as SVGElement;
const toast = document.getElementById('toast') as HTMLDivElement;
const toastMessage = document.getElementById('toast-message') as HTMLSpanElement;
const resizer = document.getElementById('resizer') as HTMLDivElement;

// ── Constants ───────────────────────────────────
const STORAGE_KEY = 'peek_state';
const SPLASH_DURATION = 2000;

// ── Default Markdown (Welcome) ──────────────────
const DEFAULT_MARKDOWN = `# Welcome to Peek

Peek is a **lightweight**, *elegant* Markdown editor with live preview.

## Features

- \u2728 Live preview as you type
- \U0001F317 Light & Dark mode
- \U0001F4BE Auto-save to localStorage
- \U0001F4CB Copy & Download
- \U0001F3A8 Beautiful typography

## Try it out

### Lists

1. First ordered item
2. Second ordered item
   - Nested unordered item
   - Another nested item
3. Third ordered item

### Task Lists

- [x] Write some Markdown
- [x] See it preview live
- [ ] Share with friends

### Code

Inline code: \`console.log("Hello, Peek!")\`

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, ${name}!\`;
}

console.log(greet("Peek"));
\`\`\`

### Blockquote

> "Simplicity is the ultimate sophistication."
> — Leonardo da Vinci

### Table

| Feature | Status |
|---------|--------|
| Live Preview | \u2705 Ready |
| Dark Mode | \u2705 Ready |
| Auto-save | \u2705 Ready |

### Horizontal Rule

---

### Link

[Visit Marked.js](https://marked.js.org)

Start typing above to edit! \U0001F446
`;

// ── State ───────────────────────────────────────
let state: AppState = {
  markdown: '',
  theme: 'light',
};

// ── Theme Management ──────────────────────────
function detectSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark'): void {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);

  if (theme === 'dark') {
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
  } else {
    iconSun.style.display = 'block';
    iconMoon.style.display = 'none';
  }

  saveState();
}

function toggleTheme(): void {
  applyTheme(state.theme === 'light' ? 'dark' : 'light');
}

// ── Markdown Rendering ──────────────────────────
function renderMarkdown(): void {
  const raw = editor.value;
  state.markdown = raw;

  if (raw.trim().length === 0) {
    preview.innerHTML = '';
    emptyState.classList.remove('hidden');
    previewMeta.textContent = 'Empty';
  } else {
    try {
      const html = marked.parse(raw, {
        gfm: true,
        breaks: true,
        headerIds: false,
      });
      preview.innerHTML = html;
      emptyState.classList.add('hidden');
      previewMeta.textContent = 'Live';
    } catch (err) {
      preview.innerHTML = `<p style="color: var(--fg-muted);">Preview error: ${err}</p>`;
      previewMeta.textContent = 'Error';
    }
  }

  updateMeta();
  saveState();
}

function updateMeta(): void {
  const text = editor.value;
  const words = text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  editorMeta.textContent = `${words} word${words !== 1 ? 's' : ''} \u00B7 ${chars} char${chars !== 1 ? 's' : ''}`;
}

// ── Auto-save ───────────────────────────────────
function saveState(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      return {
        markdown: parsed.markdown ?? '',
        theme: parsed.theme ?? detectSystemTheme(),
      };
    }
  } catch {
    // Silently fail
  }
  return {
    markdown: DEFAULT_MARKDOWN,
    theme: detectSystemTheme(),
  };
}

// ── Clipboard ───────────────────────────────────
function copyMarkdown(): void {
  const text = editor.value;
  if (!text) {
    showToast('Nothing to copy');
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied!');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Copied!');
  });
}

// ── Download ────────────────────────────────────
function downloadMarkdown(): void {
  const text = editor.value;
  if (!text.trim()) {
    showToast('Nothing to download');
    return;
  }

  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Downloaded!');
}

// ── Toast ───────────────────────────────────────
let toastTimeout: number | null = null;

function showToast(message: string): void {
  toastMessage.textContent = message;
  toast.classList.add('visible');
  toast.setAttribute('aria-hidden', 'false');

  if (toastTimeout) {
    window.clearTimeout(toastTimeout);
  }

  toastTimeout = window.setTimeout(() => {
    toast.classList.remove('visible');
    toast.setAttribute('aria-hidden', 'true');
  }, 2000);
}

// ── Resizer ─────────────────────────────────────
let isResizing = false;
let startX = 0;
let startWidth = 0;

function initResizer(): void {
  const panelEditor = document.querySelector('.panel-editor') as HTMLDivElement;
  if (!panelEditor || !resizer) return;

  resizer.addEventListener('mousedown', (e: MouseEvent) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = panelEditor.offsetWidth;
    resizer.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    const containerWidth = (document.querySelector('.main') as HTMLDivElement).offsetWidth;
    const newWidth = Math.max(200, Math.min(containerWidth - 200, startWidth + dx));
    const percent = (newWidth / containerWidth) * 100;
    panelEditor.style.flex = `0 0 ${percent}%`;
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      resizer.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}

// ── Splash Screen ───────────────────────────────
function dismissSplash(): void {
  splash.classList.add('hidden');
  splash.setAttribute('aria-hidden', 'true');
  app.classList.add('visible');
  app.setAttribute('aria-hidden', 'false');
  editor.focus();
}

// ── Keyboard Shortcuts ──────────────────────────
function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Tab' && document.activeElement === editor) {
    e.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const spaces = '  ';
    editor.value = editor.value.substring(0, start) + spaces + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + spaces.length;
    renderMarkdown();
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    downloadMarkdown();
  }

  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    copyMarkdown();
  }
}

// ── Initialization ──────────────────────────────
function init(): void {
  state = loadState();
  applyTheme(state.theme);
  editor.value = state.markdown;
  renderMarkdown();

  editor.addEventListener('input', renderMarkdown);
  btnCopy.addEventListener('click', copyMarkdown);
  btnDownload.addEventListener('click', downloadMarkdown);
  btnTheme.addEventListener('click', toggleTheme);
  document.addEventListener('keydown', handleKeydown);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  initResizer();
  window.setTimeout(dismissSplash, SPLASH_DURATION);
}

// ── Boot ──────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
