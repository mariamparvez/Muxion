const clients = ["Macy’s", "Bloomingdale’s", 'BMW', 'British Telecom', 'News Corp', 'Momentum', 'AAPC Codify'];
const fields = [
  ['wallet', 'Fintech', 'Making complex financial journeys feel clear.'],
  ['globe', 'Ecommerce', 'Shopping experiences across mobile and desktop.'],
  ['grid', 'SaaS', 'Useful dashboards and everyday product workflows.'],
  ['users', 'Marketing agencies', 'Digital experiences shaped around brand and audience.'],
  ['external', 'Landing pages', 'Focused pages with a clear next step.']
];

export function clientExperience(icon) {
  return `<section class="experience-section section" aria-labelledby="experience-heading">
    <div class="experience-heading"><div><div class="eyebrow">Mariam’s international client experience</div><h2 id="experience-heading">Global brands.<br><span>Thoughtful digital experiences.</span></h2></div><p>As a Design Manager, I’ve worked for international clients across apps, desktop applications and websites. That breadth shapes how I approach every new challenge.</p></div>
    <ul class="experience-clients" aria-label="Clients Mariam has worked for">${clients.map((name,i)=>`<li><span class="experience-index" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><strong>${name}</strong></li>`).join('')}</ul>
    <div class="experience-disciplines"><div class="experience-disciplines-intro"><span class="eyebrow">Across screens. Across sectors.</span><h3>Complex products.<br>Clear experiences.</h3><p>Mobile apps, desktop apps and the web. Designed around the people using them.</p><p><strong>Build services:</strong> UI/UX design, graphic design, full-stack development and vibe coding. From interface design to APIs, databases and deployment, with AI-assisted coding guided by testing and review.</p></div><ul>${fields.map(([name,title,description])=>`<li>${icon(name)}<div><h4>${title}</h4><p>${description}</p></div></li>`).join('')}</ul></div>
  </section>`;
}
