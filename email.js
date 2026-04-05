/**
 * 投资报告邮件：mailto 方案（无后端时可用）；生产环境可改为 API 调用
 */
(function () {
  function encodeBody(text) {
    return encodeURIComponent(text);
  }

  window.sendInvestmentReportEmail = function (land, reportSummary) {
    const to = "UkraineYuanYu@outlook.com";
    const subj = encodeURIComponent(
      "[投资报告] " + (land && land.name ? land.name : "Tarasivka Lot 1")
    );
    const body = encodeURIComponent(
      (reportSummary || "") +
        "\n\n---\n" +
        (land
          ? `项目: ${land.name}\n坐标: ${land.coordText || ""}\n链接: ${typeof window !== "undefined" ? window.location.href : ""}`
          : "")
    );
    window.location.href = "mailto:" + to + "?subject=" + subj + "&body=" + body;
  };

  window.copyReportToClipboard = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      return false;
    }
  };
})();
