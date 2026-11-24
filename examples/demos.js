'use strict';
const icons={
 trip:'<path d="M3 10h18v10H3zM8 10V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M7 13v4m10-4v4"/>',
 lunch:'<path d="M4 3v7c0 3 6 3 6 0V3M7 3v17M17 3c-3 3-4 7-4 10h4m0-10v17"/>',
 quote:'<path d="M6 2h10l3 4v16H6zM9 9h7m-7 4h7m-7 4h4"/>',
 brand:'<path d="M3 8h6l2-3h10v15H3zM8 15l3-3 2 2 2-2 3 4"/>',
 csv:'<path d="M3 4h18v16H3zM3 9h18M9 9v11m6-11v11"/>',
 tag:'<path d="M3 4h14a3 3 0 0 1 3 3v8H9l-6 5zM7 8h8m-8 3h6"/>',
 volunteer:'<path d="M3 6h18v15H3zM7 3v6m10-6v6M3 11h18m-13 4h3m2 0h3"/>',
 cake:'<path d="M3 16h18v5H3zM5 16v-6h14v6M8 10V7h8v3m-4-3V5M12 2l.4 1.2"/>'
};
const configs={
 ...nonprofitDemos,
 1:['trip','Switchback','Banff weekend','Settle shared expenses for Maya, Liam and Chloe.','#226c59','#deefe8'],
 16:['lunch','Lunchroom','Friday lunch order','Choose a dish and see the kitchen tally before the cutoff.','#945015','#f7e8d4'],
 36:['quote','Fieldwork Studio','Project estimate','Configure a website package for fictional client Northline Goods.','#5e4784','#ece6f5'],
 37:['brand','Folio Desk','Northline brand intake','Gather the five items the studio needs before kickoff.','#92616b','#f4e6e9'],
 56:['csv','Rowcraft','Clean a contact list','Map date and phone columns, then review the rows ready to export.','#276b55','#e0efe5'],
 57:['tag','Margin Notes','Interview findings','Review editable suggestions from a recorded AI example.','#365b8a','#e1ebf7'],
 79:['volunteer','Gather','Saturday community potluck','Choose a shift or contribute a dish to the neighborhood lunch.','#87601c','#fbefd7'],
 92:['cake','Petal Bakery','Cake order desk','Build a custom cake order and check the pickup schedule.','#97506c','#f8e4ed']
};
const requested=Number(new URLSearchParams(location.search).get('id'));
const id=Object.hasOwn(configs,requested)?requested:92;
const [icon,workspace,title,summary,accent,wash]=configs[id];
document.documentElement.style.setProperty('--accent',accent);
document.documentElement.style.setProperty('--wash',wash);
document.title=title+' · '+workspace;
const root=document.getElementById('preview');
const notice=document.getElementById('notice');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cash=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:Number.isInteger(n)?0:2,maximumFractionDigits:2}).format(n);
const panel=(title,body,tone=false)=>'<section class="panel'+(tone?' tonal':'')+'"><h2>'+title+'</h2>'+body+'</section>';
const line=(label,val)=>'<div class="line"><span>'+label+'</span><b>'+val+'</b></div>';
const action=(label,act,klass='primary')=>'<button type="button" class="'+klass+'" data-action="'+act+'">'+label+'</button>';
const primary=label=>'<button class="primary" type="submit">'+label+'</button>';
const field=(name,content)=>'<label class="field">'+name+content+'</label>';
const options=(values,selected)=>values.map(s=>'<option'+(s===selected?' selected':'')+'>'+esc(s)+'</option>').join('');
const read=(form,name)=>String(new FormData(form).get(name)||'').trim();
const firstCsv='Name,Visit,Phone\nAri,2026-05-01,(506) 555-0101\nJules,2026-05-14,506-555-0102\nDev,2026-02-30,506-555-0103';
function initial(){
if(id===102)return grantSample();
if(id===110)return volunteerSample();
return {
 1:{expenses:[{title:'Cabin',payer:'Maya',amount:90,members:['Maya','Liam','Chloe']},{title:'Dinner',payer:'Liam',amount:30,members:['Liam','Maya']}]},
 16:{orders:[{dish:'Green curry',note:''}],closed:false},
 36:{qty:2,review:true,saved:null},
 37:{done:[true,true,true,false,false],file:''},
 56:{raw:firstCsv,dateCol:'Visit',phoneCol:'Phone',result:null},
 57:{tags:[{tag:'Manual reporting',quote:'I type the totals into a second sheet every Friday.',state:''},{tag:'Slow approvals',quote:'The sign-off can sit unread for a day.',state:''}]},
 79:{shifts:[{title:'Set up',time:'10:00–11:00',cap:2,booked:1,mine:false},{title:'Welcome table',time:'11:00–12:00',cap:3,booked:1,mine:false}],dishes:[{title:'Garden salad',cat:'Side'}]},
 92:{tier:'Single tier',fondant:true,flavor:'Vanilla',notes:'',date:'2026-12-05',bookings:{'2026-12-05':[{title:'Lemon cake'},{title:'Chocolate cake'}],'2026-12-06':[]}}
}[id];}
let state=initial(),timer;
function say(message){clearTimeout(timer);notice.textContent=message;timer=setTimeout(()=>notice.textContent='',4500);}
function exportCsv(name,rows){
 const safe=v=>{let text=String(v??'');if(/^[=+@\-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
 const csv=rows.map(row=>row.map(safe).join(',')).join('\r\n');
 const a=document.createElement('a'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
}
function parseCsv(raw){
 const records=[];let row=[],cell='',quoted=false;
 for(let i=0;i<raw.length;i++){const c=raw[i];if(c==='"'&&(!cell||quoted)){if(quoted&&raw[i+1]==='"'){cell+='"';i++;}else{quoted=!quoted;}}
 else if(c===','&&!quoted){row.push(cell.trim());cell='';}
 else if(c==='\n'&&!quoted){row.push(cell.trim());if(row.some(Boolean))records.push(row);row=[];cell='';}
 else if(c!=='\r'||quoted){cell+=c;}}
 if(quoted)throw Error('Close the quotation marks in the CSV.');row.push(cell.trim());if(row.some(Boolean))records.push(row);return records;
}
function cleanCsv(){
 const [headers,...records]=parseCsv(state.raw);if(!headers||headers.length<2||!records.length)throw Error('Include a header and at least one data row.');
 const d=headers.indexOf(state.dateCol),p=headers.indexOf(state.phoneCol);
 if(d===-1||p===-1||d===p)throw Error('Choose two different existing columns.');
 const good=[],bad=[];
 for(const row of records){
 let match=/^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(row[d]||'');
 if(!match){let us=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(row[d]||'');if(us)match=[null,us[3],us[1],us[2]];}
 let dateOK=false,iso='';
 if(match){const y=+match[1],m=+match[2],day=+match[3];const date=new Date(Date.UTC(y,m-1,day));dateOK=y>=1000&&date.getUTCFullYear()===y&&date.getUTCMonth()===m-1&&date.getUTCDate()===day;if(dateOK)iso=date.toISOString().slice(0,10);}
 let digits=(row[p]||'').replace(/[^0-9]/g,'');if(digits.length===11&&digits[0]==='1')digits=digits.slice(1);
 const err=row.length!==headers.length?'Column count':!dateOK?'Invalid date':digits.length!==10?'Invalid phone':'';
 if(err)bad.push([...row,err]);else{const ok=[...row];ok[d]=iso;ok[p]='('+digits.slice(0,3)+') '+digits.slice(3,6)+'-'+digits.slice(6);good.push(ok);}}
 return {headers,good,bad};
}
const names=['Maya','Liam','Chloe'];
function trip(){
 const balances=Object.fromEntries(names.map(n=>[n,0]));
 for(const e of state.expenses){const cents=Math.round(e.amount*100);balances[e.payer]+=cents;e.members.forEach((m,i)=>balances[m]-=Math.floor(cents/e.members.length)+(i<cents%e.members.length?1:0));}
 const debtors=names.filter(n=>balances[n]<0),creditors=names.filter(n=>balances[n]>0);let d=0,c=0,items=[];
 while(d<debtors.length&&c<creditors.length){let debtor=debtors[d],creditor=creditors[c],a=Math.min(-balances[debtor],balances[creditor]);items.push(line(esc(debtor)+' owes '+esc(creditor),cash(a/100)));balances[debtor]+=a;balances[creditor]-=a;if(!balances[debtor])d++;if(!balances[creditor])c++;}
 return panel('Expense ledger',state.expenses.map(e=>line(esc(e.title)+'<br><small>'+esc(e.payer)+' paid for '+e.members.length+'</small>',cash(e.amount))).join('')+'<form data-form="expense">'+field('Expense','<input name="title" required maxlength="48" placeholder="Fuel">')+'<div class="minigrid">'+field('Amount (USD)','<input name="amount" type="number" min=".01" max="99999" step=".01" required placeholder="24">')+field('Paid by','<select name="payer">'+options(names,names[0])+'</select>')+'</div><fieldset style="border:0;padding:0;margin:0"><legend class="caption">Split with</legend>'+names.map(n=>'<label class="tick"><input type="checkbox" name="member" value="'+n+'" checked>'+n+'</label>').join('')+'</fieldset><div class="actions">'+primary('Add expense')+'</div></form>')+panel('Settlement',items.join('')||'Everyone is settled.',true);
}
function lunch(){
 const dishes=['Green curry','Pad Thai','Miso bowl'];const qty=state.orders.length;
 return panel('Place an order','<p class="caption">Each dish is $10. Sample cutoff is 11:30 AM.</p><form data-form="lunch">'+field('Dish','<select name="dish">'+options(dishes,dishes[0])+'</select>')+field('Kitchen note','<input name="note" maxlength="80" placeholder="Mild, extra basil">')+'<div class="actions"><button class="primary" '+(state.closed?'disabled':'')+'>'+ (state.closed?'Orders closed':'Add order')+'</button></div></form>')+panel('Kitchen tally',dishes.filter(n=>state.orders.some(o=>o.dish===n)).map(n=>line(n,state.orders.filter(o=>o.dish===n).length+' ×')).join('')+state.orders.filter(o=>o.note).map(o=>'<p class="caption">'+esc(o.dish)+' · '+esc(o.note)+'</p>').join('')+line('Total with 15% tax',cash(qty*11.5))+'<div class="actions">'+action(state.closed?'Set clock to 11:15':'Set clock to 11:31','clock','soft')+'</div>',true);
}
function quote(){const subtotal=200*state.qty+(state.review?150:0);
 return panel('Project scope',field('Website pages · $200 each','<input data-bind="qty" type="number" min="1" max="30" value="'+state.qty+'">')+'<label class="tick"><input data-bind="review" type="checkbox" '+(state.review?'checked':'')+'> Add final content review · $150</label>')+panel('Estimate',line('Design and build',cash(state.qty*200))+(state.review?line('Content review','$150'):'')+line('Project total','<strong class="amt">'+cash(subtotal)+'</strong>')+'<div class="actions">'+action('Save estimate','save-quote')+'</div>'+(state.saved!==null?'<p class="caption">Saved estimate · '+cash(state.saved)+'</p>':''),true);
}
function brand(){const labels=['Brand colors','Home page copy','About page copy','Logo file','Services page copy'];const count=state.done.filter(Boolean).length;
 return panel('Required assets',labels.map((label,i)=>'<div class="line"><span>'+label+(i===0?'<br><i class="swatch" style="background:#253953"></i><i class="swatch" style="background:#db969d"></i><i class="swatch" style="background:#f4ebd9"></i>':'')+(i===3&&state.file?'<br><small>'+esc(state.file)+'</small>':'')+'</span>'+action(state.done[i]?'Received':'Mark received','asset-'+i,'quiet')+'</div>').join('')+field('Or select a local logo file','<input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" data-bind="logo">'))+panel('Kickoff readiness','<span class="amt">'+count*20+'%</span><progress class="comp" max="5" value="'+count+'">'+count+'/5</progress><p>'+count+' of 5 items received.</p><p class="caption">'+(count===5?'Ready for studio review.':'Still needed: '+esc(labels.filter((_,i)=>!state.done[i]).join(', '))+'.')+'</p>',true);
}
function cleaner(){let headers;try{headers=parseCsv(state.raw)[0]||[];}catch{headers=[];}const r=state.result;
 return panel('Source data','<form data-form="csv">'+field('Contact CSV','<textarea name="raw" data-bind="csvraw" spellcheck="false">'+esc(state.raw)+'</textarea>')+'<div class="minigrid">'+field('Date column','<select name="date">'+options(headers,state.dateCol)+'</select>')+field('Phone column','<select name="phone">'+options(headers,state.phoneCol)+'</select>')+'</div><div class="actions">'+primary('Clean rows')+'</div></form>')+panel('Cleaning report',r?'<div class="minigrid"><div class="mini"><b>'+r.good.length+'</b>Accepted</div><div class="mini"><b>'+r.bad.length+'</b>Rejected</div></div>'+r.bad.map(row=>'<p class="caption">'+esc(row.join(' · '))+'</p>').join('')+'<div class="actions">'+action('Export accepted CSV','csv-good','soft')+action('Export rejects','csv-bad','soft')+'</div>':'<p>Run the sample to check dates and normalize contact numbers.</p>',true);
}
function tags(){const accepted=state.tags.filter(t=>t.state==='Accepted');
 return panel('Suggested tags',state.tags.map((t,i)=>'<section class="tagrow">'+field('Tag '+(i+1),'<input data-bind="tag" data-index="'+i+'" maxlength="70" value="'+esc(t.tag)+'">')+'<p class="quote">“'+esc(t.quote)+'”</p><div class="actions">'+action('Accept','accept-'+i,'soft')+action('Reject','reject-'+i,'quiet')+(t.state?'<span class="pill">'+t.state+'</span>':'')+'</div></section>').join(''))+panel('Reviewed findings','<span class="amt">'+accepted.length+'</span><p>Accepted tags</p>'+accepted.map(t=>line(esc(t.tag),'✓')).join('')+'<div class="actions"><button type="button" data-action="findings" class="primary" '+(accepted.length?'':'disabled')+'>Export findings</button></div>',true);
}
function volunteer(){
 return panel('Volunteer shifts',state.shifts.map((sh,i)=>'<div class="line"><span><b>'+sh.title+'</b><br><small>'+sh.time+' · '+sh.booked+'/'+sh.cap+' places filled</small></span>'+action(sh.mine?'Cancel my place':'Join shift','shift-'+i,sh.mine?'quiet':'soft')+'</div>').join(''))+panel('Potluck table',state.dishes.map(d=>line(esc(d.title),'<span class="pill">'+esc(d.cat)+'</span>')).join('')+'<form data-form="dish">'+field('Dish','<input name="name" maxlength="45" required placeholder="Lemon squares">')+field('Category','<select name="category">'+options(['Main','Side','Dessert','Drinks'],'Dessert')+'</select>')+'<div class="actions">'+primary('Add dish')+'</div></form>',true);
}
function cake(){const orders=state.bookings[state.date],full=orders.length>=3;const price=(state.tier==='Single tier'?60:95)+(state.fondant?15:0);
 return panel('Build an order','<div class="minigrid">'+field('Size','<select data-bind="tier">'+options(['Single tier','Double tier'],state.tier)+'</select>')+field('Flavor','<select data-bind="flavor">'+options(['Vanilla','Chocolate','Lemon'],state.flavor)+'</select>')+'</div><label class="tick"><input data-bind="fondant" type="checkbox" '+(state.fondant?'checked':'')+'> Fondant finish · +$15</label>'+field('Pickup date','<select data-bind="date">'+options(Object.keys(state.bookings),state.date)+'</select>')+field('Allergy notes','<input data-bind="notes" maxlength="80" value="'+esc(state.notes)+'" placeholder="Optional">')+line('Order estimate','<span class="amt">'+cash(price)+'</span>')+'<div class="actions"><button data-action="book" class="primary" '+(full?'disabled':'')+'>'+ (full?'Pickup day full':'Book sample order')+'</button></div>')+panel('Pickup schedule','<p class="hint">'+state.date+'</p>'+line('Booked pickups',orders.length+' / 3')+orders.map((o,i)=>line('Order '+(i+1),esc(o.title)+(o.notes?'<br><small>'+esc(o.notes)+'</small>':''))).join('')+'<p class="caption">'+(full?'Choose another pickup date.':(3-orders.length)+' pickup '+(3-orders.length===1?'place':'places')+' available.')+'</p>',true);
}
const pages={1:trip,16:lunch,36:quote,37:brand,56:cleaner,57:tags,79:volunteer,92:cake,102:grantDesk,110:volunteerDesk};
function render(focusKey){
 root.innerHTML='<header><div class="bar"><span class="mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round" stroke-linecap="round">'+icons[icon]+'</svg></span><strong>'+workspace+'</strong><span class="sample">Sample workspace</span></div></header><main class="container"><h1>'+title+'</h1><p class="intro">'+summary+'</p><div class="split">'+pages[id]()+'</div><button type="button" class="reset" data-action="reset">Reset sample</button></main>';
 if(focusKey){const el=root.querySelector(focusKey);el?.focus({preventScroll:true});}
}
root.addEventListener('click',event=>{const b=event.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,i=Number(a.split('-').pop());let msg='';
 if(a==='reset'){state=initial();msg='Sample restored.';}
 else if(id===102||id===110){msg=nonprofitAction(a,i);}
 else if(a==='clock'){state.closed=!state.closed;msg=state.closed?'It is 11:31 AM. Orders are closed.':'Orders reopened at 11:15 AM.';}
 else if(a==='save-quote'){state.saved=200*state.qty+(state.review?150:0);msg='Estimate saved in this sample.';}
 else if(a.startsWith('asset-')){state.done[i]=!state.done[i];if(i===3&&!state.done[i])state.file='';msg='Checklist updated.';}
 else if(a.startsWith('csv-')){const k=a.endsWith('good')?'good':'bad',r=state.result;if(r){exportCsv('contacts-'+k+'.csv',[[...r.headers,...(k==='bad'?['Reason']:[])],...r[k]]);say('CSV exported.');}return;}
 else if(a.startsWith('accept-')||a.startsWith('reject-')){if(!state.tags[i].tag.trim()){say('Enter a tag name first.');return;}state.tags[i].state=a.startsWith('accept-')?'Accepted':'Rejected';msg='Review decision saved.';}
 else if(a==='findings'){exportCsv('reviewed-findings.csv',[['Tag','Source quote'],...state.tags.filter(s=>s.state==='Accepted').map(s=>[s.tag,s.quote])]);say('Reviewed findings exported.');return;}
 else if(a.startsWith('shift-')){const sh=state.shifts[i];if(sh.mine){sh.mine=false;sh.booked--;msg='Your place is available again.';}else if(sh.booked<sh.cap){sh.mine=true;sh.booked++;msg='Your place is reserved.';}else{say('This shift is full.');return;}}
 else if(a==='book'){const entries=state.bookings[state.date];if(entries.length>=3){say('This pickup day is full.');return;}entries.push({title:state.flavor+' · '+state.tier.toLowerCase(),notes:state.notes});msg='Sample order booked.';}
 render('[data-action="'+a+'"]');say(msg);
});
root.addEventListener('change',event=>{const t=event.target,k=t.dataset.bind;if(!k)return;
 if(k==='qty'){if(!t.checkValidity()||!t.value){t.reportValidity();return;}state.qty=Number(t.value);}
 else if(k==='review'||k==='fondant'){state[k]=t.checked;}
 else if(k==='logo'){if(!t.files[0])return;state.file=t.files[0].name;state.done[3]=true;say('Local file name added to the checklist.');}
 else if(k==='csvraw'){
 state.raw=t.value;state.result=null;let headers=[];try{headers=parseCsv(t.value)[0]||[];}catch{}
 for(const [field,key] of [['date','dateCol'],['phone','phoneCol']]){const select=root.querySelector('select[name="'+field+'"]');select.innerHTML=options(headers,state[key]);}
 return;
 }
 else if(k==='tag'){state.tags[Number(t.dataset.index)].tag=t.value;return;}
 else if(k==='notes'){state.notes=t.value;return;}else{state[k]=t.value;}
 render('[data-bind="'+k+'"]');
});
root.addEventListener('submit',e=>{e.preventDefault();const f=e.target,kind=f.dataset.form;let msg='';
 if(id===102||id===110){msg=nonprofitSubmit(kind,f);}
 else if(kind==='expense'){const members=new FormData(f).getAll('member');if(!members.length){say('Choose at least one traveler.');return;}const title=read(f,'title');if(!title){say('Name the expense.');return;}state.expenses.push({title,payer:read(f,'payer'),amount:Number(read(f,'amount')),members});msg='Expense and settlement updated.';}
 else if(kind==='lunch'){if(state.closed){say('Orders are closed.');return;}state.orders.push({dish:read(f,'dish'),note:read(f,'note')});msg='Order added to the kitchen tally.';}
 else if(kind==='csv'){state.raw=read(f,'raw');state.dateCol=read(f,'date');state.phoneCol=read(f,'phone');try{state.result=cleanCsv();msg='Cleaning report ready.';}catch(err){say(err.message);return;}}
 else if(kind==='dish'){let name=read(f,'name');if(!name){say('Name your dish.');return;}state.dishes.push({title:name,cat:read(f,'category')});msg='Dish added to the table.';}
 render('form[data-form="'+kind+'"] button[type=submit]');say(msg);
});
render();
