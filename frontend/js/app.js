/**
 * National Land Acquisition & Management System (NLAMS)
 * Ministry of Rural Development, Government of India
 * Enterprise Frontend Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initAccessibility();
  initNavigation();
  initRoleSimulation();
  initDashboardChart();
  initProposalWizard();
  initGISMapViewer();
  initLoginModal();
  updateCurrentTimestamp();
});

/* ==========================================================================
   1. GIGW Accessibility & Language Toggles
   ========================================================================== */
function initAccessibility() {
  let baseSize = 14;

  const btnDecrease = document.getElementById('btn-font-decrease');
  const btnReset = document.getElementById('btn-font-reset');
  const btnIncrease = document.getElementById('btn-font-increase');
  const btnContrast = document.getElementById('btn-contrast-toggle');
  const langEn = document.getElementById('lang-en');
  const langHi = document.getElementById('lang-hi');

  if (btnDecrease) {
    btnDecrease.addEventListener('click', () => {
      if (baseSize > 12) {
        baseSize -= 1;
        document.documentElement.style.fontSize = baseSize + 'px';
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      baseSize = 14;
      document.documentElement.style.fontSize = '14px';
    });
  }

  if (btnIncrease) {
    btnIncrease.addEventListener('click', () => {
      if (baseSize < 18) {
        baseSize += 1;
        document.documentElement.style.fontSize = baseSize + 'px';
      }
    });
  }

  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isHigh = document.body.classList.contains('high-contrast');
      btnContrast.setAttribute('aria-pressed', isHigh);
      btnContrast.title = isHigh ? "Switch to Normal Mode" : "Switch to High Contrast Mode";
    });
  }

  if (langEn && langHi) {
    langEn.addEventListener('click', () => {
      langEn.classList.add('active');
      langHi.classList.remove('active');
      toggleLanguage('en');
    });
    langHi.addEventListener('click', () => {
      langHi.classList.add('active');
      langEn.classList.remove('active');
      toggleLanguage('hi');
    });
  }
}

function toggleLanguage(lang) {
  const elements = document.querySelectorAll('[data-en][data-hi]');
  elements.forEach(el => {
    el.textContent = lang === 'hi' ? el.getAttribute('data-hi') : el.getAttribute('data-en');
  });
}

function updateCurrentTimestamp() {
  const tsElement = document.getElementById('live-timestamp');
  if (tsElement) {
    const now = new Date();
    const options = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false,
      timeZone: 'Asia/Kolkata'
    };
    tsElement.textContent = now.toLocaleString('en-IN', options) + ' IST';
  }
}

/* ==========================================================================
   2. Navigation & View Routing
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link[data-target]');
  const views = document.querySelectorAll('.view-panel');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current-text');
  const pageMainTitle = document.getElementById('page-main-title');

  const titlesMap = {
    'view-dashboard': { title: 'Executive Overview Dashboard', crumb: 'Dashboard' },
    'view-proposals': { title: 'Land Acquisition Proposals (RFCTLARR 2013)', crumb: 'Proposals' },
    'view-gis': { title: 'GIS Spatial Tracking & Cadastral Cadastre', crumb: 'GIS Map' },
    'view-records': { title: 'Digital Land Records (RoR & Khasra Registry)', crumb: 'Land Records' },
    'view-rr': { title: 'Rehabilitation & Resettlement (R&R) Monitoring', crumb: 'R&R Tracking' },
    'view-reports': { title: 'Statutory Reports & Gazette Notifications', crumb: 'Reports' }
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');

      // Update Nav active styling
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Switch view panel
      views.forEach(v => {
        v.classList.remove('active');
        if (v.id === targetId) {
          v.classList.add('active');
        }
      });

      // Update breadcrumbs and titles
      if (titlesMap[targetId]) {
        if (pageMainTitle) pageMainTitle.textContent = titlesMap[targetId].title;
        if (breadcrumbCurrent) breadcrumbCurrent.textContent = titlesMap[targetId].crumb;
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* ==========================================================================
   3. Role Simulator (Central Ministry, State Govt, District Authority)
   ========================================================================== */
