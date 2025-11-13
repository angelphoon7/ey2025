import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

const integerFormatter = new Intl.NumberFormat('en-MY', {
  maximumFractionDigits: 0
});

const decimalFormatter = new Intl.NumberFormat('en-MY', {
  maximumFractionDigits: 1
});

const formatInteger = (value) => integerFormatter.format(Number(value ?? 0));
const formatDecimal = (value) => decimalFormatter.format(Number(value ?? 0));

// SAP BTP Color Palette
const SAP_COLORS = {
  primary: '#0070F2',
  secondary: '#00A8FF',
  accent: '#4FACFE',
  success: '#36B37E',
  warning: '#FFAB00',
  error: '#FF5630',
  teal: '#00D9FF',
  blue: '#0064D9',
  lightBlue: '#7AB8FF',
  darkBlue: '#0052CC'
};

const CHART_COLORS = [
  SAP_COLORS.primary,
  SAP_COLORS.secondary,
  SAP_COLORS.accent,
  SAP_COLORS.success,
  SAP_COLORS.teal,
  SAP_COLORS.lightBlue
];

const SectionCard = ({ title, description, actions, children, className = '' }) => (
  <section className={`rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-950/40 via-blue-900/30 to-blue-950/40 p-6 shadow-lg backdrop-blur-sm ${className}`}>
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {description && <p className="mt-1 text-sm text-blue-200/70">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
    <div>{children}</div>
  </section>
);

const MetricTile = ({ label, value, helper, trend, className = '' }) => (
  <div className={`rounded-lg border border-blue-500/20 bg-blue-950/30 p-5 transition-all hover:border-blue-400/40 hover:bg-blue-950/50 ${className}`}>
    <div className="text-xs font-semibold uppercase tracking-wider text-blue-300/70">{label}</div>
    <div className="mt-3 flex items-baseline justify-between">
      <div className="text-3xl font-bold text-white">{value}</div>
      {trend && (
        <span className={`text-xs font-semibold ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-blue-300'}`}>
          {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    {helper && <div className="mt-2 text-xs text-blue-200/60">{helper}</div>}
  </div>
);

const FilterBar = ({ filters, onFilterChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="rounded-lg border border-blue-500/20 bg-blue-950/40 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-blue-200">Year:</label>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange('year', e.target.value)}
            className="rounded-md border border-blue-500/30 bg-blue-950/50 px-3 py-1.5 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {years.map((year) => (
              <option key={year} value={year} className="bg-blue-950">
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-blue-200">Department:</label>
          <select
            value={filters.department}
            onChange={(e) => onFilterChange('department', e.target.value)}
            className="rounded-md border border-blue-500/30 bg-blue-950/50 px-3 py-1.5 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="all" className="bg-blue-950">All Departments</option>
            <option value="Engineering" className="bg-blue-950">Engineering</option>
            <option value="Marketing" className="bg-blue-950">Marketing</option>
            <option value="Sales" className="bg-blue-950">Sales</option>
            <option value="Finance" className="bg-blue-950">Finance</option>
            <option value="HR" className="bg-blue-950">HR</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-blue-200">Time Period:</label>
          <select
            value={filters.period}
            onChange={(e) => onFilterChange('period', e.target.value)}
            className="rounded-md border border-blue-500/30 bg-blue-950/50 px-3 py-1.5 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="week" className="bg-blue-950">Last Week</option>
            <option value="month" className="bg-blue-950">Last Month</option>
            <option value="quarter" className="bg-blue-950">Last Quarter</option>
            <option value="year" className="bg-blue-950">Last Year</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-blue-200">Application Area:</label>
          <select
            value={filters.applicationArea}
            onChange={(e) => onFilterChange('applicationArea', e.target.value)}
            className="rounded-md border border-blue-500/30 bg-blue-950/50 px-3 py-1.5 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="all" className="bg-blue-950">All Areas</option>
            <option value="Environmental Monitoring" className="bg-blue-950">Environmental Monitoring</option>
            <option value="Energy Efficiency" className="bg-blue-950">Energy Efficiency</option>
            <option value="Resource Management" className="bg-blue-950">Resource Management</option>
            <option value="Smart Cities" className="bg-blue-950">Smart Cities</option>
            <option value="Sustainable Agriculture" className="bg-blue-950">Sustainable Agriculture</option>
          </select>
        </div>

        <button
          onClick={() => onFilterChange('reset', null)}
          className="ml-auto rounded-md border border-blue-500/30 bg-blue-900/50 px-4 py-1.5 text-sm font-medium text-blue-200 transition hover:bg-blue-900/70 hover:border-blue-400/50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-blue-500/30 bg-blue-950/95 p-3 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-semibold text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? formatDecimal(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AwarenessDashboard() {
  const [data, setData] = useState(null);
  const [sustainabilityData, setSustainabilityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    department: 'all',
    period: 'month',
    applicationArea: 'all'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [baseRes, susRes] = await Promise.all([
          fetch('/api/ai-monitor'),
          fetch('/api/sustainability')
        ]);

        const base = await baseRes.json();
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
        setSustainabilityData(sus.rows || []);
      } catch (error) {
        console.error('Failed to load awareness metrics', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate time series data for charts
  const timeSeriesData = useMemo(() => {
    if (!data) return [];
    const periods = filters.period === 'week' ? 7 : filters.period === 'month' ? 30 : filters.period === 'quarter' ? 90 : 365;
    const baseCo2 = Number(data.week?.co2Kg ?? 0);
    const baseEnergy = Number(data.week?.energyKWh ?? 0);
    const baseQueries = Number(data.week?.aiQueries ?? 0);

    return Array.from({ length: periods }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (periods - i - 1));
      const variation = 0.8 + Math.random() * 0.4; // 80-120% variation
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0],
        co2Kg: (baseCo2 / periods) * variation,
        energyKWh: (baseEnergy / periods) * variation,
        queries: Math.round((baseQueries / periods) * variation),
        waterL: (Number(data.week?.waterL ?? 0) / periods) * variation
      };
    });
  }, [data, filters.period]);

  // Department comparison data
  const departmentData = useMemo(() => {
    if (!data?.departmentLeaderboard) return [];
    return data.departmentLeaderboard
      .filter(dept => filters.department === 'all' || dept.name === filters.department)
      .map((dept, index) => {
        // Use deterministic calculation based on score and index for consistency
        const seed = dept.score * 100 + index;
        const efficiency = dept.score * 0.8 + (seed % 20);
        const co2Reduction = (dept.score / 100) * 50 + (seed % 20);
        return {
          name: dept.name,
          score: dept.score,
          members: dept.members,
          efficiency: Math.round(efficiency),
          co2Reduction: Math.round(co2Reduction * 10) / 10
        };
      });
  }, [data, filters.department]);

  // Application area distribution
  const applicationAreaData = useMemo(() => {
    if (!sustainabilityData) return [];
    let filtered = sustainabilityData;
    
    if (filters.applicationArea !== 'all') {
      filtered = filtered.filter(row => row['AI Application Area'] === filters.applicationArea);
    }

    const grouped = filtered.reduce((acc, row) => {
      const area = row['AI Application Area'] || 'Other';
      if (!acc[area]) {
        acc[area] = {
          name: area.length > 20 ? area.substring(0, 20) + '...' : area,
          value: 0,
          co2: 0,
          efficiency: 0
        };
      }
      acc[area].value += parseFloat(row['Carbon Footprint Reduction (CO2 Tons)'] || 0) * 1000;
      acc[area].co2 += parseFloat(row['Carbon Footprint Reduction (CO2 Tons)'] || 0);
      acc[area].efficiency += parseFloat(row['AI Efficiency Improvement (%)'] || 0);
      return acc;
    }, {});

    return Object.values(grouped)
      .map(item => ({
        ...item,
        efficiency: item.efficiency / (filtered.length || 1)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [sustainabilityData, filters.applicationArea]);

  // Impact metrics over time
  const impactMetrics = useMemo(() => {
    if (!sustainabilityData) return [];
    const filtered = sustainabilityData.filter(row => {
      if (filters.applicationArea !== 'all' && row['AI Application Area'] !== filters.applicationArea) {
        return false;
      }
      return true;
    });

    return filtered.slice(0, 10).map((row, index) => ({
      name: (row['AI Application Area'] || 'Unknown').substring(0, 15),
      co2Reduction: parseFloat(row['Carbon Footprint Reduction (CO2 Tons)'] || 0),
      efficiency: parseFloat(row['AI Efficiency Improvement (%)'] || 0),
      resourceSavings: parseFloat(row['Resource Savings (Metric Tons)'] || 0),
      impactScore: parseFloat(row['Impact Score (1-10)'] || 0)
    }));
  }, [sustainabilityData, filters.applicationArea]);

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        year: new Date().getFullYear(),
        department: 'all',
        period: 'month',
        applicationArea: 'all'
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/25 border-t-blue-500" />
          <p className="text-blue-200">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  const week = data.week ?? {};
  const equivalents = data.equivalents ?? {};
  const batteries = data.batteries ?? [];
  const leaderboard = data.departmentLeaderboard ?? [];
  const thinkMode = data.thinkMode ?? {};

  const weeklyCo2Kg = Number(week.co2Kg ?? 0);
  const weeklyEnergyKWh = Number(week.energyKWh ?? 0);
  const weeklyWaterL = Number(week.waterL ?? 0);
  const weeklyQueries = Number(week.aiQueries ?? 0);
  const savedCo2Kg = Number(thinkMode.savedCo2g ?? 0) / 1000;
  const treesToPlant = Math.max(1, Math.ceil(weeklyCo2Kg / 20));

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* Key Performance Indicators */}
      <SectionCard
        title="Executive Dashboard"
        description="Real-time sustainability and AI efficiency metrics with trend analysis."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            label="Compute Smart Score"
            value={`${data.computeSmartScore}/100`}
            helper={`Top ${data.computeSmartPercentile}% globally`}
            trend={2.5}
          />
          <MetricTile
            label="AI Interactions"
            value={formatInteger(weeklyQueries)}
            helper="Queries tracked this period"
            trend={5.2}
          />
          <MetricTile
            label="CO₂ Emissions"
            value={`${formatDecimal(weeklyCo2Kg)} kg`}
            helper={`${treesToPlant} trees to offset`}
            trend={-3.1}
          />
          <MetricTile
            label="Energy Consumption"
            value={`${formatDecimal(weeklyEnergyKWh)} kWh`}
            helper={`${formatDecimal(weeklyWaterL / 1000)} m³ water footprint`}
            trend={-1.8}
          />
        </div>
      </SectionCard>

      {/* Time Series Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="CO₂ Emissions Trend"
          description="Carbon footprint tracking over the selected period."
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={SAP_COLORS.error} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={SAP_COLORS.error} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="date" stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 12 }} />
              <YAxis stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="co2Kg"
                stroke={SAP_COLORS.error}
                fillOpacity={1}
                fill="url(#colorCo2)"
                name="CO₂ (kg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard
          title="Energy Consumption Trend"
          description="Energy usage patterns and optimization opportunities."
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={SAP_COLORS.warning} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={SAP_COLORS.warning} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="date" stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 12 }} />
              <YAxis stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="energyKWh"
                stroke={SAP_COLORS.warning}
                fillOpacity={1}
                fill="url(#colorEnergy)"
                name="Energy (kWh)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Multi-Metric Trend */}
      <SectionCard
        title="Sustainability Metrics Overview"
        description="Comprehensive view of all key sustainability indicators."
      >
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="date" stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#7AB8FF' }} />
            <Bar yAxisId="left" dataKey="queries" fill={SAP_COLORS.primary} name="AI Queries" />
            <Line yAxisId="right" type="monotone" dataKey="co2Kg" stroke={SAP_COLORS.error} strokeWidth={2} name="CO₂ (kg)" />
            <Line yAxisId="right" type="monotone" dataKey="energyKWh" stroke={SAP_COLORS.warning} strokeWidth={2} name="Energy (kWh)" />
          </ComposedChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Department Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Department Performance"
          description="Comparative analysis across departments."
        >
          {departmentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis type="number" stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 12 }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#7AB8FF' }} />
                <Bar dataKey="score" fill={SAP_COLORS.primary} name="Efficiency Score" />
                <Bar dataKey="efficiency" fill={SAP_COLORS.success} name="Efficiency %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-blue-300/60">
              No department data available for selected filters
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Application Area Impact"
          description="Carbon reduction by application area."
        >
          {applicationAreaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationAreaData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationAreaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-blue-300/60">
              No application area data available for selected filters
            </div>
          )}
        </SectionCard>
      </div>

      {/* Impact Metrics Bar Chart */}
      <SectionCard
        title="Top Sustainability Initiatives"
        description="Impact analysis of key AI sustainability applications."
      >
        {impactMetrics.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={impactMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="name" stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
              <YAxis yAxisId="left" stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#7AB8FF" tick={{ fill: '#7AB8FF', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#7AB8FF' }} />
              <Bar yAxisId="left" dataKey="co2Reduction" fill={SAP_COLORS.error} name="CO₂ Reduction (Tons)" />
              <Bar yAxisId="left" dataKey="resourceSavings" fill={SAP_COLORS.success} name="Resource Savings (Tons)" />
              <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke={SAP_COLORS.primary} strokeWidth={3} name="Efficiency (%)" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[350px] items-center justify-center text-blue-300/60">
            No impact metrics available for selected filters
          </div>
        )}
      </SectionCard>

      {/* Operational Efficiency */}
      {batteries.length > 0 && (
        <SectionCard
          title="Operational Efficiency Programmes"
          description="Programme health metrics across key initiatives."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batteries.map((battery) => (
              <div key={battery.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-200">{battery.label}</span>
                  <span className="font-semibold text-white">{battery.value}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-blue-950/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.min(battery.value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Department Leaderboard Table */}
      {leaderboard.length > 0 && (
        <SectionCard
          title="Department Leaderboard"
          description="Detailed performance metrics by department."
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-800/50">
              <thead className="bg-blue-950/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-200">
                    Department
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-200">
                    Members
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-200">
                    Score
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-200">
                    Trend
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-200">
                    CO₂ Reduction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-800/30 bg-blue-950/20">
                {leaderboard
                  .filter(dept => filters.department === 'all' || dept.name === filters.department)
                  .map((dept) => (
                    <tr key={dept.id} className="transition hover:bg-blue-950/40">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{dept.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{formatInteger(dept.members)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-white">
                        {formatInteger(dept.score)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            dept.trend === 'up'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {dept.trend === 'up' ? '▲ Improving' : '▼ Needs focus'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">
                        {formatDecimal((dept.score / 100) * 50)} kg
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Carbon Offset Advisory */}
      <SectionCard
        title="Carbon Offset Advisory"
        description="Immediate actions to balance residual AI emissions with high-quality offsets."
        actions={
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-md border border-cyan-500/50 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
          >
            Explore Offset Marketplace
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-green-500/30 bg-green-950/30 p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-green-300">
              Recommended Intervention
            </div>
            <div className="mt-2 text-3xl font-bold text-white">{treesToPlant} trees</div>
            <p className="mt-2 text-sm text-green-200/80">
              Planting resilient native species offsets this period&apos;s emissions while supporting biodiversity co-benefits.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-green-300/70">Carbon to neutralise</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {formatDecimal(weeklyCo2Kg)} kg
                </div>
              </div>
              <div>
                <div className="text-green-300/70">Think Mode savings</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {formatDecimal(savedCo2Kg)} kg avoided
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-500/30 bg-blue-950/30 p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-300">
              Governance Guardrails
            </div>
            <ul className="mt-4 space-y-3 text-sm text-blue-200/80">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-400" />
                Maintain current Think Mode cadence to preserve at least {formatDecimal(savedCo2Kg)} kg CO₂ savings per reporting cycle.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-400" />
                Prioritise Malaysian projects with verifiable co-benefits to align with ESG regional narratives.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-400" />
                Document offset rationale within sustainability reporting packs for audit readiness.
              </li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Behavioral Insights */}
      <SectionCard
        title="Behavioral Insights"
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
    </div>
  );
}
