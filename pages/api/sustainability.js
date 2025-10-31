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

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'ai_sustainability_dataset.csv');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Dataset not found. Place ai_sustainability_dataset.csv in public/data.' });
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const rows = parseCSV(content);

    // Aggregate useful metrics for AI Awareness Meter
    const num = (v) => {
      const n = parseFloat((v || '').toString().replace(/[^0-9.-]/g, ''));
      return isNaN(n) ? 0 : n;
    };

    const totalCo2Tons = rows.reduce((s, r) => s + num(r['Carbon Footprint Reduction (CO2 Tons)']), 0);
    const totalResourceTons = rows.reduce((s, r) => s + num(r['Resource Savings (Metric Tons)']), 0);
    const adoptionAvg = rows.length
      ? rows.reduce((s, r) => s + num(r['AI Adoption Rate (%)']), 0) / rows.length
      : 0;

    // Simple estimates to populate the awareness meter
    const aggregates = {
      aiQueries: rows.length,
      co2Kg: Math.round(totalCo2Tons * 1000),
      // rough energy estimate from CO2 reduction (arbitrary proxy for demo)
      energyKWh: Math.round(totalCo2Tons * 400),
      // proxy water from resource savings
      waterL: Math.round(totalResourceTons * 1000),
      adoptionAvg: Math.round(adoptionAvg)
    };

    res.status(200).json({ rows, count: rows.length, aggregates });
  } catch (e) {
    console.error('CSV read error:', e);
    res.status(500).json({ error: 'Failed to read dataset', details: e.message });
  }
}


