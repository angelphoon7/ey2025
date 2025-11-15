const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2
});

const percentFrom100Formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1
});

const parseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'number') return value;
  const cleaned = value.toString().replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const calculateAggregates = (rows = []) => {
  if (!rows.length) {
    return {
      totalCarbonSavedTons: 0,
      totalResourceSavingsTons: 0,
      totalCostReductionUSD: 0,
      avgROIYears: 0,
      avgAdoptionRate: 0,
      avgEfficiencyImprovement: 0
    };
  }

  const sums = rows.reduce(
    (acc, row) => {
      acc.totalCarbonSavedTons += parseNumber(row['Carbon Footprint Reduction (CO2 Tons)']);
      acc.totalResourceSavingsTons += parseNumber(row['Resource Savings (Metric Tons)']);
      acc.totalCostReductionUSD += parseNumber(row['Cost Reduction ($ Million)']);
      acc.avgROIYears += parseNumber(row['ROI (Years)']);
      acc.avgAdoptionRate += parseNumber(row['AI Adoption Rate (%)']);
      acc.avgEfficiencyImprovement += parseNumber(row['AI Efficiency Improvement (%)']);
      return acc;
    },
    {
      totalCarbonSavedTons: 0,
      totalResourceSavingsTons: 0,
      totalCostReductionUSD: 0,
      avgROIYears: 0,
      avgAdoptionRate: 0,
      avgEfficiencyImprovement: 0
    }
  );

  const count = rows.length;

  return {
    totalCarbonSavedTons: sums.totalCarbonSavedTons,
    totalResourceSavingsTons: sums.totalResourceSavingsTons,
    totalCostReductionUSD: sums.totalCostReductionUSD,
    avgROIYears: sums.avgROIYears / count,
    avgAdoptionRate: sums.avgAdoptionRate / count,
    avgEfficiencyImprovement: sums.avgEfficiencyImprovement / count
  };
};

const buildTopInitiatives = (rows = [], take = 6) => {
  const ranked = [...rows]
    .map((row) => ({
      area: row['AI Application Area'],
      description: row['Description'],
      impactScore: parseNumber(row['Impact Score (1-10)']),
      efficiencyImprovement: parseNumber(row['AI Efficiency Improvement (%)']),
      carbonReduction: parseNumber(row['Carbon Footprint Reduction (CO2 Tons)']),
      adoptionRate: parseNumber(row['AI Adoption Rate (%)'])
    }))
    .sort((a, b) => b.impactScore - a.impactScore);

  return ranked.slice(0, take);
};

const buildGRIIndicators = (aggregates, aiMetrics) => {
  const griItems = [
    {
      code: 'GRI 302-1',
      indicator: 'Reduction in energy consumption',
      value: `${numberFormatter.format(aiMetrics.energySavedKWh)} kWh saved`,
      commentary:
        'AI-driven optimization initiatives lowered compute demand, directly reducing energy intensity of AI workloads.'
    },
    {
      code: 'GRI 303-5',
      indicator: 'Water withdrawal and consumption',
      value: `${numberFormatter.format(aiMetrics.waterSavedL)} L water savings`,
      commentary:
        'Efficient AI operations and model right-sizing contributed to measurable reductions in cooling and infrastructure water usage.'
    },
    {
      code: 'GRI 305-5',
      indicator: 'Reduction in GHG emissions',
      value: `${numberFormatter.format(aggregates.totalCarbonSavedTons)} tons carbon dioxide avoided`,
      commentary:
        'Portfolio-wide deployment of targeted AI initiatives prevented carbon dioxide through clean energy shifts and waste mitigation.'
    },
    {
      code: 'GRI 306-2',
      indicator: 'Waste diverted from disposal',
      value: `${numberFormatter.format(aggregates.totalResourceSavingsTons)} metric tons resources preserved`,
      commentary:
        'Automation in waste streams and circular economy programs minimized landfill outputs and boosted materials recovery.'
    },
    {
      code: 'GRI 201-2',
      indicator: 'Financial implications of climate change',
      value: `${currencyFormatter.format(aggregates.totalCostReductionUSD * 1_000_000)} cost avoided`,
      commentary:
        'Cost efficiencies stem from lower energy bills, smarter resource allocation, and reduced regulatory exposure.'
    },
    {
      code: 'GRI 205-2',
      indicator: 'Communication and training about anti-corruption policies',
      value: `${percentFrom100Formatter.format(aggregates.avgAdoptionRate)}% AI adoption`,
      commentary:
        'Robust adoption and governance programs embed responsible-AI training across the organization, reinforcing resilience.'
    }
  ];

  return griItems;
};

