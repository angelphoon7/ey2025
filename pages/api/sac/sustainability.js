import fs from 'fs';
import path from 'path';

function parseCSV(content) {
  const lines = content.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        cols.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    cols.push(current);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] !== undefined ? cols[idx] : '';
    });
    return obj;
  });
}

function aggregatesFromRows(rows) {
  const num = (v) => {
    const n = parseFloat((v || '').toString().replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  const totalCo2Tons = rows.reduce((s, r) => s + num(r['Carbon Footprint Reduction (CO2 Tons)']), 0);
  const totalResourceTons = rows.reduce((s, r) => s + num(r['Resource Savings (Metric Tons)']), 0);
  const adoptionAvg = rows.length
    ? rows.reduce((s, r) => s + num(r['AI Adoption Rate (%)']), 0) / rows.length
    : 0;

  return {
    aiQueries: rows.length,
    co2Kg: Math.round(totalCo2Tons * 1000),
    energyKWh: Math.round(totalCo2Tons * 400),
    waterL: Math.round(totalResourceTons * 1000),
    adoptionAvg: Math.round(adoptionAvg)
  };
}

export default async function handler(req, res) {
  // CORS for public consumption by SAP Analytics Cloud
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'ai_sustainability_dataset.csv');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Dataset not found. Place ai_sustainability_dataset.csv in public/data.' });
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const rows = parseCSV(content);

    const format = (req.query.format || 'json').toString().toLowerCase();

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      // Return raw CSV content so SAC can import it directly from a URL
      return res.status(200).send(content);
    }

    // default: json
    const aggregates = aggregatesFromRows(rows);
    return res.status(200).json({ rows, count: rows.length, aggregates });
  } catch (e) {
    console.error('SAC API error:', e);
    res.status(500).json({ error: 'Failed to read dataset', details: e.message });
  }
}
