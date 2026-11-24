// Render the storefront's own public copy with fresh sample state.
// Node supplies only the small DOM surface used by these build-time views.
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const source = path => readFileSync(new URL(path, root), 'utf8');
const noop = () => {};
const element = () => ({
  innerHTML: '', open: false, querySelector: () => null, addEventListener: noop,
  close() { this.open = false; }, showModal() { this.open = true; }
});

function run(files, globals) {
  const context = vm.createContext(globals);
  for (const path of files) vm.runInContext(source(path), context, {filename:path});
  return code => vm.runInContext(code, context);
}

const elements = Object.fromEntries(['main', 'dialog', '#top', '#foot'].map(key => [key, element()]));
const site = {
  document: {querySelector: key => elements[key] ?? null},
  localStorage: {getItem: () => null}, location: {hash:''}, URLSearchParams,
  scrollTo: noop, addEventListener: noop, setInterval: noop
};
site.window = site;
const entry = source('index.html');
const scripts = [...entry.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
const render = run(scripts, site);
const demoScripts = [...source('examples/demos.html').matchAll(/<script src="([^"]+)"/g)].map(match => 'examples/'+match[1]);

function demoViews(id) {
  const preview = element();
  const demo = run(demoScripts, {
    location: {search:'?id='+id}, URLSearchParams,
    document: {documentElement:{style:{setProperty:noop}}, getElementById:key => key==='preview'?preview:element()}
  });
  const views = {'Sample workspace':preview.innerHTML};
  const roles = {102:['Finance officer','Grants manager'],110:['Volunteer · Avery','Program lead']};
  for (const role of roles[id] || []) {
    demo('state.role='+JSON.stringify(role)+'; render()');
    views[role] = preview.innerHTML;
  }
  return views;
}

const routes = {
  'Marketplace home':render('home()'), 'Browse apps':render("browse('')"),
  'How it works':render('guide()'), 'NeoApps Factory':render('factory()'),
  'Nonprofit collection':render('nonprofitCollection()'), 'Marketplace playbook':render('book()')
};
for (const tab of ['Launch plan','Decisions','Variants']) {
  routes['Playbook · '+tab] = render('bookTab='+JSON.stringify(tab)+'; bookBody()');
}
const configs = render('configs');
const pilots = {};
for (const key of Object.keys(configs)) {
  const id = Number(key);
  const listing = render('listingPage('+id+')');
  const views = {Overview:listing};
  for (const tab of ['Screens & demo','Changelog','Reviews']) {
    views[tab] = render('detailTab='+JSON.stringify(tab)+'; listingPage('+id+')');
  }
  pilots[id] = {config:configs[id], views, demo:demoViews(id)};
}
const first = Number(Object.keys(configs)[0]);
const buyer = {'Sign in':render('library()'), 'Staff preview':render('ops()')};
render('state.buyer=true');
buyer['Preview checkout'] = render('checkout('+first+')');
for (const tab of ['Purchases','Requests','Support']) buyer['My apps · '+tab] = render('library('+JSON.stringify(tab)+')');
for (const name of ['account','customize','supportForm']) {
  render(name==='account'?'account()':name+'('+first+')');
  buyer[name] = elements.dialog.innerHTML;
}
// Show each published order view using one fixed, fictional order.
render(`state.orders.push({id:'DEMO-ORDER',app:${first},time:'2026-11-24T12:00:00Z',
  amount:configs[${first}][6],step:0,attempt:1,status:'Paid',region:'Canada (example)',
  licence:state.settings.licence,history:[]})`);
for (const [name,changes] of Object.entries({
  Queued:{step:0}, Failed:{step:2,error:'Sample build failed.'},
  Live:{step:4,error:''}, Refunded:{status:'Refunded'}
})) {
  render('Object.assign(state.orders[0],'+JSON.stringify(changes)+')');
  buyer['Order · '+name] = render("orderPage('DEMO-ORDER')");
  if (name==='Live') {
    for (const action of ['receipt','writeReview']) {
      render(action+"('DEMO-ORDER')");
      buyer[action] = elements.dialog.innerHTML;
    }
  }
}
render("state.role='Admin'");
for (const tab of ['Overview','Listings','Orders','Requests','Reviews','Settings','Notifications','Audit']) {
  buyer['Factory operations · '+tab] = render('opsTab='+JSON.stringify(tab)+'; opsContent(true)');
}
process.stdout.write(JSON.stringify({playbook:render('PLAYBOOK'),routes,pilots,buyer}));
