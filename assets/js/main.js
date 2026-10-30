/* EMC Roofing LLC — site behaviour */

// Paste a form endpoint here (e.g. https://formspree.io/f/xxxxxxx) to receive
// estimate requests by email. Left empty, the form hands the request off to
// a text message / phone call instead.
const FORM_ENDPOINT = "";
const PHONE = "+18135351481";

(function () {
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile navigation
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // Project filters
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project-card");
  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filterBtns.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      projects.forEach((p) => {
        const show = f === "all" || p.dataset.cats.split(" ").includes(f);
        p.classList.toggle("hidden", !show);
      });
    })
  );

  // Lightbox
  const lb = document.querySelector(".lightbox");
  if (lb) {
    const img = lb.querySelector("img");
    const cap = lb.querySelector("figcaption");
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };
    projects.forEach((p) =>
      p.addEventListener("click", () => {
        img.src = p.dataset.full;
        img.alt = p.querySelector("img").alt;
        cap.innerHTML = "";
        cap.append(p.querySelector("h3").textContent);
        const loc = document.createElement("span");
        loc.textContent = p.querySelector("p").textContent;
        cap.append(loc);
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
        lb.querySelector(".lightbox-close").focus();
      })
    );
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".lightbox-close")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && lb.classList.contains("open")) close(); });
  }

  // Estimate forms
  document.querySelectorAll("form.estimate-form").forEach((form) => {
    const status = form.querySelector(".form-status");
    const show = (cls, html) => { status.className = "form-status show " + cls; status.innerHTML = html; };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if (data.get("company")) return; // honeypot

      if (FORM_ENDPOINT) {
        const btn = form.querySelector("button[type=submit]");
        btn.disabled = true;
        try {
          const res = await fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error(res.statusText);
          form.reset();
          show("ok", "<strong>Thank you!</strong> Your request was sent. We'll be in touch shortly.");
        } catch (err) {
          show("err", 'Sorry, something went wrong. Please call us at <a href="tel:' + PHONE + '">(813) 535-1481</a>.');
        } finally {
          btn.disabled = false;
        }
        return;
      }

      const body = [
        "Free estimate request",
        "Name: " + data.get("name"),
        "Phone: " + data.get("phone"),
        data.get("email") ? "Email: " + data.get("email") : "",
        "Service: " + data.get("service"),
        data.get("details") ? "Details: " + data.get("details") : "",
      ].filter(Boolean).join("\n");
      const sms = "sms:" + PHONE + "?&body=" + encodeURIComponent(body);
      show("info", 'Almost done — <a href="' + sms + '">tap here to text your request</a> to EMC Roofing, or call <a href="tel:' + PHONE + '">(813) 535-1481</a>.');
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) window.location.href = sms;
    });
  });

  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
