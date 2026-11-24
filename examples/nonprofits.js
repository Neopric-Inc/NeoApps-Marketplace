'use strict';

const nonprofitDemos = {
  102: ['quote', 'Harbour Community Fund', 'Grant reporting desk', 'Prepare the autumn workshop report for the Harbour Neighbourhood Grant.', '#286258', '#e0efe9'],
  110: ['volunteer', 'Harbour Volunteer Centre', 'Volunteer activity log', 'Review submitted shifts and export the verified time for the community program.', '#325d86', '#e1ecf6']
};

function grantSample() {
  return {
    role: 'Program lead', sessions: 12, target: 20, receipt: '', approved: false,
    history: [{actor: 'Program lead', time: '2026-10-30T14:00:00Z', text: 'Recorded 12 workshops from the October delivery log.'}]
  };
}

function volunteerSample() {
  return {
    role: 'Coordinator',
    shifts: [
      {volunteer: 'Avery', date: '2026-11-17', activity: 'Pantry sorting', minutes: 90, note: 'Sorted winter donations.', status: 'Pending'},
      {volunteer: 'Morgan', date: '2026-11-18', activity: 'Welcome desk', minutes: 150, note: 'Covered afternoon intake.', status: 'Pending'}
    ]
  };
}

function switchRole(roles) {
  return field('Preview role', '<select data-bind="role">'+options(roles,state.role)+'</select>');
}

function grantDesk() {
  const role = state.role;
  const roles = ['Program lead','Finance officer','Grants manager'];
  const percent = Math.round(state.sessions / state.target * 100);
  let controls;
  if (state.approved) {
    controls = '<p>The grants manager approved this reporting period. Its evidence and totals are locked.</p>';
  } else if (role === 'Program lead') {
    controls = '<form data-form="grant-progress">' +
      field('Additional workshops delivered','<input type="number" name="count" min="1" max="999" step="1" value="4" required>') +
      field('Evidence reference','<input name="evidence" maxlength="100" placeholder="e.g. November delivery log" required>') +
      primary('Record progress')+'</form>';
  } else if (role === 'Finance officer') {
    controls = '<form data-form="grant-receipt">'+field('Receipt reference','<input name="receipt" maxlength="100" placeholder="e.g. RECEIPT-104" required>')+primary(state.receipt?'Replace receipt reference':'Link receipt')+'</form>';
  } else {
    controls = '<p class="hint">Review the delivery log and finance receipt before signing off.</p><button type="button" data-action="grant-approve" class="primary" '+(state.receipt?'':'disabled')+'>Approve report</button>';
  }
  const audit = state.history.map(entry => line(esc(entry.text),esc(entry.actor)+'<br><small>'+esc(new Date(entry.time).toLocaleString())+'</small>')).join('');
  const exportButton = state.approved && role === 'Grants manager' ? '<div class="actions">'+action('Export funder report','grant-export')+'</div>' : '';
  return panel('Reporting period', switchRole(roles)+line('Period','Autumn workshops')+line('Report due','30 Nov 2026')+controls)+
    panel('Funder summary',line('Sessions delivered',state.sessions+' / '+state.target+' · '+percent+'%')+
      line('Finance receipt',esc(state.receipt||'Missing'))+line('Report status',state.approved?'Approved':'Draft')+exportButton,true)+
    panel('Decision history',audit);
}

function displayTime(minutes) {
  return Math.floor(minutes/60)+' h '+minutes%60+' min';
}

