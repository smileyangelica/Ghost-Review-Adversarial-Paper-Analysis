document.addEventListener('DOMContentLoaded', () => {
    // --- State & Data ---
    const state = {
        theme: localStorage.getItem('ghost-theme') || 'light',
        activeTab: 'conferences',
        selectedConference: null,
        reviewActive: false
    };

    const CONFERENCES = [
        {
            id: 'isdc2026',
            name: 'International Space Development Conference (ISDC)',
            country: 'USA (McLean, VA)',
            link: 'https://isdc.nss.org',
            relation: 'Space Health session matches your focus on microgravity health and countermeasures.',
            symposium: 'Space Health & Medical Track',
            deadline: new Date('2026-04-15T23:59:59Z'), // April 15, 2026
            category: 'Space-Health',
            tags: ['Urgent', 'Active']
        },
        {
            id: 'ieee-waae',
            name: 'IEEE Workshop on Advanced Aerospace Engineering',
            country: 'Online / International',
            link: 'https://ieee-waae.org',
            relation: 'Life Support Systems & Human-Machine tracks align with your astronaut safety research.',
            symposium: 'Human Systems Integration',
            deadline: new Date('2026-06-30T23:59:59Z'), // June 30, 2026
            category: 'Innovation',
            tags: ['Active']
        },
        {
            id: 'asgsr2026',
            name: 'American Society for Gravitational and Space Research (ASGSR)',
            country: 'USA (Crystal City, VA)',
            link: 'https://asgsr.org',
            relation: 'Cell & Molecular Biology track is the primary venue for your mitochondrial research.',
            symposium: 'Cell & Molecular Microgravity Biology',
            deadline: new Date('2026-06-15T23:59:59Z'),
            category: 'Microgravity',
            tags: ['Active']
        },
        {
            id: 'iac2026',
            name: '77th International Astronautical Congress (IAC)',
            country: 'Antalya, Türkiye',
            link: 'https://www.iafastro.org/events/iac/iac-2026/',
            relation: 'Symposium A1.8 "Biology in Space" is the gold standard for your lifecycles research.',
            symposium: 'A1.8 Biology in Space',
            deadline: new Date('2026-02-28T23:59:59Z'),
            category: 'Space Science',
            tags: ['Mandatory', 'Legacy']
        },
        {
            id: 'meae2026',
            name: 'Modern Engineering and Applied Engineering (MEAE)',
            country: 'International',
            link: 'http://www.meae.org',
            relation: 'Extreme Environment Engineering track fits your MedTech hardware development.',
            symposium: 'Medical Instrumentation in Space',
            deadline: new Date('2026-07-10T23:59:59Z'),
            category: 'MedTech',
            tags: ['Active']
        }
    ];

    const JOURNALS = [
        {
            name: 'npj Microgravity (Nature)',
            impact: '4.8 (Est)',
            link: 'https://www.nature.com/npjmgrav/',
            scope: 'Biological and physical sciences in space and microgravity environments.',
            category: 'High Impact'
        },
        {
            name: 'Acta Astronautica',
            impact: '3.1 (Est)',
            link: 'https://www.sciencedirect.com/journal/acta-astronautica',
            scope: 'Broad space research encompassing engineering, health, and policy.',
            category: 'Professional'
        },
        {
            name: 'Journal of Space Safety Engineering',
            impact: 'N/A',
            link: 'https://www.sciencedirect.com/journal/journal-of-space-safety-engineering',
            scope: 'Technological advancements in life-support, radiation shielding, and astronaut safety.',
            category: 'Niche Tech'
        }
    ];

    // --- DOM Elements ---
    const body = document.body;
    const modeCheckbox = document.getElementById('mode-checkbox');
    const sidebarResults = document.getElementById('sidebar-results');
    const abstractInput = document.getElementById('abstract-input');
    const clearBtn = document.getElementById('clear-btn');
    const exportBtn = document.getElementById('export-pdf');
    const pdfUpload = document.getElementById('pdf-upload');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const activeConfDisplay = document.querySelector('#active-conference-display .value');
    const weaknessList = document.getElementById('weakness-list');
    const generalAssessment = document.getElementById('general-assessment');
    const revisedText = document.getElementById('revised-text');
    const impactBadges = document.getElementById('impact-badges');
    
    // Stats
    const stats = {
        grammar: document.getElementById('count-grammar'),
        logic: document.getElementById('count-logic'),
        term: document.getElementById('count-term')
    };

    // --- Initialization ---
    initTheme();
    renderSidebar();
    startClock();

    // --- Theme Logic ---
    function initTheme() {
        body.setAttribute('data-theme', state.theme);
        modeCheckbox.checked = state.theme === 'dark';
        modeCheckbox.addEventListener('change', () => {
            state.theme = modeCheckbox.checked ? 'dark' : 'light';
            body.setAttribute('data-theme', state.theme);
            localStorage.setItem('ghost-theme', state.theme);
        });
    }

    // --- Sidebar Rendering ---
    function renderSidebar() {
        sidebarResults.innerHTML = '';
        
        if (state.activeTab === 'conferences') {
            CONFERENCES.sort((a,b) => a.deadline - b.deadline).forEach(conf => {
                const card = document.createElement('div');
                card.className = `sidebar-card ${state.selectedConference?.id === conf.id ? 'active' : ''}`;
                const isUrgent = (conf.deadline - new Date()) / (1000 * 60 * 60 * 24) < 7 && conf.deadline > new Date();
                
                card.innerHTML = `
                    <div class="card-top">
                        <h3>${conf.name}</h3>
                        <span class="status-pill ${isUrgent ? 'urgent' : 'active'}">${isUrgent ? 'Urgent' : conf.category}</span>
                    </div>
                    <div class="card-meta">
                        <span>📍 ${conf.country}</span>
                        <span class="deadline-label">${formatDeadline(conf.deadline)}</span>
                    </div>
                    <span class="countdown" data-deadline="${conf.deadline.toISOString()}">Calculating...</span>
                    <p class="relation-text">${conf.relation}</p>
                    <a href="${conf.link}" target="_blank" class="btn-text" style="display:block; margin-top:0.5rem">Visit Portal ↗</a>
                `;
                
                card.onclick = (e) => {
                    if (e.target.tagName !== 'A') selectConference(conf);
                };
                sidebarResults.appendChild(card);
            });
        } else {
            JOURNALS.forEach(journal => {
                const card = document.createElement('div');
                card.className = 'sidebar-card';
                card.innerHTML = `
                    <div class="card-top">
                        <h3>${journal.name}</h3>
                        <span class="status-pill active">IF: ${journal.impact}</span>
                    </div>
                    <p class="relation-text" style="font-style:normal">${journal.scope}</p>
                    <a href="${journal.link}" target="_blank" class="btn-text" style="display:block; margin-top:0.5rem">Submit Manuscript ↗</a>
                `;
                sidebarResults.appendChild(card);
            });
        }
    }

    tabBtns.forEach(btn => {
        btn.onclick = () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.activeTab = btn.dataset.tab;
            renderSidebar();
        };
    });

    function selectConference(conf) {
        state.selectedConference = conf;
        activeConfDisplay.textContent = conf.name;
        renderSidebar();
    }

    // --- Date Formatting ---
    function formatDeadline(date) {
        const options = { 
            weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZone: 'CET', hour12: true 
        };
        const formatted = new Intl.DateTimeFormat('en-US', options).format(date);
        return formatted.replace(',', '') + ' CET';
    }

    function startClock() {
        setInterval(() => {
            document.querySelectorAll('.countdown').forEach(el => {
                const deadline = new Date(el.dataset.deadline);
                const now = new Date();
                const diff = deadline - now;
                
                if (diff < 0) {
                    el.textContent = "Deadline Passed";
                    el.style.color = "#94a3b8";
                } else {
                    const days = Math.floor(diff / (1000*60*60*24));
                    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
                    el.textContent = `${days}d ${hours}h left`;
                }
            });
        }, 1000);
    }

    // --- Peer Review Logic ---
    const originalReview = {
        assessment: `<strong>General Assessment:</strong> Critical lapses in precision regarding mitochondrial dysregulation. Subject-verb agreement errors dilute impact.`,
        weaknesses: [
            { type: 'grammar', title: 'Subject-Verb Mismatch', desc: '"Research ... have" should be "Research ... has".' },
            { type: 'term', title: 'Biological Precision', desc: '"dis-regulation" should be "dysregulation".' },
            { type: 'logic', title: 'Theme Continuity', desc: 'Abrupt shift from Martian hazards to Earth laboratories.' }
        ],
        revision: `Research on astronaut health and model organisms <strong>has</strong> revealed six fundamental hallmarks of spaceflight biology: oxidative stress, DNA damage, mitochondrial <strong>dysregulation</strong>, epigenetic shifts, telomere alterations, and microbiome volatility. This review synthesizes current knowledge on these features, evaluating the associated health risks for long-duration Martian missions. <strong>Furthermore, we analyze how</strong> space medicine innovations are being translated into terrestrial longevity solutions.`,
        counts: { grammar: 1, term: 1, logic: 1 }
    };

    function handleInput() {
        const val = abstractInput.value.trim();
        if (val === '') {
            resetReview();
            return;
        }
        
        // Simulating processing
        setTimeout(() => {
            if (val.includes("astronaut health")) {
                applyReview(originalReview);
            } else {
                applyReview({
                    assessment: '<strong>Scanning new manuscript...</strong> Analysis suggests focus on niche innovation tracks.',
                    weaknesses: [{ type: 'logic', title: 'Abstract Scope', desc: 'Ensure alignment with the target symposium.' }],
                    counts: { grammar: 0, term: 0, logic: 1 },
                    revision: '[Processing high-fidelity revision based on new data...]'
                });
            }
        }, 300);
    }

    function applyReview(rev) {
        generalAssessment.innerHTML = rev.assessment;
        stats.grammar.textContent = rev.counts.grammar;
        stats.logic.textContent = rev.counts.logic;
        stats.term.textContent = rev.counts.term;
        
        weaknessList.innerHTML = '';
        rev.weaknesses.forEach(w => {
            const div = document.createElement('div');
            div.className = 'weakness-item';
            div.innerHTML = `<span class="icon">${w.type === 'grammar' ? '📋' : w.type === 'logic' ? '🧩' : '⚖️'}</span><div><h3>${w.title}</h3><p>${w.desc}</p></div>`;
            weaknessList.appendChild(div);
        });
        
        revisedText.innerHTML = rev.revision;
        impactBadges.innerHTML = '<span>🚀 High Precision</span><span>🧪 Scientific Tone</span>';
    }

    function resetReview() {
        generalAssessment.textContent = "Ready for manuscript analysis.";
        weaknessList.innerHTML = '';
        revisedText.textContent = "Awaiting analysis...";
        impactBadges.innerHTML = '';
        Object.values(stats).forEach(s => s.textContent = '0');
    }

    abstractInput.addEventListener('input', handleInput);
    clearBtn.onclick = () => { abstractInput.value = ''; resetReview(); };

    // --- PDF Upload Logic ---
    pdfUpload.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
        let text = "";
        
        for (let i = 1; i <= Math.min(pdf.numPages, 2); i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(" ");
        }
        
        abstractInput.value = text;
        handleInput();
    };

    // --- PDF Export Logic ---
    exportBtn.onclick = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const confName = state.selectedConference?.name || "Global Space Health Symposium";
        const sympName = state.selectedConference?.symposium || "General Session";
        
        // Header
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Conference: ${confName}`, 20, 20);
        doc.text(`Symposium: ${sympName}`, 20, 25);
        doc.line(20, 30, 190, 30);
        
        // Title
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102);
        doc.text("Refined Abstract (The Gold Standard)", 20, 45);
        
        // Content
        doc.setFontSize(11);
        doc.setTextColor(50);
        const splitText = doc.splitTextToSize(revisedText.innerText, 170);
        doc.text(splitText, 20, 60);
        
        // Footer
        doc.setFontSize(8);
        doc.text(`Generated by Ghost Review AI Specialist - ${new Date().toLocaleDateString()} (CET)`, 20, 280);
        
        doc.save("Refined_Abstract_GhostReview.pdf");
    };
});
