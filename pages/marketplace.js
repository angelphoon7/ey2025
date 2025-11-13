import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  TreePine,
  Wind,
  Sun,
  Waves,
  Factory,
  Building2,
  Check,
  ChevronRight,
  MapPin,
  Award,
  ShoppingCart
} from 'lucide-react';

const CarbonOffsetMarketplace = () => {
  const [cart, setCart] = useState([]);
  const [monthlyBudget] = useState(500);
  const [carbonToOffset] = useState(156); // kg from previous calculations
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const offsetProjects = useMemo(
    () => [
      {
        id: 1,
        name: 'Malaysian Rainforest Conservation',
        type: 'forestry',
        icon: TreePine,
        location: 'Pahang, Malaysia',
        provider: 'Yayasan Hijau Malaysia',
        pricePerTon: 45,
        minPurchase: 0.5,
        certification: ['Gold Standard', 'VCS'],
        impact: 'Protects 2,500 hectares of primary rainforest',
        cobenefits: ['Biodiversity', 'Indigenous Communities', 'Water Conservation'],
        carbonRemoved: '5,000 tons/year',
        timeline: 'Immediate impact',
        featured: true,
        sustainability: 95,
        transparency: 98,
        localImpact: true
      },
      {
        id: 2,
        name: 'Solar Farm Development - Sabah',
        type: 'renewable',
        icon: Sun,
        location: 'Sabah, Malaysia',
        provider: 'TNB Renewables',
        pricePerTon: 38,
        minPurchase: 1,
        certification: ['CDM', 'I-REC'],
        impact: '50 MW solar installation preventing fossil fuel use',
        cobenefits: ['Clean Energy Access', 'Job Creation', 'Grid Stability'],
        carbonRemoved: '75,000 tons/year',
        timeline: 'Impact over 25 years',
        featured: false,
        sustainability: 92,
        transparency: 95,
        localImpact: true
      },
      {
        id: 3,
        name: 'Wind Energy Project - Peninsular Malaysia',
        type: 'renewable',
        icon: Wind,
        location: 'Perak, Malaysia',
        provider: 'Green Energy Sdn Bhd',
        pricePerTon: 42,
        minPurchase: 0.5,
        certification: ['Gold Standard', 'CDM'],
        impact: '30 MW wind farm displacing coal power',
        cobenefits: ['Air Quality', 'Energy Security', 'Technology Transfer'],
        carbonRemoved: '48,000 tons/year',
        timeline: 'Impact over 20 years',
        featured: false,
        sustainability: 88,
        transparency: 92,
        localImpact: true
      },
      {
        id: 4,
        name: 'Mangrove Restoration - Johor',
        type: 'blue-carbon',
        icon: Waves,
        location: 'Johor, Malaysia',
        provider: 'Malaysian Nature Society',
        pricePerTon: 52,
        minPurchase: 0.25,
        certification: ['Verra', 'Plan Vivo'],
        impact: 'Restore 500 hectares of coastal mangroves',
        cobenefits: ['Coastal Protection', 'Fisheries', 'Tourism', 'Biodiversity'],
        carbonRemoved: '2,500 tons/year',
        timeline: '30+ year carbon sequestration',
        featured: true,
        sustainability: 97,
        transparency: 94,
        localImpact: true
      },
      {
        id: 6,
        name: 'Urban Green Spaces - Kuala Lumpur',
        type: 'urban',
        icon: Building2,
        location: 'Kuala Lumpur, Malaysia',
        provider: 'DBKL Green Initiative',
        pricePerTon: 48,
        minPurchase: 0.5,
        certification: ['Local Government Verified'],
        impact: 'Create 10 urban parks with 5,000 new trees',
        cobenefits: ['Urban Cooling', 'Air Quality', 'Community Wellness', 'Flood Control'],
        carbonRemoved: '1,200 tons/year',
        timeline: '50+ year sequestration',
        featured: false,
        sustainability: 82,
        transparency: 88,
        localImpact: true
      },
      {
        id: 7,
        name: 'Biogas from Palm Oil Mill',
        type: 'waste-to-energy',
        icon: Factory,
        location: 'Pahang, Malaysia',
        provider: 'Sustainable Palm Oil Initiative',
        pricePerTon: 40,
        minPurchase: 1,
        certification: ['Gold Standard', 'RSPO'],
        impact: 'Convert palm oil waste to renewable energy',
        cobenefits: ['Waste Reduction', 'Clean Energy', 'RSPO Compliance'],
        carbonRemoved: '25,000 tons/year',
        timeline: '15 year project lifecycle',
        featured: false,
        sustainability: 90,
        transparency: 93,
        localImpact: true
      },
      {
        id: 8,
        name: 'Direct Air Capture Technology',
        type: 'technology',
        icon: Wind,
        location: 'Singapore (Regional)',
        provider: 'CarbonTech Asia',
        pricePerTon: 120,
        minPurchase: 0.1,
        certification: ['Pending Verra'],
        impact: 'Cutting-edge carbon removal technology',
        cobenefits: ['Innovation', 'Permanent Storage', 'Scalability'],
        carbonRemoved: '1,000 tons/year (scaling)',
        timeline: 'Permanent removal',
        featured: false,
        sustainability: 75,
        transparency: 85,
        localImpact: false
      }
    ],
    []
  );

  const filteredProjects = useMemo(() => {
    const filtered = offsetProjects.filter(
      (project) => selectedType === 'all' || project.type === selectedType
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'featured') return Number(b.featured) - Number(a.featured);
      if (sortBy === 'price-low') return a.pricePerTon - b.pricePerTon;
      if (sortBy === 'price-high') return b.pricePerTon - a.pricePerTon;
      if (sortBy === 'impact') return b.sustainability - a.sustainability;
      return 0;
    });

    return sorted;
  }, [offsetProjects, selectedType, sortBy]);

  const addToCart = (project) => {
    const tons = parseFloat((carbonToOffset / 1000).toFixed(2));
    const cost = parseFloat((project.pricePerTon * tons).toFixed(2));

    setCart((prev) => {
      if (prev.some((item) => item.id === project.id)) {
        return prev;
      }
      return [
        ...prev,
        {
          ...project,
          tons,
          cost
        }
      ];
    });
  };

  const removeFromCart = (projectId) => {
    setCart((prev) => prev.filter((item) => item.id !== projectId));
  };

  const totalCost = useMemo(
    () => cart.reduce((sum, item) => sum + item.cost, 0),
    [cart]
  );
  const totalCarbon = useMemo(
    () => cart.reduce((sum, item) => sum + item.tons, 0),
    [cart]
  );

  const getTypeColor = (type) => {
    const colors = {
      forestry: 'bg-green-100 text-green-800 border-green-300',
      renewable: 'bg-blue-100 text-blue-800 border-blue-300',
      'blue-carbon': 'bg-cyan-100 text-cyan-800 border-cyan-300',
      urban: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'waste-to-energy': 'bg-orange-100 text-orange-800 border-orange-300',
      technology: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pb-16">
      <header className="bg-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-700 hover:text-green-800">
            ← Back to Dashboard
          </Link>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Carbon Offset Marketplace</h1>
              <p className="text-green-100 text-lg">
                Offset your AI carbon footprint with verified, high-impact projects
              </p>
            </div>
            <div className="text-right bg-white/10 rounded-xl px-6 py-4 shadow-inner">
              <div className="text-sm opacity-90">Carbon to Offset</div>
              <div className="text-5xl font-bold">{carbonToOffset} kg</div>
              <div className="text-sm opacity-90">
                ≈ {(carbonToOffset / 1000).toFixed(2)} tons CO₂
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All Projects', emoji: '' },
                { value: 'forestry', label: 'Forestry', emoji: '🌳' },
                { value: 'renewable', label: 'Renewable', emoji: '⚡' },
                { value: 'blue-carbon', label: 'Blue Carbon', emoji: '🌊' },
                { value: 'urban', label: 'Urban', emoji: '🌆' },
                { value: 'waste-to-energy', label: 'Waste to Energy', emoji: '♻️' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedType(option.value)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedType === option.value
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.emoji && <span className="mr-2">{option.emoji}</span>}
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="impact">Sustainability Score</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {filteredProjects.map((project) => {
              const Icon = project.icon;
              const isInCart = cart.some((item) => item.id === project.id);

              return (
                <article
                  key={project.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all ${
                    project.featured ? 'border-2 border-yellow-400' : ''
                  }`}
                >
                  {project.featured && (
                    <div className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold mb-4">
                      ⭐ Featured Project
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{project.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {project.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600">
                            RM {project.pricePerTon}
                          </div>
                          <div className="text-xs text-gray-600">per ton CO₂</div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{project.impact}</p>

                      <dl className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <dt className="text-xs text-gray-600 mb-1">Provider</dt>
                          <dd className="font-semibold">{project.provider}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-600 mb-1">Carbon Removed</dt>
                          <dd className="font-semibold">{project.carbonRemoved}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-600 mb-1">Timeline</dt>
                          <dd className="font-semibold">{project.timeline}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-600 mb-1">Min. Purchase</dt>
                          <dd className="font-semibold">{project.minPurchase} tons</dd>
                        </div>
                      </dl>

                      <div className="flex flex-wrap gap-2 mb-4 text-xs font-semibold">
                        <span
                          className={`px-3 py-1 rounded-full border ${getTypeColor(project.type)}`}
                        >
                          {project.type.replace('-', ' ').toUpperCase()}
                        </span>
                        {project.localImpact && (
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                            🇲🇾 Local Impact
                          </span>
                        )}
                        {project.certification.map((cert) => (
                          <span
                            key={cert}
                            className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300"
                          >
                            ✓ {cert}
                          </span>
                        ))}
                      </div>

                      <div className="mb-4">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Co-benefits:</div>
                        <div className="flex flex-wrap gap-2">
                          {project.cobenefits.map((benefit) => (
                            <span
                              key={benefit}
                              className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">Sustainability</span>
                            <span className="text-xs font-bold text-green-600">
                              {project.sustainability}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${project.sustainability}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">Transparency</span>
                            <span className="text-xs font-bold text-blue-600">
                              {project.transparency}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${project.transparency}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => (isInCart ? removeFromCart(project.id) : addToCart(project))}
                        disabled={isInCart}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                          isInCart
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                        }`}
                      >
                        {isInCart ? (
                          <>
                            <Check className="w-5 h-5" />
                            Added to Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart (
                            {(carbonToOffset / 1000 * project.pricePerTon).toFixed(2)} RM)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-green-600" />
                Your Cart
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No projects selected yet</p>
                  <p className="text-sm mt-2">Add projects to offset your carbon footprint</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{item.name}</div>
                            <div className="text-xs text-gray-600">{item.tons} tons CO₂</div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 text-xl"
                            aria-label={`Remove ${item.name}`}
                          >
                            ×
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">RM {item.pricePerTon}/ton</span>
                          <span className="font-bold text-green-600">RM {item.cost.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Total Carbon Offset:</span>
                      <span className="font-bold">{totalCarbon.toFixed(2)} tons</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700">Total Cost:</span>
                      <span className="text-2xl font-bold text-green-600">
                        RM {totalCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-4">
                      Monthly budget: RM {monthlyBudget} (
                      {((totalCost / monthlyBudget) * 100).toFixed(0)}% used)
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${Math.min((totalCost / monthlyBudget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg">
                    Complete Purchase
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-2 text-xs text-green-800">
                      <Award className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Impact:</strong> Your purchase will offset {totalCarbon.toFixed(2)} tons
                        of CO₂ and support {cart.length} verified project
                        {cart.length > 1 ? 's' : ''} in Malaysia.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CarbonOffsetMarketplace;


