/**
 * GPT 风格投资报告 HTML 生成 + PDF 导出（html2pdf.js）
 * 正式环境可将 buildReportHtml 改为调用 OpenAI API，再渲染
 */
(function () {
  function esc(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildSections(land) {
    const infra = land.infra || {};
    const market = land.market || {};
    return `
      <section class="report-section">
        <h2>一、标的概览</h2>
        <p><strong>名称：</strong>${esc(land.name)}</p>
        <p><strong>位置：</strong>${esc(land.region)}，${esc(land.city || "")}</p>
        <p><strong>面积：</strong>${esc(land.area)}</p>
        <p><strong>意向价格带：</strong>${esc(land.price)}</p>
        <p><strong>GPS：</strong>${esc(land.coordText)}</p>
        <p><strong>综合评分 / ROI：</strong>${esc(land.score)} / ${esc(land.roi)}</p>
      </section>
      <section class="report-section">
        <h2>二、配套与可达性</h2>
        <ul>
          <li>医疗：${esc(infra.medical)}</li>
          <li>教育：${esc(infra.education)}</li>
          <li>零售：${esc(infra.retail)}</li>
          <li>交通：${esc(infra.transport)}</li>
          <li>休闲：${esc(infra.leisure)}</li>
        </ul>
      </section>
      <section class="report-section">
        <h2>三、周边市场观察（摘要）</h2>
        <ul>
          <li>产品形态：${esc(market.product)}</li>
          <li>面积段：${esc(market.sizeRangeSqm)}</li>
          <li>单价（美元/㎡）：毛坯 ${esc(market.priceShellPerSqmUsd)}；精装 ${esc(market.priceFinishedPerSqmUsd)}</li>
          <li>总价带：${esc(market.totalRangeUsd)}</li>
        </ul>
        <p><em>${esc(market.remark)}</em></p>
      </section>
      <section class="report-section">
        <h2>四、风险提示与建议</h2>
        <p>${esc(land.reportNote || "请以律师地籍尽调、环境评估与融资结构为准。")}</p>
        <p>本报告由站内模板生成，可对接 GPT API 自动扩写章节（法规、税务、汇率、ESG）。</p>
      </section>
    `;
  }

  window.buildGptStyleReportHtml = function (land) {
    if (typeof land === "undefined" && typeof LAND !== "undefined") land = LAND;
    if (!land) return "<p>无数据</p>";
    if (typeof buildAiReportHtml === "function") {
      return (
        '<div id="gpt-report-root" class="gpt-report-wrap">' +
        buildAiReportHtml(land) +
        "</div>"
      );
    }
    const date = new Date().toISOString().slice(0, 10);
    return `
      <div id="gpt-report-root" style="font-family:Segoe UI,Arial,sans-serif;color:#111;padding:24px;max-width:800px;margin:0 auto;">
        <header style="border-bottom:2px solid #0f3d7a;padding-bottom:12px;margin-bottom:20px;">
          <h1 style="margin:0;color:#0f3d7a;">投资研判报告（GPT 模板）</h1>
          <p style="margin:8px 0 0;color:#666;font-size:14px;">生成日期：${esc(date)} · ${esc(land.name)}</p>
        </header>
        ${buildSections(land)}
        <footer style="margin-top:32px;font-size:12px;color:#888;">
          YuanYu Land Platform · 仅供演示，不构成投资建议
        </footer>
      </div>
    `;
  };

  /**
   * 将报告导出为 PDF（需页面已加载 html2pdf.js）
   */
  window.exportReportToPdf = function (elementOrSelector, filename) {
    const el =
      typeof elementOrSelector === "string"
        ? document.querySelector(elementOrSelector)
        : elementOrSelector;
    if (!el) {
      alert("未找到报告容器");
      return;
    }
    if (typeof html2pdf === "undefined") {
      window.print();
      return;
    }
    const opt = {
      margin: 10,
      filename: filename || "Tarasivka-Lot-1-Report.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(el).save();
  };

  window.renderReportInto = function (containerId, land) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = buildGptStyleReportHtml(land);
  };
})();
