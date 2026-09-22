import React from 'react';
import Root from '../Root.jsx';
import { ValsContext } from './ValsContext.js';
import { THEME_VARS } from './theme-vars.js';
import {
  SECTORS,
  CHECK_TYPES,
  STATUSES,
  AGENCIES,
  STATES,
  DISTRICTS,
  DISTRICT_OPTIONS,
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
  money,
  SEAL_DATE_LABEL,
  ALL,
  NAV_DEFS,
  FLAGGED_STATUSES,
  AWAITING_STATUSES,
  RESOLVED_STATUSES,
  REG_DISTRICTS,
  MOCK_EMAILS,
} from '../data/mock.js';
import { fetchOverview, fetchWorks, fetchStateDetail, fetchDossier, CHECK_LABELS, WORK_STATUSES } from '../api.js';

const ALLWORKS_PAGE_SIZE = 14;
const CHECK_KEY_BY_LABEL = Object.fromEntries(
  Object.entries(CHECK_LABELS).map(([key, label]) => [label, key]),
);

let INDIA_STATE_PATHS = null, INDIA_MAP_W = 520, INDIA_MAP_H = 560;

export default class AppState extends React.Component {
  state = {
    route: 'login', screen: 'overview', session: null,
    loginEmail: '', sending: false, sent: false,
    regFullName: '', regEmail: '', regRole: 'District Collector', regState: 'Maharashtra', regDistrict: 'Pune', regSubmitting: false,
    scope: 'local', darkMode: false,
    allworksDistrict: ALL, fundDistrict: ALL, csvMenuOpen: false,
    settingsJurisdictionLocked: true, settingsState: 'Maharashtra', settingsDistrict: 'Pune',
    settingsDensity: 'comfortable', settingsDarkIntensity: 60,
    settingsOverdueDays: 150, settingsIdleFundCr: 5, settingsCritCutoff: 30, settingsHighCutoff: 22, settingsMedCutoff: 15,
    settingsEmailDigest: true, settingsEmailFrequency: 'weekly', settingsDesktopAlerts: true,
    settingsNotifyCritical: true, settingsNotifyHigh: true, settingsNotifyMedium: false,
    settingsIncludeAnnexures: true,
    paletteOpen: false, paletteQuery: '',
    copilotOpen: false, copilotMessages: [], copilotDraft: '', listening: false,
    tickerSeconds: 0,
    overviewSortKey: 'flagged',
    districtModalStateId: null,
    workModalId: null, workModalNote: '', workModalSavedAt: null, workModalDecision: null,
    workModalDossier: null, workModalDossierLoading: false,
    allworksQuery: '', allworksSector: ALL, allworksStatus: ALL, allworksCheckType: ALL, allworksPage: 1,
    queueTab: 'awaiting', reportGeneratingId: null, toast: null, trackedIds: [],
    loginError: null, regToastMsg: null,
    overviewLive: null,
    allworksState: ALL, worksLive: null, stateDetail: null,
  };

  _worksKey = null;

  _loadWorks() {
    const s = this.state;
    const key = [s.allworksState, s.allworksStatus, s.allworksCheckType, s.allworksQuery, s.allworksPage].join('|');
    if (key === this._worksKey) return;
    this._worksKey = key;
    fetchWorks({
      state: s.allworksState === ALL ? null : s.allworksState,
      status: s.allworksStatus === ALL ? null : s.allworksStatus,
      checkType: s.allworksCheckType === ALL ? null : CHECK_KEY_BY_LABEL[s.allworksCheckType],
      query: s.allworksQuery,
      page: s.allworksPage,
      pageSize: ALLWORKS_PAGE_SIZE,
    })
      .then((worksLive) => { if (key === this._worksKey) this.setState({worksLive}); })
      .catch(() => {});
  }

  componentDidMount() {
    fetchOverview()
      .then((overviewLive) => this.setState({overviewLive}))
      .catch(() => {});  // API down: the overview falls back to mock.js
    this._loadWorks();
    this.syncTheme(this._vals ?? {});
    if (this.state.route === 'app') this._loadIndiaMap();
    try {
      const raw = window.localStorage.getItem('mplads.session');
      if (raw) { const s = JSON.parse(raw); this.setState({session:s, route:'app'}); }
      const sc = window.localStorage.getItem('mplads.scope');
      if (sc==='local'||sc==='national') this.setState({scope:sc});
      const dm = window.localStorage.getItem('mplads.darkMode');
      if (dm) this.setState({darkMode: dm==='1'});
      const tr = window.localStorage.getItem('mplads.tracked');
      if (tr) this.setState({trackedIds: JSON.parse(tr)});
    } catch(e) {}
    this._tickClock = setInterval(() => this.setState((s) => ({tickerSeconds:s.tickerSeconds+1})), 1000);
    this._onKeyDown = (e) => { if (e.key==='k' && (e.metaKey||e.ctrlKey)) { e.preventDefault(); this.setState((s) => ({paletteOpen:!s.paletteOpen})); } };
    document.addEventListener('keydown', this._onKeyDown);
  }
  componentDidUpdate() {
    this.syncTheme(this._vals ?? {});
    if (this.state.route === 'app') this._loadIndiaMap();
    this._loadWorks();
  }

  componentWillUnmount() {
    clearInterval(this._tickClock);
    document.removeEventListener('keydown', this._onKeyDown);
    if (this._noteTimer) clearTimeout(this._noteTimer);
  }

  doLogin = (session) => {
    this.setState({ session, route:'app', screen:'overview' });
    try { window.localStorage.setItem('mplads.session', JSON.stringify(session)); } catch(e) {}
  };
  handleMagicLogin = (e) => {
    e.preventDefault();
    const email = this.state.loginEmail.trim().toLowerCase();
    if (!email || !MOCK_EMAILS.includes(email)) {
      this.setState({loginError:'User is not registered yet. Kindly register or continue as a mock user.'});
      return;
    }
    this.setState({loginError:null, sending:true});
    setTimeout(() => {
      this.setState({sending:false, sent:true});
      setTimeout(() => this.doLogin({fullName:'Anagha Kulkarni', email, role:'District Collector', state:'Maharashtra', district:'Pune'}), 900);
    }, 700);
  };
  setLoginEmail = (e) => this.setState({loginEmail: e.target.value, loginError:null});
  handleBiometricLogin = () => this.doLogin({fullName:'Anagha Kulkarni', email:'collector.pune@maharashtra.gov.in', role:'District Collector', state:'Maharashtra', district:'Pune'});
  gotoRegister = (e) => { e.preventDefault(); this.setState({route:'register'}); };
  gotoLogin = (e) => { e.preventDefault(); this.setState({route:'login'}); };
  setRegFullName = (e) => this.setState({regFullName:e.target.value});
  setRegEmail = (e) => this.setState({regEmail:e.target.value});
  setRegRole = (e) => this.setState({regRole:e.target.value});
  setRegState = (e) => { const v=e.target.value; const d=(REG_DISTRICTS[v]??['District HQ'])[0]; this.setState({regState:v, regDistrict:d}); };
  setRegDistrict = (e) => this.setState({regDistrict:e.target.value});
  handleRegisterSubmit = (e) => {
    e.preventDefault();
    try { window.localStorage.setItem('mplads.registeredProfile', JSON.stringify({fullName:this.state.regFullName, email:this.state.regEmail, role:this.state.regRole, state:this.state.regState, district:this.state.regDistrict})); } catch(e) {}
    this.setState({regSubmitting:true, regToastMsg:'Account created — redirecting to your scoped dashboard…'});
    setTimeout(() => this.doLogin({fullName:this.state.regFullName||'New Officer', email:this.state.regEmail, role:this.state.regRole, state:this.state.regState, district:this.state.regDistrict}), 600);
  };
  handleLogout = () => {
    this.setState({session:null, route:'login'});
    try { window.localStorage.removeItem('mplads.session'); } catch(e) {}
  };
  setScopeLocal = () => { this.setState({scope:'local'}); try{window.localStorage.setItem('mplads.scope','local');}catch(e){} };
  setScopeNational = () => { this.setState({scope:'national'}); try{window.localStorage.setItem('mplads.scope','national');}catch(e){} };
  toggleDarkMode = () => this.setState((s) => { const next=!s.darkMode; try{window.localStorage.setItem('mplads.darkMode', next?'1':'0');}catch(e){} return {darkMode:next}; });
  setThemeLight = () => { try{window.localStorage.setItem('mplads.darkMode','0');}catch(e){} this.setState({darkMode:false}); };
  setThemeDark = () => { try{window.localStorage.setItem('mplads.darkMode','1');}catch(e){} this.setState({darkMode:true}); };
  toggleJurisdictionLocked = () => this.setState((s) => ({ settingsJurisdictionLocked: !s.settingsJurisdictionLocked }));
  setSettingsState = (e) => { const v=e.target.value; this.setState({ settingsState:v, settingsDistrict:(DISTRICTS[v] ?? [v+' HQ'])[0] }); };
  setSettingsDistrict = (e) => this.setState({ settingsDistrict: e.target.value });
  setFundDistrict = (e) => this.setState({ fundDistrict: e.target.value });
  setSettingsDensity = (d) => () => this.setState({ settingsDensity: d });
  setSettingsDarkIntensity = (e) => this.setState({ settingsDarkIntensity: Number(e.target.value) });
  setSettingsOverdueDays = (e) => this.setState({ settingsOverdueDays: Number(e.target.value) || 0 });
  setSettingsIdleFundCr = (e) => this.setState({ settingsIdleFundCr: Number(e.target.value) || 0 });
  setSettingsCritCutoff = (e) => this.setState({ settingsCritCutoff: Number(e.target.value) || 0 });
  setSettingsHighCutoff = (e) => this.setState({ settingsHighCutoff: Number(e.target.value) || 0 });
  setSettingsMedCutoff = (e) => this.setState({ settingsMedCutoff: Number(e.target.value) || 0 });
  toggleSettingsEmailDigest = () => this.setState((s) => ({ settingsEmailDigest: !s.settingsEmailDigest }));
  setSettingsEmailFrequency = (e) => this.setState({ settingsEmailFrequency: e.target.value });
  toggleSettingsDesktopAlerts = () => this.setState((s) => ({ settingsDesktopAlerts: !s.settingsDesktopAlerts }));
  toggleSettingsNotifyCritical = () => this.setState((s) => ({ settingsNotifyCritical: !s.settingsNotifyCritical }));
  toggleSettingsNotifyHigh = () => this.setState((s) => ({ settingsNotifyHigh: !s.settingsNotifyHigh }));
  toggleSettingsNotifyMedium = () => this.setState((s) => ({ settingsNotifyMedium: !s.settingsNotifyMedium }));
  toggleSettingsIncludeAnnexures = () => this.setState((s) => ({ settingsIncludeAnnexures: !s.settingsIncludeAnnexures }));
  saveSettings = () => { this.setState({toast:{title:'Settings saved', description:'Your workspace preferences have been updated.'}}); setTimeout(() => this.setState((s) => (s.toast && s.toast.title==='Settings saved' ? {toast:null} : {})), 4000); };
  resetSettings = () => { this.setState({ settingsJurisdictionLocked:true, settingsState:'Maharashtra', settingsDistrict:'Pune', settingsDensity:'comfortable', settingsDarkIntensity:60, settingsOverdueDays:150, settingsIdleFundCr:5, settingsCritCutoff:30, settingsHighCutoff:22, settingsMedCutoff:15, settingsEmailDigest:true, settingsEmailFrequency:'weekly', settingsDesktopAlerts:true, settingsNotifyCritical:true, settingsNotifyHigh:true, settingsNotifyMedium:false, settingsIncludeAnnexures:true, toast:{title:'Defaults restored', description:'All Settings preferences were reset.'} }); setTimeout(() => this.setState((s) => (s.toast && s.toast.title==='Defaults restored' ? {toast:null} : {})), 4000); };
  requestJurisdictionChange = () => { this.setState({toast:{title:'Request submitted', description:'Your zonal admin has been notified.'}}); setTimeout(() => this.setState((s) => (s.toast && s.toast.title==='Request submitted' ? {toast:null} : {})), 4000); };

