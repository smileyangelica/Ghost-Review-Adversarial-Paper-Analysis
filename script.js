document.addEventListener('DOMContentLoaded', () => {
    const abstractInput = document.getElementById('abstract-input');
    const clearBtn = document.getElementById('clear-btn');
    const weaknessList = document.getElementById('weakness-list');
    const generalAssessment = document.getElementById('general-assessment');
    const revisedText = document.getElementById('revised-text');
    const statCounts = {
        grammar: document.querySelector('.stat-badge.grammar .count'),
        logic: document.querySelector('.stat-badge.logic .count'),
        terminology: document.querySelector('.stat-badge.terminology .count')
    };

    const originalAbstract = `Research on astronaut health and model organisms have revealed six features of spaceflight biology which guide our current understanding of fundamental molecular changes that occur during space travel. The features include oxidative stress, DNA damage, mitochondrial dis-regulation, epigenetic changes (including gene regulation), telomere length alterations, and microbiome shifts. We review the known hazards of human spaceflight, the effects of spaceflight on living systems through these six fundamental features, and the associated health risks of space exploration. We also discuss the essential health and safety concerns for astronauts involved in future missions, especially in the planned long-duration and Martian missions. While a lot of technologies (downsizing laboratories, training chambers, wearables) were developed for the Space Medicine industry, they also found their applications on Earth. They now allow humans to live both active and healthy lives, and enable their safely entering hazardous environments of deep water as well as deep space. Key genes and polymorphisms that allow us to assess human predispositions to chronic diseases and evaluate astronauts’ potential will also be shortly discussed.`;

    const originalReview = {
        assessment: `<strong>General Assessment:</strong> The submission attempts a broad synthesis but suffers from significant lapses in academic precision and structural cohesion. The transition from molecular biology to Earth longevity feels like an afterthought rather than a core thesis.`,
        weaknesses: [
            { type: 'grammar', title: 'Subject-Verb Mismatch', desc: '"Research ... have revealed" is grammatically incorrect. "Research" is an uncountable noun requiring the singular "has".' },
            { type: 'grammar', title: 'Prefix Error', desc: '"dis-regulation" is a misspelling. The correct biological term is "dysregulation".' },
            { type: 'terminology', title: 'Informal Phrasing', desc: '"While a lot of technologies" is overly colloquial. Recommend "While numerous technologies" or "A diverse array of technologies".' },
            { type: 'terminology', title: 'Vague Conclusion', desc: '"shortly discussed" is weak. Use "briefly synthesized" or specify the scope of the discussion.' },
            { type: 'logic', title: 'Structural Discontinuity', desc: 'The leap from Martian radiation hazards to terrestrial longevity applications lacks a logical bridge, diluting the scientific focus.' }
        ],
        revision: `Research on astronaut health and model organisms <strong>has</strong> revealed six fundamental hallmarks of spaceflight biology: oxidative stress, DNA damage, mitochondrial <strong>dysregulation</strong>, epigenetic shifts, telomere alterations, and microbiome volatility. This review synthesizes current knowledge on these features, evaluating the associated health risks for long-duration Martian missions. <strong>Furthermore, we analyze how</strong> space medicine innovations are being translated into terrestrial longevity solutions. Finally, we evaluate specific genetic polymorphisms that facilitate risk assessment for both astronauts and chronic disease patients on Earth.`,
        counts: { grammar: 2, terminology: 2, logic: 1 }
    };

    const emptyState = {
        assessment: `<strong>Ready for Review:</strong> Please enter or paste a scientific abstract into the input box to begin the adversarial peer review process.`,
        weaknesses: [],
        revision: `Awaiting input for suggested improvements...`,
        counts: { grammar: 0, terminology: 0, logic: 0 }
    };

    const customState = {
        assessment: `<strong>New Analysis Detected:</strong> Reviewer 2 is currently processing the new manuscript. Initial scans suggest that the focus and tone need significant refinement to meet publication standards.`,
        weaknesses: [
            { type: 'logic', title: 'Novelty Check', desc: 'Ensure that the abstract clearly states the novel contribution of this work versus existing literature.' },
            { type: 'terminology', title: 'Scholarly Impact', desc: 'Avoid qualitative descriptors and focus on quantifying outcomes where possible.' }
        ],
        revision: `[Drafting Revision based on new input...]`,
        counts: { grammar: 0, terminology: 1, logic: 1 }
    };

    function updateUI(state) {
        // Update Stats
        statCounts.grammar.textContent = state.counts.grammar;
        statCounts.terminology.textContent = state.counts.terminology;
        statCounts.logic.textContent = state.counts.logic;

        // Update Assessment
        generalAssessment.innerHTML = state.assessment;

        // Update Weaknesses
        weaknessList.innerHTML = '';
        state.weaknesses.forEach(w => {
            const item = document.createElement('div');
            item.className = `weakness-item ${w.type}-item`;
            item.innerHTML = `
                <span class="icon">${w.type === 'grammar' ? '📋' : w.type === 'logic' ? '🧩' : '⚖️'}</span>
                <div class="details">
                    <h3>${w.title}</h3>
                    <p>${w.desc}</p>
                </div>
            `;
            weaknessList.appendChild(item);
        });

        // Update Revision
        revisedText.innerHTML = state.revision;
    }

    function handleInput() {
        const value = abstractInput.value.trim();
        
        if (value === "") {
            updateUI(emptyState);
        } else if (value.includes("astronaut health") && value.includes("longevity")) {
            updateUI(originalReview);
        } else {
            updateUI(customState);
        }
    }

    abstractInput.addEventListener('input', handleInput);

    clearBtn.addEventListener('click', () => {
        abstractInput.value = '';
        handleInput();
        abstractInput.focus();
    });

    // Initial Load
    handleInput();
});
