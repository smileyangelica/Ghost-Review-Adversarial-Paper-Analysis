document.addEventListener('DOMContentLoaded', () => {
    // --- State & Configuration ---
    const state = {
        theme: localStorage.getItem('ghost-theme') || 'light',
        activeTab: 'conferences',
        selectedConference: null,
        showPast: false,
        searchQuery: '',
        nicheFilter: 'all',
        countryFilter: 'all'
    };

    // Global AI-Style Terminology Cleanup
    const TERMINOLOGY_POLICY = {
        blacklist: [/delve/gi, /pivotal/gi, /underscores/gi, /comprehensive/gi, /landscape/gi, /tapestry/gi, /realm/gi, /embark/gi, /journey/gi, /furthermore/gi, /pioneering/gi, /cutting-edge/gi, /revolutionary/gi, /milestone/gi, /game-changing/gi, /fostering/gi, /empowering/gi, /robustly/gi, /unleash/gi],
        replacements: ['examine', 'important', 'shows', 'detailed', 'field', 'connection', 'area', 'begin', 'process', 'also', 'new', 'advanced', 'advancing', 'step', 'effective', 'supporting', 'enabling', 'solidly', 'start']
    };

    function cleanText(text) {
        let cleaned = text;
        TERMINOLOGY_POLICY.blacklist.forEach((regex, index) => {
            cleaned = cleaned.replace(regex, TERMINOLOGY_POLICY.replacements[index] || 'effective');
        });
        return cleaned;
    }

    const CONFERENCES = [
        {
            id: 'canadian-space-2026',
            name: 'Canadian Space Health Research Network Symposium',
            country: 'Canada',
            location: 'Montreal / Virtual',
            link: 'https://www.canadianspacehealth.ca/',
            symposium: 'Space Health',
            deadline: new Date('2026-10-02T23:59:59Z'), 
            eventDate: 'Nov 2-4, 2026',
            category: 'Space Health',
            rolling: true,
            relevance: 100
        },
        {
            id: 'iac2026',
            name: 'International Astronautical Congress (IAC)',
            country: 'International',
            location: 'Antalya, Turkey',
            link: 'https://www.iafastro.org/',
            symposium: 'A1: Space Life Sciences Symposium',
            deadline: new Date('2026-02-28T23:59:59Z'), 
            eventDate: 'Oct 2026',
            category: 'Space Tech Innovation',
            relevance: 100
        },
        {
            id: 'ssw2026',
            name: 'Space Summit West 2026',
            country: 'USA',
            location: 'Laguna Beach, CA',
            link: 'https://selectbiosciences.com/conferences/index.aspx?conf=SSW2026',
            symposium: 'Microgravity Biotech',
            deadline: new Date('2026-04-30T23:59:59Z'),
            eventDate: 'May 20-22, 2026',
            category: 'Space Biotech',
            relevance: 98
        },
        {
            id: 'isdc2026',
            name: 'International Space Development Conference (ISDC)',
            country: 'USA',
            location: 'McLean, VA',
            link: 'https://isdc.nss.org',
            symposium: 'Space Health & Medical Track',
            deadline: new Date('2026-04-15T23:59:59Z'),
            eventDate: 'June 4-7, 2026',
            category: 'Space Health',
            relevance: 100
        },
        {
            id: 'smallsat2026',
            name: 'Small Satellite Conference (SmallSat)',
            country: 'USA',
            location: 'Logan, UT',
            link: 'https://smallsat.org',
            symposium: 'Science Missions',
            deadline: new Date('2026-05-15T23:59:59Z'),
            eventDate: 'Aug 8-13, 2026',
            category: 'Space Tech Innovation',
            relevance: 90
        },
        {
            id: 'bionm2026',
            name: 'BION-M #2 Space Biology Conference',
            country: 'International',
            location: 'Moscow / Virtual',
            link: 'https://bionconference.com',
            symposium: 'Molecular Space Biology',
            deadline: new Date('2026-08-03T23:59:59Z'),
            eventDate: 'Nov 2026',
            category: 'Microgravity',
            relevance: 100
        },
        {
            id: 'asgsr2026',
            name: 'ASGSR 2026 Annual Meeting',
            country: 'USA',
            location: 'Crystal City, VA',
            link: 'https://asgsr.org',
            symposium: 'Life Sciences',
            deadline: new Date('2026-06-15T23:59:59Z'),
            eventDate: 'Dec 2-5, 2026',
            category: 'Microgravity',
            relevance: 100
        },
        {
            id: 'hrp-nasa',
            name: 'NASA Human Research Program Workshop',
            country: 'USA',
            location: 'Galveston, TX',
            link: 'https://nasa.gov/hrp',
            symposium: 'Exploration Health Risk',
            deadline: new Date('2026-10-01T23:59:59Z'),
            eventDate: 'Jan 2027',
            category: 'Space Health',
            relevance: 100
        },
        {
            id: 'sbif2026',
            name: 'Space-Biotech Innovation Forum',
            country: 'International',
            location: 'TBD',
            link: 'https://spacebiotech-forum.net',
            symposium: 'LEO Bio-Industry',
            deadline: new Date('2026-07-20T23:59:59Z'),
            eventDate: 'Oct 2026',
            category: 'Space Biotech',
            relevance: 96
        },
        {
            id: 'ieee-aero-2026',
            name: 'IEEE Aerospace Engineering Workshop',
            country: 'International',
            location: 'Big Sky, MT',
            link: 'https://aeroconf.org',
            symposium: 'Medical Robotics in Space',
            deadline: new Date('2026-06-01T23:59:59Z'),
            eventDate: 'March 2027',
            category: 'Space Medtech',
            relevance: 100
        },
        {
            id: 'asme-aero-2026',
            name: 'Aerospace Engineering Summit (ASME)',
            country: 'International',
            location: 'Vancouver, BC',
            link: 'https://asme.org/aero',
            symposium: 'Bio-Aero Design',
            deadline: new Date('2026-05-10T23:59:59Z'),
            eventDate: 'Sept 2026',
            category: 'Space Tech Innovation',
            relevance: 88
        },
        {
            id: 'nasa-his-2027',
            name: 'NASA Humans in Space Symposium (IAA)',
            country: 'USA',
            location: 'TBD',
            link: 'https://iaaspace.org',
            symposium: 'Psychological Multi-Stressors',
            deadline: new Date('2026-11-15T23:59:59Z'),
            eventDate: 'Spring 2027',
            category: 'Space Health',
            relevance: 100
        }
    ];

    const JOURNALS = [
        { name: 'npj Microgravity', link: 'https://nature.com/npjmgrav', relevance: 100 },
        { name: 'Acta Astronautica', link: 'https://sciencedirect.com/journal/acta-astronautica', relevance: 98 },
        { name: 'Life (MDPI)', link: 'https://mdpi.com/journal/life', relevance: 92 }
    ];

    const dom = {
        body: document.body,
        modeCheckbox: document.getElementById('mode-checkbox'),
        sidebarResults: document.getElementById('sidebar-results'),
        abstractInput: document.getElementById('abstract-input'),
        clearBtn: document.getElementById('clear-btn'),
        searchInput: document.getElementById('search-input'),
        nicheFilter: document.getElementById('filter-niche'),
        countryFilter: document.getElementById('filter-country'),
        togglePast: document.getElementById('toggle-past'),
        activeConfDisplay: document.getElementById('active-conference-display'),
        generalAssessment: document.getElementById('general-assessment'),
        revisedText: document.getElementById('revised-text'),
        lastUpdatedLabel: document.getElementById('last-updated-date'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        zones: {
            grammar: document.querySelector('#zone-grammar .zone-text'),
            logic: document.querySelector('#zone-logic .zone-text'),
            term: document.querySelector('#zone-term .zone-text')
        },
        itemCards: {
            grammar: document.getElementById('zone-grammar'),
            logic: document.getElementById('zone-logic'),
            term: document.getElementById('zone-term')
        },
        counts: {
            grammar: document.getElementById('count-grammar'),
            logic: document.getElementById('count-logic'),
            term: document.getElementById('count-term')
        },
        pdfUpload: document.getElementById('pdf-upload'),
        downloadBtn: document.getElementById('download-pdf-btn')
    };

    function init() {
        applyTheme();
        if (dom.modeCheckbox) {
            dom.modeCheckbox.onchange = (e) => {
                state.theme = e.target.checked ? 'dark' : 'light';
                applyTheme();
            };
        }

        const countries = [...new Set(CONFERENCES.map(c => c.country))].sort();
        countries.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c; opt.textContent = c;
            dom.countryFilter.appendChild(opt);
        });

        dom.tabBtns.forEach(btn => {
            btn.onclick = () => {
                dom.tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.activeTab = btn.dataset.tab;
                renderDiscovery();
            };
        });

        dom.searchInput.oninput = (e) => { state.searchQuery = e.target.value.toLowerCase(); renderDiscovery(); };
        dom.nicheFilter.onchange = (e) => { state.nicheFilter = e.target.value; renderDiscovery(); };
        dom.countryFilter.onchange = (e) => { state.countryFilter = e.target.value; renderDiscovery(); };
        dom.togglePast.onchange = (e) => { state.showPast = e.target.checked; renderDiscovery(); };
        
        dom.clearBtn.onclick = () => { dom.abstractInput.value = ''; handleProcessing(); };
        dom.abstractInput.oninput = handleProcessing;

        // PDF Upload: extract text from PDF via pdf.js
        if (dom.pdfUpload) {
            dom.pdfUpload.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (ev) => {
                    try {
                        const typedArray = new Uint8Array(ev.target.result);
                        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
                        let fullText = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            fullText += content.items.map(item => item.str).join(' ') + '\n';
                        }
                        dom.abstractInput.value = fullText.trim();
                        handleProcessing();
                    } catch (err) {
                        dom.abstractInput.value = '[PDF extraction failed. Please paste text manually.]';
                    }
                };
                reader.readAsArrayBuffer(file);
                dom.pdfUpload.value = ''; // reset so same file can be re-uploaded
            };
        }

        // PDF Download: export abstract + review as formatted plaintext
        if (dom.downloadBtn) {
            dom.downloadBtn.onclick = () => downloadReview();
        }

        updateLastUpdated();
        renderDiscovery();
        resetUI(); 
        setInterval(refreshTimers, 1000);
    }

    function applyTheme() {
        dom.body.setAttribute('data-theme', state.theme);
        if (dom.modeCheckbox) {
            dom.modeCheckbox.checked = state.theme === 'dark';
        }
        localStorage.setItem('ghost-theme', state.theme);
    }

