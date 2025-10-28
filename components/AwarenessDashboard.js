import { useEffect, useState } from 'react';

const StatTile = ({ label, value, sublabel }) => (
  <div>
    <div className="text-5xl font-extrabold text-white">{value}</div>
    <div className="text-white/70 mt-1">{label}</div>
    {sublabel && <div className="text-white/40 text-sm">{sublabel}</div>}
  </div>
);

const MiniCard = ({ icon, value, label }) => (
  <div className="bg-white/60/10 bg-white/10 rounded-xl p-6 text-center">
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-3xl font-extrabold text-white">{value}</div>
    <div className="text-white/70 mt-1">{label}</div>
  </div>
);

export default function AwarenessDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch base mock metrics
        const baseRes = await fetch('/api/ai-monitor');
        const base = await baseRes.json();
        // Fetch Kaggle aggregates and override key fields for awareness meter
        const susRes = await fetch('/api/sustainability');
        const sus = await susRes.json();
        const merged = {
          ...base.awareness,
          week: {
            aiQueries: sus.aggregates?.aiQueries || base.awareness.week.aiQueries,
            co2Kg: sus.aggregates?.co2Kg || base.awareness.week.co2Kg,
            energyKWh: sus.aggregates?.energyKWh || base.awareness.week.energyKWh,
            waterL: sus.aggregates?.waterL || base.awareness.week.waterL
          }
        };
        setData(merged);
      } catch (e) {
        console.error('Failed to load awareness metrics', e);
      }
    };
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Efficiency Batteries */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-4">🔋 Efficiency Batteries</h4>
        <div className="space-y-4">
          {data.batteries?.map((b) => (
            <div key={b.id}>
              <div className="flex justify-between text-sm text-white/80 mb-1">
                <span>{b.label}</span>
                <span>{b.value}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`${b.value >= 85 ? 'bg-green-500' : b.value >= 70 ? 'bg-yellow-500' : 'bg-red-500'} h-3 rounded-full`}
                  style={{ width: `${b.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awareness Meter */}
      <div className="rounded-xl p-6 border border-white/20 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 text-white">
        <h3 className="text-xl font-semibold flex items-center space-x-2 mb-6">
          <span>🧠</span>
          <span>Your AI Awareness Meter</span>
        </h3>
        <p className="text-white/80 mb-6">This Week's Environmental Impact</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <StatTile label="AI Queries" value={data.week.aiQueries} />
          <StatTile label="CO  Generated" value={`${data.week.co2Kg} kg`} />
          <StatTile label="Energy Used" value={`${data.week.energyKWh} kWh`} />
          <StatTile label="Water Used" value={`${data.week.waterL}L`} />
        </div>
      </div>

      {/* Equivalents */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-4">💡 That's Equal To:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MiniCard icon="🚗" value={`${data.equivalents.drivingKm} km`} label="Driving distance" />
          <MiniCard icon="💧" value={data.equivalents.toiletFlushes} label="Toilet flushes" />
          <MiniCard icon="💡" value={`${data.equivalents.roomLightingHrs} hrs`} label="Room lighting" />
        </div>
      </div>

      {/* Compute Smart Score */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-3">🟢 Compute Smart Score</h4>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(data.computeSmartScore, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-white/80 mt-2">
          <span>{data.computeSmartScore}/100</span>
          <span>🎉 You're in the top {data.computeSmartPercentile}% of mindful AI users!</span>
        </div>
      </div>

      {/* Think Mode Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-4">🕒 Think Mode Stats</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div>
            <div className="text-3xl font-bold">{data.thinkMode.pauses}</div>
            <div className="text-white/70">Times you paused</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{data.thinkMode.avgThinkSeconds}s</div>
            <div className="text-white/70">Avg think time</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{data.thinkMode.refinedQueries}</div>
            <div className="text-white/70">Queries refined</div>
          </div>
        </div>
        <div className="text-emerald-300 mt-3 text-sm">✨ You saved {data.thinkMode.savedCo2g}g CO  by refining queries!</div>
      </div>

      {/* Achievements removed per request */}

      {/* Department Leaderboard */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-4">👥 Department Leaderboard</h4>
        <div className="space-y-3">
          {data.departmentLeaderboard?.map((d) => (
            <div key={d.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-sm">{d.id}</div>
                <div>
                  <div className="text-white font-medium">{d.name}</div>
                  <div className="text-white/60 text-xs">{d.members} members</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-white font-semibold text-lg">{d.score}</div>
                <div className={`${d.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>{d.trend === 'up' ? '↗' : '↘'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Challenge */}
      <div className="rounded-xl p-6 border border-white/20 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 text-white">
        <h4 className="text-lg font-semibold mb-4">🧠 Learning Challenge</h4>
        <p className="text-white/90 mb-4">Before using AI: Can you solve this problem yourself first?</p>
        <div className="bg-white/10 rounded-lg p-4 mb-4">Today's Challenge: "{data.learningChallenge.text}"</div>
        <div className="flex flex-col md:flex-row gap-3">
          <button className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg">I'll Try First</button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">Use AI Helper</button>
        </div>
      </div>
    </div>
  );
}
