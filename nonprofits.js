function nonprofitCollection() {
  const briefs = apps.filter(app => app.category === 'Nonprofit Operations');
  const groups = [...new Set(briefs.map(app => app.group))];
  const pilots = listings().filter(id => byId(id).category === 'Nonprofit Operations');
  const sections = groups.map(group => {
    const rows = briefs.filter(app => app.group === group).map(app => `
      <a class="brieflink nonprofit-brief" href="#/brief/${app.id}">
        <div><h3>${esc(app.title)}</h3><p>${esc(app.pitch)}</p></div>
        <small>${esc(app.buyer)}</small>
      </a>`).join('');
    return `<section class="nonprofit-group"><h2>${esc(group)}</h2><div class="brief-grid">${rows}</div></section>`;
  }).join('');
  return `<div class="wrap page">${crumb(['Nonprofits'])}
    <div class="hero-small nonprofit-head">
      <div class="eyeline">${ic('layers')} Marketplace collection</div>
      <h1>Apps for nonprofits</h1>
      <p>Find a workflow for your staff, volunteers, board or community. Each of the ${briefs.length} briefs includes a build prompt, role permissions and an acceptance test.</p>
      <a class="link" href="resources/marketplace-playbook.xlsx" download>${ic('download')} Download the playbook</a>
    </div>
    ${pilots.length ? `<section class="nonprofit-group"><h2>Try a sample workflow</h2><div class="nonprofit-pilots">${pilots.map(card).join('')}</div></section>` : ''}
    ${sections}
  </div>`;
}
