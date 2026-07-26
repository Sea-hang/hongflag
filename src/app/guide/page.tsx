import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";
import { guideContent } from "@/data/guide-content";

// 简单的 Markdown → HTML 转换
function renderMarkdown(md: string): string {
  let html = md;

  // 代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g,
    (_, lang, code) => `<pre class="code-block"><code>${code.trim()}</code></pre>`);

  // 内联代码
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // 标题
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

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
              <div className="h-[2px] w-6 rounded-full" style={{ background: "var(--color-accent)" }} />
              <span className="text-[12px] font-medium tracking-[0.12em] uppercase text-[var(--color-accent)]">
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
            .guide-content {
              font-family: var(--font-body);
              color: var(--color-ink-2);
              line-height: 1.9;
              font-size: 15px;
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
              padding-bottom: 8px;
              border-bottom: 1px solid var(--color-rule);
            }
            .guide-content h3 {
              font-family: var(--font-display);
              font-size: 17px;
              font-weight: 600;
              color: var(--color-ink);
              margin-top: 32px;
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
              padding: 12px 20px;
              margin: 20px 0;
              background: var(--color-paper-2);
              border-radius: 0 12px 12px 0;
              color: var(--color-ink-2);
              font-size: 14px;
              font-style: italic;
            }
            .guide-content ul {
              list-style: none;
              padding: 0;
              margin: 12px 0 20px;
            }
            .guide-content li {
              position: relative;
              padding-left: 20px;
              color: var(--color-ink-2);
              line-height: 1.8;
              font-size: 15px;
              margin-bottom: 4px;
            }
            .guide-content li::before {
              content: "";
              position: absolute;
              left: 4px;
              top: 11px;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: var(--color-accent);
              opacity: 0.5;
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
              background: var(--color-paper-2);
              border: 1px solid var(--color-rule);
              border-radius: 12px;
              padding: 16px 20px;
              overflow-x: auto;
              margin: 20px 0;
              font-size: 13px;
              line-height: 1.7;
              font-family: var(--font-mono);
            }
            .guide-content .code-block code {
              color: var(--color-ink);
            }
            .guide-content .inline-code {
              background: var(--color-paper-2);
              padding: 2px 7px;
              border-radius: 5px;
              font-size: 13px;
              color: var(--color-accent);
              font-family: var(--font-mono);
              border: 1px solid var(--color-rule);
            }
            @media (max-width: 640px) {
              .guide-content h1 { font-size: 24px; }
              .guide-content h2 { font-size: 19px; }
              .guide-content td:first-child { white-space: normal; }
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
