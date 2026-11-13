# Giacobbi's — staging redesign

Static demo of a redesigned giacobbis.com plus a demo owner dashboard (`/admin/`, sample data only).

- Edit content in `build.mjs`, then run `node build.mjs` to regenerate the HTML pages.
- No build step is needed to host: deploy the repo root as a static site (Vercel or Netlify).
- Staging is kept out of search engines (`robots.txt`, `X-Robots-Tag`, `noindex` meta).