function initRoleSimulation() {
  const roleSelect = document.getElementById('role-simulator-select');
  const userName = document.getElementById('user-profile-name');
  const userRole = document.getElementById('user-profile-role');
  const roleScopeBadge = document.getElementById('role-scope-badge');

  const roleProfiles = {
    'central': {
      name: 'Dr. S. K. Sharma, IAS',
      role: 'Joint Secretary (DoLR), MoRD',
      scope: 'National Jurisdiction (All States)',
      alertText: 'Active Session: Central Ministry level clearance authority under RFCTLARR Act Sec 11.'
    },
    'state': {
      name: 'Shri R. V. Kulkarni, IAS',
      role: 'Principal Secretary (Revenue), Maharashtra',
      scope: 'State Level: Maharashtra',
      alertText: 'Active Session: State Revenue Department monitoring 34 active linear infrastructure projects.'
    },
    'district': {
      name: 'Ms. Ananya Deshmukh, IAS',
      role: 'Collector & CALA, Thane District',
      scope: 'District Level: Thane & Palghar',
      alertText: 'Active Session: Competent Authority for Land Acquisition (CALA) for NH-48 & DFC corridors.'
    }
  };

  if (roleSelect) {
    roleSelect.addEventListener('change', () => {
      const selected = roleProfiles[roleSelect.value] || roleProfiles['central'];
      if (userName) userName.textContent = selected.name;
      if (userRole) userRole.textContent = selected.role;
      if (roleScopeBadge) roleScopeBadge.textContent = selected.scope;

      // Show brief notification
      showToastNotification(`Switched role to: ${selected.role}`);
    });
  }
}

function showToastNotification(message) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.backgroundColor = '#FFFFFF';
  toast.style.color = '#1C252E';
  toast.style.borderLeft = '4px solid #C45F43';
  toast.style.border = '1px solid rgba(182, 166, 146, 0.35)';
  toast.style.borderLeftWidth = '4px';
  toast.style.borderLeftColor = '#C45F43';
  toast.style.padding = '14px 20px';
  toast.style.borderRadius = '12px';
  toast.style.fontSize = '13px';
  toast.style.fontFamily = 'Plus Jakarta Sans, sans-serif';
  toast.style.fontWeight = '600';
  toast.style.boxShadow = '0 8px 24px -4px rgba(45, 35, 25, 0.12), 0 20px 40px -8px rgba(45, 35, 25, 0.08)';
  toast.style.zIndex = '99999';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '8px';
  toast.innerHTML = `<span style="color:#C45F43; font-size:16px;">📜</span> <span>${message}</span>`;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

/* ==========================================================================
   4. Prompt 2: State-wise Acquisition Progress Chart (Recharts-style SVG)
   ========================================================================== */
/* ==========================================================================
   4. State-wise Acquisition Progress Chart (Artisan Watercolor & Storytelling)
   ========================================================================== */
