// Seed data for the MPLADS prototype, lifted verbatim from the canvas
// export. Everything here is generated from a fixed mulberry32 seed, so
// the numbers are stable across reloads — there is no backend.

function mulberry32(seed){return function(){seed|=0;seed=(seed+0x6d2b79f5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
const rand = mulberry32(20260831);
const pick = (arr) => arr[Math.floor(rand()*arr.length)];
const int = (min,max) => Math.floor(min+rand()*(max-min+1));

const SECTORS = ['Drinking Water & Sanitation','Agriculture & Irrigation','Roads, Bridges & Transport','Education & Youth','Healthcare','Energy & Lighting','Community Infrastructure'];
const SECTOR_SUBTYPES = {
  'Drinking Water & Sanitation': ['Borewell','Overhead tank','Piped water scheme','Community toilet block'],
  'Agriculture & Irrigation': ['Check dam','Farm pond','Canal lining','Lift irrigation'],
  'Roads, Bridges & Transport': ['CC road','Culvert','Foot bridge','Bus shelter'],
  'Education & Youth': ['Classroom block','School toilet','Sports ground','Library'],
  'Healthcare': ['Primary health centre','Ambulance','Dialysis unit','Ward renovation'],
  'Energy & Lighting': ['Solar street light','Village electrification','Solar pump','Transformer'],
  'Community Infrastructure': ['Community hall','Crematorium shed','Anganwadi centre','Public park'],
};
const CHECK_TYPES = ['Cost outlier','Timing anomaly','Duplicate match','Progress mismatch','Stalled','Concentration'];
const STATUSES = ['Flagged','Under review','Clarification sought','Escalated','Cleared','Completed','Ongoing'];
const AGENCIES = ['PWD Maharashtra','Zilla Parishad Pune','Jal Jeevan Mission Cell','District RES','Municipal Corp Engineering','State Rural Dev. Agency','CPWD Regional Div.','Panchayat Samiti Works Dept.'];
const MPS = ['Suresh Patil MP','Anjali Deshmukh MP','Ramesh Yadav MP','Kavita Rao MP','Vikram Shinde MP','Farooq Ansari MP'];

const STATE_SEEDS = [
  {id:'MH',name:'Maharashtra',monitored:1842},{id:'UP',name:'Uttar Pradesh',monitored:2210},{id:'BR',name:'Bihar',monitored:1390},
  {id:'WB',name:'West Bengal',monitored:1204},{id:'TN',name:'Tamil Nadu',monitored:1088},{id:'RJ',name:'Rajasthan',monitored:940},
  {id:'KA',name:'Karnataka',monitored:876},{id:'GJ',name:'Gujarat',monitored:812},{id:'MP',name:'Madhya Pradesh',monitored:940},
  {id:'AP',name:'Andhra Pradesh',monitored:664},{id:'OD',name:'Odisha',monitored:702},{id:'TG',name:'Telangana',monitored:588},
  {id:'KL',name:'Kerala',monitored:470},{id:'PB',name:'Punjab',monitored:402},{id:'HR',name:'Haryana',monitored:356},
  {id:'JH',name:'Jharkhand',monitored:388},{id:'AS',name:'Assam',monitored:340},{id:'CT',name:'Chhattisgarh',monitored:302},
  {id:'UK',name:'Uttarakhand',monitored:180},{id:'HP',name:'Himachal Pradesh',monitored:146},{id:'JK',name:'Jammu & Kashmir',monitored:210},{id:'GA',name:'Goa',monitored:68},
];
const STATES = STATE_SEEDS.map((s) => {
  const flaggedRate = 0.04+rand()*0.14;
  const flagged = Math.round(s.monitored*flaggedRate);
  const avgRisk = int(28,88);
  const trend = Array.from({length:8},(_, i) => Math.max(4, Math.round(flagged*(0.55+i*0.07)*(0.85+rand()*0.3))));
  return {id:s.id,name:s.name,monitored:s.monitored,flagged,avgRisk,trend};
}).sort((a,b) => b.flagged-a.flagged);

const DISTRICTS = {
  Maharashtra:['Pune','Nashik','Nagpur','Kolhapur','Aurangabad'], 'Uttar Pradesh':['Lucknow','Varanasi','Kanpur','Agra','Meerut'],
  Bihar:['Patna','Gaya','Muzaffarpur','Bhagalpur'], 'West Bengal':['Kolkata','Howrah','Darjeeling','Malda'],
  'Tamil Nadu':['Chennai','Coimbatore','Madurai','Salem'], Rajasthan:['Jaipur','Jodhpur','Udaipur','Kota'],
  Karnataka:['Bengaluru','Mysuru','Hubli','Belagavi'], Gujarat:['Ahmedabad','Surat','Vadodara','Rajkot'],
  'Madhya Pradesh':['Bhopal','Indore','Jabalpur','Gwalior'],
};
const DISTRICT_OPTIONS = [];
function buildDistrictOptions(works){
  const seen = new Set();
  works.forEach((w) => { const k=`${w.state}::${w.district}`; if(!seen.has(k)){ seen.add(k); DISTRICT_OPTIONS.push({value:k, label:`${w.district} — ${w.state}`}); } });
  DISTRICT_OPTIONS.sort((a,b) => a.label.localeCompare(b.label));
}
function districtFor(state){return pick(DISTRICTS[state] ?? [state+' HQ', state+' North', state+' South']);}
const VILLAGES = ['Kharadi','Chandwad','Sinnar','Baramati','Junnar','Wai','Shirur','Daund','Indapur','Ambegaon'];
const BLOCKS = ['Block A','Block B','Block C','North Tehsil','South Tehsil'];

function riskBandTags(risk){
  const n = risk>75?int(2,3):risk>40?int(1,2):int(0,1);
  const tags = new Set();
  let guard=0;
  while (tags.size<n && guard<40) {tags.add(pick(CHECK_TYPES)); guard++;}
  return Array.from(tags);
}
function statusForRisk(risk){
  if (risk>=75) return pick(['Flagged','Under review','Escalated','Clarification sought']);
  if (risk>=40) return pick(['Under review','Ongoing','Flagged','Clarification sought']);
  return pick(['Cleared','Completed','Ongoing']);
}
function titleFor(sector,subType,village){
  const templates = {
    'Drinking Water & Sanitation': `${subType} construction at ${village}`,
    'Agriculture & Irrigation': `${subType} development, ${village} watershed`,
    'Roads, Bridges & Transport': `${subType} from ${village} to main road`,
    'Education & Youth': `${subType} upgrade, Zilla Parishad school ${village}`,
    'Healthcare': `${subType} strengthening, ${village} PHC`,
    'Energy & Lighting': `${subType} installation across ${village} ward`,
    'Community Infrastructure': `${subType} construction, ${village} gram panchayat`,
  };
  return templates[sector];
}

const WORKS = Array.from({length:260},(_, i) => {
  const stateRow = pick(STATES);
  const sector = pick(SECTORS);
  const subType = pick(SECTOR_SUBTYPES[sector]);
  const village = pick(VILLAGES);
  const district = districtFor(stateRow.name);
  const riskScore = int(4,98);
  const sanctioned = int(8,220)*100000;
  const released = Math.round(sanctioned*(0.4+rand()*0.6));
  const utilised = Math.round(released*(0.3+rand()*0.65));
  let progress = Math.min(100, Math.round((utilised/sanctioned)*100+int(-8,8)));
  progress = Math.max(0, Math.min(100, progress));
  const status = statusForRisk(riskScore);
  const year = pick([2022,2023,2024,2025]);
  const month = int(1,12);
  const day = int(1,28);
  const flaggedDate = new Date(2026, int(4,8), int(1,28));
  const waitingDays = int(1,34);
  const resolved = status==='Cleared'||status==='Completed';
  return {
    id: `MP-${year}-${(8000+i*7+int(0,6)).toString().padStart(5,'0')}`,
    title: titleFor(sector,subType,village), sector, subType,
    state: stateRow.name, district, village, block: pick(BLOCKS),
    sanctioned, released, utilised, progress, agency: pick(AGENCIES),
    sanctionDate: `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
    status, riskScore, checkTags: riskBandTags(riskScore), mp: pick(MPS),
    flaggedDate: flaggedDate.toISOString().slice(0,10), waitingDays,
    resolvedDate: resolved ? new Date(2026, int(6,8), int(1,28)).toISOString().slice(0,10) : undefined,
    decision: status==='Cleared' ? 'Cleared — documentation verified' : status==='Completed' ? 'Closed — work verified complete' : undefined,
    reviewedBy: resolved ? pick(['R. Kulkarni, DC Office','S. Menon, Nodal Officer','A. Bhatt, Central Cell']) : undefined,
  };
});

function riskBand(score){ if (score>=75) return 'high'; if (score>=40) return 'med'; return 'low'; }
const RISK_LABEL = { high:'High risk', med:'Medium', low:'Low risk' };
const DEFAULT_PALETTE = ['#1b3a6b','#b4213d','#9a6a0e','#1f6a4c'];
const DARK_PALETTE = ['#5B8DEF','#E0637B','#E3B341','#3FBE8E'];
function hexMix(hexA, hexB, t) {
  const a = parseInt(hexA.replace('#',''),16), b = parseInt(hexB.replace('#',''),16);
  const ar=(a>>16)&255, ag=(a>>8)&255, ab=a&255, br=(b>>16)&255, bg=(b>>8)&255, bb=b&255;
  const r=Math.round(ar+(br-ar)*t), g=Math.round(ag+(bg-ag)*t), bl=Math.round(ab+(bb-ab)*t);
  return `rgb(${r},${g},${bl})`;
}
function scaleDark(hex, intensity) {
  if (intensity === 60) return hex;
  if (intensity < 60) return hexMix('#2A3B58', hex, intensity/60);
  return hexMix(hex, '#05070A', (intensity-60)/40);
}

const CHECK_TYPE_COUNTS = CHECK_TYPES.reduce((acc,ct) => { acc[ct]=WORKS.filter((w) => w.checkTags.includes(ct)).length; return acc; }, {});

function agencyLedger(list){
  return AGENCIES.map((name) => {
    const own = list.filter((w) => w.agency===name);
    const idleFunds = own.reduce((a,w) => a+Math.max(0, w.released-w.utilised), 0);
    const stuck = own.filter((w) => w.released>w.utilised && w.status!=='Completed');
    const avgIdleDays = stuck.length ? Math.round(stuck.reduce((a,w) => a+(38+Math.round((1-(w.utilised/(w.released||1)))*180)), 0)/stuck.length) : 0;
    return { name, works: own.length, idleFunds, avgIdleDays,
      overdueUCs: stuck.filter((w) => w.progress<70).length,
      missingDPRs: own.filter((w) => w.progress<25).length };
  }).filter((a) => a.works>0).sort((a,b) => b.idleFunds-a.idleFunds);
}
WORKS.forEach((w, i) => { const ds = DISTRICTS[w.state]; if (ds && i%5<2) w.district = ds[0]; });
const AGENCY_IDLE = agencyLedger(WORKS);
buildDistrictOptions(WORKS);

const REPORTS = [
  {id:'r1',title:'Quarterly risk summary — Q2 FY26',description:'Consolidated risk posture across all states with year-on-year comparison and sector drill-down.',recipients:'Central Ministry Officer · 12 State Nodal Officers',schedule:'Quarterly · next run 1 Oct 2026',frequency:'Scheduled'},
  {id:'r2',title:'Weekly high-risk bulletin',description:'Works crossing the high-risk threshold (≥75) in the last 7 days, ranked by escalation priority.',recipients:'District Collectors · Review Queue owners',schedule:'Weekly · every Monday, 07:00 IST',frequency:'Scheduled'},
  {id:'r3',title:'Monthly utilisation report',description:'Fund release vs. utilisation pace by agency, flagging idle-fund accumulation and UC backlogs.',recipients:'State Nodal Officer · Finance Cell',schedule:'Monthly · 1st working day',frequency:'Scheduled'},
  {id:'r4',title:'RTI / CAG audit dossier — single work',description:'Cryptographically hashed dossier: metadata, satellite imagery, ledger entries and payment logs for one Work ID.',recipients:'On-demand, generated per request',schedule:'On-demand · instant',frequency:'On-demand'},
  {id:'r5',title:'District performance scorecard',description:'Comparative scorecard of every district in scope — flag rate, resolution speed, idle fund ratio.',recipients:'District Collector · Self',schedule:'On-demand · instant',frequency:'On-demand'},
];

const LIVE_EVENTS = [
  {tag:'high',text:'New cost outlier detected on <b>MP-2024-08832</b> — borewell, Junnar (3.7 SD above median)'},
  {tag:'high',text:'Duplicate sanction match flagged between <b>MP-2023-04471</b> and <b>MP-2023-04512</b>'},
  {tag:'med',text:'<b>PWD Maharashtra</b> escalated to state review — 3 works pending 21+ days'},
  {tag:'clear',text:'Satellite refresh completed for <b>Pune district</b> — 214 works re-verified'},
  {tag:'med',text:'Batch payment of ₹1.8 Cr released in single voucher — <b>Zilla Parishad Pune</b>'},
  {tag:'high',text:'Vendor cartel signal: 3 works share director GSTIN — <b>MP-2024-09120</b> cluster'},
  {tag:'clear',text:'Citizen ground-truth photo verified for <b>MP-2025-01187</b> — matches reported progress'},
  {tag:'med',text:'Utilisation Certificate overdue 45 days — <b>District RES</b>, 4 works affected'},
];

function money(amount){
  if (amount>=10000000) return `₹${(amount/10000000).toFixed(2)} Cr`;
  if (amount>=100000) return `₹${(amount/100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}
const SEAL_DATE_LABEL = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
const ALL = '__all__';
const NAV_DEFS = [
  {key:'overview',label:'Overview',dot:'▤'},{key:'allworks',label:'All works',dot:'▦'},
  {key:'fundflow',label:'Fund flow',dot:'₹'},{key:'tracker',label:'Tracker',dot:'◎'},{key:'contractors',label:'Contractors',dot:'⛭'},{key:'reports',label:'Reports',dot:'▧'},
  {key:'settings',label:'Settings',dot:'⚙'},
];
const FLAGGED_STATUSES = ['Flagged','Under review','Clarification sought','Escalated'];
const AWAITING_STATUSES = FLAGGED_STATUSES;
const RESOLVED_STATUSES = ['Cleared','Completed'];
const REG_DISTRICTS = { Maharashtra:['Pune','Nashik','Nagpur','Kolhapur','Aurangabad'], 'Uttar Pradesh':['Lucknow','Varanasi','Kanpur','Agra'], Bihar:['Patna','Gaya','Muzaffarpur'] };
const MOCK_EMAILS = ['officer@mplads.gov.in','you@nic.gov.in','collector.pune@maharashtra.gov.in','admin@mospi.gov.in'];

export {
  mulberry32,
  rand,
  pick,
  int,
  SECTORS,
  SECTOR_SUBTYPES,
  CHECK_TYPES,
  STATUSES,
  AGENCIES,
  MPS,
  STATE_SEEDS,
  STATES,
  DISTRICTS,
  DISTRICT_OPTIONS,
  buildDistrictOptions,
  districtFor,
  VILLAGES,
  BLOCKS,
  riskBandTags,
  statusForRisk,
  titleFor,
  WORKS,
  riskBand,
  RISK_LABEL,
  DEFAULT_PALETTE,
  DARK_PALETTE,
  hexMix,
  scaleDark,
  CHECK_TYPE_COUNTS,
  agencyLedger,
  AGENCY_IDLE,
  REPORTS,
  LIVE_EVENTS,
  money,
  SEAL_DATE_LABEL,
  ALL,
  NAV_DEFS,
  FLAGGED_STATUSES,
  AWAITING_STATUSES,
  RESOLVED_STATUSES,
  REG_DISTRICTS,
  MOCK_EMAILS,
};
