import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";
import { guideContent } from "@/data/guide-content";

// 简单的 Markdown → HTML 转换
function renderMarkdown(md: string): string {
  // 先转义 HTML
  let html = md;

  // 代码块（```...```）
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

  // 链接 [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 图片 ![alt](url) — 目前没有但万一有
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // 水平线
  html = html.replace(/^---$/gm, '<hr>');

  // 引用
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // 表格：找出连续的 | 行并包裹
  html = html.replace(/((?:^\|.+\|\n?)+)/gm, (block: string) => {
    const rows = block.trim().split('\n').filter(r => !r.match(/^\|[\s-:|]+\|$/));
    const cells = rows.map(row =>
      '<tr>' + row.split('|').filter(c => c.trim())
        .map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
    ).join('');
    return `<table>${cells}</table>`;
  });

  // 无序列表项
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');

  // 有序列表项
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // 把分散的 <li> 包裹成 <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // 段落：连续的非空、非特殊行
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
    if (!trimmed) {
      flushPara();
      continue;
    }
    // 已经是 HTML 标签的行直接输出
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
          <style>{`
            .guide-content h1 { font-size: 32px; font-weight: 800; color: var(--text-primary); margin-bottom: 24px; line-height: 1.2; }
            .guide-content h2 { font-size: 22px; font-weight: 700; color: var(--text-primary); margin-top: 40px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid var(--border); }
            .guide-content h3 { font-size: 17px; font-weight: 600; color: var(--text-primary); margin-top: 28px; margin-bottom: 8px; }
            .guide-content h4 { font-size: 15px; font-weight: 600; color: var(--text-secondary); margin-top: 20px; margin-bottom: 6px; }
            .guide-content p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 12px; font-size: 15px; }
            .guide-content strong { color: var(--text-primary); }
            .guide-content a { color: var(--accent); text-decoration: underline; }
            .guide-content a:hover { opacity: 0.8; }
            .guide-content hr { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
            .guide-content blockquote { border-left: 3px solid var(--accent); padding: 8px 16px; margin: 16px 0; background: var(--bg-secondary); border-radius: 0 8px 8px 0; color: var(--text-secondary); font-size: 14px; }
            .guide-content ul { list-style: disc; padding-left: 24px; margin: 8px 0 16px; }
            .guide-content li { color: var(--text-secondary); line-height: 1.8; font-size: 15px; }
            .guide-content table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
            .guide-content td { border: 1px solid var(--border); padding: 10px 14px; color: var(--text-secondary); }
            .guide-content td:first-child { font-weight: 600; color: var(--text-primary); white-space: nowrap; }
            .guide-content .code-block { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; overflow-x: auto; margin: 16px 0; font-size: 13px; line-height: 1.7; }
            .guide-content .code-block code { color: var(--text-primary); }
            .guide-content .inline-code { background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; font-size: 13px; color: var(--accent); }
            @media (max-width: 640px) {
              .guide-content h1 { font-size: 26px; }
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
