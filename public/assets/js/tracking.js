/**
 * Rastreo de pedidos (adaptado de rastreo.html de la versión HTML).
 * Consulta pública: GET {API}/<guía>; 404 = guía no encontrada.
 * Admite ?guia=, ?guide= o ?tracking= en la URL para consultar al cargar.
 */
(function () {
  var API_URL = "https://api.kikilogistics.co/api/v1/routes/getRouteByGuide";
  var EN = document.documentElement.lang.indexOf("en") === 0;
  var LOCALE = EN ? "en-US" : "es-CO";
  var M = EN ? {
    noData: "No data", update: "Update", tracking: "In progress",
    news: "We will update this as soon as we receive news.",
    carrier: "Carrier: ", tbc: "To be confirmed",
    lastLoc: "Last location: ", locLater: "Location available once events are received.",
    noDesc: "No additional description", noDescShort: "No description",
    querying: "Checking your tracking number on the Kiki network...",
    notFound: "We could not find information for this tracking number.",
    failed: "We could not check the status. Please try again in a few minutes.",
    generic: "Something went wrong while checking the tracking service.",
    shown: "Showing the latest available information.",
    invalid: "Please enter a valid tracking number.",
    badChars: "The number entered contains no allowed characters."
  } : {
    noData: "Sin dato", update: "Actualización", tracking: "En seguimiento",
    news: "Actualizaremos apenas recibamos novedades.",
    carrier: "Transportadora: ", tbc: "Por confirmar",
    lastLoc: "Última ubicación: ", locLater: "Ubicación disponible al recibir eventos.",
    noDesc: "Sin descripción adicional", noDescShort: "Sin descripción",
    querying: "Consultando la guía en la red de Kiki...",
    notFound: "No encontramos información para este número de guía.",
    failed: "No pudimos consultar el estado. Inténtalo nuevamente en unos minutos.",
    generic: "Ocurrió un error al consultar el servicio de rastreo.",
    shown: "Mostrando la información más reciente disponible.",
    invalid: "Por favor ingresa un número de guía válido.",
    badChars: "El número ingresado no contiene caracteres permitidos."
  };

  function init() {
    var form = document.getElementById("trackingForm");
    if (!form) return;
    var $ = function (id) { return document.getElementById(id); };
    var input = $("trackingNumber"), feedback = $("trackingFeedback"), submitButton = $("trackingSubmit");
    var summaryGrid = $("trackingSummaryGrid"), statusPill = $("summaryStatusPill"), statusMessage = $("summaryStatusMessage");
    var summaryGuide = $("summaryGuide"), summaryCarrier = $("summaryCarrier"), summaryUpdated = $("summaryUpdated");
    var summaryLocation = $("summaryLocation"), summaryEta = $("summaryEta");
    var timelineCard = $("trackingTimelineCard"), timeline = $("trackingTimeline"), timelineEmpty = $("trackingTimelineEmpty");
    var timelinePill = $("timelineStatusPill"), tableCard = $("trackingTableCard"), tableBody = $("trackingTableBody"), tableEmpty = $("trackingTableEmpty");

    function showFeedback(message, type) {
      feedback.textContent = message;
      feedback.classList.remove("error", "success");
      if (type === "error" || type === "success") feedback.classList.add(type);
    }

    function toggleLoading(isLoading) {
      submitButton.disabled = isLoading;
      submitButton.classList.toggle("is-loading", isLoading);
    }

    function sanitizeGuide(value) { return value.replace(/[^a-zA-Z0-9-_.]/g, "").toUpperCase(); }

    function parseDate(value) {
      if (!value && value !== 0) return null;
      var d = typeof value === "number" ? new Date(value) : new Date(value.toString().replace(" ", "T"));
      return isNaN(d.getTime()) ? null : d;
    }
    function toTimestamp(value) { var d = parseDate(value); return d ? d.getTime() : 0; }
    function formatDate(value) {
      if (!value && value !== 0) return M.noData;
      var d = parseDate(value);
      return d ? d.toLocaleString(LOCALE, { dateStyle: "medium", timeStyle: "short" }) : value;
    }

    function classifyStatus(status) {
      var text = (status || "").toString().toLowerCase();
      if (!text) return "";
      if (/entregad|delivered|finalizad/.test(text)) return "delivered";
      if (/incidencia|reten|issue|devuel|return/.test(text)) return "issue";
      if (/transit|camino|ruta|recole|route/.test(text)) return "in-transit";
      return "";
    }

    function setStatusTone(element, statusText) {
      element.classList.remove("delivered", "in-transit", "issue");
      var tone = classifyStatus(statusText);
      if (tone) element.classList.add(tone);
      element.textContent = statusText || M.tracking;
    }

    // La respuesta del API no está documentada: se aceptan los nombres de campo más comunes.
    function normalizeData(raw) {
      var base = (raw && (raw.data || raw.route || raw.result)) || raw;
      if (!base || typeof base !== "object") return null;
      var events = base.events || base.history || base.routeEvents || base.timeline || base.movements || base.statuses || [];
      if (!Array.isArray(events) && typeof events === "object") events = Object.values(events);
      events = Array.isArray(events) ? events.filter(Boolean).map(function (item) {
        return {
          status: item.status || item.state || item.event || item.title || item.estado || M.update,
          description: item.description || item.message || item.detail || item.details || item.novedad || "",
          location: item.location || [item.city, item.country].filter(Boolean).join(", ") || item.address || item.ciudad || "",
          date: item.date || item.eventDate || item.createdAt || item.updatedAt || item.timestamp || item.fecha || null
        };
      }) : [];
      events.sort(function (a, b) { return toTimestamp(b.date) - toTimestamp(a.date); });
      var latest = events[0] || {};
      return {
        guide: base.guide || base.guideNumber || base.trackingNumber || base.reference || base.num_guia || "",
        carrier: base.carrier || base.provider || base.logisticOperator || base.partner || "Kiki Logistics",
        status: base.status || base.currentStatus || base.estado || latest.status || M.tracking,
        eta: base.estimatedDelivery || base.eta || base.promiseDate || base.deliveryDate || "",
        lastUpdate: latest.date || base.updatedAt || base.lastUpdate || "",
        location: latest.location || base.location || base.city || "",
        statusDetail: latest.description || base.message || M.news,
        events: events
      };
    }

    function renderSummary(data, guideQuery) {
      summaryGrid.classList.remove("is-hidden");
      setStatusTone(statusPill, data.status);
      setStatusTone(timelinePill, data.status);
      statusMessage.textContent = data.statusDetail || M.news;
      summaryGuide.textContent = data.guide || guideQuery || "—";
      summaryCarrier.textContent = M.carrier + (data.carrier || M.tbc);
      summaryUpdated.textContent = formatDate(data.lastUpdate);
      summaryLocation.textContent = data.location ? M.lastLoc + data.location : M.locLater;
      summaryEta.textContent = data.eta ? formatDate(data.eta).split(",")[0] : M.noData;
    }

    function el(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    function renderTimeline(events) {
      timeline.innerHTML = "";
      timelineEmpty.classList.toggle("is-hidden", events.length > 0);
      events.forEach(function (item) {
        var entry = el("li", "tracking-timeline-item");
        var tone = classifyStatus(item.status);
        if (tone) entry.classList.add(tone);
        entry.appendChild(el("div", "tracking-timeline-marker"));
        entry.appendChild(el("p", "tracking-helper mb-1", formatDate(item.date)));
        entry.appendChild(el("h4", "", item.status || M.update));
        entry.appendChild(el("p", "", [item.description, item.location].filter(Boolean).join(" · ") || M.noDesc));
        timeline.appendChild(entry);
      });
    }

    function renderTable(events) {
      tableBody.innerHTML = "";
      tableEmpty.classList.toggle("is-hidden", events.length > 0);
      events.forEach(function (item) {
        var row = el("tr");
        [formatDate(item.date), item.status || M.update, item.description || M.noDescShort, item.location || "—"]
          .forEach(function (v) { row.appendChild(el("td", "", v)); });
        tableBody.appendChild(row);
      });
    }

    function hideResults() {
      [summaryGrid, timelineCard, tableCard, timelineEmpty, tableEmpty].forEach(function (n) { n.classList.add("is-hidden"); });
      timeline.innerHTML = "";
      tableBody.innerHTML = "";
    }

    function fetchTracking(guideValue) {
      if (!guideValue) return;
      hideResults();
      toggleLoading(true);
      showFeedback(M.querying, "info");
      fetch(API_URL + "/" + encodeURIComponent(guideValue), { headers: { Accept: "application/json" } })
        .then(function (response) {
          if (response.status === 404) throw new Error(M.notFound);
          if (!response.ok) throw new Error(M.failed);
          return response.json();
        })
        .then(function (data) {
          var normalized = normalizeData(data);
          if (!normalized) throw new Error(M.notFound);
          renderSummary(normalized, guideValue);
          timelineCard.classList.remove("is-hidden");
          tableCard.classList.remove("is-hidden");
          renderTimeline(normalized.events.slice().reverse());
          renderTable(normalized.events);
          showFeedback(M.shown, "success");
        })
        .catch(function (error) {
          hideResults();
          showFeedback(error && error.message && error.message.indexOf("fetch") < 0 ? error.message : M.generic, "error");
        })
        .then(function () { toggleLoading(false); });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var rawValue = input.value.trim();
      if (!rawValue) { showFeedback(M.invalid, "error"); return; }
      var sanitized = sanitizeGuide(rawValue);
      if (!sanitized) { showFeedback(M.badChars, "error"); return; }
      input.value = sanitized;
      fetchTracking(sanitized);
    });

    var params = new URLSearchParams(window.location.search);
    var autoGuide = params.get("guia") || params.get("guide") || params.get("tracking");
    if (autoGuide) {
      input.value = sanitizeGuide(autoGuide);
      fetchTracking(input.value);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