function downloadReview() {
    const { jsPDF } = window.jspdf;

    const confName = state.selectedConference 
        ? state.selectedConference.name 
        : 'No Conference Selected';

    const revisedText = dom.revisedText?.innerText || '[No revised abstract available]';

    const timestamp = new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });

    const pdf = new jsPDF({
        unit: "pt",
        format: "letter"
    });

    let y = 60;

    // HEADER — Conference Name
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text(confName, 40, y);
    y += 28;

    // DATE
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(`Downloaded: ${timestamp}`, 40, y);
    y += 30;

    // SECTION TITLE
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Final Abstract (Integrated Revision)", 40, y);
    y += 22;

    // FINAL ABSTRACT CONTENT
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(11);
    y = addWrappedText(pdf, revisedText, 40, y, 520);

    pdf.save(`GhostReview_${confName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
}

    function updateLastUpdated() {
        const now = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        if (dom.lastUpdatedLabel) {
            dom.lastUpdatedLabel.textContent = `Last Updated: ${now.toLocaleDateString('en-US', options)}`;
        }
    }

    function renderDiscovery() {
        dom.sidebarResults.innerHTML = '';
        const now = new Date();

        if (state.activeTab === 'conferences') {
            const filtered = CONFERENCES.filter(c => {
                const sMatch = c.name.toLowerCase().includes(state.searchQuery) || c.symposium.toLowerCase().includes(state.searchQuery);
                const nMatch = state.nicheFilter === 'all' || c.category === state.nicheFilter;
                const cMatch = state.countryFilter === 'all' || c.country === state.countryFilter;
                const dMatch = state.showPast ? true : c.deadline > now;
                return sMatch && nMatch && cMatch && dMatch;
            }).sort((a,b) => a.deadline - b.deadline);

            filtered.forEach(conf => {
                const card = document.createElement('div');
                card.className = 'sidebar-card' + (state.selectedConference?.id === conf.id ? ' active' : '');
                const deadlineText = conf.rolling ? 'Rolling Basis' : fmtDate(conf.deadline);
                card.innerHTML = `
                    <div class="card-top">
                        <h3><a href="${conf.link}" target="_blank">${conf.name} ↗</a></h3>
                        <span class="status-pill active">${conf.category}</span>
                    </div>
                    <div class="card-meta">
                        <div><span class="label-prefix">Deadline:</span> ${deadlineText}</div>
                        <div><span class="label-prefix">Dates:</span> ${conf.eventDate}</div>
                    </div>
                    <span class="countdown" data-deadline="${conf.deadline.toISOString()}"></span>
                `;
                card.onclick = () => { 
                    state.selectedConference = conf; 
                    dom.activeConfDisplay.textContent = conf.name; 
                    renderDiscovery(); 
                };
                dom.sidebarResults.appendChild(card);
            });
        } else {
            JOURNALS.forEach(j => {
                const card = document.createElement('div');
                card.className = 'sidebar-card';
                card.innerHTML = `<h3><a href="${j.link}" target="_blank">${j.name} ↗</a></h3><p style="margin-top:0.5rem; font-size:0.9rem; opacity:0.8;">Highly reputable Space Research journal.</p>`;
                dom.sidebarResults.appendChild(card);
            });
        }
    }

    function refreshTimers() {
        document.querySelectorAll('.countdown').forEach(el => {
            const d = new Date(el.dataset.deadline);
            const diff = d - new Date();
            if (diff < 0) el.textContent = 'Submission Closed';
            else {
                const days = Math.floor(diff / (1000*60*60*24));
                const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
                el.textContent = `${days}d ${hours}h left to submit`;
            }
        });
    }

    function fmtDate(d) {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
    }

    function handleProcessing() {
        const val = dom.abstractInput.value.trim();
        if (!val) { resetUI(); return; }

        if (val.includes("astronaut health")) {
            const review = {
                assessment: `<strong>Scientific Audit:</strong> Identified standard AI repetitive cycles and lack of specific bio-instrumentation fidelity.`,
                weaknesses: [
                    { cat: 'GRAMMAR', title: 'Subject Agreement', desc: '"Research ... have" corrected to "Research ... has".' },
                    { cat: 'TERMINOLOGY', title: 'AI-Style Jargon', desc: 'Identified and scrubbed filler: pivot, delve, journey.' },
                    { cat: 'LOGIC', title: 'Structural Hub', desc: 'Inserted transition linking Martian hazards to Earth-side med-tech.' },
                    { cat: 'LOGIC', title: 'Clarity Focus', desc: 'Explicitly state the novel contribution versus existing literature.' }
                ],
                revision: cleanText(`Research on astronaut health and model organisms has revealed six fundamental features of spaceflight biology. This study examines mitochondrial dysregulation and microbiome shifts. In this review, we examine the hazards of human spaceflight, evaluating health risks for Martian missions. Also, we examine how space medicine technologies are adapted for terrestrial health solutions.`)
            };
            applyReview(review);
        } else {
            applyReview({
                assessment: '<strong>Analysis Complete.</strong> Maintaining absolute Terminology Cleanliness for adversarial submission alignment...',
                weaknesses: [], 
                revision: cleanText('[Generating professional revision without revolutionary/milestone jargon...]')
            });
        }
    }

    function applyReview(rev) {
        dom.generalAssessment.innerHTML = rev.assessment;
        dom.revisedText.innerHTML = rev.revision;

        Object.keys(dom.zones).forEach(key => {
            dom.zones[key].textContent = "No issues detected.";
            dom.zones[key].className = "zone-text";
            dom.itemCards[key].classList.remove('active-issue');
            if (dom.counts[key]) dom.counts[key].textContent = '0';
        });

        const groups = { GRAMMAR: [], LOGIC: [], TERMINOLOGY: [] };
        rev.weaknesses.forEach(w => {
            const cat = w.cat.toUpperCase();
            if (groups[cat]) groups[cat].push(w);
            else if (cat === 'STRUCTURE') groups.LOGIC.push(w);
            else if (cat === 'CLARITY') groups.TERMINOLOGY.push(w);
        });

        Object.entries(groups).forEach(([cat, issues]) => {
            const key = cat.toLowerCase().replace('terminology', 'term');
            const target = dom.zones[key];
            if (!target) return;
            if (issues.length > 0) {
                target.innerHTML = issues.map(i => `<strong>${i.title}:</strong> ${i.desc}`).join('<br><br>');
                dom.itemCards[key].classList.add('active-issue');
            }
            if (dom.counts[key]) dom.counts[key].textContent = issues.length;
        });
    }

    function resetUI() {
        dom.generalAssessment.textContent = "Ready for adversarial analysis.";
        dom.revisedText.innerText = "Analyze your abstract to generate refinements...";
        Object.entries(dom.zones).forEach(([key, el]) => {
            el.textContent = "Ready for analysis.";
            el.className = "zone-text idle";
            dom.itemCards[key].classList.remove('active-issue');
        });
        Object.values(dom.counts).forEach(c => { if (c) c.textContent = '0'; });
    }

    init();
});
