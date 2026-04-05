/**
 * 首页全屏 Mapbox：雾效、地形、相机动效、基辅州范围限制、单宗地叠加
 * 依赖：mapbox-gl、MapboxGeocoder、MapboxDraw、全局 projects / LAND
 */
(function () {
  const KYIV_OBLAST_BBOX = [29.75, 49.95, 32.35, 51.55];

  function projectFeature(p) {
    return {
      type: "Feature",
      properties: {
        id: p.id,
        name: p.name,
        price: p.price || "—",
        area: p.area || "—",
        type: p.type || "土地"
      },
      geometry: { type: "Point", coordinates: [p.lng, p.lat] }
    };
  }

  function estimateDistanceKm(coords) {
    let total = 0;
    for (let i = 1; i < coords.length; i++) {
      const [lng1, lat1] = coords[i - 1];
      const [lng2, lat2] = coords[i];
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      total += 6371 * 2 * Math.asin(Math.sqrt(a));
    }
    return total;
  }

  window.initKyivHomeMap = function (opts) {
    const projects = opts.projects || (typeof projects !== "undefined" ? projects : []);
    const primary = projects[0] || opts.land;
    if (!primary) {
      console.warn("initKyivHomeMap: no parcel data");
      return null;
    }

    mapboxgl.accessToken = opts.accessToken;

    const appState = {
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      showHeat: false,
      terrain: true,
      favorites: JSON.parse(localStorage.getItem("yy_favorites") || "[]"),
      selectedId: primary.id,
      userInteracting: false,
      orbitTimer: null
    };

    const map = new mapboxgl.Map({
      container: opts.containerId || "map-main",
      style: appState.style,
      center: [primary.lng, primary.lat],
      zoom: 13.2,
      pitch: 52,
      bearing: -28,
      antialias: true,
      maxBounds: [
        [KYIV_OBLAST_BBOX[0], KYIV_OBLAST_BBOX[1]],
        [KYIV_OBLAST_BBOX[2], KYIV_OBLAST_BBOX[3]]
      ]
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(new mapboxgl.ScaleControl({ unit: "metric" }), "bottom-right");

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder: opts.geocoderPlaceholder || "Search in Kyiv Oblast…",
      countries: "ua",
      bbox: KYIV_OBLAST_BBOX
    });
    map.addControl(geocoder, "top-left");

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { line_string: true, polygon: true, trash: true }
    });
    map.addControl(draw, "top-right");

    function ensureTerrainSetup() {
      if (!map.getSource("mapbox-dem")) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14
        });
      }
    }

    function setFog() {
      if (typeof map.setFog === "function") {
        map.setFog({
          range: [0.6, 10],
          color: "#b0c4de",
          "horizon-blend": 0.08,
          "high-color": "#1e3a8a",
          "space-color": "#020617",
          "star-intensity": 0.12
        });
      }
    }

    function fitProjects(features) {
      if (!features.length) return;
      const b = new mapboxgl.LngLatBounds();
      features.forEach((f) => b.extend(f.geometry.coordinates));
      map.fitBounds(b, { padding: { top: 100, bottom: 120, left: 80, right: 80 }, duration: 1200 });
    }

    function addProjectLayers() {
      const features = projects.map(projectFeature);
      const collection = { type: "FeatureCollection", features };

      if (!map.getSource("project-points")) {
        map.addSource("project-points", {
          type: "geojson",
          data: collection,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });
      } else {
        map.getSource("project-points").setData(collection);
      }

      if (!map.getLayer("clusters")) {
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "project-points",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#f97316",
            "circle-radius": ["step", ["get", "point_count"], 18, 5, 24, 20, 30],
            "circle-opacity": 0.85
          }
        });
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "project-points",
          filter: ["has", "point_count"],
          layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 }
        });
        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "project-points",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#38bdf8",
            "circle-radius": 9,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff"
          }
        });
        map.addLayer({
          id: "heatmap",
          type: "heatmap",
          source: "project-points",
          maxzoom: 12,
          layout: { visibility: "none" },
          paint: {
            "heatmap-weight": 1,
            "heatmap-intensity": 0.85,
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33,102,172,0)",
              0.2,
              "rgb(103,169,207)",
              0.4,
              "rgb(209,229,240)",
              0.6,
              "rgb(253,219,199)",
              0.8,
              "rgb(239,138,98)",
              1,
              "rgb(178,24,43)"
            ],
            "heatmap-radius": 32
          }
        });
      }

      projects.forEach((p) => {
        const sourceId = "land-" + p.id;
        const fillId = "fill-" + p.id;
        const lineId = "line-" + p.id;
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, { type: "geojson", data: p.geojson });
          map.addLayer({
            id: fillId,
            type: "fill",
            source: sourceId,
            paint: { "fill-color": "#38bdf8", "fill-opacity": 0.42 }
          });
          map.addLayer({
            id: lineId,
            type: "line",
            source: sourceId,
            paint: { "line-color": "#e0f2fe", "line-width": 2.5 }
          });
          map.on("click", fillId, (e) => {
            appState.selectedId = p.id;
            if (opts.onSelect) opts.onSelect(p);
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(
                `<strong>${p.name}</strong><br/>${p.price}<br/>${p.area}<br/><a href="detail.html?id=${p.id}">Data Room →</a>`
              )
              .addTo(map);
          });
        }
      });

      fitProjects(features);
    }

    function setMapStyle(styleUrl) {
      appState.style = styleUrl;
      map.setStyle(styleUrl);
      map.once("style.load", () => {
        setFog();
        ensureTerrainSetup();
        if (appState.terrain) {
          map.setTerrain({ source: "mapbox-dem", exaggeration: 1.35 });
        }
        map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
        addProjectLayers();
      });
    }

    function introFly() {
      map.flyTo({
        center: [primary.lng, primary.lat],
        zoom: 14.4,
        pitch: 58,
        bearing: -35,
        duration: 2800,
        essential: true
      });
    }

    function startOrbit() {
      if (appState.orbitTimer) clearInterval(appState.orbitTimer);
      appState.orbitTimer = setInterval(() => {
        if (appState.userInteracting) return;
        const b = map.getBearing() + 0.12;
        map.setBearing(b % 360);
      }, 50);
    }

    map.on("mousedown", () => {
      appState.userInteracting = true;
    });
    map.on("touchstart", () => {
      appState.userInteracting = true;
    });
    map.on("wheel", () => {
      appState.userInteracting = true;
    });

    map.on("load", () => {
      setFog();
      ensureTerrainSetup();
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.35 });
      addProjectLayers();
      introFly();
      startOrbit();
      if (opts.onReady) opts.onReady(map, primary);
    });

    map.on("click", "clusters", (e) => {
      const feats = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
      if (!feats.length) return;
      const clusterId = feats[0].properties.cluster_id;
      map.getSource("project-points").getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({ center: feats[0].geometry.coordinates, zoom });
      });
    });

    map.on("click", "unclustered-point", (e) => {
      const c = e.features[0].geometry.coordinates.slice();
      const p = e.features[0].properties;
      const proj = projects.find((x) => x.id === Number(p.id));
      if (proj && opts.onSelect) opts.onSelect(proj);
      new mapboxgl.Popup()
        .setLngLat(c)
        .setHTML(`<strong>${p.name}</strong><br/>${p.price}<br/><a href="detail.html?id=${p.id}">详情</a>`)
        .addTo(map);
    });

    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("draw.create", () => {
      const feature = draw.getAll().features[0];
      if (!feature || feature.geometry.type !== "LineString") return;
      const km = estimateDistanceKm(feature.geometry.coordinates).toFixed(2);
      alert("Distance: " + km + " km");
    });

    function toggleHeat() {
      appState.showHeat = !appState.showHeat;
      const vis = appState.showHeat ? "visible" : "none";
      if (map.getLayer("heatmap")) {
        map.setLayoutProperty("heatmap", "visibility", vis);
      }
    }

    function toggleTerrain() {
      appState.terrain = !appState.terrain;
      ensureTerrainSetup();
      if (appState.terrain) {
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.35 });
      } else {
        map.setTerrain(null);
      }
    }

    function toggleBasemap() {
      const next = appState.style.includes("satellite")
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/satellite-streets-v12";
      setMapStyle(next);
    }

    return {
      map,
      appState,
      fitProjects: () => fitProjects(projects.map(projectFeature)),
      setMapStyle,
      toggleHeat,
      toggleTerrain,
      toggleBasemap,
      draw
    };
  };
})();