function initDashboardChart() {
  const svg = document.getElementById('svg-state-chart');
  const tooltip = document.getElementById('chart-tooltip');
  if (!svg) return;

  const chartData = [
    { state: 'Maharashtra', acquired: 34200, pending: 12800, narrative: 'Western Freight Corridor • Vasai-Palghar' },
    { state: 'Uttar Pradesh', acquired: 28900, pending: 15400, narrative: 'Ganga Expressway • Purvanchal Links' },
    { state: 'Gujarat', acquired: 22600, pending: 7900, narrative: 'Coastal Economic Zone • Bharuch-Surat' },
    { state: 'Odisha', acquired: 12720, pending: 8300, narrative: 'Greenfield Mineral Corridor • Sambalpur' }
  ];

  const maxVal = 50000;
  const svgWidth = 620;
  const svgHeight = 275;
  const margin = { top: 38, right: 25, bottom: 55, left: 65 };
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;

  // Clear existing
  svg.innerHTML = '';

  // SVG Namespace
  const ns = "http://www.w3.org/2000/svg";

  // Create Defs for Watercolor Gradients & Filters
  const defs = document.createElementNS(ns, 'defs');
  defs.innerHTML = `
    <!-- Watercolor Turbulence Filter for Organic Edges -->
    <filter id="artisan-watercolor" x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>

    <!-- Acquired Land: Deep Indigo into Forest Green Watercolor Wash -->
    <linearGradient id="grad-acquired-wash" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1C2B39" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#244633" stop-opacity="0.88"/>
      <stop offset="100%" stop-color="#38634B" stop-opacity="0.82"/>
    </linearGradient>

    <!-- Pending Land: Terracotta into Warm Ochre Watercolor Wash -->
    <linearGradient id="grad-pending-wash" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C45F43" stop-opacity="0.92"/>
      <stop offset="55%" stop-color="#DE7D63" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#D2832C" stop-opacity="0.80"/>
    </linearGradient>

    <!-- Subtle Deckle Shadow -->
    <filter id="bar-shadow" x="-10%" y="-5%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#2D2214" flood-opacity="0.08"/>
    </filter>
  `;
  svg.appendChild(defs);

  // Y-axis grid lines with warm paper ink color
  const yTicks = [0, 10000, 20000, 30000, 40000, 50000];
  yTicks.forEach(tick => {
    const y = margin.top + innerHeight - (tick / maxVal) * innerHeight;

    // Gridline
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', margin.left);
    line.setAttribute('x2', margin.left + innerWidth);
    line.setAttribute('y1', y);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', '#E8E1D5');
    line.setAttribute('stroke-dasharray', tick === 0 ? 'none' : '4 4');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);

    // Y-axis Label
    const text = document.createElementNS(ns, 'text');
    text.setAttribute('x', margin.left - 12);
    text.setAttribute('y', y + 4);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('font-family', 'Plus Jakarta Sans, sans-serif');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', '500');
    text.setAttribute('fill', '#6E7E8F');
    text.textContent = tick === 0 ? '0' : (tick / 1000) + 'k Ha';
    svg.appendChild(text);
  });

  // Groups for Bars
  const groupWidth = innerWidth / chartData.length;
  const barWidth = 30;
  const barGap = 8;

  chartData.forEach((d, i) => {
    const groupX = margin.left + i * groupWidth + (groupWidth - (barWidth * 2 + barGap)) / 2;

    // 1. Acquired Bar (Watercolor Indigo-Forest)
    const acqHeight = Math.max(8, (d.acquired / maxVal) * innerHeight);
    const acqY = margin.top + innerHeight - acqHeight;

    const rectAcq = document.createElementNS(ns, 'rect');
    rectAcq.setAttribute('x', groupX);
    rectAcq.setAttribute('y', acqY);
    rectAcq.setAttribute('width', barWidth);
    rectAcq.setAttribute('height', acqHeight);
    rectAcq.setAttribute('fill', 'url(#grad-acquired-wash)');
    rectAcq.setAttribute('filter', 'url(#artisan-watercolor)');
    rectAcq.setAttribute('rx', '7');
    rectAcq.setAttribute('class', 'chart-bar');
    rectAcq.setAttribute('data-state', d.state);
    rectAcq.setAttribute('data-type', 'Acquired & Possessed');
    rectAcq.setAttribute('data-value', d.acquired.toLocaleString('en-IN') + ' Ha');
    rectAcq.setAttribute('data-note', d.narrative);

    // Hand-drawn Seedling Motif above Acquired Bar
    const seedling = document.createElementNS(ns, 'path');
    seedling.setAttribute('d', `M ${groupX + 10} ${acqY - 4} c 0 -5 5 -8 7 -8 c 0 3 -2 7 -5 8 m -2 0 c 0 -4 -4 -6 -6 -6 c 0 3 2 5 4 6`);
    seedling.setAttribute('stroke', '#244633');
    seedling.setAttribute('stroke-width', '1.3');
    seedling.setAttribute('fill', '#DCE7DF');
    seedling.setAttribute('stroke-linecap', 'round');

    // 2. Pending Bar (Watercolor Terracotta-Ochre)
    const penHeight = Math.max(8, (d.pending / maxVal) * innerHeight);
    const penY = margin.top + innerHeight - penHeight;

    const rectPen = document.createElementNS(ns, 'rect');
    rectPen.setAttribute('x', groupX + barWidth + barGap);
    rectPen.setAttribute('y', penY);
    rectPen.setAttribute('width', barWidth);
    rectPen.setAttribute('height', penHeight);
    rectPen.setAttribute('fill', 'url(#grad-pending-wash)');
    rectPen.setAttribute('filter', 'url(#artisan-watercolor)');
    rectPen.setAttribute('rx', '7');
    rectPen.setAttribute('class', 'chart-bar');
    rectPen.setAttribute('data-state', d.state);
    rectPen.setAttribute('data-type', 'Statutory Clearance / Hearings');
    rectPen.setAttribute('data-value', d.pending.toLocaleString('en-IN') + ' Ha');
    rectPen.setAttribute('data-note', d.narrative);

    // Hand-drawn Compass/Marker Motif above Pending Bar
    const marker = document.createElementNS(ns, 'circle');
    marker.setAttribute('cx', groupX + barWidth + barGap + barWidth / 2);
    marker.setAttribute('cy', penY - 7);
    marker.setAttribute('r', '3');
    marker.setAttribute('stroke', '#C45F43');
    marker.setAttribute('stroke-width', '1.3');
    marker.setAttribute('fill', '#F8E3DD');

    // State Name (Serif font)
    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', groupX + barWidth + barGap / 2);
    label.setAttribute('y', margin.top + innerHeight + 20);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-family', 'Lora, Georgia, serif');
    label.setAttribute('font-size', '12.5');
    label.setAttribute('font-weight', '700');
    label.setAttribute('fill', '#1C252E');
    label.textContent = d.state;

    // Narrative percentage badge
    const pct = Math.round((d.acquired / (d.acquired + d.pending)) * 100);
    const subLabel = document.createElementNS(ns, 'text');
    subLabel.setAttribute('x', groupX + barWidth + barGap / 2);
    subLabel.setAttribute('y', margin.top + innerHeight + 36);
    subLabel.setAttribute('text-anchor', 'middle');
    subLabel.setAttribute('font-family', 'Plus Jakarta Sans, sans-serif');
    subLabel.setAttribute('font-size', '10.5');
    subLabel.setAttribute('font-weight', '700');
    subLabel.setAttribute('fill', '#244633');
    subLabel.textContent = `🌱 ${pct}% Settled`;

    svg.appendChild(rectAcq);
    svg.appendChild(seedling);
    svg.appendChild(rectPen);
    svg.appendChild(marker);
    svg.appendChild(label);
    svg.appendChild(subLabel);
  });

  // Attach hover tooltips with tactile paper styling
  const bars = svg.querySelectorAll('.chart-bar');
  bars.forEach(bar => {
    bar.addEventListener('mousemove', (e) => {
      const state = bar.getAttribute('data-state');
      const type = bar.getAttribute('data-type');
      const val = bar.getAttribute('data-value');
      const note = bar.getAttribute('data-note');

      if (tooltip) {
        tooltip.style.display = 'block';
        tooltip.innerHTML = `
          <div style="font-family:Lora, serif; font-size:13.5px; font-weight:700; color:#1C2B39; margin-bottom:3px; display:flex; align-items:center; gap:6px;">
            <span>📍 ${state}</span>
          </div>
          <div style="font-size:11px; color:#6E7E8F; margin-bottom:2px;">${type}:</div>
          <div style="font-size:15px; font-weight:800; color:#C45F43; margin-bottom:4px;">${val}</div>
          <div style="font-size:10.5px; color:#485664; border-top:1px dashed #D2C6B6; padding-top:4px;">${note}</div>
        `;

        const rect = svg.getBoundingClientRect();
        tooltip.style.left = (e.clientX - rect.left + 16) + 'px';
        tooltip.style.top = (e.clientY - rect.top - 24) + 'px';
      }
    });

    bar.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.style.display = 'none';
    });
  });
}

