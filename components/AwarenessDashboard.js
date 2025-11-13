import { useEffect, useState } from 'react';
import Link from 'next/link';

const integerFormatter = new Intl.NumberFormat('en-MY', {
  maximumFractionDigits: 0
});

const decimalFormatter = new Intl.NumberFormat('en-MY', {
  maximumFractionDigits: 1
});

const formatInteger = (value) => integerFormatter.format(Number(value ?? 0));
const formatDecimal = (value) => decimalFormatter.format(Number(value ?? 0));

const SectionCard = ({ title, description, actions, children }) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.06] bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02] p-6 shadow-[0_30px_60px_-40px_rgba(8,47,73,0.7)] backdrop-blur-md">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
    <div className="mt-6">{children}</div>
  </section>
);

const MetricTile = ({ label, value, helper }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.08] p-4 transition hover:border-white/20 hover:bg-white/[0.12]">
    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">{label}</div>
    <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
    {helper && <div className="mt-2 text-xs text-white/50">{helper}</div>}
  </div>
);

const ProgressRow = ({ label, value }) => (
  <div>
    <div className="mb-2 flex items-center justify-between text-xs text-white/60">
      <span>{label}</span>
      <span className="font-semibold text-white">{value}%</span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-sky-400"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  </div>
);

export default function AwarenessDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOnce = async () => {
      try {
        const baseRes = await fetch('/api/ai-monitor');
        const base = await baseRes.json();
        const susRes = await fetch('/api/sustainability');
        const sus = await susRes.json();

        const merged = {
          ...base.awareness,
          week: {
            aiQueries: sus.aggregates?.aiQueries ?? base.awareness.week.aiQueries,
            co2Kg: sus.aggregates?.co2Kg ?? base.awareness.week.co2Kg,
            energyKWh: sus.aggregates?.energyKWh ?? base.awareness.week.energyKWh,
            waterL: sus.aggregates?.waterL ?? base.awareness.week.waterL
          }
        };

        const frozen = {
          ...merged,
          computeSmartScore: Math.round(merged.computeSmartScore),
          computeSmartPercentile: merged.computeSmartPercentile
        };
        setData(frozen);
      } catch (error) {
        console.error('Failed to load awareness metrics', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOnce();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-white/70" />
      </div>
    );
  }

  const week = data.week ?? {};
  const equivalents = data.equivalents ?? {};
  const batteries = data.batteries ?? [];
  const leaderboard = data.departmentLeaderboard ?? [];
  const thinkMode = data.thinkMode ?? {};
  const learningChallenge = data.learningChallenge ?? {};

  const weeklyCo2Kg = Number(week.co2Kg ?? 0);
  const weeklyEnergyKWh = Number(week.energyKWh ?? 0);
  const weeklyWaterL = Number(week.waterL ?? 0);
  const weeklyQueries = Number(week.aiQueries ?? 0);

  const savedCo2Kg = Number(thinkMode.savedCo2g ?? 0) / 1000;
  const treesToPlant = Math.max(1, Math.ceil(weeklyCo2Kg / 20));

  return (
    <div className="space-y-8">
      <SectionCard
        title="Executive Snapshot"
        description="Week-to-date performance across AI sustainability and efficiency indicators."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <MetricTile
            label="Compute Smart Score"
            value={`${data.computeSmartScore}/100`}
            helper={`Top ${data.computeSmartPercentile}% against global benchmark`}
          />
          <MetricTile
            label="AI Interactions Tracked"
            value={formatInteger(weeklyQueries)}
            helper="Unique prompts monitored for responsible usage"
          />
          <MetricTile
            label="Net CO₂ Emissions"
            value={`${formatDecimal(weeklyCo2Kg)} kg`}
            helper={`Neutralise with ${treesToPlant} tree${treesToPlant > 1 ? 's' : ''}`}
          />
          <MetricTile
            label="Energy Consumption"
            value={`${formatDecimal(weeklyEnergyKWh)} kWh`}
            helper={`${formatDecimal(weeklyWaterL / 1000)} m³ estimated water footprint`}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Sustainability Impact Profile"
        description="Translate operational data into real-world equivalents to support GRI-aligned disclosures."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile
            label="Commuting Distance"
            value={`${formatInteger(equivalents.drivingKm ?? 0)} km`}
            helper="Passenger vehicle emissions avoided"
          />
          <MetricTile
            label="Water Footprint"
            value={`${formatInteger(equivalents.toiletFlushes ?? 0)} uses`}
            helper="Equivalent household water consumption"
          />
          <MetricTile
            label="Lighting Duration"
            value={`${formatInteger(equivalents.roomLightingHrs ?? 0)} hrs`}
            helper="Domestic LED lighting comparison"
          />
          <MetricTile
            label="Carbon Offset Advisory"
            value={`${treesToPlant} trees`}
            helper="Target to achieve net-zero for the period"
          />
        </div>
      </SectionCard>

      {batteries.length > 0 && (
        <SectionCard
          title="Operational Efficiency Programmes"
          description="Programme health across prompt design, model right-sizing, data supply, and carbon governance."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {batteries.map((battery) => (
              <ProgressRow key={battery.id} label={battery.label} value={battery.value} />
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard
        title="Carbon Offset Advisory"
        description="Immediate actions to balance residual AI emissions with high-quality offsets."
        actions={
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-400/20 px-4 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/35"
          >
            Explore Offset Marketplace
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/15 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50/80">
              Recommended intervention
            </div>
            <div className="mt-2 text-3xl font-semibold text-white">{treesToPlant} trees</div>
            <p className="mt-2 text-sm text-white/70">
              Planting resilient native species offsets this week&apos;s emissions while supporting
              biodiversity co-benefits.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-emerald-50/80">
              <div>
                <div className="text-white/60">Carbon to neutralise</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {formatDecimal(weeklyCo2Kg)} kg
                </div>
              </div>
              <div>
                <div className="text-white/60">Think Mode savings</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {formatDecimal(savedCo2Kg)} kg avoided
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/[0.08] p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Governance guardrails
            </div>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Maintain current Think Mode cadence to preserve at least{' '}
                {formatDecimal(savedCo2Kg)} kg CO₂ savings per reporting cycle.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Prioritise Malaysian projects with verifiable co-benefits to align with ESG regional
                narratives.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Document offset rationale within sustainability reporting packs for audit readiness.
              </li>
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Behavioural Insights"
        description="How teams are embracing mindful AI usage to minimise redundant compute."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricTile
            label="Intentional Pauses"
            value={formatInteger(thinkMode.pauses ?? 0)}
            helper="Moments of reflection before triggering AI"
          />
          <MetricTile
            label="Average Think Time"
            value={`${formatInteger(thinkMode.avgThinkSeconds ?? 0)} s`}
            helper="Helps reduce duplicate or noisy prompts"
          />
          <MetricTile
            label="Queries Refined"
            value={formatInteger(thinkMode.refinedQueries ?? 0)}
            helper="Human-in-the-loop adjustments applied"
          />
          <MetricTile
            label="CO₂ Saved via Think Mode"
            value={`${formatDecimal(savedCo2Kg)} kg`}
            helper="Cumulative emissions avoided through governance"
          />
        </div>
      </SectionCard>

      {leaderboard.length > 0 && (
        <SectionCard
          title="Department Performance Leaderboard"
          description="Comparator view of adoption, stewardship, and efficiency gains."
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
            <table className="min-w-full divide-y divide-white/10 text-sm text-white/80">
              <thead className="bg-white/[0.08] text-xs uppercase tracking-[0.16em] text-white/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">
                    Department
                  </th>
                  <th scope="col" className="px-4 py-3 text-left">
                    Members
                  </th>
                  <th scope="col" className="px-4 py-3 text-left">
                    Score
                  </th>
                  <th scope="col" className="px-4 py-3 text-left">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {leaderboard.map((dept) => (
                  <tr key={dept.id} className="transition hover:bg-white/[0.07]">
                    <td className="px-4 py-4 font-medium text-white">{dept.name}</td>
                    <td className="px-4 py-4">{formatInteger(dept.members)}</td>
                    <td className="px-4 py-4 font-semibold text-white">
                      {formatInteger(dept.score)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          dept.trend === 'up'
                            ? 'bg-emerald-400/20 text-emerald-200'
                            : 'bg-rose-400/20 text-rose-200'
                        }`}
                      >
                        {dept.trend === 'up' ? '▲ Improving' : '▼ Needs focus'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

    </div>
  );
}
