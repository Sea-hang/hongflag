import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";
import { guideContent } from "@/data/guide-content";

// 标题文本 → 锚点 ID
function slugify(text: string): string {
  // 去掉 Markdown 标题标记、去首尾空格、去掉 emoji
  return text
    .replace(/^[#\s]+/, "")
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}️]/gu, "")
    .trim()
    .replace(/[^\w一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

// 简单的 Markdown → HTML 转换
function renderMarkdown(md: string): string {
  let html = md;

  // 代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g,
    (_, lang, code) => `<pre class="code-block"><code>${code.trim()}</code></pre>`);

  // 内联代码
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // 标题（带锚点 ID）
  html = html.replace(/^#### (.+)$/gm, (_, title) => `<h4 id="${slugify(title)}">${title}</h4>`);
  html = html.replace(/^### (.+)$/gm, (_, title) => `<h3 id="${slugify(title)}">${title}</h3>`);
  html = html.replace(/^## (.+)$/gm, (_, title) => `<h2 id="${slugify(title)}">${title}</h2>`);
  html = html.replace(/^# (.+)$/gm, (_, title) => `<h1 id="${slugify(title)}">${title}</h1>`);

  // 粗体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // 水平线
  html = html.replace(/^---$/gm, '<hr>');

  // 引用
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // 表格
  html = html.replace(/((?:^\|.+\|\n?)+)/gm, (block: string) => {
    const rows = block.trim().split('\n').filter(r => !r.match(/^\|[\s-:|]+\|$/));
    const cells = rows.map(row =>
      '<tr>' + row.split('|').filter(c => c.trim())
        .map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
    ).join('');
    return `<table>${cells}</table>`;
  });

  // 列表
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // 段落
  const lines = html.split('\n');
  const result: string[] = [];
  let paragraph: string[] = [];

  function flushPara() {
    if (paragraph.length) {
      result.push('<p>' + paragraph.join(' ') + '</p>');
      paragraph = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { flushPara(); continue; }
    if (/^<(h[1-4]|pre|ul|li|\/ul|table|tr|td|hr|blockquote|img)/.test(trimmed) ||
        /^<p>/.test(trimmed) ||
        /^<(h[1-4]|pre|ul|li|\/ul|table|tr|td|hr|blockquote|img)/.test(result[result.length - 1] || '')) {
      flushPara();
      result.push(trimmed);
    } else {
      paragraph.push(trimmed);
    }
  }
  flushPara();

  return result.join('\n');
}

export default function GuidePage() {
  const htmlContent = renderMarkdown(guideContent);

  return (
    <>
      <GlassNav />
      <main className="pt-28 pb-16">
        <article className="max-w-3xl mx-auto px-5">
          {/* 页面标题 */}
          <div className="mb-10 pb-8" style={{ borderBottom: "2px solid var(--color-rule)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-6 rounded-full" style={{ background: "var(--color-warm)" }} />
              <span className="text-[12px] font-medium tracking-[0.12em] uppercase" style={{ color: "var(--color-warm)" }}>
                入学指南
              </span>
            </div>
            <h1
              className="text-[var(--text-display-s)] font-bold tracking-tight leading-[1.1]"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
            >
              入学指南
            </h1>
          </div>

          <style>{`
            html { scroll-behavior: smooth; }

            .guide-content {
              font-family: var(--font-body);
              color: var(--color-ink-2);
              line-height: 1.9;
              font-size: 15px;
            }

            /* 锚点跳转不被导航挡住 */
            .guide-content h2,
            .guide-content h3,
            .guide-content h4 {
              scroll-margin-top: 100px;
            }

            .guide-content h1 {
              font-family: var(--font-display);
              font-size: 28px;
              font-weight: 800;
              color: var(--color-ink);
              margin-bottom: 20px;
              line-height: 1.25;
              letter-spacing: -0.01em;
            }
            .guide-content h2 {
              font-family: var(--font-display);
              font-size: 22px;
              font-weight: 700;
              color: var(--color-ink);
              margin-top: 44px;
              margin-bottom: 14px;
              padding-bottom: 10px;
              border-bottom: 2px solid var(--color-accent-light);
              letter-spacing: -0.01em;
            }
            .guide-content h2:hover::after {
              content: " #";
              opacity: 0.3;
              font-weight: 400;
              font-size: 0.7em;
            }
            .guide-content h3 {
              font-family: var(--font-display);
              font-size: 18px;
              font-weight: 600;
              color: var(--color-ink);
              margin-top: 36px;
              margin-bottom: 10px;
            }
            .guide-content h4 {
              font-family: var(--font-display);
              font-size: 15px;
              font-weight: 600;
              color: var(--color-ink-2);
              margin-top: 24px;
              margin-bottom: 8px;
            }
            .guide-content p {
              color: var(--color-ink-2);
              line-height: 1.9;
              margin-bottom: 14px;
              font-size: 15px;
            }
            .guide-content strong {
              color: var(--color-ink);
              font-weight: 600;
            }
            .guide-content a {
              color: var(--color-accent);
              text-decoration: underline;
              text-underline-offset: 2px;
              text-decoration-thickness: 1px;
              transition: opacity 0.2s;
            }
            .guide-content a:hover {
              opacity: 0.75;
            }
            .guide-content hr {
              border: none;
              border-top: 1px solid var(--color-rule);
              margin: 36px 0;
            }
            .guide-content blockquote {
              border-left: 3px solid var(--color-accent);
              padding: 14px 22px;
              margin: 20px 0;
              background: var(--color-card);
              border-radius: 0 14px 14px 0;
              color: var(--color-ink-2);
              font-size: 14px;
              font-style: italic;
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
            }
            .guide-content blockquote strong {
              color: var(--color-accent);
            }

            /* 无序列表 */
            .guide-content ul {
              list-style: none;
              padding: 0;
              margin: 12px 0 20px;
            }
            .guide-content ul li {
              position: relative;
              padding-left: 22px;
              color: var(--color-ink-2);
              line-height: 1.8;
              font-size: 15px;
              margin-bottom: 4px;
            }
            .guide-content ul li::before {
              content: "";
              position: absolute;
              left: 4px;
              top: 11px;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: var(--color-accent);
              opacity: 0.5;
            }

            /* 有序列表（目录） */
            .guide-content ol {
              list-style: none;
              counter-reset: guide-counter;
              padding: 20px 24px;
              margin: 24px 0;
              background: var(--color-card);
              border-radius: 16px;
              border: 1px solid var(--color-rule);
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
            }
            .guide-content ol li {
              counter-increment: guide-counter;
              position: relative;
              padding: 8px 0 8px 36px;
              color: var(--color-ink-2);
              line-height: 1.6;
              font-size: 15px;
              border-bottom: 1px solid var(--color-rule);
            }
            .guide-content ol li:last-child {
              border-bottom: none;
            }
            .guide-content ol li::before {
              content: counter(guide-counter);
              position: absolute;
              left: 0;
              top: 7px;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: var(--color-accent-light);
              color: var(--color-accent);
              font-size: 12px;
              font-weight: 700;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .guide-content ol li a {
              text-decoration: none;
              font-weight: 500;
              transition: color 0.2s;
            }
            .guide-content ol li a:hover {
              color: var(--color-accent-2);
              text-decoration: underline;
            }

            .guide-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 14px;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid var(--color-rule);
            }
            .guide-content th, .guide-content td {
              border: 1px solid var(--color-rule);
              padding: 10px 16px;
              color: var(--color-ink-2);
            }
            .guide-content td:first-child {
              font-weight: 600;
              color: var(--color-ink);
              white-space: nowrap;
              background: var(--color-paper-2);
            }
            .guide-content .code-block {
              background: var(--color-card);
              border: 1px solid var(--color-rule);
              border-radius: 12px;
              padding: 16px 20px;
              overflow-x: auto;
              margin: 20px 0;
              font-size: 13px;
              line-height: 1.7;
              font-family: var(--font-mono);
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
            }
            .guide-content .code-block code {
              color: var(--color-ink);
            }
            .guide-content .inline-code {
              background: var(--color-accent-light);
              padding: 2px 8px;
              border-radius: 5px;
              font-size: 13px;
              color: var(--color-accent);
              font-family: var(--font-mono);
              font-weight: 500;
            }
            @media (max-width: 640px) {
              .guide-content h1 { font-size: 24px; }
              .guide-content h2 { font-size: 19px; }
              .guide-content td:first-child { white-space: normal; }
              .guide-content ol { padding: 16px; }
              .guide-content ol li { padding-left: 32px; }
            }
          `}</style>
          <div
            className="guide-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
