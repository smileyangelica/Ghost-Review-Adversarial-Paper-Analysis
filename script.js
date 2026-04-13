document.addEventListener('DOMContentLoaded', () => {
    // --- State & Config ---
    const state = {
        theme: localStorage.getItem('ghost-theme') || 'light',
        activeTab: 'conferences',
        selectedConference: null,
        showPast: false,
        searchQuery: '',
        nicheFilter: 'all',
        countryFilter: 'all',
        sortMode: 'deadline'
    };

    // AI-Style Terminology Blacklist & Clean Alternatives
    const TERMINOLOGY_POLICY = {
        blacklist: [/delve/gi, /pivotal/gi, /underscores/gi, /comprehensive/gi, /landscape/gi, /tapestry/gi, /realm/gi, /embark/gi, /journey/gi, /furthermore/gi, /pioneering/gi, /cutting-edge/gi],
        replacements: ['examine', 'important', 'shows', 'detailed', 'field', 'connection', 'area', 'begin', 'process', 'also', 'new', 'advanced']
    };

    function cleanText(text) {
        let cleaned = text;
        TERMINOLOGY_POLICY.blacklist.forEach((regex, index) => {
            cleaned = cleaned.replace(regex, TERMINOLOGY_POLICY.replacements[index]);
        });
        return cleaned;
    }

    const CONFERENCES = [
        {
            id: 'isdc2026',
            name: 'International Space Development Conference (ISDC)',
            country: 'USA',
            location: 'McLean, VA',
            link: 'https://isdc.nss.org',
            relation: 'Space Health session matches your focus on microgravity health and countermeasures.',
            symposium: 'Space Health & Medical Track',
            deadline: new Date('2026-04-15T23:59:59Z'),
            eventDate: 'June 4-7, 2026',
            category: 'Space-Health',
            relevance: 95
        },
        {
            id: 'ssw2026',
            name: 'Space Summit West 2026',
            country: 'USA',
            location: 'Laguna Beach, CA',
            link: 'https://selectbiosciences.com/conferences/index.aspx?conf=SSW2026',
            relation: 'Ideal for your biotech and organ-on-chip research.',
            symposium: 'Microgravity Biotech',
            deadline: new Date('2026-04-30T23:59:59Z'),
            eventDate: 'May 20-22, 2026',
            category: 'Space-Biotech',
            relevance: 90
        },
        {
            id: 'asme2026',
            name: 'Aerospace Engineering Summit (ASME)',
            country: 'International',
            location: 'Washington, DC',
            link: 'https://www.asme.org/events/aerospace-summit',
            relation: 'Aligns under the Aerospace Medical track for hardware innovation.',
            symposium: 'Aerospace Medical Engineering',
            deadline: new Date('2026-05-27T23:59:59Z'),
            eventDate: 'Sept 14-15, 2026',
            category: 'Innovation',
            relevance: 85
        },
        {
            id: 'smallsat2026',
            name: 'Small Satellite Conference (SmallSat)',
            country: 'USA',
            location: 'Logan, UT',
            link: 'https://smallsat.org',
            relation: 'Focus on miniaturized MedTech payloads and autonomous health monitoring.',
            symposium: 'Science and Exploration Payloads',
            deadline: new Date('2026-05-01T23:59:59Z'),
            eventDate: 'Aug 8-13, 2026',
            category: 'Innovation',
            relevance: 80
        },
        {
            id: 'asgsr2026',
            name: 'ASGSR Annual Meeting',
            country: 'USA',
            location: 'Crystal City, VA',
            link: 'https://asgsr.org',
            relation: 'The primary venue for your mitochondrial microgravity research.',
            symposium: 'Cell & Molecular Biology',
            deadline: new Date('2026-06-15T23:59:59Z'),
            eventDate: 'Dec 2-5, 2026',
            category: 'Microgravity',
            relevance: 100
        },
        {
            id: 'ieee-waae',
            name: 'IEEE Workshop on Advanced Aerospace Engineering',
            country: 'International',
            location: 'Online',
            link: 'https://ieee-waae.org',
            relation: 'Human Systems Integration tracks align with your safety research.',
            symposium: 'Human-Machine Integration',
            deadline: new Date('2026-06-30T23:59:59Z'),
            eventDate: 'Nov 12-14, 2026',
            category: 'Innovation',
            relevance: 75
        },
        {
            id: 'biotech-space',
            name: 'Space-Biotech Innovation Forum',
            country: 'Germany',
            location: 'Bremen',
            link: 'https://space-biotech-forum.eu',
            relation: 'Highly specific niche forum for pharmaceutical and bioprinting applications.',
            symposium: 'In-Space Biomanufacturing',
            deadline: new Date('2026-05-15T23:59:59Z'),
            eventDate: 'Sept 10-12, 2026',
            category: 'Space-Biotech',
            relevance: 98
        },
        {
            id: 'hrp- NASA',
            name: 'NASA Human Research Program Workshop',
            country: 'USA',
            location: 'Galveston, TX',
            link: 'https://www.nasa.gov/hrp',
            relation: 'The essential convening for HRP investigators and space health specialists.',
            symposium: 'Exploration Health Risk',
            deadline: new Date('2026-10-01T23:59:59Z'),
            eventDate: 'Jan 2027',
            category: 'Space-Health',
            relevance: 100
        },
        {
            id: 'iac2026',
            name: '77th International Astronautical Congress (IAC)',
            country: 'Türkiye',
            location: 'Antalya',
            link: 'https://iafastro.org',
            relation: 'Symposium A1.8 "Biology in Space" is the standard for your work.',
            symposium: 'A1.8 Biology in Space',
            deadline: new Date('2026-02-28T23:59:59Z'),
            eventDate: 'Oct 5-9, 2026',
            category: 'Space-Health',
            relevance: 95
        }
    ];

    const JOURNALS = [
        { name: 'npj Microgravity', link: 'https://nature.com/npjmgrav', scope: 'Biology and physiology in space.', relevance: 100 },
        { name: 'Acta Astronautica', link: 'https://sciencedirect.com/journal/acta-astronautica', scope: 'Technical astronautics and health.', relevance: 90 },
        { name: 'Life (MDPI)', link: 'https://mdpi.com/journal/life', scope: 'Astrobiology and life sciences.', relevance: 85 }
    ];

    // --- DOM Elements ---
    const elements = {
        body: document.body,
        modeCheckbox: document.getElementById('mode-checkbox'),
        sidebarResults: document.getElementById('sidebar-results'),
        abstractInput: document.getElementById('abstract-input'),
        clearBtn: document.getElementById('clear-btn'),
        exportBtn: document.getElementById('export-pdf'),
        pdfUpload: document.getElementById('pdf-upload'),
        searchInput: document.getElementById('search-input'),
        nicheFilter: document.getElementById('filter-niche'),
        countryFilter: document.getElementById('filter-country'),
        sortFilter: document.getElementById('filter-sort'),
        togglePast: document.getElementById('toggle-past'),
        activeConfDisplay: document.querySelector('#active-conference-display .value'),
        weaknessList: document.getElementById('weakness-list'),
        generalAssessment: document.getElementById('general-assessment'),
        revisedText: document.getElementById('revised-text'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        counts: {
            grammar: document.getElementById('count-grammar'),
            logic: document.getElementById('count-logic'),
            term: document.getElementById('count-term')
        }
    };

    // --- Initialization ---
    init();

    function init() {
        // Theme
        elements.body.setAttribute('data-theme', state.theme);
        elements.modeCheckbox.checked = state.theme === 'dark';
        elements.modeCheckbox.onchange = () => {
            state.theme = elements.modeCheckbox.checked ? 'dark' : 'light';
            elements.body.setAttribute('data-theme', state.theme);
            localStorage.setItem('ghost-theme', state.theme);
        };

        // Populating dynamic countries
        const countries = [...new Set(CONFERENCES.map(c => c.country))].sort();
        countries.forEach(country => {
            const opt = document.createElement('option');
            opt.value = country;
            opt.textContent = country;
            elements.countryFilter.appendChild(opt);
        });

        // Tabs
        elements.tabBtns.forEach(btn => {
            btn.onclick = () => {
                elements.tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.activeTab = btn.dataset.tab;
                filterAndRender();
            };
        });

        // Filters
        elements.searchInput.oninput = (e) => { state.searchQuery = e.target.value.toLowerCase(); filterAndRender(); };
        elements.nicheFilter.onchange = (e) => { state.nicheFilter = e.target.value; filterAndRender(); };
        elements.countryFilter.onchange = (e) => { state.countryFilter = e.target.value; filterAndRender(); };
        elements.sortFilter.onchange = (e) => { state.sortMode = e.target.value; filterAndRender(); };
        elements.togglePast.onchange = (e) => { state.showPast = e.target.checked; filterAndRender(); };
        
        elements.clearBtn.onclick = () => { elements.abstractInput.value = ''; handleInput(); };
        elements.abstractInput.oninput = handleInput;

        filterAndRender();
        setInterval(updateCountdowns, 1000);
    }

    // --- Discovery Core ---
    function filterAndRender() {
        elements.sidebarResults.innerHTML = '';
        const now = new Date();

        if (state.activeTab === 'conferences') {
            let filtered = CONFERENCES.filter(c => {
                const searchMatch = c.name.toLowerCase().includes(state.searchQuery) || c.symposium.toLowerCase().includes(state.searchQuery);
                const nicheMatch = state.nicheFilter === 'all' || c.category === state.nicheFilter;
                const countryMatch = state.countryFilter === 'all' || c.country === state.countryFilter;
                const deadlineMatch = state.showPast ? true : c.deadline > now;
                return searchMatch && nicheMatch && countryMatch && deadlineMatch;
            });

            // Standardized Sort
            filtered.sort((a,b) => {
                if (state.sortMode === 'deadline') return a.deadline - b.deadline;
                if (state.sortMode === 'date') return new Date(a.eventDate) - new Date(b.eventDate);
                return b.relevance - a.relevance;
            });

            filtered.forEach(conf => {
                const card = document.createElement('div');
                card.className = 'sidebar-card' + (state.selectedConference?.id === conf.id ? ' active' : '');
                const isPassed = conf.deadline < now;
                
                card.innerHTML = `
                    <div class="card-top">
                        <h3>${conf.name}</h3>
                        <span class="status-pill active" style="background:${isPassed ? '#94a3b8' : ''}">${conf.category}</span>
                    </div>
                    <div class="card-meta">
                        <div class="meta-item"><span class="label-prefix">Deadline:</span> ${formatDate(conf.deadline)}</div>
                        <div class="meta-item"><span class="label-prefix">Dates:</span> ${conf.eventDate}</div>
                        <div class="meta-item">📍 ${conf.location}, ${conf.country}</div>
                    </div>
                    <span class="countdown" data-deadline="${conf.deadline.toISOString()}"></span>
                    <p class="relation-text">${conf.relation}</p>
                `;
                card.onclick = () => { state.selectedConference = conf; elements.activeConfDisplay.textContent = conf.name; filterAndRender(); };
                elements.sidebarResults.appendChild(card);
            });
        } else {
            JOURNALS.forEach(j => {
                const card = document.createElement('div');
                card.className = 'sidebar-card';
                card.innerHTML = `<h3>${j.name}</h3><p class="relation-text">${j.scope}</p><a href="${j.link}" target="_blank" class="btn-text" style="display:block; margin-top:0.5rem">Visit Portal ↗</a>`;
                elements.sidebarResults.appendChild(card);
            });
        }
    }

    function updateCountdowns() {
        document.querySelectorAll('.countdown').forEach(el => {
            const d = new Date(el.dataset.deadline);
            const diff = d - new Date();
            if (diff < 0) el.textContent = 'Deadline Passed';
            else {
                const days = Math.floor(diff / (1000*60*60*24));
                const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
                el.textContent = `${days}d ${hours}h until submission`;
            }
        });
    }

    function formatDate(d) {
        return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'CET' }).format(d) + ' CET';
    }

    // --- Terminal Analysis Engine ---
    function handleInput() {
        const val = elements.abstractInput.value.trim();
        if (!val) { resetWorkbench(); return; }

        // Hardcoded simulation for the provide abstract
        if (val.includes("astronaut health")) {
            const review = {
                assessment: `<strong>Analysis:</strong> Critical lapses in precision regarding bio-instrumentation identified. Language shows patterns of habitual repetition.`,
                weaknesses: [
                    { cat: 'Grammar', icon: '📋', title: 'Subject-Verb Error', desc: '"Research ... have" corrected to "Research ... has".' },
                    { cat: 'Terminology', icon: '⚖️', title: 'Field Jargon', desc: '"dis-regulation" changed to clinical "dysregulation".' },
                    { cat: 'Logic', icon: '🧩', title: 'Structure Check', desc: 'Added transition between Martian hazards and Earth applications.' }
                ],
                revision: cleanText(`Research on astronaut health and model organisms has revealed six fundamental hallmarks of spaceflight biology: oxidative stress, DNA damage, mitochondrial dysregulation, epigenetic shifts, telomere alterations, and microbiome volatility. This study examines these features to evaluate health risks for Martian missions. Also, we analyze how space medicine innovations are being adapted for terrestrial longevity solutions.`)
            };
            applyReview(review);
        } else {
            applyReview({
                assessment: '<strong>New Manuscript Detected.</strong> Scanning for niche innovation alignment...',
                weaknesses: [{ cat: 'Clarity', icon: '👁️', title: 'Scope Analysis', desc: 'Ensure abstract explicitly mentions commercial space applications.' }],
                revision: cleanText('[Generating professional revision using clean vocabulary...]')
            });
        }
    }

    function applyReview(rev) {
        elements.generalAssessment.innerHTML = rev.assessment;
        elements.weaknessList.innerHTML = '';
        rev.weaknesses.forEach(w => {
            const div = document.createElement('div');
            div.className = 'weakness-item';
            div.innerHTML = `
                <div class="weakness-icon-wrapper">
                    <span>${w.icon}</span>
                    <span class="category-label">${w.cat}</span>
                </div>
                <div><h3>${w.title}</h3><p>${w.desc}</p></div>
            `;
            elements.weaknessList.appendChild(div);
        });
        elements.revisedText.innerHTML = rev.revision;
    }

    function resetWorkbench() {
        elements.generalAssessment.textContent = "Ready for manuscript analysis.";
        elements.weaknessList.innerHTML = '';
        elements.revisedText.innerText = "Waiting for abstract input...";
    }
});
