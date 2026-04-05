/**
 * 塔拉西夫卡（с. Тарасівка）一号地 — 单一标的正式数据
 * 文本来源：《一号地项目分析情况》可提取文本；《Звіт с.Тарасівка 29.03.19》为扫描 PDF，字段为结构化占位，以实地尽调为准。
 */
const LAND = {
  id: 1,
  slug: "kyiv-tarasivka-lot-1",
  name: "基辅塔拉西夫卡一号地",
  nameEn: "Tarasivka Lot 1, Kyiv Region",
  nameUk: "Земельна ділянка №1, с. Тарасівка",
  city: "Kyiv Oblast",
  region: "с. Тарасівка (Tarasivka)",
  type: "土地",
  price: "$90,000 - $170,000",
  area: "1.352 公顷",
  areaHa: 1.352,
  lat: 50.3454167,
  lng: 30.3389444,
  coordText: `50°20'43.5"N 30°20'20.2"E`,
  googleMapsUrl: "https://maps.app.goo.gl/2aYZMNTBv3x36QCP8",
  score: 86,
  roi: "8.5% - 12.2%",
  status: "verified",
  reportDate: "2019-03-29",
  reportNote: "乌方《Звіт с.Тарасівка 29.03.19》为扫描件，本站已做字段化归档；权属与界址以地籍文件与现场测量为准。",
  highlights: [
    "On Demand 公交站约 300m，可衔接基辅通勤",
    "约 850m 湖泊与自然休闲带",
    "Boyarka 区综合医院约 3.5km",
    "村内教育/零售配套完整度适合低密度住宅或度假型开发"
  ],
  infra: {
    medical: "村内诊所/急救点约 0.5–1km；Boyarka District Hospital 约 3.5km",
    pharmacy: "村内药店约 0.5km（非 24h）",
    education: "幼儿园约 0.5km；小学约 0.8km",
    retail: "村内杂货 0.3–0.7km；Boyarka 超市约 3km",
    mall: "5km 内无大型购物中心；基辅大型商业约 15km+",
    leisure: "村内公园约 0.2km；森林/绿地 1–2km；湖泊约 850m",
    transport: "On Demand 公交站约 300m"
  },
  market: {
    product: "周边在售以独栋为主，5km 内有联排在建",
    sizeRangeSqm: "100–200 m² 为主",
    priceShellPerSqmUsd: "600–1000",
    priceFinishedPerSqmUsd: "1300–1800",
    totalRangeUsd: "90,000–170,000",
    remark: "大面积单价通常更低；小面积去化可能更快（区域观察）"
  },
  /**
   * 短视频建议 <30MB、mp4(H.264)。与 index.html、detail.html 同级根目录上传即可（GitHub 网页上传文件不用建文件夹）。
   * kind: "file" → 原生 video；kind: "youtube" → 嵌入外链。完整 URL 亦可直接写在 src。
   */
  videos: [
    {
      id: "aerial",
      title: "航拍 · 地块轮廓",
      kind: "file",
      src: "aerial.mp4",
      poster: "aerial-poster.jpg",
      note: "仓库根目录上传 aerial.mp4；不需要 poster 可删 poster 字段"
    },
    {
      id: "drive",
      title: "车行/步行 · 周边环境",
      kind: "file",
      src: "drive.mp4",
      note: "仓库根目录上传 drive.mp4"
    }
  ],
  mapModes: {
    satellite: "mapbox://styles/mapbox/satellite-streets-v12",
    streets: "mapbox://styles/mapbox/streets-v12",
    terrain3d: true
  },
  documents: [
    { label: "《一号地项目分析情况》中文尽调摘要", type: "analysis", ref: "一号地项目分析情况 (2).pdf" },
    { label: "《Звіт с.Тарасівка 29.03.19》乌方现场/扫描报告", type: "survey", ref: "Звіт с.Тарасівка 29.03.19..pdf" }
  ],
  /**
   * AI 报告扩写用结构化事实（非投资建议）；与 PDF 交叉核验请以原件为准
   */
  reportAi: {
    executiveZh:
      "标的为乌克兰基辅州鲍里斯皮尔区塔拉西夫卡村（с. Тарасівка）一号宗地，面积约 1.352 公顷，定位为近郊生态型住宅/度假持有或分期开发用地。综合交通（On Demand 公交）、水体与森林休闲资源、Boyarka 医疗半径，形成「通勤 + 宜居」组合。价格带与区域独栋成交区间一致，但汇率、产权与规划用途仍须专项核验。",
    executiveEn:
      "Single parcel in Tarasivka (Boryspil district, Kyiv Oblast), ~1.352 ha, suited for low-density housing or phased development. Transport, lake/forest amenity and Boyarka medical radius support a commute-plus-livability thesis. Pricing aligns with observed detached-home bands; FX, title and zoning must be verified independently.",
    scenarios: [
      {
        name: "情景 A · 持有整备",
        horizon: "3–5 年",
        capexHint: "道路开口、围界、临时水电与景观整理",
        exitHint: "整备后转让或合作开发分成",
        risk: "中"
      },
      {
        name: "情景 B · 分期独栋",
        horizon: "2–4 年",
        capexHint: "设计报批、样板栋、预售与回款节奏",
        exitHint: "散售或打包出售给本地开发商",
        risk: "中高（审批与市场）"
      },
      {
        name: "情景 C · 长租/度假托管",
        horizon: "持续",
        capexHint: "轻改造与运营系统",
        exitHint: "现金流覆盖持有成本，长期资产增值",
        risk: "中低（运营能力）"
      }
    ],
    legalChecklist: [
      "地籍图与界址点是否与现场一致（GNSS 复测）",
      "规划分区 / 用途许可（Житлова / Дачна 等）与建筑退线",
      "产权链、抵押、查封与继承风险",
      "环境与水文：近水体缓冲区、排水与防洪",
      "道路通行权（егрес / доступ）与公共管线接驳点",
      "跨境交易结构：SPV、合同适用法律与争议解决"
    ],
    taxFx: [
      "土地交易印花税/登记费以乌克兰现行税则与标的性质为准（须本地会计师出具）",
      "外币结算与汇款路径影响有效成本；需与银行合规确认",
      "个人 vs 法人持有在折旧、分红与退出税负上差异显著"
    ],
    sensitivity: [
      { factor: "格里夫纳 / 美元汇率", impact: "影响建安与进口材料成本，进而挤压毛利" },
      { factor: "基辅圈住房需求", impact: "独栋去化周期与折扣深度" },
      { factor: "利率与融资成本", impact: "分期开发时的资金占用" },
      { factor: "政策与战时管制", impact: "施工许可、跨境付款与保险可得性" }
    ],
    esg: [
      "水体与湿地缓冲：施工期泥沙与径流管理",
      "森林与生物多样性：清表与道路线位优化",
      "社区关系：本地用工与施工交通噪声控制"
    ],
    comparablesNote:
      "5km 半径内独栋与联排为可比主锚；大面积宗地单价通常低于小宗地，需按可售 GFA 还原。"
  },
  geojson: {
    type: "Feature",
    properties: { name: "Tarasivka Lot 1" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [30.3378, 50.3460],
        [30.3400, 50.3460],
        [30.3400, 50.3445],
        [30.3378, 50.3445],
        [30.3378, 50.3460]
      ]]
    }
  },
  seo: {
    title: "基辅塔拉西夫卡一号地 1.352ha | Kyiv Oblast 单一标的",
    description:
      "仅聚焦乌克兰基辅州塔拉西夫卡村一号宗地：三维 Mapbox 数据室、影像与《一号地项目分析情况》《Звіт 29.03.19》交叉索引、AI 投资报告（非全球资产池）。",
    keywords: "Kyiv Oblast, Tarasivka, Boryspil, land investment, 基辅土地, 塔拉西夫卡, Ukraine"
  }
};

const projects = [LAND];

function getLandById(id) {
  const n = Number(id);
  return projects.find(p => p.id === n) || LAND;
}

function getLandBySlug(slug) {
  return projects.find(p => p.slug === slug) || LAND;
}
