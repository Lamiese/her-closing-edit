/* Her Closing Edit: site scripts (no dependencies) */
(function () {
  "use strict";
  var CONSENT_KEY = "tce-analytics-consent";
  var queue = [];
  var gaLoaded = false;

  function getConsent() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {} }

  function loadGA() {
    var id = window.TCE && window.TCE.ga4Id;
    if (!id || gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    queue.forEach(function (e) { window.gtag("event", e[0], e[1]); });
    queue = [];
  }

  // Analytics events only send when GA4 is configured AND the visitor has accepted.
  window.tceTrack = function (name, params) {
    if (!(window.TCE && window.TCE.ga4Id) || getConsent() !== "granted") return;
    if (gaLoaded && window.gtag) window.gtag("event", name, params || {});
    else queue.push([name, params || {}]);
  };

  document.addEventListener("DOMContentLoaded", function () {
    // Mobile menu
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.getElementById("main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        nav.classList.toggle("is-open", !open);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("is-open")) {
          toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); toggle.focus();
        }
      });
    }

    var y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();

    // Consent banner
    var banner = document.getElementById("consent");
    if (banner) {
      var c = getConsent();
      if (c === "granted") loadGA();
      else if (!c) banner.hidden = false;
      banner.addEventListener("click", function (e) {
        var v = e.target.getAttribute("data-consent");
        if (!v) return;
        setConsent(v); banner.hidden = true;
        if (v === "granted") loadGA();
      });
    }
    document.querySelectorAll("[data-open-consent]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (banner) { banner.hidden = false; banner.querySelector("button").focus(); }
        else alert("This site doesn’t currently use analytics cookies.");
      });
    });

    // Checkout clicks (only rendered when a product is genuinely available)
    document.querySelectorAll("[data-checkout]").forEach(function (a) {
      a.addEventListener("click", function () {
        window.tceTrack("begin_checkout", { item_name: a.dataset.product, value: Number(a.dataset.price), currency: "USD" });
      });
    });

    // Commission calculator
    var calc = document.querySelector("[data-calculator]");
    if (calc) {
      var $ = function (id) { return calc.querySelector("#" + id); };
      var fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
      var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) && v > 0 ? v : 0; };
      var pct = function (id) { return Math.min(num(id), 100) / 100; };
      var run = function () {
        var mode = calc.querySelector('input[name="calc-mode"]:checked').value;
        calc.querySelector(".calc-direct").hidden = mode !== "direct";
        calc.querySelector(".calc-rates").hidden = mode !== "rates";
        var price = num("calc-price"), rate = pct("calc-rate"), sales, detail;
        if (mode === "direct") {
          sales = Math.floor(num("calc-sales"));
          detail = sales + " sale" + (sales === 1 ? "" : "s") + " × " + fmt.format(price) + " × " + (rate * 100) + "% commission.";
        } else {
          var calls = Math.floor(num("calc-calls"));
          var shown = calls * pct("calc-show");
          sales = shown * pct("calc-close");
          detail = calls + " booked calls → about " + (Math.round(shown * 10) / 10) + " calls held → about " + (Math.round(sales * 10) / 10) + " sales, at " + (rate * 100) + "% of " + fmt.format(price) + ".";
        }
        calc.querySelector("[data-calc-total]").textContent = fmt.format(sales * price * rate);
        calc.querySelector("[data-calc-detail]").textContent = detail + " Hypothetical, before tax, refunds and clawbacks.";
      };
      calc.addEventListener("input", run);
      calc.addEventListener("change", run);
      run();
    }
  });
})();