/* ==========================================================================
   5. Prompt 3: Proposal Submission Multi-Step Form
   ========================================================================== */
function initProposalWizard() {
  const steps = [
    document.getElementById('step-panel-1'),
    document.getElementById('step-panel-2'),
    document.getElementById('step-panel-3'),
    document.getElementById('step-panel-4')
  ];

  const stepNavItems = document.querySelectorAll('.step-item');
  let currentStep = 1;

  function showStep(stepNum) {
    if (stepNum < 1 || stepNum > 4) return;
    currentStep = stepNum;

    // Update panels
    steps.forEach((panel, idx) => {
      if (panel) {
        panel.classList.toggle('active', idx + 1 === currentStep);
      }
    });

    // Update stepper header
    stepNavItems.forEach((btn, idx) => {
      const btnStep = idx + 1;
      btn.classList.remove('active', 'completed');
      if (btnStep === currentStep) {
        btn.classList.add('active');
      } else if (btnStep < currentStep) {
        btn.classList.add('completed');
      }
    });
  }

  // Stepper Header click navigation
  stepNavItems.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      showStep(idx + 1);
    });
  });

  // Next and Prev Buttons
  const btnNext1 = document.getElementById('btn-step1-next');
  const btnNext2 = document.getElementById('btn-step2-next');
  const btnNext3 = document.getElementById('btn-step3-next');
  const btnSubmit = document.getElementById('btn-step4-submit');

  const btnPrev2 = document.getElementById('btn-step2-prev');
  const btnPrev3 = document.getElementById('btn-step3-prev');
  const btnPrev4 = document.getElementById('btn-step4-prev');
  const btnCancel = document.getElementById('btn-proposal-cancel');

  if (btnNext1) btnNext1.addEventListener('click', () => {
    const projName = document.getElementById('prop-project-name');
    if (projName && !projName.value.trim()) {
      alert('Please enter the Project Name before proceeding.');
      projName.focus();
      return;
    }
    showStep(2);
  });

  if (btnNext2) btnNext2.addEventListener('click', () => showStep(3));
  if (btnNext3) btnNext3.addEventListener('click', () => showStep(4));

  if (btnPrev2) btnPrev2.addEventListener('click', () => showStep(1));
  if (btnPrev3) btnPrev3.addEventListener('click', () => showStep(2));
  if (btnPrev4) btnPrev4.addEventListener('click', () => showStep(3));

  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel? Any unsaved proposal data will be reset.')) {
        document.getElementById('proposal-master-form').reset();
        showStep(1);
      }
    });
  }

  if (btnSubmit) {
    btnSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      const refNo = 'PROP/2026/MHA/' + Math.floor(1000 + Math.random() * 9000);
      alert(`Proposal Submitted Successfully!\n\nReference ID: ${refNo}\nStatutory Notice: Forwarded to Principal Secretary (Revenue) and CALA for Section 4 SIA verification.`);
      showToastNotification(`New Proposal ${refNo} Registered.`);
      showStep(1);
      document.getElementById('proposal-master-form').reset();
    });
  }

  // Save Draft button
  const btnSaveDraft = document.getElementById('btn-proposal-draft');
  if (btnSaveDraft) {
    btnSaveDraft.addEventListener('click', () => {
      showToastNotification('Draft proposal saved with temporary ID: DRAFT/2026/902');
    });
  }
}

