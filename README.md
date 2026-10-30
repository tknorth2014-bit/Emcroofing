# EMC Roofing LLC — Website

Static, mobile-responsive marketing site for EMC Roofing LLC (Ocala, FL). No build step — plain HTML, CSS and JS, ready for Vercel.

## Pages
`/` · `/services` · `/projects` · `/about` · `/reviews` · `/contact` (+ `404.html`)

## Deploy on Vercel
1. In Vercel, **Add New → Project** and import this GitHub repo.
2. Framework preset: **Other**. Leave build command and output directory empty.
3. Deploy, then add `emcroofing.com` under **Settings → Domains**.

`vercel.json` enables clean URLs (`/services` instead of `/services.html`) and asset caching.

## Estimate form
Set `FORM_ENDPOINT` at the top of `assets/js/main.js` to a form service URL (for example a free Formspree form) to receive requests by email. While it is empty, submitting the form opens a pre-filled text message to (813) 535-1481 on phones and shows the call/text option on desktop.

## Photos
All images live in `assets/img/`. Each photo has three files: `name.jpg`, `name.webp` and `name-900.webp` (mobile). To swap in your own full-resolution photos, replace those files keeping the same names (about 1600–2000px wide).