  navTo = (screen) => () => this.setState({screen});
  gotoQueue = () => this.setState({screen:'queue'});

  openPalette = () => this.setState({paletteOpen:true, paletteQuery:''});
  closePalette = () => this.setState({paletteOpen:false});
  stopProp = (e) => e.stopPropagation();
  setPaletteQuery = (e) => this.setState({paletteQuery:e.target.value});
  paletteGotoScreen = (screen) => () => this.setState({paletteOpen:false, screen});
  paletteGotoWork = (id) => () => { this.setState({paletteOpen:false, screen:'allworks'}); this.openWorkModal(id)(); };

  openWorkModal = (id) => () => {
    let note = '';
    try { const raw = window.localStorage.getItem('mplads.draft.'+id); if (raw) note = raw; } catch(e) {}
    this.setState({workModalId:id, workModalNote:note, workModalDecision:null, workModalSavedAt:null, workModalDossier:null, workModalDossierLoading:false});
    if (this.state.overviewLive) {
      this.setState({workModalDossierLoading:true});
      fetchDossier(id)
        .then((dossier) => { if (this.state.workModalId === id) this.setState({workModalDossier:dossier, workModalDossierLoading:false}); })
        .catch(() => { if (this.state.workModalId === id) this.setState({workModalDossierLoading:false}); });
    }
  };
  closeWorkModal = () => this.setState({workModalId:null, workModalDossier:null, workModalDossierLoading:false});
  setWorkNote = (e) => {
    const v = e.target.value;
    this.setState({workModalNote:v});
    if (this._noteTimer) clearTimeout(this._noteTimer);
    const id = this.state.workModalId;
    this._noteTimer = setTimeout(() => { try{window.localStorage.setItem('mplads.draft.'+id, v);}catch(err){} this.setState({workModalSavedAt:Date.now()}); }, 500);
  };
  aiDraftNote = () => {
    const w = WORKS.find((x) => x.id===this.state.workModalId);
    if (!w) return;
    const text = `AI-drafted assessment: ${w.checkTags.join(' and ')} triggered on ${w.id}. Sanctioned value is ${money(w.sanctioned)} against reported progress of ${w.progress}%. Recommend requesting revised cost estimates and a fresh Measurement Book entry before further disbursement.`;
    this.setState({workModalNote:text});
    try{window.localStorage.setItem('mplads.draft.'+w.id, text);}catch(e){}
    this.setState({workModalSavedAt:Date.now()});
  };
  recordDecision = (label) => () => this.setState({workModalDecision:label});
  toggleTrack = (id) => () => this.setState((s) => {
    const tracked = s.trackedIds.includes(id) ? s.trackedIds.filter((x) => x!==id) : [...s.trackedIds, id];
    try{window.localStorage.setItem('mplads.tracked', JSON.stringify(tracked));}catch(e){}
    return {trackedIds:tracked};
  });

  openDistrictModal = (id) => () => this.setState({districtModalStateId:id});
  closeDistrictModal = () => this.setState({districtModalStateId:null, stateDetail:null});
  openStateModal = (name) => () => {
    this.setState({districtModalStateId:name, stateDetail:null});
    fetchStateDetail(name)
      .then((stateDetail) => { if (this.state.districtModalStateId === name) this.setState({stateDetail}); })
      .catch(() => {});
  };
  setOverviewSort = (key) => () => this.setState({overviewSortKey:key});

  setAllworksField = (field) => (e) => this.setState({[field]: e.target.value, allworksPage:1});
  setAllworksPage = (n) => () => this.setState({allworksPage:n});
  clearAllworksFilters = () => this.setState({allworksQuery:'', allworksSector:ALL, allworksStatus:ALL, allworksCheckType:ALL, allworksDistrict:ALL, allworksState:ALL, allworksPage:1});

  setQueueAwaiting = () => this.setState({queueTab:'awaiting'});
  setQueueResolved = () => this.setState({queueTab:'resolved'});

