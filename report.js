// ─────────────────────────────────────────────
// report.js — GPT Investment Report + PDF Download
//
// Dependencies (add to your HTML <head>):
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
//
// Replace YOUR_OPENAI_KEY with your actual OpenAI API key
// Get your key at: https://platform.openai.com/api-keys
// ─────────────────────────────────────────────

async function generateReport(item) {
  // Check subscription
  const subscribed = localStorage.getItem("subscribed");
  if (!subscribed) {
    if (confirm("Subscribe to unlock full AI reports. Go to subscription page?")) {
      window.location = "subscription.html";
    }
    return;
  }

  // Show loading state
  const btn = document.getElementById("reportBtn");
  const output = document.getElementById("reportOutput");
  if (btn) { btn.disabled = true; btn.textContent = "Generating Report..."; }
  if (output) { output.innerHTML = `<p style="color:#4da3ff;">⏳ Generating AI report, please wait...</p>`; }

  const score = calcScore(item);

  const prompt = `You are a senior land investment analyst. Generate a detailed, professional investment report for the following property. Use clear sections with headings. Be specific and data-driven.

Property Details:
- Title: ${item.title}
- Country: ${item.country}
- Price: $${item.price.toLocaleString()}
- Investment Score: ${score}/100
- ROI Score: ${item.roi}/100
- Growth Potential: ${item.growth}/100
- Location Score: ${item.location}/100
- Risk Score: ${item.risk}/100
- Liquidity Score: ${item.liquidity}/100
- Infrastructure Score: ${item.infrastructure}/100
- Investment Thesis: ${item.thesis}

Please include the following sections:
1. Executive Summary
2. Market Analysis
3. Investment Highlights
4. Risk Factors
5. Financial Projections
6. Final Recommendation

Keep the tone professional and suitable for institutional investors.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_OPENAI_KEY"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const report = data.choices[0].message.content;

    // Show report in page
    if (output) {
      output.innerHTML = `
        <div style="background:#111;border:1px solid #4da3ff;padding:24px;margin-top:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="color:#4da3ff;">AI Investment Report — ${item.title}</h3>
            <button onclick="downloadPDF()" style="padding:8px 16px;font-size:11px;">Download PDF</button>
          </div>
          <pre id="reportText" style="white-space:pre-wrap;color:#ccc;font-family:inherit;line-height:1.8;font-size:13px;">${report}</pre>
        </div>`;
    }

    // Auto-generate PDF
    downloadPDFContent(item, report, score);

  } catch (err) {
    console.error("Report generation error:", err);
    if (output) {
      output.innerHTML = `<p style="color:#f66;">✗ Failed to generate report. Check your OpenAI API key or try again.</p>`;
    }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "Generate AI Report"; }
  }
}

// Download PDF from already-generated report text
function downloadPDF() {
  const reportText = document.getElementById("reportText");
  if (!reportText) { alert("No report to download. Generate a report first."); return; }
  const item = data[localStorage.getItem("id")];
  downloadPDFContent(item, reportText.textContent, calcScore(item));
}

// Core PDF generation
function downloadPDFContent(item, reportText, score) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentW = pageW - margin * 2;

  // Header bar
  doc.setFillColor(13, 31, 60);
  doc.rect(0, 0, pageW, 28, "F");
  doc.setTextColor(77, 163, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("LANDINVEST", margin, 12);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(170, 170, 170);
  doc.text("AI Investment Report", margin, 20);
  doc.text(new Date().toLocaleDateString(), pageW - margin, 20, { align: "right" });

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 28, pageW, 24, "F");
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(item.title, margin, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(170, 170, 170);
  doc.text(`${item.country}  ·  $${item.price.toLocaleString()}  ·  Score: ${score}/100`, margin, 48);

  // Score boxes
  let bx = margin;
  const boxes = [
    ["ROI", item.roi],
    ["Growth", item.growth],
    ["Location", item.location],
    ["Risk", item.risk],
    ["Liquidity", item.liquidity],
    ["Infra", item.infrastructure]
  ];
  const bw = (contentW - 5) / boxes.length;
  doc.setFillColor(11, 15, 20);
  boxes.forEach(([label, val]) => {
    doc.rect(bx, 56, bw - 2, 16, "F");
    doc.setTextColor(77, 163, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(String(val), bx + (bw - 2) / 2, 65, { align: "center" });
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(label, bx + (bw - 2) / 2, 69, { align: "center" });
    bx += bw;
  });

  // Report body
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(reportText, contentW);
  let y = 82;
  lines.forEach(line => {
    if (y > 275) {
      doc.addPage();
      doc.setFillColor(13, 31, 60);
      doc.rect(0, 0, pageW, 12, "F");
      y = 20;
    }
    // Section headings
    if (/^\d+\.|^[A-Z\s]{4,}:/.test(line.trim())) {
      doc.setTextColor(77, 163, 255);
      doc.setFont("helvetica", "bold");
    } else {
      doc.setTextColor(200, 200, 200);
      doc.setFont("helvetica", "normal");
    }
    doc.text(line, margin, y);
    y += 5.5;
  });

  // Footer
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFillColor(11, 15, 20);
    doc.rect(0, 284, pageW, 14, "F");
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.text("LandInvest AI Platform · Confidential", margin, 291);
    doc.text(`Page ${i} of ${pages}`, pageW - margin, 291, { align: "right" });
  }

  doc.save(`${item.title.replace(/\s+/g, "_")}_Investment_Report.pdf`);
}

// Score calculator
function calcScore(d) {
  return Math.round(
    d.location       * 0.25 +
    d.growth         * 0.20 +
    d.roi            * 0.20 +
    d.risk           * 0.15 +
    d.liquidity      * 0.10 +
    d.infrastructure * 0.10
  );
}
