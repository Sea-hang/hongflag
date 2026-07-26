# Design — 红旗实验学校 (蓝色 + 浅红 + 米白)

A locked design system for this school website. Blue primary + light red/pink accent + warm cream background, serif display headings, minimal text-forward layout.

## Genre

Editorial (编辑型) — clean, text-forward, minimal. Glassmorphism retained.

## Macrostructure family

- 首页: **Marquee Hero** — 巨大衬线标题 + 简洁副标题
- 内容页 (关于, 指南): **Long Document** — 散文式
- 索引页 (活动): **Catalogue** — 卡片目录
- 联系: **Letter** — 书信风格
- 最新动态: **StackedBooks** — 3D 堆叠书本（桌面端）/ 平面列表（手机端）

## Theme — 蓝 + 浅红 + 米白

| Token | OKLCH | 描述 |
|-------|-------|------|
| `--color-paper` | oklch(97% 0.012 85) | 米白背景 |
| `--color-paper-2` | oklch(94% 0.008 85) | 稍深米白 |
| `--color-ink` | oklch(12% 0.025 260) | 深蓝黑文字 |
| `--color-ink-2` | oklch(35% 0.025 260) | 次级文字 |
| `--color-accent` | oklch(54% 0.18 255) | 蓝色主色 |
| `--color-accent-deep` | oklch(28% 0.16 260) | 深蓝 / 页脚背景 |
| `--color-warm` | oklch(62% 0.15 25) | 浅红点缀（section 标签、装饰线）|
| `--color-card` | oklch(99% 0.005 85) | 卡片白色 |

### Dark mode

- `--color-paper`: oklch(10% 0.012 260)
- `--color-ink`: oklch(93% 0.005 85)
- `--color-accent`: oklch(66% 0.16 255)
- `--color-warm`: oklch(72% 0.12 25)

## Typography

- Display: `"Noto Serif SC", Georgia, serif` — 思源宋体
- Body: `"Noto Sans SC", "Figtree", "Inter", system-ui, sans-serif`
- Mono: `"JetBrains Mono", monospace`
- H1: `clamp(2.5rem, 1.25rem + 4vw, 5.625rem)`, line-height: 0.95, tracking: -0.005em

## Spacing

4-point named scale (`--space-*` tokens).

## Motion

- framer-motion fade-up + slide reveals
- Hero parallax scroll
- Smooth scroll (Lenis)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Reduced-motion: collapse to opacity-only ≤ 150ms

## Key visual features

- **SVG curve footer divider** — wave separating content from dark footer
- **Dark navy footer** (`--color-accent-deep`) with white text
- **StackedBooks** — 3 CSS 3D books at desktop, flat list on mobile
- **Minimal nav** — shield badge + school name left, clean links right
- **Glass nav** retained
- **Section labels** in warm pink (`--color-warm`) — small uppercase titles + decorative lines

## CTA voice

- Primary: filled blue, 6px radius, white text, hover shadow
- Secondary: ghost with border, ink text, hover light blue tint
