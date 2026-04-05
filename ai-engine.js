/**
 * 客户端「AI 投资报告」生成：基于 LAND.reportAi + 基础字段拼装完整 HTML。
 * 生产环境可将 buildAiReportHtml 替换为对 GPT API 的 fetch 调用。
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

  function listItems(arr) {
    if (!arr || !arr.length) return "<li>—</li>";
    return arr.map((x) => `<li>${esc(x)}</li>`).join("");
  }

  function scenarioRows(land) {
    const rows = (land.reportAi && land.reportAi.scenarios) || [];
    if (!rows.length) return "<p>—</p>";
    return rows
      .map(
        (s) => `
      <tr>
        <td>${esc(s.name)}</td>
        <td>${esc(s.horizon)}</td>
        <td>${esc(s.capexHint)}</td>
        <td>${esc(s.exitHint)}</td>
        <td>${esc(s.risk)}</td>
      </tr>`
      )
      .join("");
  }

  function sensitivityTable(land) {
    const rows = (land.reportAi && land.reportAi.sensitivity) || [];
    if (!rows.length) return "<p>—</p>";
    return rows
      .map(
        (r) => `
      <tr><td>${esc(r.factor)}</td><td>${esc(r.impact)}</td></tr>`
      )
      .join("");
  }

  window.buildAiReportHtml = function (land) {
    if (typeof land === "undefined" && typeof LAND !== "undefined") land = LAND;
    if (!land) return "<p>无数据</p>";
    const ra = land.reportAi || {};
    const infra = land.infra || {};
    const market = land.market || {};
    const date = new Date().toISOString().slice(0, 10);

    return `
<div class="ai-report-root">
  <header class="ai-report-head">
    <div class="ai-report-badge">AI Investment Report · Kyiv Oblast Only</div>
    <h1>投资研判报告（全量）</h1>
    <p class="ai-report-meta">${esc(land.name)} · ${esc(date)} · GPS ${esc(land.coordText)}</p>
  </header>

  <section class="ai-report-section">
    <h2>0. 范围声明</h2>
    <p>本站点<strong>仅展示乌克兰基辅州塔拉西夫卡村一号宗地</strong>，不收录全球或其他城市资产。下列分析为基于结构化字段与公开摘要的生成稿，<strong>不构成投资建议</strong>；正式决策须结合律师、地籍、税务与现场尽调。</p>
  </section>

  <section class="ai-report-section">
    <h2>一、执行摘要（中文）</h2>
    <p>${esc(ra.executiveZh || "")}</p>
    <h3>Executive summary (EN)</h3>
    <p>${esc(ra.executiveEn || "")}</p>
  </section>

  <section class="ai-report-section">
    <h2>二、标的概览与数据室索引</h2>
    <ul>
      <li><strong>位置：</strong>${esc(land.region)}，${esc(land.city || "")}</li>
      <li><strong>面积：</strong>${esc(land.area)}（约 ${esc(land.areaHa)} ha）</li>
      <li><strong>价格带：</strong>${esc(land.price)}</li>
      <li><strong>综合评分 / ROI（模型）：</strong>${esc(land.score)} / ${esc(land.roi)}</li>
    </ul>
    <h3>PDF 与资料交叉索引</h3>
    <ul>
      ${(land.documents || [])
        .map((d) => `<li><strong>${esc(d.label)}</strong>（${esc(d.type)}）— ${esc(d.ref)}</li>`)
        .join("")}
    </ul>
    <p class="ai-report-note">${esc(land.reportNote || "")}</p>
  </section>

  <section class="ai-report-section">
    <h2>三、配套与可达性</h2>
    <ul>
      <li>医疗：${esc(infra.medical)}</li>
      <li>教育：${esc(infra.education)}</li>
      <li>零售：${esc(infra.retail)} · 药店：${esc(infra.pharmacy)}</li>
      <li>交通：${esc(infra.transport)}</li>
      <li>休闲：${esc(infra.leisure)} · 商场：${esc(infra.mall)}</li>
    </ul>
  </section>

  <section class="ai-report-section">
    <h2>四、周边市场观察</h2>
    <ul>
      <li>产品：${esc(market.product)}</li>
      <li>面积段：${esc(market.sizeRangeSqm)}</li>
      <li>单价 USD/㎡：毛坯 ${esc(market.priceShellPerSqmUsd)}；精装 ${esc(market.priceFinishedPerSqmUsd)}</li>
      <li>总价带：${esc(market.totalRangeUsd)}</li>
    </ul>
    <p><em>${esc(market.remark)}</em></p>
    <p>${esc(ra.comparablesNote || "")}</p>
  </section>

  <section class="ai-report-section">
    <h2>五、投资情景与开发路径</h2>
    <table class="ai-report-table">
      <thead><tr><th>情景</th><th>周期</th><th>资本支出要点</th><th>退出思路</th><th>风险档</th></tr></thead>
      <tbody>${scenarioRows(land)}</tbody>
    </table>
  </section>

  <section class="ai-report-section">
    <h2>六、敏感性分析</h2>
    <table class="ai-report-table">
      <thead><tr><th>因子</th><th>对回报的影响</th></tr></thead>
      <tbody>${sensitivityTable(land)}</tbody>
    </table>
  </section>

  <section class="ai-report-section">
    <h2>七、法律 / 地籍尽调清单</h2>
    <ul>${listItems(ra.legalChecklist)}</ul>
  </section>

  <section class="ai-report-section">
    <h2>八、税务与外汇提示</h2>
    <ul>${listItems(ra.taxFx)}</ul>
  </section>

  <section class="ai-report-section">
    <h2>九、ESG 与社区</h2>
    <ul>${listItems(ra.esg)}</ul>
  </section>

  <section class="ai-report-section">
    <h2>十、亮点与风险摘要</h2>
    <h3>亮点</h3>
    <ul>${listItems(land.highlights)}</ul>
    <h3>主要风险</h3>
    <p>战争与监管不确定性、审批周期、汇率波动、可比成交波动、环境与水文限制。须以独立第三方报告为准。</p>
  </section>

  <footer class="ai-report-foot">
    <p>YuanYu Land Data Room · 生成时间 ${esc(date)} · 仅供参考</p>
  </footer>
</div>`;
  };

  /** 逐段显现，模拟「生成」动效（不破坏 HTML 结构） */
  window.revealAiReport = function (containerId, html) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = html;
    const sections = el.querySelectorAll(".ai-report-section, .ai-report-head");
    sections.forEach((node, idx) => {
      node.style.opacity = "0";
      node.style.transform = "translateY(10px)";
      node.style.transition = "opacity 0.45s ease, transform 0.45s ease";
      requestAnimationFrame(() => {
        setTimeout(() => {
          node.style.opacity = "1";
          node.style.transform = "none";
        }, 60 * idx);
      });
    });
  };
})();
