import { useEffect, useState } from 'react';

export default function SustainabilityTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/sustainability');
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setRows(json.rows || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-white/80">Loading dataset…</div>;
  if (error) return <div className="text-red-300">{error}</div>;
  if (!rows.length) return <div className="text-white/80">No data.</div>;

  const headers = Object.keys(rows[0]);
  const visible = rows.slice(0, 50); // show first 50 to keep it light

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h4 className="text-lg font-semibold text-white mb-4">AI Sustainability Dataset (sample)</h4>
      <div className="overflow-auto max-h-[480px]">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-white/10">
            <tr>
              {headers.map(h => (
                <th key={h} className="text-left text-white px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((r, idx) => (
              <tr key={idx} className="odd:bg-white/5">
                {headers.map(h => (
                  <td key={h} className="px-3 py-2 text-white/90 whitespace-nowrap">{r[h]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 50 && (
        <div className="text-xs text-white/60 mt-2">Showing 50 of {rows.length} rows. Place CSV at public/data/ai_sustainability_dataset.csv</div>
      )}
    </div>
  );
}