/* ==========================================================================
   6. Prompt 4: GIS Spatial Tracking Viewer & Interactive Cadastral Parcels
   ========================================================================== */
function initGISMapViewer() {
  const popupCard = document.getElementById('gis-parcel-popup');
  const popupClose = document.getElementById('popup-close-btn');
  const polygons = document.querySelectorAll('.parcel-polygon');

  // Popup fields
  const pId = document.getElementById('pop-parcel-id');
  const pStatus = document.getElementById('pop-status');
  const pArea = document.getElementById('pop-area');
  const pKhasra = document.getElementById('pop-khasra');
  const pVillage = document.getElementById('pop-village');
  const pOwner = document.getElementById('pop-owner');
  const pAmount = document.getElementById('pop-amount');

  // Parcel mock database
  const parcelDatabase = {
    '409A': {
      status: 'Compensation Paid',
      badgeClass: 'badge-green',
      area: '2.4 Hectares',
      khasra: '142/3',
      village: 'Navghar (Taluka: Vasai)',
      owner: 'Smt. Shakuntala Patil & 2 Others',
      amount: '₹ 1,48,20,000'
    },
    '409B': {
      status: 'Sec 19 Notice Issued',
      badgeClass: 'badge-saffron',
      area: '1.8 Hectares',
      khasra: '142/4',
      village: 'Navghar (Taluka: Vasai)',
      owner: 'Shri Ramchandra G. Mhatre',
      amount: '₹ 1,12,50,000 (Award Drafted)'
    },
    '410': {
      status: 'Court Stay / Disputed',
      badgeClass: 'badge-rejected',
      area: '3.1 Hectares',
      khasra: '143/1',
      village: 'Chinchoti (Taluka: Vasai)',
      owner: 'Tribal Co-operative Society',
      amount: '₹ 1,94,40,000 (Escrow Frozen)'
    },
    '411': {
      status: 'Compensation Disbursed',
      badgeClass: 'badge-green',
      area: '4.5 Hectares',
      khasra: '144/2',
      village: 'Chinchoti (Taluka: Vasai)',
      owner: 'Shri Ganesh Narayan Raut',
      amount: '₹ 2,85,60,000 (PFMS Credited)'
    },
    '412': {
      status: 'Possession Taken',
      badgeClass: 'badge-green',
      area: '2.9 Hectares',
      khasra: '145/1A',
      village: 'Navghar',
      owner: 'Gram Panchayat Forest Land',
      amount: 'Inter-Departmental Transfer'
    }
  };

  polygons.forEach(poly => {
    poly.addEventListener('click', (e) => {
      const parcelId = poly.getAttribute('data-parcel-id');
      const data = parcelDatabase[parcelId];
      if (!data || !popupCard) return;

      pId.textContent = `Parcel ID: ${parcelId}`;
      pStatus.textContent = data.status;
      pArea.textContent = data.area;
      pKhasra.textContent = data.khasra;
      pVillage.textContent = data.village;
      pOwner.textContent = data.owner;
      pAmount.textContent = data.amount;

      // Position popup near clicked element or fixed coordinate
      const rect = poly.getBoundingClientRect();
      const parentRect = document.querySelector('.gis-viewport-wrapper').getBoundingClientRect();

      let leftPos = rect.left - parentRect.left + 20;
      let topPos = rect.top - parentRect.top - 10;

      // Keep within bounds
      if (leftPos + 290 > parentRect.width) leftPos = parentRect.width - 300;
      if (topPos + 260 > parentRect.height) topPos = parentRect.height - 270;
      if (topPos < 10) topPos = 20;

      popupCard.style.left = leftPos + 'px';
      popupCard.style.top = topPos + 'px';
      popupCard.style.display = 'block';

      // Highlight active polygon
      polygons.forEach(p => p.style.strokeWidth = '1.5');
      poly.style.strokeWidth = '3.5';
    });
  });

  if (popupClose) {
    popupClose.addEventListener('click', () => {
      if (popupCard) popupCard.style.display = 'none';
    });
  }

  // Layer Toggles
  const toggleAcquired = document.getElementById('toggle-acquired');
  const toggleVillages = document.getElementById('toggle-villages');
  const toggleHighway = document.getElementById('toggle-highway');
  const toggleLabels = document.getElementById('toggle-labels');

  if (toggleAcquired) {
    toggleAcquired.addEventListener('change', (e) => {
      document.querySelectorAll('.parcel-polygon.acquired').forEach(p => {
        p.style.display = e.target.checked ? 'block' : 'none';
      });
    });
  }

  if (toggleVillages) {
    toggleVillages.addEventListener('change', (e) => {
      const villageLayer = document.getElementById('gis-village-layer');
      if (villageLayer) villageLayer.style.display = e.target.checked ? 'block' : 'none';
    });
  }

  if (toggleHighway) {
    toggleHighway.addEventListener('change', (e) => {
      const highwayLayer = document.getElementById('gis-highway-layer');
      if (highwayLayer) highwayLayer.style.display = e.target.checked ? 'block' : 'none';
    });
  }

  if (toggleLabels) {
    toggleLabels.addEventListener('change', (e) => {
      document.querySelectorAll('.parcel-text').forEach(t => {
        t.style.display = e.target.checked ? 'block' : 'none';
      });
    });
  }
}

