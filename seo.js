// ─────────────────────────────────────────────
// seo.js — GPT-powered SEO Article Generator
//
// Generates 800–1500 word investment articles
// for any country in any language using GPT-4.
//
// Replace YOUR_OPENAI_KEY with your actual key
// Get your key at: https://platform.openai.com/api-keys
// ─────────────────────────────────────────────

const OPENAI_KEY = "YOUR_OPENAI_KEY";

// Supported languages for the UI dropdown
const LANGUAGES = [
  { code: "en",    label: "English" },
  { code: "zh",    label: "中文 (Chinese)" },
  { code: "uk",    label: "Українська (Ukrainian)" },
  { code: "ru",    label: "Русский (Russian)" },
  { code: "ar",    label: "العربية (Arabic)" },
  { code: "de",    label: "Deutsch (German)" },
  { code: "fr",    label: "Français (French)" },
];

// Generate SEO article via GPT
async function generateSEOArticle(country, language) {
  if (!country || !language) {
    throw new Error("Country and language are required.");
  }

  const prompt = `Write a detailed, SEO-optimized article of 800–1500 words about investing in land in ${country}.
Write the article in ${language}.

Structure the article with the following sections using clear headings (##):
1. Introduction — Why ${country} land is attracting global investors
2. Market Overview — Current land market trends and pricing
3. ROI Potential — Expected returns, yield, and appreciation
4. Growth Trends — Economic, demographic, and infrastructure drivers
5. Risk Factors — Legal, political, currency, and market risks
6. Infrastructure & Connectivity — Transport, utilities, development
7. Practical Investor Tips — How to buy, legal steps, due diligence
8. Conclusion — Final recommendation and outlook

Use data-driven language, professional tone suitable for institutional and individual investors.
Include relevant statistics where possible.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Render article to the page with formatted headings
function renderArticle(text, country, language) {
  const container = document.getElementById("seo-article");
  if (!container) return;

  // Convert markdown headings to HTML
  let html = text
    .replace(/^## (.+)$/gm, '<h2 style="color:#4da3ff;margin:24px 0 10px;font-size:18px;">$1</h2>')
    .replace(/^# (.+)$/gm,  '<h1 style="color:white;margin:20px 0 10px;font-size:22px;">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e0e0e0;">$1</strong>')
    .replace(/\n\n/g, '</p><p style="color:#ccc;line-height:1.85;margin-bottom:12px;">')
    .replace(/\n/g, '<br>');

  const wordCount = text.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  container.innerHTML = `
    <div style="background:#111;border:1px solid #222;padding:32px;margin-top:20px;">

      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #222;">
        <div>
          <p style="color:#4da3ff;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:6px;">AI Generated · SEO Article</p>
          <h2 style="color:white;font-size:20px;margin-bottom:4px;">Land Investment in ${country}</h2>
          <p style="color:#aaa;font-size:12px;">${language} · ${wordCount} words · ${readTime} min read</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button onclick="copyArticle()" style="padding:8px 16px;font-size:11px;background:#1a1a1a;border:1px solid #333;color:#aaa;cursor:pointer;">Copy Text</button>
          <button onclick="downloadArticle('${country}')" style="padding:8px 16px;font-size:11px;">Download .txt</button>
        </div>
      </div>

      <div id="article-body">
        <p style="color:#ccc;line-height:1.85;margin-bottom:12px;">${html}</p>
      </div>

    </div>`;
}

// Main display function — call this from your HTML
async function displaySEO(country, lang) {
  const subscribed = localStorage.getItem("subscribed");
  if (!subscribed) {
    if (confirm("Subscribe to generate AI articles. Go to subscription page?")) {
      window.location = "subscription.html";
    }
    return;
  }

  if (!country || !lang) {
    alert("Please select a country and language.");
    return;
  }

  const btn = document.getElementById("seoBtn");
  const container = document.getElementById("seo-article");

  if (btn) { btn.disabled = true; btn.textContent = "Generating Article..."; }
  if (container) {
    container.innerHTML = `
      <div style="padding:32px;text-align:center;background:#111;border:1px solid #222;margin-top:20px;">
        <div style="color:#4da3ff;font-size:24px;margin-bottom:12px;">⏳</div>
        <p style="color:#4da3ff;">Generating SEO article for <strong>${country}</strong>...</p>
        <p style="color:#555;font-size:12px;margin-top:8px;">This may take 10–20 seconds</p>
      </div>`;
  }

  try {
    const langLabel = LANGUAGES.find(l => l.code === lang)?.label || lang;
    const article = await generateSEOArticle(country, langLabel);
    renderArticle(article, country, langLabel);
  } catch (err) {
    console.error("SEO generation error:", err);
    if (container) {
      container.innerHTML = `
        <div style="padding:24px;background:#111;border:1px solid #f66;margin-top:20px;">
          <p style="color:#f66;">✗ Failed to generate article. Check your OpenAI API key.</p>
          <p style="color:#555;font-size:12px;margin-top:6px;">${err.message}</p>
        </div>`;
    }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "Generate Article"; }
  }
}

// Copy article text to clipboard
function copyArticle() {
  const body = document.getElementById("article-body");
  if (!body) return;
  navigator.clipboard.writeText(body.innerText)
    .then(() => alert("✓ Article copied to clipboard!"))
    .catch(() => alert("Copy failed. Please select and copy manually."));
}

// Download article as .txt file
function downloadArticle(country) {
  const body = document.getElementById("article-body");
  if (!body) return;
  const text = body.innerText;
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `LandInvest_${country.replace(/\s+/g,"_")}_Article.txt`;
  a.click();
}