  generateReport = (id, title) => () => {
    this.setState({reportGeneratingId:id});
    setTimeout(() => {
      this.setState({reportGeneratingId:null, toast:{title:'Dossier generated', description:`${title} — cryptographically hashed and ready for download.`}});
      setTimeout(() => this.setState((s) => (s.toast && s.toast.title==='Dossier generated' ? {toast:null} : {})), 4000);
    }, 1600);
  };
  csvColumns = ['Work ID','Title','Sub-type','Sector','District','State','Implementing agency','Sanctioned (₹)','Released (₹)','Utilised (₹)','Progress %','Status','Risk score','Check tags'];
  csvRow = (w) => [w.id,w.title,w.subType,w.sector,w.district,w.state,w.agency,w.sanctioned,w.released,w.utilised,w.progress,w.status,w.riskScore,(w.checkTags||[]).join(' | ')];
  downloadCsv = (name, rows) => {
    const esc = (v) => '"' + String(v ?? '').replace(/"/g,'""') + '"';
    const csv = [this.csvColumns.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\r\n');
    try {
      const url = URL.createObjectURL(new Blob(['\ufeff'+csv], {type:'text/csv;charset=utf-8;'}));
      const a = document.createElement('a');
      a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      return true;
    } catch(e) { return false; }
  };
  flashToast = (title, description) => {
    this.setState({toast:{title, description}});
    setTimeout(() => this.setState((s) => (s.toast && s.toast.title===title ? {toast:null} : {})), 4000);
  };
  toggleCsvMenu = () => this.setState((s) => ({csvMenuOpen: !s.csvMenuOpen}));
  closeCsvMenu = () => this.setState({csvMenuOpen:false});
  exportOneWorkCsv = (w) => () => {
    const name = 'mplads-' + w.id + '.csv';
    const ok = this.downloadCsv(name, [this.csvRow(w)]);
    this.setState({csvMenuOpen:false});
    ok ? this.flashToast('CSV exported', w.id + ' — ' + w.title + ' saved to your Downloads as ' + name + '.')
       : this.flashToast('Export failed', 'Your browser blocked the download.');
  };
  exportAllworksCsv = (rows) => () => {
    const name = 'mplads-works-' + new Date().toISOString().slice(0,10) + '.csv';
    const ok = this.downloadCsv(name, rows.map(this.csvRow));
    this.setState({csvMenuOpen:false});
    ok ? this.flashToast('CSV exported', rows.length + ' works written to ' + name + '.')
       : this.flashToast('Export failed', 'Your browser blocked the download.');
  };
  exportCurrentReport = () => {
    const label = this.state.scope==='local' ? `${this.state.session.district}, ${this.state.session.state}` : 'National Overview';
    this.setState({reportGeneratingId:'current-export'});
    setTimeout(() => {
      this.setState({reportGeneratingId:null, toast:{title:'Report exported', description:`${label} sector report is ready for download.`}});
      setTimeout(() => this.setState((s) => (s.toast && s.toast.title==='Report exported' ? {toast:null} : {})), 4000);
    }, 1200);
  };

  toggleCopilot = () => this.setState((s) => {
    if (!s.copilotOpen && s.copilotMessages.length===0) {
      const label = ({overview:'the National Overview',allworks:'the All Works directory',fundflow:'Fund Flow & PFMS analysis',tracker:'the Project Tracker',reports:'Reports',queue:'the Review Queue'})[s.screen] ?? 'this screen';
      return {copilotOpen:true, copilotMessages:[{role:'assistant', text:`I can see you're viewing ${label}. Ask me to summarize a flag, draft a clarification memo, or check a contractor's bidding history.`}]};
    }
    return {copilotOpen:!s.copilotOpen};
  });
  copilotIntro = () => {
    const label = ({overview:'the National Overview',allworks:'the All Works directory',fundflow:'Fund Flow & PFMS analysis',tracker:'the Project Tracker',contractors:'the Contractors register',reports:'Reports',queue:'the Review Queue',settings:'Settings'})[this.state.screen] ?? 'this screen';
    return {role:'assistant', text:`I can see you're viewing ${label}. Ask me to summarize a flag, draft a clarification memo, or check a contractor's bidding history.`};
  };
  clearCopilot = () => {
    this._stopDictation();
    this.setState({copilotMessages:[this.copilotIntro()], copilotDraft:''});
    this.flashToast('Conversation cleared', 'The copilot has been reset to a fresh session.');
  };
  setCopilotDraft = (e) => this.setState({copilotDraft:e.target.value});
  runCopilotAction = (label, response) => () => this.setState((s) => ({copilotMessages:[...s.copilotMessages, {role:'user',text:label}, {role:'assistant',text:response}]}));
  copilotSummarize = () => this.runCopilotAction('Summarize why flagged', 'This work exceeds the sector median cost by 3.7 standard deviations and shares a sanction description with a nearby project — both cost-outlier and duplicate-match checks triggered.')();
  copilotDraftMemo = () => this.runCopilotAction('Draft clarification memo', 'Draft ready: "The implementing agency is requested to submit revised cost estimates with vendor quotations and the Measurement Book entry within 7 working days."')();
  copilotBiddingHistory = () => this.runCopilotAction('Check contractor bidding history', 'This contractor won 4 of the last 5 tenders from this agency as the sole bidder — flagging for cartel review.')();
  sendCopilotMessage = () => {
    const d = this.state.copilotDraft.trim();
    if (!d) return;
    const label = ({overview:'the National Overview',allworks:'the All Works directory',fundflow:'Fund Flow & PFMS analysis',tracker:'the Project Tracker',reports:'Reports',queue:'the Review Queue'})[this.state.screen] ?? 'this screen';
    this.setState((s) => ({copilotMessages:[...s.copilotMessages, {role:'user',text:d}, {role:'assistant',text:`Noted. I've logged this against ${label} for follow-up — I'll surface relevant findings once analysis completes.`}], copilotDraft:''}));
  };
  copilotKeyDown = (e) => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); this.sendCopilotMessage(); } };
  _stopDictation = () => {
    this._wantListening = false;
    if (this._rec) { try { this._rec.onend = null; this._rec.stop(); } catch(e) {} }
    this._rec = null;
    this.setState({listening:false});
  };
  _beginDictation = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const ERRS = {
      'not-allowed': 'Microphone permission was denied. Click the mic icon in the address bar and allow it.',
      'service-not-allowed': 'Chrome refused the speech service for this page. Serve the file over http://localhost and retry.',
      'network': 'Speech recognition needs an internet connection — Chrome transcribes on its servers.',
      'audio-capture': 'No microphone was found on this device.',
      'aborted': 'Dictation was interrupted.',
    };
    const rec = new SR();
    rec.lang = 'en-IN'; rec.interimResults = true; rec.continuous = true; rec.maxAlternatives = 1;
    rec.onstart = () => { this._draftBase = this.state.copilotDraft || ''; this.setState({listening:true}); };
    rec.onresult = (e) => {
      let out = '';
      for (let i = 0; i < e.results.length; i++) out += e.results[i][0].transcript;
      out = out.replace(/\s+/g, ' ').trim();
      const base = this._draftBase || '';
      this.setState({copilotDraft: (base ? base + ' ' : '') + out});
    };
    rec.onerror = (e) => {
      const code = (e && e.error) || 'unknown';
      if (code === 'no-speech') return;
      this._wantListening = false; this._rec = null;
      this.setState({listening:false});
      this.flashToast('Dictation stopped', ERRS[code] || ('Speech recognition error: ' + code));
    };
    rec.onend = () => {
      if (this._wantListening) {
        this._draftBase = this.state.copilotDraft || '';
        try { rec.start(); return; } catch(err) {}
      }
      this._rec = null; this.setState({listening:false});
    };
    this._rec = rec; this._wantListening = true;
    try { rec.start(); }
    catch(err) {
      this._rec = null; this._wantListening = false; this.setState({listening:false});
      this.flashToast('Dictation failed to start', String((err && err.message) || err));
    }
  };
  toggleListening = () => {
    if (this._rec) { this._stopDictation(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { this.flashToast('Dictation unavailable', 'This browser has no speech recognition. Chrome and Edge support it.'); return; }
    if (window.location.protocol === 'file:') {
      this.flashToast('Dictation needs a local server', 'Chrome blocks the microphone on file:// pages. Run  python -m http.server  in this folder, then open http://localhost:8000 and dictation will work.');
      return;
    }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({audio:true})
        .then((stream) => { stream.getTracks().forEach((t) => t.stop()); this._beginDictation(); })
        .catch((err) => {
          const n = (err && err.name) || 'error';
          const MSG = {
            NotFoundError: 'No microphone is connected to this computer. Plug in a headset or USB mic, then try again.',
            NotAllowedError: 'You denied microphone access. Click the camera/mic icon in the address bar, set Microphone to Allow, then reload.',
            NotReadableError: 'Another app is already using the microphone. Close it (Zoom, Teams, Meet) and try again.',
            SecurityError: 'This page must be served over http://localhost or https for microphone access.',
          };
          const TITLE = n === 'NotFoundError' ? 'No microphone found' : n === 'NotAllowedError' ? 'Microphone blocked' : 'Microphone unavailable';
          this.flashToast(TITLE, MSG[n] || ('Microphone error: ' + n));
        });
    } else { this._beginDictation(); }
  };


  renderVals() {
    const s = this.state;
    const [PRI, HIGH, MED, CLEAR] = s.darkMode ? DARK_PALETTE : DEFAULT_PALETTE;
    const PRI_FG = '#FAFBF9';
    const wash = (hex) => hexMix(s.darkMode ? '#101a2c' : '#ffffff', hex, s.darkMode ? 0.28 : 0.14);
    const HIGH_WASH = wash(HIGH), MED_WASH = wash(MED), CLEAR_WASH = wash(CLEAR);
    const T = s.darkMode ? {
      page:scaleDark('#10192A', s.settingsDarkIntensity), sidebar:scaleDark('#0E1626', s.settingsDarkIntensity), sidebarBorder:'#2A3D5F', card:scaleDark('#16223A', s.settingsDarkIntensity), border:'#28395A',
      text:'#E8ECF3', textSec:'#A9B6C9', textMuted:'#8E9CB2',
      surfaceMuted:'#1D2A42', surfaceActive:'#223351', surfaceSubtle:'#16223A', sectorBadge:'#1F3050',
      mapBg:'#0F1B2D', mapMuted:'#1D2A42',
    } : {
      page:'#E6E9E3', sidebar:'#F7F9F5', sidebarBorder:'#D4DAD2', card:'#fff', border:'#D6DCD3',
      text:'#131A22', textSec:'#4A555F', textMuted:'#6C7780',
      surfaceMuted:'#E7EAE4', surfaceActive:'#E1E7DE', surfaceSubtle:'#F7F8F5', sectorBadge:'#E1E7F0',
      mapBg:'#FBFAF6', mapMuted:'#E9E2CE',
    };
    const badgeStyle = 'soft';
    const density = s.settingsDensity;
    const cellPad = density==='compact' ? '6px 14px' : '10px 16px';
    function tone(hex, wash){ return badgeStyle==='bold' ? {bg:hex, fg:'#fff'} : {bg:wash, fg:hex}; }
    const highTone = tone(HIGH, HIGH_WASH), medTone = tone(MED, MED_WASH), clearTone = tone(CLEAR, CLEAR_WASH);
    const RISK_COLORS = { high:highTone.fg, med:medTone.fg, low:clearTone.fg };
    const RISK_WASH = { high:highTone.bg, med:medTone.bg, low:clearTone.bg };
    const showLogin = s.route==='login';
    const showRegister = s.route==='register';
    const showApp = s.route==='app' && !!s.session;

    const roleOptions = ['District Collector','State Nodal Officer','Central Ministry Officer','Citizen Auditor'];
    const stateNameOptions = STATES.map((x) => x.name);
    const regDistrictOptions = REG_DISTRICTS[s.regState] ?? ['District HQ'];

    const chakraSpokes = Array.from({length:24}, (_, i) => { const a = (i/24)*Math.PI*2; return { x: 100+92*Math.cos(a), y: 100+92*Math.sin(a) }; });
    if (!showApp) {
      return {
        showLogin, showRegister, showApp, chakraSpokes, pageBg: T.page, textPrimary: T.text,
        primaryColor: PRI, primaryFg: PRI_FG, riskHighColor: HIGH, riskMedColor: MED, riskClearColor: CLEAR,
        riskHighWash: HIGH_WASH, riskMedWash: MED_WASH, riskClearWash: CLEAR_WASH, cellPad,
        loginEmail: s.loginEmail, setLoginEmail: this.setLoginEmail, handleMagicLogin: this.handleMagicLogin,
        loginDisabled: s.sending||s.sent, loginBtnOpacity: (s.sending||s.sent) ? 0.7 : 1,
        loginButtonLabel: s.sent ? 'OTP verified successfully. Redirecting…' : s.sending ? 'Verifying OTP…' : 'Send OTP on Email',
        loginError: s.loginError, showLoginError: !!s.loginError,
        handleBiometricLogin: this.handleBiometricLogin, gotoRegister: this.gotoRegister, gotoLogin: this.gotoLogin,
        regFullName: s.regFullName, setRegFullName: this.setRegFullName, regEmail: s.regEmail, setRegEmail: this.setRegEmail,
        regRole: s.regRole, setRegRole: this.setRegRole, regState: s.regState, setRegState: this.setRegState,
        regDistrict: s.regDistrict, setRegDistrict: this.setRegDistrict, regSubmitting: s.regSubmitting,
        regButtonLabel: s.regSubmitting ? 'Creating account…' : 'Create account', handleRegisterSubmit: this.handleRegisterSubmit,
        regToastMsg: s.regToastMsg, showRegToast: !!s.regToastMsg,
        roleOptions, stateNameOptions, regDistrictOptions,
      };
    }

    const session = s.session;
    const canSwitchScope = session.role !== 'District Collector';
    const navItems = NAV_DEFS.map((n) => {
      const active = s.screen===n.key;
      return { key:n.key, label:n.label, dot:n.dot, go: this.navTo(n.key),
        bg: active ? T.surfaceActive : 'transparent', color: active ? T.text : T.textSec,
        borderColor: active ? PRI : 'transparent', weight: active ? 600 : 500 };
    });
    const awaitingAll = WORKS.filter((w) => AWAITING_STATUSES.includes(w.status));
    const resolvedAll = WORKS.filter((w) => RESOLVED_STATUSES.includes(w.status));
    const queueActive = s.screen==='queue';

    // Overview reads from the API once it answers; everything else is still mock.
    const live = s.overviewLive;
    const ovStates = live ? live.states : STATES;
    const ovChecks = live ? live.checkCounts : CHECK_TYPE_COUNTS;

    const totalMonitored = ovStates.reduce((a,x) => a+x.monitored, 0);
    const totalFlagged = ovStates.reduce((a,x) => a+x.flagged, 0);
    const avgRiskNat = live ? Math.round(live.kpis.avg_national_risk_score)
      : Math.round(STATES.reduce((a,x) => a+x.avgRisk, 0)/STATES.length);
    const totalSanctioned = live ? live.kpis.total_funds_sanctioned : WORKS.reduce((a,w) => a+w.sanctioned, 0);
    const highRiskCount = live ? live.kpis.high_risk_works : WORKS.filter((w) => w.riskScore>=75).length;
    const overviewStats = [
      {label:'Works monitored', value: totalMonitored.toLocaleString('en-IN'), color:T.text},
      {label:'Flagged for review', value: totalFlagged.toLocaleString('en-IN'), color:HIGH, sub:`${((totalFlagged/totalMonitored)*100).toFixed(1)}% of total`},
      {label:'High-risk works (≥75)', value: highRiskCount.toLocaleString('en-IN'), color:HIGH},
      {label:'Avg. national risk score', value:`${avgRiskNat}`, color:MED},
      {label:'Total funds sanctioned', value: money(totalSanctioned), color:T.text, sub:'across monitored works'},
    ];
    const maxAvgRisk = Math.max(...ovStates.map((x) => x.avgRisk)) || 1;
    const mapReady = !!INDIA_STATE_PATHS;
    const stateIds = new Set(ovStates.map((x) => x.id));
    const mapCells = mapReady ? ovStates.filter((st) => INDIA_STATE_PATHS[st.id]).map((st) => {
      const t = st.avgRisk/maxAvgRisk;
      return { id:st.id, d: INDIA_STATE_PATHS[st.id], fill: hexMix(T.mapMuted, HIGH, t),
        title:`${st.name} — ${st.flagged} flagged of ${st.monitored} monitored, avg risk ${st.avgRisk}`,
        open: live ? this.openStateModal(st.name) : this.openDistrictModal(st.id) };
    }) : [];
    const mapOtherPaths = mapReady ? Object.keys(INDIA_STATE_PATHS).filter((id) => !stateIds.has(id)).map((id) => INDIA_STATE_PATHS[id]) : [];
    const legendCells = Array.from({length:12}, (_, i) => hexMix(T.mapMuted, HIGH, i/11));
    const checkBars = Object.entries(ovChecks).map(([label,value]) => ({label,value})).sort((a,b) => b.value-a.value);
    const maxBar = Math.max(...checkBars.map((b) => b.value));
    checkBars.forEach((b) => { b.pct = Math.max(3, (b.value/maxBar)*100); });
    const sortButtons = ['flagged','avgRisk','monitored'].map((key) => ({ key, go: this.setOverviewSort(key),
      label: key==='flagged'?'Flagged':key==='avgRisk'?'Avg. risk':'Monitored',
      bg: s.overviewSortKey===key?T.surfaceActive:'transparent', color:T.text }));
    const sortedStates = [...ovStates].sort((a,b) => b[s.overviewSortKey]-a[s.overviewSortKey]);
    const sortedStateRows = sortedStates.map((st, i) => {
      const band = riskBand(st.avgRisk);
      const max = Math.max(...st.trend), min = Math.min(...st.trend), range = max-min||1;
      const pts = st.trend.map((v, j) => { const x=(j/(st.trend.length-1))*96; const y=28-((v-min)/range)*28; return `${x},${y}`; });
      const rising = st.trend[st.trend.length-1] > st.trend[0];
      return { rank:i+1, name:st.name, monitored: st.monitored.toLocaleString('en-IN'), flagged: st.flagged.toLocaleString('en-IN'),
        riskBg: RISK_WASH[band], riskColor: RISK_COLORS[band], riskLabel: `${st.avgRisk} · ${RISK_LABEL[band]}`,
        sparkPoints: pts.join(' '), sparkColor: rising?HIGH:T.textMuted, sparkLastY: pts[pts.length-1].split(',')[1],
        open: live ? this.openStateModal(st.name) : this.openDistrictModal(st.id) };
    });

    const MONTHS = ['Feb','Mar','Apr','May','Jun','Jul','Aug'];
    const fundWorks = s.fundDistrict===ALL ? WORKS : WORKS.filter((w) => `${w.state}::${w.district}`===s.fundDistrict);
    const fundLedger = s.fundDistrict===ALL ? AGENCY_IDLE : agencyLedger(fundWorks);
    const fundSanctioned = fundWorks.reduce((a,w) => a+w.sanctioned, 0);
    const totalReleased = fundWorks.reduce((a,w) => a+w.released, 0);
    const totalUtilised = fundWorks.reduce((a,w) => a+w.utilised, 0);
    const idleGap = totalReleased-totalUtilised;
    const totalIdle = fundLedger.reduce((a,ag) => a+ag.idleFunds, 0);
    const fundflowStats = [
      {label:'Sanctioned', value: money(fundSanctioned), color:T.text},
      {label:'Released', value: money(totalReleased), color:T.text},
      {label:'Utilised', value: money(totalUtilised), color:CLEAR},
      {label:'Idle gap (released − utilised)', value: money(idleGap), color:MED},
      {label:'Total idle across agencies', value: money(totalIdle), color:HIGH},
    ];
    const releasedVals = MONTHS.map((_, i) => Math.round((totalReleased/1e7)*((i+1)/MONTHS.length)*(0.85+i*0.03)));
    const utilisedVals = MONTHS.map((_, i) => Math.round((totalUtilised/1e7)*((i+1)/MONTHS.length)*(0.7+i*0.02)));
    const padLeft=46, padRight=34, padTop=14, padBottom=40, width=640, height=240;
    const baseline = height-padBottom, plotSpan = baseline-padTop;
    const maxV = Math.max(...releasedVals, ...utilisedVals)*1.1;
    const xStep = (width-padLeft-padRight)/(MONTHS.length-1);
    function toPts(vals){ return vals.map((v,i) => { const x=padLeft+i*xStep; const y=baseline-(v/maxV)*plotSpan; return [x,y]; }); }
    const relPts = toPts(releasedVals), utilPts = toPts(utilisedVals);
    const catmull = (pts, i) => { const p0=pts[i-1]||pts[i], p1=pts[i], p2=pts[i+1], p3=pts[i+2]||p2; return {c1x:p1[0]+(p2[0]-p0[0])/6, c1y:p1[1]+(p2[1]-p0[1])/6, c2x:p2[0]-(p3[0]-p1[0])/6, c2y:p2[1]-(p3[1]-p1[1])/6}; };
    const smoothSegments = (pts) => { let d = ''; for (let i=0;i<pts.length-1;i++){ const c=catmull(pts,i); d += ` C${c.c1x.toFixed(2)},${c.c1y.toFixed(2)} ${c.c2x.toFixed(2)},${c.c2y.toFixed(2)} ${pts[i+1][0]},${pts[i+1][1]}`; } return d; };
    const smoothPath = (pts) => `M${pts[0][0]},${pts[0][1]}${smoothSegments(pts)}`;
    const relSmooth = smoothPath(relPts), utilSmooth = smoothPath(utilPts);
    const fundflowReleasedPoints = relSmooth;
    const fundflowUtilisedPoints = utilSmooth;
    const fundflowReleasedAreaPath = `${relSmooth} L${relPts[relPts.length-1][0]},${baseline} L${relPts[0][0]},${baseline} Z`;
    const fundflowUtilisedAreaPath = `${utilSmooth} L${utilPts[utilPts.length-1][0]},${baseline} L${utilPts[0][0]},${baseline} Z`;
    const fundflowReleasedEnd = {x: relPts[relPts.length-1][0], y: relPts[relPts.length-1][1], label: `₹${releasedVals[releasedVals.length-1]}`};
    const fundflowUtilisedEnd = {x: utilPts[utilPts.length-1][0], y: utilPts[utilPts.length-1][1], label: `₹${utilisedVals[utilisedVals.length-1]}`};
    const fundflowReleasedDots = relPts.map((p) => ({x:p[0],y:p[1]}));
    const fundflowUtilisedDots = utilPts.map((p) => ({x:p[0],y:p[1]}));
    const fundflowLabels = MONTHS.map((m,i) => ({text:m, x: padLeft+i*xStep}));
    const gridLines = [0,0.25,0.5,0.75,1].map((f) => ({ y: baseline-f*plotSpan, value: Math.round(f*maxV) }));
    const SEV_WASH={Critical:highTone.bg,High:highTone.bg,Medium:medTone.bg,Low:clearTone.bg};
    const SEV_COLOR={Critical:highTone.fg,High:highTone.fg,Medium:medTone.fg,Low:clearTone.fg};
    const idleFloor = (s.settingsIdleFundCr||0)*1e7*(fundWorks.length/WORKS.length);
    const severityOf = (a) => a.overdueUCs>=s.settingsCritCutoff ? 'Critical' : a.overdueUCs>=s.settingsHighCutoff ? 'High' : a.overdueUCs>=s.settingsMedCutoff ? 'Medium' : 'Low';
    const leakageAgencies = fundLedger
      .filter((a) => a.idleFunds>=idleFloor)
      .filter((a) => a.overdueUCs>=s.settingsMedCutoff || a.avgIdleDays>s.settingsOverdueDays)
      .map((a) => ({...a, severity: severityOf(a)}));
    const agencyRows = fundLedger.filter((a) => a.idleFunds>=idleFloor).map((a) => ({ name:a.name, idleFunds: money(a.idleFunds), avgIdleDays:`${a.avgIdleDays}d`, missingDPRs:a.missingDPRs, overdueUCs:a.overdueUCs, severity: severityOf(a), sevBg: SEV_WASH[severityOf(a)], sevColor: SEV_COLOR[severityOf(a)] }));

    const matchesQuery = (w, q) => { if (!q) return true; const s2=q.toLowerCase(); return w.title.toLowerCase().includes(s2)||w.id.toLowerCase().includes(s2)||w.agency.toLowerCase().includes(s2)||w.district.toLowerCase().includes(s2); };
    function filterWorks(list, {query,sector,status,checkType,district}) {
      return list.filter((w) => {
        if (district && district!==ALL && `${w.state}::${w.district}`!==district) return false;
        if (sector!==ALL && w.sector!==sector) return false;
        if (status!==ALL && w.status!==status) return false;
        if (checkType!==ALL && !w.checkTags.includes(checkType)) return false;
        if (!matchesQuery(w,query)) return false;
        return true;
      });
    }
    function worksTableRows(list, dense, onOpen) {
      return list.map((w) => {
        const band = riskBand(w.riskScore);
        const extraTags = Math.max(0, w.checkTags.length-2);
        return { id:w.id, title:w.title, sub:`${w.id} · ${w.subType}`, location:`${w.district}, ${w.state}`, sanctioned: money(w.sanctioned),
          progress:w.progress, progressColor: w.progress>=75?CLEAR:w.progress>=40?MED:HIGH,
          statusLabel:w.status, statusBg: STATUS_BG(w.status), statusColor: STATUS_COLOR(w.status),
          riskBg: RISK_WASH[band], riskColor: RISK_COLORS[band], riskLabel:`${w.riskScore} · ${RISK_LABEL[band]}`,
          dense, tags: w.checkTags.slice(0,2), extraTags, hasExtraTags: extraTags>0,
          open: onOpen(w.id) };
      });
    }
    function pageNumbers(total, current, setPage) {
      const n = Math.min(total, 7);
      return Array.from({length:n}, (_, i) => ({ n:i+1, go:setPage(i+1), bg: current===i+1?PRI:T.card, color: current===i+1?'#fff':T.text }));
    }
    const ONGOING_TONE = badgeStyle==='bold' ? {bg:T.textSec, fg:'#fff'} : {bg:T.surfaceMuted, fg:T.textSec};
    const STATUS_TONE = { Flagged:highTone, 'Under review':medTone, 'Clarification sought':medTone, Escalated:highTone, Cleared:clearTone, Completed:clearTone, Ongoing:ONGOING_TONE };
    function STATUS_BG(status){ return (STATUS_TONE[status]||ONGOING_TONE).bg; }
    function STATUS_COLOR(status){ return (STATUS_TONE[status]||ONGOING_TONE).fg; }

    const wl = s.worksLive;
    const allworksFiltered = filterWorks(WORKS, {query:s.allworksQuery, sector:s.allworksSector, status:s.allworksStatus, checkType:s.allworksCheckType, district:s.allworksDistrict});
    const allworksResultCount = wl ? wl.total : allworksFiltered.length;
    const allworksTotalPages = Math.max(1, Math.ceil(allworksResultCount/ALLWORKS_PAGE_SIZE));
    const allworksPageClamped = Math.min(s.allworksPage, allworksTotalPages);
    const allworksPageItems = allworksFiltered.slice((allworksPageClamped-1)*ALLWORKS_PAGE_SIZE, allworksPageClamped*ALLWORKS_PAGE_SIZE);

    const allworksRows = wl ? wl.works.map((w) => {
      const band = riskBand(w.risk_score);
      const tags = w.checks.map((c) => CHECK_LABELS[c] ?? c);
      const extraTags = Math.max(0, tags.length-2);
      return { id:w.work_id, title:w.description, sub:`${w.work_id} · ${w.mp_name ?? ''}`,
        location:[w.constituency, w.state].filter(Boolean).join(', '), sanctioned: money(w.sanction_amount ?? 0),
        statusLabel:w.status, statusBg: STATUS_BG(w.status), statusColor: STATUS_COLOR(w.status),
        riskBg: RISK_WASH[band], riskColor: RISK_COLORS[band], riskLabel:`${w.risk_score} · ${RISK_LABEL[band]}`,
        dense:true, tags: tags.slice(0,2), extraTags, hasExtraTags: extraTags>0, open: this.openWorkModal(w.work_id) };
    }) : worksTableRows(allworksPageItems, true, this.openWorkModal);

    const allworksHasActiveFilters = !!s.allworksQuery || s.allworksState!==ALL || s.allworksStatus!==ALL || s.allworksCheckType!==ALL;
    const allworksPrevPage = () => this.setState({allworksPage: Math.max(1, allworksPageClamped-1)});
    const allworksNextPage = () => this.setState({allworksPage: Math.min(allworksTotalPages, allworksPageClamped+1)});
    const allworksStats = wl ? [
      {label:'Total works', value: wl.total.toLocaleString('en-IN'), color:T.text},
      {label:'Completed', value: wl.completed.toLocaleString('en-IN'), color:CLEAR},
      {label:'Flagged (≥40)', value: wl.flagged.toLocaleString('en-IN'), color:HIGH},
      {label:'Total sanctioned', value: money(wl.total_sanctioned), color:T.text},
    ] : [
      {label:'Total works', value: WORKS.length.toLocaleString('en-IN'), color:T.text},
      {label:'Completed', value: WORKS.filter((w) => w.status==='Completed').length.toLocaleString('en-IN'), color:CLEAR},
      {label:'Total sanctioned', value: money(WORKS.reduce((a,w) => a+w.sanctioned, 0)), color:T.text},
      {label:'Sectors covered', value:`${SECTORS.length}`, color:T.text},
    ];

    const awaitingSorted = [...awaitingAll].sort((a,b) => (b.waitingDays??0)-(a.waitingDays??0));
    const resolvedSorted = [...resolvedAll].sort((a,b) => (b.resolvedDate??'').localeCompare(a.resolvedDate??''));
    const overdueCount = awaitingSorted.filter((w) => (w.waitingDays??0)>21).length;
    const avgWaitQueue = Math.round(awaitingSorted.reduce((a,w) => a+(w.waitingDays??0), 0)/(awaitingSorted.length||1));
    const queueStats = [
      {label:'Awaiting action', value: awaitingSorted.length.toLocaleString('en-IN'), color:HIGH},
      {label:'Overdue (>21 days)', value: overdueCount.toLocaleString('en-IN'), color:HIGH},
      {label:'Avg. waiting days', value:`${avgWaitQueue}`, color:MED},
      {label:'Resolved to date', value: resolvedSorted.length.toLocaleString('en-IN'), color:CLEAR},
    ];
    const awaitingRows = awaitingSorted.map((w) => {
      const band = riskBand(w.riskScore);
      return { title:w.title, idLine:`${w.id} · ${w.district}, ${w.state}`, flaggedDate:w.flaggedDate, waitingDays:w.waitingDays,
        waitColor: (w.waitingDays??0)>21 ? HIGH:T.textSec, status:w.status, statusBg: STATUS_BG(w.status), statusColor: STATUS_COLOR(w.status),
        riskBg: RISK_WASH[band], riskColor: RISK_COLORS[band], riskLabel:`${w.riskScore} · ${RISK_LABEL[band]}`, open: this.openWorkModal(w.id) };
    });
    const resolvedRows = resolvedSorted.map((w) => ({ title:w.title, id:w.id, resolvedDate:w.resolvedDate, decision:w.decision, reviewedBy:w.reviewedBy, sanctioned: money(w.sanctioned), open: this.openWorkModal(w.id) }));

    const reportCards = REPORTS.map((r) => ({ ...r, generating: s.reportGeneratingId===r.id,
      badgeBg: r.frequency==='Scheduled' ? T.surfaceActive : T.card, badgeColor: r.frequency==='Scheduled' ? T.text : T.textSec,
      buttonLabel: s.reportGeneratingId===r.id ? 'Generating…' : 'Generate now', generate: this.generateReport(r.id, r.title) }));

    const matches = s.paletteQuery.length>1 ? WORKS.filter((w) => w.id.toLowerCase().includes(s.paletteQuery.toLowerCase())||w.title.toLowerCase().includes(s.paletteQuery.toLowerCase())).slice(0,6) : [];
    const paletteMatches = matches.map((w) => { const band=riskBand(w.riskScore); return { title:w.title, sub:`${w.id} · ${w.district}, ${w.state}`, riskBg:RISK_WASH[band], riskColor:RISK_COLORS[band], riskLabel:`${w.riskScore}`, go: this.paletteGotoWork(w.id) }; });
    const paletteNavItems = [
      {label:'National overview', go:this.paletteGotoScreen('overview')},
      {label:'Filter drinking water works in Junnar', go:this.paletteGotoScreen('allworks')},
      {label:'All works directory', go:this.paletteGotoScreen('allworks')},
      {label:'Fund flow & PFMS leakage', go:this.paletteGotoScreen('fundflow')},
      {label:'Export audit dossier', go:this.paletteGotoScreen('reports')},
      {label:'Review queue', go:this.paletteGotoScreen('queue')},
    ];

    const SCREEN_LABELS = {overview:'the National Overview',allworks:'the All Works directory',fundflow:'Fund Flow & PFMS analysis',tracker:'the Project Tracker',reports:'Reports',queue:'the Review Queue'};
    const copilotMessages = s.copilotMessages.map((m) => ({ text:m.text, align: m.role==='assistant'?'flex-start':'flex-end', bg: m.role==='assistant'?T.surfaceMuted:PRI, color: m.role==='assistant'?T.text:PRI_FG }));

    const workModalWork = s.workModalId ? WORKS.find((w) => w.id===s.workModalId) : null;
    function seeded(id, salt){ let h=salt; for (let i=0;i<String(id).length;i++) h=(h*31+String(id).charCodeAt(i))>>>0; return h; }
    function hashFor(id, step){ const h=seeded(id+step,7); return h.toString(16).padStart(8,'0')+seeded(id,step*13).toString(16).padStart(8,'0'); }
    const TRACK_MONTHS = ['Apr','May','Jun','Jul','Aug'];
    function trackTimeline(id){
      return TRACK_MONTHS.map((m, i) => {
        const h = seeded(id, 40+i);
        return { month:`${m} 2026`, newsCount: h%4, parliamentMention: h%5===0,
          satelliteCheck: ['No visible change','Progress detected','Inspection overdue'][h%3] };
      });
    }
    const trackerRows = WORKS.filter((w) => s.trackedIds.includes(w.id)).map((w) => {
      const band = riskBand(w.riskScore);
      return { id:w.id, title:w.title, sub:`${w.id} · ${w.district}, ${w.state}`,
        riskBg: RISK_WASH[band], riskColor: RISK_COLORS[band], riskLabel:`${w.riskScore} · ${RISK_LABEL[band]}`,
        timeline: trackTimeline(w.id), open: this.openWorkModal(w.id), untrack: this.toggleTrack(w.id) };
    });

    const contractorRanked = AGENCIES.map((name) => {
      const works = WORKS.filter((w) => w.agency===name);
      const total = works.length;
      const flaggedCount = works.filter((w) => FLAGGED_STATUSES.includes(w.status)).length;
      const completedCount = works.filter((w) => w.status==='Completed').length;
      const avgRisk = total ? Math.round(works.reduce((a,w) => a+w.riskScore, 0)/total) : 0;
      const idle = AGENCY_IDLE.find((a) => a.name===name);
      return { name, total, flaggedCount, completionRate: total ? Math.round((completedCount/total)*100) : 0, avgRisk, idleFunds: idle.idleFunds };
    }).sort((a,b) => b.avgRisk-a.avgRisk);
    const contractorRows = contractorRanked.map((c, i) => {
      const band = riskBand(c.avgRisk);
      return { rank:i+1, name:c.name, total:c.total, flaggedCount:c.flaggedCount, completionRate:c.completionRate,
        riskBg: RISK_WASH[band], riskColor: RISK_COLORS[band], riskLabel:`${c.avgRisk} · ${RISK_LABEL[band]}`,
        idleFunds: money(c.idleFunds) };
    });
    const contractorStats = [
      {label:'Contractors tracked', value: AGENCIES.length.toLocaleString('en-IN'), color:T.text},
      {label:'High-risk (avg. ≥75)', value: contractorRanked.filter((c) => c.avgRisk>=75).length.toLocaleString('en-IN'), color:HIGH},
      {label:'Avg. completion rate', value:`${Math.round(contractorRanked.reduce((a,c) => a+c.completionRate,0)/contractorRanked.length)}%`, color:T.text},
      {label:'Total idle funds', value: money(contractorRanked.reduce((a,c) => a+c.idleFunds,0)), color:MED},
    ];
    let wm = {};
    const dossier = s.workModalDossier && s.workModalDossier.work_id === s.workModalId ? s.workModalDossier : null;
    const w = dossier || workModalWork;
    if (w) {
      const isLive = !!dossier;
      const workId = w.work_id ?? w.id;
      const title = w.description ?? w.title;
      const status = w.status;
      const state = w.state;
      const band = riskBand(w.risk_score ?? w.riskScore);
      const checkTags = isLive ? w.checks.map((c) => CHECK_LABELS[c] ?? c) : w.checkTags;

      const padS=24, widthS=480, heightS=180;
      let scatterPoints = [], scatterMeanX = padS, scatterHighlightX = padS, zScore = 0, peerN = 0;
      if (isLive && w.cost_outlier && w.cost_outlier.scatter) {
        const amounts = w.cost_outlier.scatter.map((p) => p.sanction_amount);
        const highlight = w.sanction_amount ?? 0;
        const maxS = Math.max(...amounts, highlight, w.cost_outlier.peer_avg) * 1.1 || 1;
        const yStep = amounts.length ? (heightS - padS * 2 - 12) / amounts.length : 0;
        scatterPoints = w.cost_outlier.scatter.map((p, i) => ({
          cx: padS + (p.sanction_amount / maxS) * (widthS - padS * 2),
          cy: heightS - padS - 12 - i * yStep,
        }));
        scatterMeanX = padS + (w.cost_outlier.peer_avg / maxS) * (widthS - padS * 2);
        scatterHighlightX = padS + (highlight / maxS) * (widthS - padS * 2);
        zScore = w.cost_outlier.z_score;
        peerN = w.cost_outlier.peer_n;
      }

      const duplicateMatches = isLive ? (w.duplicate_matches || []).map((d) => ({
        id: d.work_id,
        title: d.description,
        location: [d.constituency, d.state].filter(Boolean).join(', '),
        sanctioned: money(d.sanction_amount ?? 0),
      })) : [];

      const decision = s.workModalDecision;
      const history = decision ? [{time:'Just now', text:`Decision recorded: ${decision}.`, hash: hashFor(workId, 1)}] : [];

      const metadata = isLive ? [
        {k:'Implementing agency', v:w.ida_name ?? '—'},
        {k:'Constituency', v:w.constituency ?? '—'},
        {k:'Recommending MP', v:w.mp_name ?? '—'},
        {k:'Status', v:w.status ?? '—'},
        {k:'Recommended amount', v:money(w.recommended_amount ?? 0)},
        {k:'Sanctioned amount', v:money(w.sanction_amount ?? 0)},
      ] : [
        {k:'Work type', v:w.subType}, {k:'Sector', v:w.sector}, {k:'Village', v:w.village}, {k:'Block', v:w.block},
        {k:'Implementing agency', v:w.agency}, {k:'Recommending MP', v:w.mp},
      ];
      const recommendedDate = w.recommended_date
        ? new Date(w.recommended_date).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})
        : '—';
      const peerAvg = isLive && w.cost_outlier
        ? money(Math.round(w.cost_outlier.peer_avg))
        : '—';

      wm = {
        id:workId, title, status, statusBg: STATUS_BG(status), statusColor: STATUS_COLOR(status),
        locationLine: isLive ? [w.constituency, w.state].filter(Boolean).join(', ') : `${w.village}, ${w.block} · ${w.district}, ${w.state}`,
        riskScore: w.risk_score ?? w.riskScore, riskColor: RISK_COLORS[band],
        checksCount: checkTags.length, checkTags,
        hasCostOutlier: checkTags.includes('Cost outlier'),
        hasDuplicate: checkTags.includes('Duplicate match'),
        hasStalled: checkTags.includes('Stalled'),
        peerAvg, recommendedDate, zScore, peerN,
        scatterMeanX, scatterHighlightX, scatterPoints,
        duplicateMatches,
        savedLabel: s.workModalSavedAt ? 'Draft auto-saved to this device' : 'Not yet saved',
        clearAction: this.recordDecision('Cleared'), clarifyAction: this.recordDecision('Clarification requested'), escalateAction: this.recordDecision('Escalated to state'),
        history,
        metadata,
        sanctioned: money(w.sanction_amount ?? w.sanctioned ?? 0),
        recommended: money(w.recommended_amount ?? 0),
        isTracked: s.trackedIds.includes(workId), trackLabel: s.trackedIds.includes(workId) ? '✓ Tracking' : 'Track this project',
        trackAction: this.toggleTrack(workId),
        loadingDossier: s.workModalDossierLoading && isLive,
      };
    }

    return {
      showLogin, showRegister, showApp,
      primaryColor: PRI, primaryFg: PRI_FG, riskHighColor: HIGH, riskMedColor: MED, riskClearColor: CLEAR,
      riskHighWash: HIGH_WASH, riskMedWash: MED_WASH, riskClearWash: CLEAR_WASH, cellPad,
      navItems, queueNavBg: queueActive ? HIGH_WASH : 'transparent', queueNavLabel: 'Review queue', gotoQueue: this.gotoQueue,
      sessionName: session.fullName, sessionRoleLine: `${session.role} · ${session.district}, ${session.state}`, sessionDistrict: session.district, sessionState: session.state,
      sessionRole: session.role, sessionInitials: (session.fullName||'').split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0,2).toUpperCase() || '—',
      isSettings: s.screen==='settings',
      settingsJurisdictionLocked: s.settingsJurisdictionLocked, settingsJurisdictionUnlocked: !s.settingsJurisdictionLocked, settingsState: s.settingsState, settingsDistrict: s.settingsDistrict,
      settingsDensity: s.settingsDensity, settingsDarkIntensity: s.settingsDarkIntensity,
      settingsOverdueDays: s.settingsOverdueDays, settingsIdleFundCr: s.settingsIdleFundCr, settingsCritCutoff: s.settingsCritCutoff, settingsHighCutoff: s.settingsHighCutoff, settingsMedCutoff: s.settingsMedCutoff,
      settingsEmailDigest: s.settingsEmailDigest, settingsEmailFrequency: s.settingsEmailFrequency, settingsDesktopAlerts: s.settingsDesktopAlerts,
      settingsNotifyCritical: s.settingsNotifyCritical, settingsNotifyHigh: s.settingsNotifyHigh, settingsNotifyMedium: s.settingsNotifyMedium,
      settingsIncludeAnnexures: s.settingsIncludeAnnexures,
      toggleJurisdictionLocked: this.toggleJurisdictionLocked, setSettingsState: this.setSettingsState, setSettingsDistrict: this.setSettingsDistrict,
      setThemeLight: this.setThemeLight, setThemeDark: this.setThemeDark,
      setDensityComfortable: this.setSettingsDensity('comfortable'), setDensityCompact: this.setSettingsDensity('compact'),
      setSettingsDensity: this.setSettingsDensity, setSettingsDarkIntensity: this.setSettingsDarkIntensity,
      setSettingsOverdueDays: this.setSettingsOverdueDays, setSettingsIdleFundCr: this.setSettingsIdleFundCr, setSettingsCritCutoff: this.setSettingsCritCutoff, setSettingsHighCutoff: this.setSettingsHighCutoff, setSettingsMedCutoff: this.setSettingsMedCutoff,
      toggleSettingsEmailDigest: this.toggleSettingsEmailDigest, setSettingsEmailFrequency: this.setSettingsEmailFrequency, toggleSettingsDesktopAlerts: this.toggleSettingsDesktopAlerts,
      toggleSettingsNotifyCritical: this.toggleSettingsNotifyCritical, toggleSettingsNotifyHigh: this.toggleSettingsNotifyHigh, toggleSettingsNotifyMedium: this.toggleSettingsNotifyMedium,
      toggleSettingsIncludeAnnexures: this.toggleSettingsIncludeAnnexures,
      saveSettings: this.saveSettings, resetSettings: this.resetSettings, requestJurisdictionChange: this.requestJurisdictionChange,
      jurisdictionLockedBg: s.settingsJurisdictionLocked?T.surfaceActive:'transparent', jurisdictionLockedColor: s.settingsJurisdictionLocked?T.text:T.textSec, jurisdictionLockedBorder: s.settingsJurisdictionLocked?PRI:'transparent',
      jurisdictionAnyBg: !s.settingsJurisdictionLocked?T.surfaceActive:'transparent', jurisdictionAnyColor: !s.settingsJurisdictionLocked?T.text:T.textSec, jurisdictionAnyBorder: !s.settingsJurisdictionLocked?PRI:'transparent',
      densityComfortableBg: s.settingsDensity==='comfortable'?T.surfaceActive:'transparent', densityComfortableColor: s.settingsDensity==='comfortable'?T.text:T.textSec, densityComfortableBorder: s.settingsDensity==='comfortable'?PRI:'transparent',
      densityCompactBg: s.settingsDensity==='compact'?T.surfaceActive:'transparent', densityCompactColor: s.settingsDensity==='compact'?T.text:T.textSec, densityCompactBorder: s.settingsDensity==='compact'?PRI:'transparent',
      lightModeBg: !s.darkMode?PRI:T.card, lightModeColor: !s.darkMode?PRI_FG:T.text, lightModeBorder: !s.darkMode?PRI:T.border,
      emailDigestBg: s.settingsEmailDigest?PRI:T.surfaceMuted, emailDigestColor: s.settingsEmailDigest?PRI_FG:T.textSec, emailDigestLabel: s.settingsEmailDigest?'On':'Off',
      desktopAlertsBg: s.settingsDesktopAlerts?PRI:T.surfaceMuted, desktopAlertsColor: s.settingsDesktopAlerts?PRI_FG:T.textSec, desktopAlertsLabel: s.settingsDesktopAlerts?'On':'Off',
      includeAnnexuresBg: s.settingsIncludeAnnexures?PRI:T.surfaceMuted, includeAnnexuresColor: s.settingsIncludeAnnexures?PRI_FG:T.textSec, includeAnnexuresLabel: s.settingsIncludeAnnexures?'On':'Off',
      notifyCriticalBg: s.settingsNotifyCritical?HIGH_WASH:T.surfaceMuted, notifyCriticalColor: s.settingsNotifyCritical?HIGH:T.textSec, notifyCriticalBorder: s.settingsNotifyCritical?HIGH:T.border,
      notifyHighBg: s.settingsNotifyHigh?MED_WASH:T.surfaceMuted, notifyHighColor: s.settingsNotifyHigh?MED:T.textSec, notifyHighBorder: s.settingsNotifyHigh?MED:T.border,
      notifyMediumBg: s.settingsNotifyMedium?T.surfaceActive:T.surfaceMuted, notifyMediumColor: s.settingsNotifyMedium?T.text:T.textSec, notifyMediumBorder: s.settingsNotifyMedium?T.textSec:T.border,
      handleLogout: this.handleLogout,
      sealDateLabel: SEAL_DATE_LABEL,
      tickerSyncedLabel: s.tickerSeconds===0 ? 'just now' : `${s.tickerSeconds}s ago`,  // still-mock screens only
      lastSyncedLabel: live && live.lastSyncedAt
        ? new Date(live.lastSyncedAt).toLocaleString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})
        : '—',
      canSwitchScope, showScopedBadge: !canSwitchScope,
      scopeChipDistrict: s.settingsDistrict, scopeChipState: s.settingsState,
      districtOptions: DISTRICT_OPTIONS, settingsStateOptions: STATES.map((x) => x.name),
      settingsDistrictOptions: DISTRICTS[s.settingsState] ?? [s.settingsState+' HQ'],
      allworksDistrict: s.allworksDistrict, setAllworksDistrict: this.setAllworksField('allworksDistrict'),
      fundDistrict: s.fundDistrict, setFundDistrict: this.setFundDistrict,
      fundScopeLabel: s.fundDistrict===ALL ? 'All districts · national' : s.fundDistrict.split('::').reverse().join(', '),
      setScopeLocal: this.setScopeLocal, setScopeNational: this.setScopeNational,
      scopeLocalBg: s.scope==='local' ? PRI:'transparent', scopeLocalColor: s.scope==='local' ? PRI_FG:T.textSec,
      scopeNationalBg: s.scope==='national' ? PRI:'transparent', scopeNationalColor: s.scope==='national' ? PRI_FG:T.textSec,
      toggleDarkMode: this.toggleDarkMode, darkMode: s.darkMode, darkModeInv: !s.darkMode, darkModeTitle: s.darkMode?'Switch to light mode':'Switch to dark mode',
      darkModeBg: s.darkMode?PRI:T.card, darkModeColor: s.darkMode?PRI_FG:T.text, darkModeBorder: s.darkMode?PRI:T.border,
      exportAllworksCsv: this.exportAllworksCsv(allworksFiltered),
      csvAvailable: !wl, csvMenuOpen: s.csvMenuOpen, toggleCsvMenu: this.toggleCsvMenu, closeCsvMenu: this.closeCsvMenu,
      csvScopeLabel: s.allworksDistrict===ALL ? 'All districts' : s.allworksDistrict.split('::').reverse().join(', '),
      csvHasItems: allworksFiltered.length>0, csvNoItems: allworksFiltered.length===0,
      csvMenuItems: allworksFiltered.slice(0,60).map((w) => ({
        id: w.id, title: w.title, sub: w.district + ', ' + w.state + ' · ' + money(w.sanctioned),
        go: this.exportOneWorkCsv(w) })),
      csvMenuTruncated: allworksFiltered.length>60,
      csvMenuTruncatedLabel: 'Showing first 60 of ' + allworksFiltered.length + ' — narrow the filters to reach a specific work.',
      exportCurrentReport: this.exportCurrentReport, exportReportLabel: s.reportGeneratingId==='current-export'?'Exporting…':'Export report',
      headingColor: s.darkMode ? '#EFDCB0' : T.text,
      bodyColor: s.darkMode ? '#E7E2D6' : T.text,
      copilotAccent: s.darkMode ? '#2DE8C8' : '#0E7C6B',
      copilotAccentFg: s.darkMode ? '#06231D' : '#FFFFFF',
      copilotAccentLine: s.darkMode ? 'rgba(45,232,200,0.45)' : 'rgba(14,124,107,0.35)',
      copilotHeaderBg: s.darkMode ? 'rgba(45,232,200,0.10)' : 'rgba(14,124,107,0.07)',
      copilotChipBg: s.darkMode ? 'rgba(45,232,200,0.07)' : 'rgba(14,124,107,0.05)',
      listenIcon: s.listening ? '■' : '●',
      listenClass: s.listening ? 'mp-glow mp-rec' : 'mp-glow',
      listenTitle: s.listening ? 'Stop dictation' : 'Dictate your note',
      pageBg: T.page, sidebarBg: T.sidebar, sidebarBorder: T.sidebarBorder, cardBg: T.card, borderColor: T.border,
      textPrimary: T.text, textSecondary: T.textSec, textMuted: T.textMuted,
      surfaceMuted: T.surfaceMuted, surfaceActive: T.surfaceActive, surfaceSubtle: T.surfaceSubtle, sectorBadgeBg: T.sectorBadge,
      mapBg: T.mapBg, mapMuted: T.mapMuted,
      openPalette: this.openPalette,
      chakraSpokes,
      isOverview: s.screen==='overview', isAllworks: s.screen==='allworks', isFundflow: s.screen==='fundflow', isTracker: s.screen==='tracker', isContractors: s.screen==='contractors', isQueue: s.screen==='queue', isReports: s.screen==='reports',
      overviewStats, mapCells, mapOtherPaths, mapReady, indiaMapW: INDIA_MAP_W, indiaMapH: INDIA_MAP_H, legendCells, checkBars, sortButtons, sortedStateRows,
      allworksStats, allworksShowPagination: allworksTotalPages>1,
      fundflowStats, fundflowReleasedAreaPath, fundflowUtilisedAreaPath, fundflowReleasedEnd, fundflowUtilisedEnd, fundflowReleasedPoints, fundflowUtilisedPoints, fundflowReleasedDots, fundflowUtilisedDots, fundflowLabels, gridLines, leakageAgencies, agencyRows,
      trackerRows, trackerHasRows: trackerRows.length>0, trackerNoRows: trackerRows.length===0,
      contractorRows, contractorStats,
      queueStats, queueTab: s.queueTab, isQueueAwaiting: s.queueTab==='awaiting', isQueueResolved: s.queueTab==='resolved',
      setQueueAwaiting: this.setQueueAwaiting, setQueueResolved: this.setQueueResolved,
      queueAwaitingBorder: s.queueTab==='awaiting'?PRI:'transparent', queueAwaitingColor: s.queueTab==='awaiting'?T.text:T.textMuted,
      queueResolvedBorder: s.queueTab==='resolved'?PRI:'transparent', queueResolvedColor: s.queueTab==='resolved'?T.text:T.textMuted,
      awaitingCount: awaitingSorted.length, resolvedCount: resolvedSorted.length, awaitingRows, resolvedRows,
      reportCards,
      toast: s.toast,
      paletteOpen: s.paletteOpen, paletteQuery: s.paletteQuery, closePalette: this.closePalette, stopProp: this.stopProp, setPaletteQuery: this.setPaletteQuery,
      paletteHasMatches: paletteMatches.length>0, paletteMatches, paletteNavItems,
      copilotOpen: s.copilotOpen, copilotIcon: s.copilotOpen ? '✕' : 'AI', toggleCopilot: this.toggleCopilot,
      copilotContext: SCREEN_LABELS[s.screen] ?? 'this screen', copilotMessages,
      clearCopilot: this.clearCopilot, copilotHasHistory: s.copilotMessages.length>1,
      copilotSummarize: this.copilotSummarize, copilotDraftMemo: this.copilotDraftMemo, copilotBiddingHistory: this.copilotBiddingHistory,
      copilotDraft: s.copilotDraft, setCopilotDraft: this.setCopilotDraft, copilotKeyDown: this.copilotKeyDown, sendCopilotMessage: this.sendCopilotMessage,
      toggleListening: this.toggleListening, listenBg: s.listening?PRI:T.card, listenColor: s.listening?'#fff':T.text, listenBorder: s.listening?PRI:T.border,
      districtModalOpen: !!s.districtModalStateId, closeDistrictModal: this.closeDistrictModal,
      districtModalState: (() => {
        if (live) {
          const sd = s.stateDetail;
          return sd ? { name:sd.state, flagged: sd.works_flagged.toLocaleString('en-IN'), monitored: sd.works_monitored.toLocaleString('en-IN'), avgRisk: sd.avg_risk_score }
                    : { name: s.districtModalStateId ?? '', flagged:'…', monitored:'…', avgRisk:'…' };
        }
        const st = STATES.find((x) => x.id===s.districtModalStateId);
        return st ? { name:st.name, flagged: st.flagged.toLocaleString(), monitored: st.monitored.toLocaleString(), avgRisk: st.avgRisk } : {name:'',flagged:'',monitored:'',avgRisk:''};
      })(),
      districtModalWorks: (() => {
        if (live) {
          const sd = s.stateDetail;
          if (!sd) return [];
          return sd.works.map((w) => { const band = riskBand(w.risk_score); return { title:w.description, sub:`${w.work_id} · ${w.constituency ?? ''} · ${money(w.sanction_amount ?? 0)}`, riskBg:RISK_WASH[band], riskColor:RISK_COLORS[band], riskLabel:`${w.risk_score}`, open: this.openWorkModal(w.work_id) }; });
        }
        const st = STATES.find((x) => x.id===s.districtModalStateId);
        if (!st) return [];
        return WORKS.filter((w) => w.state===st.name).slice(0,18).map((w) => { const band=riskBand(w.riskScore); return { title:w.title, sub:`${w.id} · ${w.district} · ${money(w.sanctioned)}`, riskBg:RISK_WASH[band], riskColor:RISK_COLORS[band], riskLabel:`${w.riskScore}`, open: this.openWorkModal(w.id) }; });
      })(),

      screen: s.screen,
      sectorOptions: SECTORS,
      checkTypeOptions: wl ? Object.values(CHECK_LABELS) : CHECK_TYPES,
      allworksStatusOptions: wl ? WORK_STATUSES : STATUSES,
      allworksStateOptions: live ? live.states.map((x) => x.name) : [],
      allworksState: s.allworksState, setAllworksState: this.setAllworksField('allworksState'),
      allworksQuery: s.allworksQuery, allworksSector: s.allworksSector, allworksStatus: s.allworksStatus, allworksCheckType: s.allworksCheckType,
      allworksResultCount, allworksHasActiveFilters, allworksRows, allworksHasRows: allworksRows.length>0, allworksNoRows: allworksRows.length===0,
      allworksShowPagination: allworksTotalPages>1, allworksPageNumbers: pageNumbers(allworksTotalPages, allworksPageClamped, this.setAllworksPage), allworksPrevPage, allworksNextPage,
      setAllworksQuery: this.setAllworksField('allworksQuery'), setAllworksSector: this.setAllworksField('allworksSector'), setAllworksStatus: this.setAllworksField('allworksStatus'), setAllworksCheckType: this.setAllworksField('allworksCheckType'), clearAllworksFilters: this.clearAllworksFilters,
      openWorkModal: this.openWorkModal,
      workModalOpen: !!s.workModalId, workModalNote: s.workModalNote, workModalDecision: s.workModalDecision, wm,
      closeWorkModal: this.closeWorkModal, setWorkNote: this.setWorkNote, aiDraftNote: this.aiDraftNote, recordDecision: this.recordDecision,
    };
  }

  // The JSX reads colours as var(--…), so the palette is pushed to :root
  // instead of threaded through 830 inline styles.
  syncTheme(vals) {
    const root = document.documentElement;
    root.dataset.theme = this.state.darkMode ? 'dark' : 'light';
    for (const [key, cssVar] of Object.entries(THEME_VARS)) {
      const value = vals[key];
      if (value != null) root.style.setProperty('--' + cssVar, String(value));
    }
  }

  // The India map geometry is 56 KB that only the Overview map reads, so the
  // download is deferred until the dashboard route is actually on screen —
  // the login page must not pull dashboard payload. Memoised, so the repeated
  // calls from componentDidUpdate cost nothing.
  _loadIndiaMap() {
    if (this._indiaMapPromise) return this._indiaMapPromise;
    this._indiaMapPromise = import('../../assets/js/india-map-data.js').then((m) => {
      INDIA_STATE_PATHS = m.INDIA_STATE_PATHS; INDIA_MAP_W = m.INDIA_MAP_W; INDIA_MAP_H = m.INDIA_MAP_H;
      this.forceUpdate();
    });
    return this._indiaMapPromise;
  }

  render() {
    // Cached so componentDidUpdate can sync the theme without recomputing the
    // whole view-model; render itself stays free of DOM side effects.
    this._vals = this.renderVals();
    return (
      <ValsContext.Provider value={this._vals}>
        <Root />
      </ValsContext.Provider>
    );
  }
}