/* ==========================================================================
   7. IRCEP/Railbhoomi Reference Login Modal & Captcha
   ========================================================================== */
function initLoginModal() {
  const modal = document.getElementById('login-modal');
  const openBtn = document.getElementById('btn-open-login-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const btnRefreshCaptcha = document.getElementById('btn-refresh-captcha');
  const btnAudioCaptcha = document.getElementById('btn-audio-captcha');
  const captchaCanvas = document.getElementById('captcha-text');
  const loginForm = document.getElementById('gov-auth-form');

  function generateCaptcha() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (captchaCanvas) captchaCanvas.textContent = code;
  }

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      generateCaptcha();
      modal.classList.add('active');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (btnRefreshCaptcha) {
    btnRefreshCaptcha.addEventListener('click', generateCaptcha);
  }

  if (btnAudioCaptcha) {
    btnAudioCaptcha.addEventListener('click', () => {
      const code = captchaCanvas ? captchaCanvas.textContent : '';
      if ('speechSynthesis' in window && code) {
        const utterance = new SpeechSynthesisUtterance(code.split('').join(' '));
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      } else {
        alert(`Captcha Audio: ${code}`);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredCaptcha = document.getElementById('captcha-input').value.trim();
      const actualCaptcha = captchaCanvas ? captchaCanvas.textContent : '';

      if (enteredCaptcha.toUpperCase() !== actualCaptcha) {
        alert('Invalid Captcha Code. Please re-enter the code displayed.');
        generateCaptcha();
        return;
      }

      alert('Single Sign-On (Parichay / Jan Parichay) Authentication Verified.\nSession logged into National Land Acquisition & Management System.');
      modal.classList.remove('active');
      showToastNotification('User Authenticated via National Single Sign-On');
    });
  }
}
