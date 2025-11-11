# Integrating this project with SAP Analytics Cloud (SAC)

This document explains how to expose the project's sustainability dataset to SAP Analytics Cloud for import or live connections. The repo already contains a dataset at `public/data/ai_sustainability_dataset.csv` and a lightweight API route that serves the data as JSON or CSV.

Files added by this repo that help integration

- `pages/api/sac/sustainability.js` — new API route that returns the dataset as JSON (default) or CSV (`?format=csv`) and includes permissive CORS headers so SAC can fetch it directly after deployment.
- `public/data/ai_sustainability_dataset.csv` — the raw dataset used by the API.

API usage (after you deploy the Next.js app)

- JSON: https://<YOUR_DEPLOYMENT>/api/sac/sustainability
- CSV : https://<YOUR_DEPLOYMENT>/api/sac/sustainability?format=csv

Replace `<YOUR_DEPLOYMENT>` with your deployed site URL (for local testing use `http://localhost:3000` if you run the dev server).

Integration options with SAP Analytics Cloud

1) CSV import (simplest)

  - In SAC: go to the area for creating/importing a model or story and choose to import from a CSV file via URL (or upload if you downloaded the CSV).
  - Use the CSV URL (the `?format=csv` URL above). Because the route returns `text/csv` and includes CORS headers, SAC can fetch the file directly.
  - Map columns as needed in the import wizard.

2) REST / HTTP connector (JSON)

  - SAC supports importing data from HTTP/REST endpoints in many deployments (menu names differ by SAC version). Create a new HTTP/REST connection.
  - Use the JSON URL above (no special path required). The route returns a JSON object:

    {
      "rows": [ { /* dataset rows as objects keyed by column name */ } ],
      "count": <number>,
      "aggregates": { /* simple aggregates computed for convenience */ }
    }

  - If SAC asks for authentication and you want the endpoint to be public, choose a connection type that allows anonymous/no-auth or deploy the API behind an authenticated endpoint and supply credentials in the SAC connection.

3) Deployment recommendations

  - Deploy the Next.js app (Vercel is the fastest path): connect this GitHub repo to Vercel and deploy. The API URL will be `https://<your-site>.vercel.app/api/sac/sustainability`.
  - Alternatively, host on any Node/Next.js platform that supports Next.js API routes (or export the CSV to a static hosting location).

4) Local testing

  - Start dev server:

    ```powershell
    npm install
    npm run dev
    # Then visit http://localhost:3000/api/sac/sustainability or ?format=csv
    ```

5) Example curl commands

  - JSON:

    ```powershell
    curl "http://localhost:3000/api/sac/sustainability"
    ```

  - CSV:

    ```powershell
    curl "http://localhost:3000/api/sac/sustainability?format=csv" -o dataset.csv
    ```

6) Notes and suggestions

  - If your SAC tenant requires HTTPS and/or IP allowlisting, ensure the deployed endpoint matches those requirements.
  - If you require scheduled refreshes in SAC, use the CSV URL or configure the HTTP connector's schedule depending on your SAC features.
  - This API is intentionally simple and public-friendly (CORS permissive). If production data must be protected, add authentication (API keys, basic auth, or OAuth) and configure SAC connection accordingly.

If you want, I can:

- Add a small example Story/Model JSON for SAC (if you provide the SAC model format you use).
- Convert the data to an OData feed (more work; requires adding an OData server or hosting behind an OData provider).
- Deploy the endpoint to Vercel for you (I can add deployment instructions or a Vercel configuration file).