function volunteerDesk() {
  const role = state.role;
  const visible = state.shifts.map((shift,index)=>({shift,index})).filter(({shift})=>role!=='Volunteer · Avery'||shift.volunteer==='Avery');
  const verified = visible.filter(({shift})=>shift.status==='Approved');
  const rows = visible.map(({shift,index})=>{
    const review = role==='Coordinator' && shift.status==='Pending' ?
      '<div class="actions">'+action('Approve','hours-approve-'+index,'soft')+action('Return','hours-return-'+index,'quiet')+'</div>' : '';
    return '<div class="shift-record">'+line(esc(shift.volunteer)+' · '+esc(shift.activity),displayTime(shift.minutes))+
      '<p class="caption">'+esc(shift.date)+' · '+esc(shift.status)+(shift.note?' · '+esc(shift.note):'')+'</p>'+review+'</div>';
  }).join('');
  const submit = role==='Volunteer · Avery' ? '<form data-form="service-shift">'+field('Shift date','<input name="date" type="date" required>')+
    field('Activity','<input name="activity" maxlength="70" required>')+field('Minutes worked','<input name="minutes" type="number" min="1" max="1440" step="1" required>')+
    field('Activity note','<input name="note" maxlength="100">')+primary('Submit shift')+'</form>' : '';
  const summary = line('Verified time',displayTime(verified.reduce((n,{shift})=>n+shift.minutes,0)))+
    line('Approved shifts',verified.length)+line('Pending review',visible.filter(({shift})=>shift.status==='Pending').length)+
    (role==='Program lead'?'<div class="actions">'+action('Export verified log','hours-export')+'</div>':'');
  return panel('Activity log',switchRole(['Volunteer · Avery','Coordinator','Program lead'])+rows+submit)+panel('Report totals',summary,true);
}

function nonprofitAction(actionName,index) {
  if (actionName==='grant-approve' && state.role==='Grants manager' && !state.approved && state.receipt) {
    state.approved=true;
    state.history.push({actor:state.role,time:new Date().toISOString(),text:'Approved the funder report.'});
    return 'Report approved.';
  }
  if (actionName==='grant-export' && state.role==='Grants manager' && state.approved) {
    exportCsv('harbour-funder-report.csv',[
      ['Reporting period','Sessions delivered','Target','Finance receipt','Status'],['Autumn workshops',state.sessions,state.target,state.receipt,'Approved'],
      [],['Timestamp','Actor','Decision history'],...state.history.map(entry=>[entry.time,entry.actor,entry.text])
    ]);
    return 'Funder report exported.';
  }
  if (actionName==='hours-export' && state.role==='Program lead') {
    exportCsv('verified-volunteer-hours.csv',[['Volunteer','Date','Activity','Minutes','Reviewer','Verified at'],
      ...state.shifts.filter(shift=>shift.status==='Approved').map(shift=>[shift.volunteer,shift.date,shift.activity,shift.minutes,shift.reviewer,shift.reviewedAt])]);
    return 'Verified log exported.';
  }
  if (/^hours-(approve|return)-\d+$/.test(actionName) && state.role==='Coordinator') {
    const shift=state.shifts[index];
    if (shift?.status==='Pending') {
      shift.status=actionName.startsWith('hours-approve-')?'Approved':'Returned';
      shift.reviewer='Coordinator';
      shift.reviewedAt=new Date().toISOString();
      return 'Shift '+shift.status.toLowerCase()+'.';
    }
  }
  return '';
}

function nonprofitSubmit(kind,form) {
  if (kind==='grant-progress' && state.role==='Program lead' && !state.approved) {
    const count=Number(read(form,'count')), reference=read(form,'evidence');
    if (!Number.isInteger(count)||count<1||count>999||!reference) return 'Enter a workshop count and evidence reference.';
    state.sessions+=count;
    state.history.push({actor:state.role,time:new Date().toISOString(),text:'Recorded '+count+' workshops · '+reference});
    return 'Delivery log updated.';
  }
  if (kind==='grant-receipt' && state.role==='Finance officer' && !state.approved) {
    const reference=read(form,'receipt');
    if (!reference) return 'Enter a receipt reference.';
    state.receipt=reference;
    state.history.push({actor:state.role,time:new Date().toISOString(),text:'Linked receipt '+reference});
    return 'Receipt linked.';
  }
  if (kind==='service-shift' && state.role==='Volunteer · Avery') {
    const minutes=Number(read(form,'minutes')), activity=read(form,'activity'), date=read(form,'date');
    if (!Number.isInteger(minutes)||minutes<1||minutes>1440||!activity||!date) return 'Enter the shift date, activity and minutes worked.';
    state.shifts.push({volunteer:'Avery',date,activity,minutes,note:read(form,'note'),status:'Pending'});
    return 'Shift submitted for review.';
  }
  return '';
}
