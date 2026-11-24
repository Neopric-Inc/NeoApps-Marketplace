import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const source = (await readFile(new URL('data.js', root), 'utf8')).trim();
const prefix = 'window.PLAYBOOK=';
if (!source.startsWith(prefix) || !source.endsWith(';')) {
  throw new Error('Expected data.js to contain a JSON playbook assignment.');
}
const { apps } = JSON.parse(source.slice(prefix.length, -1));
const categories = new Map([
  ['Personal & Everyday Life', 'personal'],
  ['Team Operations & Internal Tools', 'team-operations'],
  ['Client Services, Agencies & Consultants', 'client-services'],
  ['Data, Research & AI Micro-Utilities', 'data-research-ai'],
  ['Education, Communities & Events', 'education-community'],
  ['Niche Small Business & Field Ops', 'small-business-field-ops'],
]);
for (const app of apps) {
  if (!categories.has(app.category)) throw new Error('Missing category slug for ' + app.category);
}
const directory = new URL('resources/briefs/', root);
await mkdir(directory, { recursive: true });
for (const [category, slug] of categories) {
  const text = ['# ' + category, ''];
  for (const app of apps.filter(app => app.category === category)) {
    text.push(
      '## ' + app.id + '. ' + app.title, '', app.pitch, '',
      '- Buyer: ' + app.buyer,
      '- Release wave: ' + app.wave + ' (' + ['','Pilot','Expand','Specialist'][app.wave] + ')',
      '- Proposed access: ' + app.access,
      '- Runtime AI in the brief: ' + (app.ai ? 'Model required' : 'No model required'),
      '', '**Build prompt**', '', app.prompt, '', '**Acceptance test**', '', app.test, ''
    );
  }
  await writeFile(new URL(slug + '.md', directory), text.join('\n'));
}
