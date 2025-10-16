// Convert markdown brand book to rich HTML report

import { readFile, writeFile } from 'fs/promises';
import { marked } from 'marked';
import { join } from 'path';

const HTML_TEMPLATE = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #2c3e50;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 60px 40px;
      text-align: center;
    }

    .header h1 {
      font-size: 3em;
      margin-bottom: 10px;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .header .subtitle {
      font-size: 1.2em;
      opacity: 0.95;
      font-weight: 300;
    }

    .content {
      padding: 60px 80px;
    }

    h1 {
      color: #667eea;
      font-size: 2.5em;
      margin: 60px 0 30px 0;
      padding-bottom: 15px;
      border-bottom: 3px solid #667eea;
    }

    h2 {
      color: #764ba2;
      font-size: 2em;
      margin: 50px 0 25px 0;
      padding-left: 20px;
      border-left: 5px solid #667eea;
    }

    h3 {
      color: #555;
      font-size: 1.5em;
      margin: 35px 0 20px 0;
      font-weight: 600;
    }

    h4 {
      color: #666;
      font-size: 1.2em;
      margin: 25px 0 15px 0;
      font-weight: 600;
    }

    p {
      margin: 15px 0;
      font-size: 1.05em;
      line-height: 1.8;
    }

    strong {
      color: #2c3e50;
      font-weight: 600;
    }

    ul, ol {
      margin: 20px 0 20px 40px;
    }

    li {
      margin: 12px 0;
      font-size: 1.05em;
      line-height: 1.7;
    }

    hr {
      border: none;
      border-top: 2px solid #e0e0e0;
      margin: 50px 0;
    }

    blockquote {
      background: #f8f9fa;
      border-left: 5px solid #ffc107;
      padding: 20px 30px;
      margin: 30px 0;
      border-radius: 8px;
      font-style: italic;
      color: #555;
    }

    .section {
      margin: 40px 0;
      padding: 30px;
      background: #f8f9fa;
      border-radius: 12px;
      border-left: 5px solid #667eea;
    }

    .badge {
      display: inline-block;
      padding: 8px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px;
      font-size: 0.9em;
      font-weight: 600;
      margin: 5px;
    }

    .quality-score {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      margin: 30px 0;
      text-align: center;
      font-size: 1.3em;
      font-weight: 600;
      box-shadow: 0 5px 15px rgba(17, 153, 142, 0.3);
    }

    .proof-point {
      background: white;
      padding: 20px;
      margin: 15px 0;
      border-radius: 8px;
      border-left: 4px solid #11998e;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .competitor-card {
      background: white;
      padding: 20px;
      margin: 15px 0;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      transition: transform 0.2s;
    }

    .competitor-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.12);
    }

    .competitor-card h4 {
      color: #667eea;
      margin-top: 0;
    }

    .footer {
      background: #2c3e50;
      color: white;
      padding: 40px;
      text-align: center;
      font-size: 0.95em;
    }

    .footer a {
      color: #667eea;
      text-decoration: none;
    }

    code {
      background: #f4f4f4;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.95em;
      color: #e83e8c;
    }

    pre {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 20px 0;
    }

    pre code {
      background: none;
      color: inherit;
      padding: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }

    th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 15px;
      border-bottom: 1px solid #e0e0e0;
    }

    tr:hover {
      background: #f8f9fa;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .container {
        box-shadow: none;
      }

      .header {
        background: #667eea;
      }
    }

    @media (max-width: 768px) {
      .content {
        padding: 30px 20px;
      }

      .header {
        padding: 40px 20px;
      }

      .header h1 {
        font-size: 2em;
      }

      h1 {
        font-size: 1.8em;
      }

      h2 {
        font-size: 1.5em;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
      <div class="subtitle">Complete Brand Strategy & Framework</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Generated by <strong>Horizon Brand Builder Pro</strong></p>
      <p>© ${new Date().getFullYear()} | <a href="https://flyberry.in" target="_blank">Visit Brand Website</a></p>
    </div>
  </div>
</body>
</html>
`;

async function convertToHTML(markdownPath: string, outputPath: string) {
  console.log(`📄 Reading markdown from: ${markdownPath}`);
  const markdown = await readFile(markdownPath, 'utf-8');

  // Extract title from first line
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Brand Strategy Report';

  console.log(`🔄 Converting to HTML...`);

  // Configure marked for better rendering
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const htmlContent = marked(markdown);

  const fullHTML = HTML_TEMPLATE(title, htmlContent);

  console.log(`💾 Writing HTML to: ${outputPath}`);
  await writeFile(outputPath, fullHTML, 'utf-8');

  console.log(`✅ HTML report generated successfully!`);
  console.log(`📊 File size: ${(fullHTML.length / 1024).toFixed(1)} KB`);
}

// Main execution
const brandName = process.argv[2] || 'flyberry-gourmet';
const markdownPath = join(process.cwd(), `outputs/${brandName}/brand-book.md`);
const outputPath = join(process.cwd(), `outputs/${brandName}/brand-book.html`);

convertToHTML(markdownPath, outputPath).catch(console.error);
