# Design — 红旗实验学校 (Braindrop 灵感)

A locked design system for this school website. Inspired by the Braindrop app landing page aesthetic: warm cream + deep navy + indigo-violet accent, serif display headings, minimal text-forward layout.

## Genre

Editorial (编辑型) — clean, text-forward, minimal. Glassmorphism retained per user preference.

## Macrostructure family

- 首页: **Marquee Hero** — 巨大衬线标题 + 简洁副标题
- 内容页 (关于, 指南): **Long Document** — 散文式
- 索引页 (活动): **Catalogue** — 卡片目录
- 联系: **Letter** — 书信风格
- 最新动态: **StackedBooks** — 3D 堆叠书本展示三条最新新闻

## Theme — Braindrop 灵感

| Token | OKLCH | 描述 |
|-------|-------|------|
| `--color-paper` | oklch(97% 0.012 80) | 暖奶油色背景 |
| `--color-paper-2` | oklch(94% 0.008 80) | 稍深暖调 |
| `--color-ink` | oklch(15% 0.02 270) | 深海军蓝文字 |
| `--color-ink-2` | oklch(38% 0.025 270) | 次级文字 |
| `--color-accent` | oklch(52% 0.18 280) | Braindrop 靛紫色 |
| `--color-accent-deep` | oklch(32% 0.20 285) | 深紫 / 页脚背景 |
| `--color-card` | oklch(99% 0.005 80) | 卡片白色 |

### Dark mode

- `--color-paper`: oklch(10% 0.008 275)
- `--color-ink`: oklch(93% 0.008 80)
- `--color-accent`: oklch(65% 0.16 280)

## Typography

- Display: `"Noto Serif SC", Georgia, serif` — 思源宋体 (serif, 如 Braindrop 的 new-spirit)
- Body: `"Noto Sans SC", "Figtree", "Inter", system-ui, sans-serif`
- Mono: `"JetBrains Mono", monospace`
- H1: `clamp(2.5rem, 1.25rem + 4vw, 5.625rem)`, line-height: 0.95, tracking: -0.005em

## Spacing

4-point named scale (`--space-*` tokens). Same as previous design.

## Motion

- framer-motion fade-up + slide reveals
- Hero parallax scroll
- Smooth scroll (Lenis)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Reduced-motion: collapse to opacity-only ≤ 150ms

## Key visual features

- **SVG curve footer divider** — Braindrop-style wave separating content from dark footer
- **Dark purple footer** (`--color-accent-deep`) with white text
- **StackedBooks** — 3 CSS 3D books at page bottom, linked to 3 latest news
- **Minimal nav** — shield badge + school name left, clean links right
- **Glass nav** retained per user preference

## CTA voice

- Primary: filled accent purple, 6px radius, white text, hover shadow
- Secondary: ghost with border, ink text, hover light purple tint
