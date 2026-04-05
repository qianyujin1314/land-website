/**
 * 轻量双语：localStorage yy_lang = zh | en
 */
(function () {
  const STR = {
    zh: {
      brandSub: "基辅州 · 塔拉西夫卡 · 仅单一宗地",
      heroTitle: "基辅圈 · 一号地数据室",
      heroLead: "非全球资产库：仅乌克兰基辅州塔拉西夫卡村 1.352 ha。Mapbox 三维雾效 + 地形 + 实时叠加宗地。",
      ctaRoom: "进入 Data Room",
      ctaAi: "AI 全量报告",
      mapBadge: "实地影像 / 航拍",
      kpiScore: "综合评分",
      kpiRoi: "模型 ROI",
      live: "智能看板",
      coord: "坐标",
      infra: "配套",
      hl: "亮点",
      heat: "热力",
      terrain: "3D 地形",
      basemap: "底图",
      fit: "视野全览",
      measure: "测距（右上绘制折线）",
      verified: "已核验",
      platformTitle: "从信息到落地：三层能力",
      tier1t: "门户层 · 免费",
      tier1d: "单宗地公开摘要、动态地图与政策风险提示。",
      tier2t: "协作层 · 订阅",
      tier2d: "PDF / 邮件、顾问队列、尽调清单与情景分析。",
      tier3t: "AI 套件 · 可扩展",
      tier3d: "全量报告、敏感性表、法律清单；可对接 GPT API 与私有 PDF。",
      compareNote: "对标国际土地投行数据室：更聚焦（仅 Kyiv Oblast 本地块），避免「全球挂牌」噪音。"
    },
    en: {
      brandSub: "Kyiv Oblast · Tarasivka · single parcel only",
      heroTitle: "Kyiv Ring · Lot 1 Data Room",
      heroLead:
        "Not a global listings site: one parcel in Tarasivka, Kyiv Oblast (~1.352 ha). Mapbox 3D fog + terrain + parcel overlay.",
      ctaRoom: "Open Data Room",
      ctaAi: "Full AI report",
      mapBadge: "Field / aerial loop",
      kpiScore: "Score",
      kpiRoi: "Model ROI",
      live: "Live board",
      coord: "Coords",
      infra: "Infrastructure",
      hl: "Highlights",
      heat: "Heatmap",
      terrain: "3D terrain",
      basemap: "Basemap",
      fit: "Fit bounds",
      measure: "Measure (draw line top-right)",
      verified: "Verified",
      platformTitle: "Three layers: insight → execution",
      tier1t: "Portal · free",
      tier1d: "Public summary, live map, risk hints — one parcel only.",
      tier2t: "Collaboration · subscription",
      tier2d: "PDF/email, advisor queue, DD checklist & scenarios.",
      tier3t: "AI suite · extensible",
      tier3d: "Full report, sensitivity & legal lists; plug in GPT API + private PDFs.",
      compareNote:
        "Compared to broad marketplaces: deeper focus on this Kyiv Oblast parcel — less noise than global feeds."
    }
  };

  function lang() {
    return localStorage.getItem("yy_lang") || "zh";
  }

  window.yyLang = lang;

  window.yySetLang = function (code) {
    if (!STR[code]) code = "zh";
    localStorage.setItem("yy_lang", code);
    apply();
    window.dispatchEvent(new Event("yy-lang"));
  };

  function apply() {
    const L = STR[lang()] || STR.zh;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (L[key]) el.textContent = L[key];
    });
  }

  window.yyApplyI18n = apply;

  document.addEventListener("DOMContentLoaded", () => {
    const sel = document.getElementById("lang-select");
    if (sel) {
      sel.value = lang();
      sel.addEventListener("change", () => yySetLang(sel.value));
    }
    apply();
  });
})();
