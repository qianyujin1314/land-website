/**
 * 多语言 SEO：注入 title、description、keywords、hreflang、JSON-LD
 * 依赖：页面需先加载 data.js（提供 LAND）
 */
(function () {
  function setMeta(name, content) {
    if (!content) return;
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function setProperty(prop, content) {
    if (!content) return;
    let el = document.querySelector(`meta[property="${prop}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", prop);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function injectHreflang(land) {
    const base = typeof window !== "undefined" && window.location ? window.location.origin + window.location.pathname : "";
    const links = [
      { hreflang: "zh-CN", href: base + "?lang=zh" },
      { hreflang: "en", href: base + "?lang=en" },
      { hreflang: "uk", href: base + "?lang=uk" },
      { hreflang: "x-default", href: base }
    ];
    links.forEach(({ hreflang, href }) => {
      let el = document.querySelector(`link[hreflang="${hreflang}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "alternate");
        el.setAttribute("hreflang", hreflang);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    });
  }

  function injectJsonLd(land) {
    if (!land || !land.name) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Place",
      name: land.name,
      description: land.seo && land.seo.description ? land.seo.description : land.name,
      geo: {
        "@type": "GeoCoordinates",
        latitude: land.lat,
        longitude: land.lng
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: land.region || "Tarasivka",
        addressRegion: land.city || "Kyiv Oblast",
        addressCountry: "UA"
      }
    });
    document.head.appendChild(script);
  }

  window.applySeo = function (land) {
    if (typeof land === "undefined" && typeof LAND !== "undefined") {
      land = LAND;
    }
    if (!land) return;

    const title = (land.seo && land.seo.title) ? land.seo.title : land.name;
    document.title = title;
    setMeta("description", land.seo && land.seo.description);
    setMeta("keywords", land.seo && land.seo.keywords);
    setProperty("og:title", title);
    setProperty("og:description", land.seo && land.seo.description);
    setProperty("og:type", "website");
    injectHreflang(land);
    injectJsonLd(land);
  };
})();