const buildNarrativeHighlights = (aggregates, aiMetrics) => [
  `Average efficiency uplift across programs reached ${percentFrom100Formatter.format(
    aggregates.avgEfficiencyImprovement
  )}% with an average ROI of ${numberFormatter.format(aggregates.avgROIYears)} years.`,
  `Sustainability-first design prevented ${numberFormatter.format(
    aiMetrics.co2PreventedKg / 1000
  )} tons of emissions in the last reporting window.`,
  `Think Mode and reuse initiatives conserved approximately ${numberFormatter.format(
    aiMetrics.energySavedKWh
  )} kWh and ${numberFormatter.format(aiMetrics.waterSavedL)} L of water.`,
  `The AI sustainability portfolio spans ${numberFormatter.format(
    aiMetrics.programCount
  )} initiatives, with governance anchored to Global Reporting Initiative standards.`
];

export async function generateGRIReport() {
  const now = new Date();

  const [{ default: jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable')
  ]);

  const autoTable = autoTableModule.default || autoTableModule;

  const [aiMonitorRes, sustainabilityRes] = await Promise.all([
    fetch('/api/ai-monitor'),
    fetch('/api/sustainability')
  ]);

  if (!aiMonitorRes.ok) {
    throw new Error('Failed to load AI monitor metrics');
  }
  if (!sustainabilityRes.ok) {
    throw new Error('Failed to load sustainability dataset');
  }

  const aiMonitor = await aiMonitorRes.json();
  const sustainability = await sustainabilityRes.json();
  const rows = sustainability.rows ?? [];

  const aggregates = calculateAggregates(rows);

  const aiMetrics = {
    energySavedKWh: parseNumber(aiMonitor.metrics?.energySavedKWh),
    waterSavedL: parseNumber(aiMonitor.metrics?.waterSavedL),
    carbonDioxidePreventedKg: parseNumber(aiMonitor.metrics?.co2PreventedKg),
    costSavingsUSD: parseNumber(aiMonitor.metrics?.costSavings),
    efficiencyScore: parseNumber(aiMonitor.metrics?.efficiency),
    programCount: rows.length || parseNumber(aiMonitor.awareness?.week?.aiQueries)
  };

  const topInitiatives = buildTopInitiatives(rows);
  const griIndicators = buildGRIIndicators(aggregates, aiMetrics);
  const narrativeHighlights = buildNarrativeHighlights(aggregates, aiMetrics);

  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 48;
  const marginBottom = 72;
  let cursorY = 72;

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredHeight) => {
    if (cursorY + requiredHeight > pageHeight - marginBottom) {
      doc.addPage();
      cursorY = 72;
      return true;
    }
    return false;
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('AI Sustainability GRI-Referenced Report', marginX, cursorY);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  cursorY += 24;
  doc.text(`Reporting date: ${now.toLocaleDateString()}`, marginX, cursorY);
  cursorY += 18;
  doc.text(
    `Scope: AI-enabled sustainability initiatives mapped to key Global Reporting Initiative (GRI) disclosures.`,
    marginX,
    cursorY,
    { maxWidth: pageWidth - marginX * 2 }
  );

  cursorY += 28;
  
  // Check if Executive Highlights section fits
  const highlightsSectionHeight = 34 + 36 + (narrativeHighlights.length * 18) + 12;
  checkPageBreak(highlightsSectionHeight);
  
  doc.setFillColor(29, 78, 216);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.roundedRect(marginX, cursorY - 18, pageWidth - marginX * 2, 34, 8, 8, 'F');
  doc.text('Executive Sustainability Highlights', marginX + 16, cursorY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(33, 33, 33);
  cursorY += 36;

  narrativeHighlights.forEach((line) => {
    // Check if this line fits on current page
    if (cursorY + 18 > pageHeight - marginBottom) {
      doc.addPage();
      cursorY = 72;
    }
    doc.circle(marginX + 6, cursorY - 3, 2, 'F');
    const textLines = doc.splitTextToSize(line, pageWidth - marginX * 2 - 16);
    doc.text(textLines, marginX + 16, cursorY);
    cursorY += textLines.length * 18;
  });

  cursorY += 12;
  // Check if GRI Indicator Mapping section fits
  checkPageBreak(40);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(33, 33, 33);
  doc.text('GRI Indicator Mapping', marginX, cursorY);

  cursorY += 10;
  autoTable(doc, {
    startY: cursorY,
    headStyles: {
      fillColor: [29, 78, 216],
      textColor: 255,
      halign: 'left'
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
      halign: 'left',
      valign: 'top'
    },
    columnStyles: {
      0: { cellWidth: 80 },
      2: { cellWidth: 120 }
    },
    head: [['GRI Code', 'Impact Indicator', 'Reported Value', 'Narrative Commentary']],
    body: griIndicators.map((item) => [
      item.code,
      item.indicator,
      item.value,
      item.commentary
    ])
  });

  cursorY = doc.lastAutoTable.finalY + 24;

  // Check if next section fits
  checkPageBreak(40);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Top Material AI Sustainability Topics', marginX, cursorY);

  const initiativeBody = topInitiatives.map((item) => [
    item.area,
    `${numberFormatter.format(item.impactScore)} / 10`,
    `${percentFrom100Formatter.format(item.efficiencyImprovement)}% efficiency gain`,
    `${numberFormatter.format(item.carbonReduction)} tons carbon dioxide avoided`,
    `${percentFrom100Formatter.format(item.adoptionRate)}% adoption`
  ]);

  autoTable(doc, {
    startY: cursorY + 12,
    headStyles: {
      fillColor: [22, 101, 52],
      textColor: 255,
      halign: 'left'
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
      halign: 'left',
      valign: 'top'
    },
    columnStyles: {
      0: { cellWidth: 110 },
      1: { cellWidth: 80 },
      2: { cellWidth: 130 },
      3: { cellWidth: 120 }
    },
    head: [
      [
        'AI Application Area',
        'Impact Score',
        'Efficiency Improvement',
        'Carbon Reduction',
        'Adoption Rate'
      ]
    ],
    body: initiativeBody
  });

  cursorY = doc.lastAutoTable.finalY + 24;

  // Check if Portfolio Outcomes section fits
  checkPageBreak(40);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Portfolio Financial and Environmental Outcomes', marginX, cursorY);

  cursorY += 20;
  const summaryMetrics = [
    {
      label: 'Total cost avoided',
      value: currencyFormatter.format(aggregates.totalCostReductionUSD * 1_000_000)
    },
    {
      label: 'Total Carbon dioxide mitigated',
      value: `${numberFormatter.format(aggregates.totalCarbonSavedTons)} tons`
    },
    {
      label: 'Resource preservation',
      value: `${numberFormatter.format(aggregates.totalResourceSavingsTons)} metric tons`
    },
    {
      label: 'Average AI adoption',
      value: `${percentFrom100Formatter.format(aggregates.avgAdoptionRate)}%`
    },
    {
      label: 'Average ROI period',
      value: `${numberFormatter.format(aggregates.avgROIYears)} years`
    },
    {
      label: 'Efficiency uplift',
      value: `${percentFrom100Formatter.format(aggregates.avgEfficiencyImprovement)}%`
    }
  ];

  summaryMetrics.forEach((metric) => {
    // Check if metric fits on current page
    if (cursorY + 16 > pageHeight - marginBottom) {
      doc.addPage();
      cursorY = 72;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(metric.label, marginX, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.text(metric.value, marginX + 220, cursorY);
    cursorY += 16;
  });

  cursorY += 20;
  
  // Check if footer fits
  if (cursorY + 50 > pageHeight - marginBottom) {
    doc.addPage();
    cursorY = 72;
  }
  
  doc.setDrawColor(200);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 16;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  
  const methodologyText = 'Methodology: Indicators derived from internal AI monitoring, supported by the AI Sustainability Dataset and aligned to the GRI Standards (2021).';
  const methodologyLines = doc.splitTextToSize(methodologyText, pageWidth - marginX * 2);
  doc.text(methodologyLines, marginX, cursorY);
  cursorY += methodologyLines.length * 12;
  
  const forwardLookingText = 'Forward-looking statements are subject to model performance, governance maturity, and regional regulatory changes.';
  const forwardLookingLines = doc.splitTextToSize(forwardLookingText, pageWidth - marginX * 2);
  doc.text(forwardLookingLines, marginX, cursorY);

  const filename = `AI_Sustainability_GRI_Report_${now
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '')}.pdf`;
  doc.save(filename);
}

