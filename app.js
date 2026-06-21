/* ============================================================
   FLAMES OF ORION — MECH BUILDER  |  app.js  (v2 — server persistence)
   Modalità Veterano
   ============================================================ */
'use strict';

// ════════════════════════════════════════════════════════════
// § 1  DATI DI GIOCO
// ════════════════════════════════════════════════════════════

const FACTIONS = [
  {
    id:'mercs', name:'MERCS', sub:'Mercenari', color:'#ff8c00', rgb:'255,140,0', icon:'⚔',
    desc:'Cacciatori di taglie, soldati di ventura e veterani delle guerre delle Corporazioni. Il loro equipaggiamento cambia da pilota a pilota e da Mech a Mech. Ex soldati che cercano di ritagliarsi una vita in questo universo affidandosi alla lama del loro coltello. I tempi sono duri, e tu devi esserlo ancora di più.',
    benName:'NIENTE PIÙ EROI',
    benDesc:'Le Unità da Combattimento iniziali ottengono un Modulo Arma o Miglioramento casuale gratuito, e una Munizione Speciale casuale gratuita.',
    budgetBonus:0
  },
  {
    id:'megacorps', name:'MEGA CORPS', sub:'Megacorporazioni', color:'#1a88ff', rgb:'26,136,255', icon:'⬡',
    desc:'Le Megacorporazioni controllano ogni risorsa e servizio, comprese le forze militari private. Armate con l\'equipaggiamento migliore e con Mech appena usciti di fabbrica, mirano a sfruttare i pianeti fino all\'osso per trarne profitto. Nonostante il loro potere, la mancanza di conoscenza locale le pone in svantaggio.',
    benName:'LAVORO FORZATO',
    benDesc:'Le Unità da Combattimento iniziali ottengono un modello di Fanteria gratuito con un\'Arma Leggera. Questo modello non conta nel limite di dimensione dell\'Unità da Combattimento.',
    budgetBonus:0
  },
  {
    id:'nobility', name:'CASATI NOBILIARI', sub:'& Sette Religiose', color:'#ffcc00', rgb:'255,204,0', icon:'♦',
    desc:'Dai Signori del Credito ai Culti della Morte di Jakar, fino all\'Ordine del Sole Morente. Combattono guerre politiche, economiche e morali. Non promettono speranza né salvezza. Ciò che offrono è semplice: sopravvivenza — brutale, spietata, ma in un universo morente è la cosa più vicina a un paradiso.',
    benName:'DECIMA GENEROSA',
    benDesc:'Le Unità da Combattimento iniziali ottengono 30.000¢ aggiuntivi per un totale di 180.000¢ da spendere.',
    budgetBonus:30000
  },
  {
    id:'lost', name:'I PERDUTI & I DANNATI', sub:'Ribelli della Zona Statica', color:'#cc2200', rgb:'204,34,0', icon:'☠',
    desc:'Resti di un settore che si è rifiutato di abbandonare la propria casa nella Zona Statica. Il loro equipaggiamento e i Mech sono logori e malandati. Alimentati da determinazione e ingegno, sono diventati avversari formidabili. Orione è la loro casa e non hanno alcuna intenzione di andarsene.',
    benDesc:'In gioco: quando un modello viene distrutto da un nemico, assegna a uno dei tuoi modelli rimanenti +1 AC per la sua prossima attivazione.',
    budgetBonus:0
  },
  {
    id:'rapido', name:'GIOCO RAPIDO', sub:'Nessuna Fazione', color:'#ffaa00', rgb:'255,170,0', icon:'⚡',
    desc:'Unità creata con regole di Gioco Rapido. Nessun bonus o fazione.',
    benName:'NESSUN BENEFICIO',
    benDesc:'In questa modalità non ottieni benefici di Fazione.',
    budgetBonus:-125000,
    hidden: true
  }
];

const IMPROVEMENTS = [
  {id:'armor_mk1',    n:1,  name:'ARMATURA MK I',              cost:10000, slots:1, rep:false, fx:'L\'AR diventa 5+.'},
  {id:'armor_mk2',    n:2,  name:'ARMATURA MK II',             cost:25000, slots:1, rep:false, fx:'L\'AR diventa 4+.'},
  {id:'react_armor',  n:3,  name:'ARMATURA REATTIVA',          cost:50000, slots:1, rep:false, fx:'Ignora il primo punto di Danno subito ogni turno.'},
  {id:'vtol',         n:4,  name:'VTOL',                       cost:25000, slots:1, rep:false, fx:'Ignora il terreno quando effettua un\'Azione di Movimento.'},
  {id:'thrusters',    n:5,  name:'PROPULSORI',                 cost:10000, slots:1, rep:true,  fx:'+1 Velocità.'},
  {id:'heat_sink',    n:6,  name:'DISSIPATORE DI CALORE',      cost:10000, slots:1, rep:false, fx:'Nuovi valori Controllo CALORE: 1=2C, 2=1C, 3–6=0C.'},
  {id:'adv_sensors',  n:7,  name:'SENSORI AVANZATI',           cost:25000, slots:1, rep:false, fx:'I Colpi Critici infliggono un ulteriore +1 Danno.'},
  {id:'heavy_plate',  n:8,  name:'BLINDATURA PESANTE',         cost:20000, slots:1, rep:true,  fx:'+1 Punti Scafo.'},
  {id:'core_stab',    n:9,  name:'STABILIZZATORI DEL NUCLEO',  cost:10000, slots:1, rep:true,  fx:'+2 Limite di CALORE.'},
  {id:'extra_mods',   n:10, name:'MODULI EXTRA',               cost:15000, slots:0, rep:true,  fx:'+1 Modulo (non occupa uno slot MD).'},
  {id:'self_dest',    n:11, name:'AUTODISTRUZIONE',            cost:10000, slots:1, rep:false, fx:'Con 7+ CALORE: Azione di Autodistruzione — il modello esplode.'},
  {id:'camo',         n:12, name:'MIMETIZZAZIONE',             cost:30000, slots:1, rep:false, fx:'Azione: stato <Mimetizzato> fino alla prossima attivazione. Nemici a distanza: –1 AC.'},
  {id:'nuke_react',   n:13, name:'REATTORE NUCLEARE',          cost:10000, slots:1, rep:false, fx:'Quando esplode, conta come se fosse a CALORE 10.'},
  {id:'targeting',    n:14, name:'SISTEMA DI PUNTAMENTO',      cost:45000, slots:1, rep:false, fx:'+1 AC (migliora i tiri di attacco).'},
  {id:'uplink',       n:15, name:'UP-LINK',                    cost:15000, slots:1, rep:false, fx:'Azione: un modello nemico in LDV ottiene Posizione Compromessa.'},
  {id:'lr_aiming',    n:16, name:'PUNTAMENTO A LUNGA GITTATA', cost:15000, slots:1, rep:false, fx:'Ignora la penalità –1 AC per Lunga Gittata negli attacchi a distanza.'},
  {id:'def_sys',      n:17, name:'SISTEMA DIFENSIVO',          cost:10000, slots:1, rep:false, fx:'Nemici entro 1": tira 1d6 — con 4+ vengono respinti appena fuori da 1".'},
  {id:'therm_sens',   n:18, name:'SENSORI TERMICI',            cost:20000, slots:1, rep:false, fx:'+1 AC quando il bersaglio ha 5+ CALORE.'},
  {id:'countermiss',  n:19, name:'CONTROMISSILI',              cost:10000, slots:1, rep:false, fx:'Colpo Critico a distanza subito: annulla il danno aggiuntivo del Critico.'},
  {id:'virus_prog',   n:20, name:'PROGRAMMA VIRUS',            cost:20000, slots:1, rep:false, fx:'1/partita: infetta un modello nemico — può compiere solo 1 azione, non Potenziata.'}
];

const RANGED = [
  {id:'flamer',      n:1, name:'LANCIAFIAMME',                  cost:10000, slots:1, dmg:'1',   range:'10"',        noAmmo:true, fx:'Se colpisce: +1d2 CALORE al bersaglio. Non può usare Munizioni Speciali.'},
  {id:'light_r',     n:2, name:'ARMA LEGGERA',                  cost:10000, slots:1, dmg:'1',   range:'Std',        fx:''},
  {id:'medium_r',    n:3, name:'ARMA MEDIA',                    cost:15000, slots:1, dmg:'2',   range:'Std',        fx:''},
  {id:'heavy_r',     n:4, name:'ARMA PESANTE',                  cost:25000, slots:2, dmg:'4',   range:'Std',        fx:'Se spara: movimento a metà Velocità. Occupa 2 MD.'},
  {id:'rail_gun',    n:5, name:'ARMA A ROTAIA',                 cost:45000, slots:1, dmg:'d3',  range:'Illimitata', fx:'Linea retta: attacca tutto sul percorso (anche alleati). +1 CALORE al modello.'},
  {id:'ai_miss',     n:6, name:'SISTEMA MISSILISTICO I.A.',     cost:15000, slots:1, dmg:'1',   range:'20"',        fx:'Non richiede LDV. Ignora qualsiasi bonus di copertura.'},
  {id:'lr_sys',      n:7, name:'SISTEMI A LUNGA GITTATA',       cost:25000, slots:1, dmg:'2(PA)',range:'Std',        fx:'Ignora il –1 AC per Lunga Gittata.'},
  {id:'miss_batt',   n:8, name:'GRANDE BATTERIA MISSILISTICA',  cost:30000, slots:1, dmg:'d2',  range:'Std',        fx:'Colpisce tutti i modelli e il terreno entro 2" dal bersaglio originale.'}
];

const MELEE = [
  {id:'combat_imp',  n:1, name:'INNESTO BASE DA COMBATTIMENTO', cost:5000,  slots:1, dmg:'1',      fx:''},
  {id:'melee_b',     n:2, name:'ARMA DA MISCHIA',              cost:10000, slots:1, dmg:'2',      fx:''},
  {id:'cable_whip',  n:3, name:'FRUSTA A CAVO',                cost:15000, slots:1, dmg:'2',      range:'3"', fx:'Portata di ingaggio 3". Considera i nemici come entro 1".'},
  {id:'lance',       n:4, name:'LANCIA',                       cost:20000, slots:1, dmg:'1',      fx:'Se ha mosso in questo turno: +2 Danno e PA.'},
  {id:'power_wpn',   n:5, name:'ARMA POTENZIATA',              cost:15000, slots:1, dmg:'2(PA)',  fx:'Con tiro di attacco 1: perde PA per il resto della partita.'},
  {id:'e_field',     n:6, name:'CAMPO ELETTRICO',              cost:10000, slots:1, dmg:'1',      fx:'Attacca tutti entro 2". Ogni modello danneggiato viene spinto di 1".'},
  {id:'p_hammer',    n:7, name:'MAGLIO PNEUMATICO',            cost:10000, slots:1, dmg:'2',      fx:'Quando colpisce: il bersaglio viene mosso 1" lontano da te.'},
  {id:'e_sword',     n:8, name:'SPADA A ENERGIA',              cost:15000, slots:1, dmg:'2',      fx:'Colpo Critico con 5+. Con tiro 1: fusione bruciata → D1 per il resto della partita.'}
];

const AMMO = [
  {id:'flechette', n:1, name:'PROIETTILI FLECHETTE',       cost:5000,  tag:'PA',                  desc:'L\'arma ottiene PA (Penetrazione Armatura).'},
  {id:'hellfire',  n:2, name:'PROIETTILI HELLFIRE',        cost:10000, tag:'+1 Danno',             desc:'Aumenta il Danno dell\'arma di 1.'},
  {id:'emf',       n:3, name:'PROIETTILI EMF',             cost:10000, tag:'–2 Vel bersaglio',    desc:'Il bersaglio riduce la Velocità di 2 fino alla fine della sua prossima attivazione.'},
  {id:'concuss',   n:4, name:'PROIETTILI CONCUSSIVI',      cost:5000,  tag:'Spinge 2"',            desc:'Il bersaglio viene mosso 2" lontano. Se impatta modello/terreno: 1 Danno a entrambi.'},
  {id:'hi_rate',   n:5, name:'PROIETTILI AD ALTA CADENZA', cost:20000, tag:'Attacco bonus su 6',  desc:'Con un 6 per colpire: applica danno critico, poi effettua un altro Attacco a Distanza con la stessa arma.'},
  {id:'tracer',    n:6, name:'PROIETTILI TRACCIANTI',      cost:5000,  tag:'Posizione Compromessa',desc:'Il bersaglio ottiene Posizione Compromessa. Anche il modello che spara ottiene Posizione Compromessa.'}
];

const TABLE_A = [
  ['Un colore',  'Oscuro',      'Duro',       'Peccato',      'Dolore',      'Pesante'],
  ['Ferro',      'Divino',      'Inferno',    'Spettro',      'Vuoto',       'Sacro'],
  ['Furia',      'Morte',       'Infernale',  'Dei cieli',    'Freddo',      'Assedio'],
  ['Acciaio',    'Vendicatore', 'Ruggine',    'Eterno',       'Tenebra',     'Terrore'],
  ['Acido',      'Tetro',       'Alpha',      'Spirito',      'Guerra',      'Notte'],
  ['Frenetico',  'Chrono',      'Un animale', 'Devastazione', 'Implacabile', 'Ribelle']
];
const TABLE_B = [
  ['Un numero',  'Telaio',     'Araldo',      'Titano',      'Segugio',     'Fiamma'],
  ['Lama',       'Armatura',   'Carro Armato','Ombra',       'Esploratore', 'Sciabola'],
  ['Artiglio',   'Spettro',    'Macchina',    'Ingranaggio', 'Maestro',     'Viandante'],
  ['Demone',     'Acciaio',    'Angelo',      'Nucleo',      'Diavolo',     'Drago'],
  ['Predone',    'Sentinella', 'Viverna',     'Motore',      'Inseguitore', 'Spirito'],
  ['Batteria',   'Unità',      'Camminatore', 'Arma',        'Fantasma',    'Giavellotto']
];

const CHASSIS = {
  leggero: { id:'leggero', name:'Telaio Leggero', v:7, ac:4, ar:6, ps:4, lc:12, md:3 },
  medio:   { id:'medio',   name:'Telaio Medio',   v:6, ac:4, ar:6, ps:6, lc:10, md:4 },
  pesante: { id:'pesante', name:'Telaio Pesante', v:5, ac:4, ar:5, ps:7, lc:9,  md:5 }
};

const GROUND_FORCES = {
  fanteria: { id:'fanteria', name:'Fanteria', v:4, ac:5, ar:6, ps:2, lc:5, md:2, cost:10000, cap:0.334 },
  veicolo:  { id:'veicolo',  name:'Veicolo Terrestre', v:5, ac:4, ar:6, ps:4, lc:7, md:3, cost:30000, cap:0.5 },
  velivolo: { id:'velivolo', name:'Velivolo', v:6, ac:4, ar:6, ps:3, lc:6, md:2, cost:25000, cap:0.5 }
};

// ════════════════════════════════════════════════════════════
// § 2  STATO APPLICAZIONE
// ════════════════════════════════════════════════════════════

let S = {
  view:'garage',          // 'garage'|'wizard'
  step:1,                 // 1..4
  unit:null,              // unit in costruzione
  openMech:null,          // indice mech espanso
  shopTab:'improvement',  // 'improvement'|'ranged'|'melee'
  rolls:{},               // {mechIdx: {a:{row,col,word}, b:{row,col,word}}}
  garage:[]               // array di unità salvate
};

// ── Caricamento locale (fallback) ──
function loadGarageLocal(){
  try{ const d=localStorage.getItem('foi_v1'); if(d) S.garage=JSON.parse(d); }catch(e){}
}

// ── Salvataggio: localStorage + server ──
function saveGarage(){
  // 1. Salva subito in localStorage
  try{ localStorage.setItem('foi_v1',JSON.stringify(S.garage)); }catch(e){}
  // 2. Invia al server (se disponibile)
  fetch('/api/garage',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(S.garage)
  }).then(r=>r.ok
    ? showToast('💾 Garage salvato su file!')
    : showToast('⚠ Errore salvataggio su file','warn')
  ).catch(()=>showToast('📱 Salvato solo in localStorage','warn'));
}

// ── Toast notifiche ──
function showToast(msg, type='ok'){
  const el=document.createElement('div');
  el.className=`toast toast-${type}`;
  el.textContent=msg;
  document.body.appendChild(el);
  requestAnimationFrame(()=>{ requestAnimationFrame(()=>el.classList.add('show')); });
  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),350); },3200);
}

// ── Export garage come JSON ──
function exportJSON(){
  const blob=new Blob([JSON.stringify(S.garage,null,2)],{type:'application/json'});
  const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:'foi-garage.json'});
  a.click(); URL.revokeObjectURL(a.href);
  showToast('📁 File JSON scaricato!');
}

// ── Import garage da JSON ──
function importJSON(){
  const inp=Object.assign(document.createElement('input'),{type:'file',accept:'.json'});
  inp.onchange=e=>{
    const f=e.target.files[0]; if(!f) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const data=JSON.parse(ev.target.result);
        if(!Array.isArray(data)) throw new Error('Formato non valido');
        S.garage=data;
        saveGarage();
        render();
        showToast(`✅ Importat${data.length===1?'a':'e'} ${data.length} unità!`);
      }catch(err){ showToast('❌ File JSON non valido','warn'); }
    };
    reader.readAsText(f);
  };
  inp.click();
}

// ════════════════════════════════════════════════════════════
// § 3  LOGICA DI STATO
// ════════════════════════════════════════════════════════════

function uid(){ return Math.random().toString(36).substr(2,9); }
function d6(){ return Math.floor(Math.random()*6); } // 0-based index
function fmt(n){ return n.toLocaleString('it-IT')+'¢'; }
function esc(s){ return s?String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):''; }

function getItem(type,id){
  if(type==='improvement') return IMPROVEMENTS.find(x=>x.id===id);
  if(type==='ranged')      return RANGED.find(x=>x.id===id);
  if(type==='melee')       return MELEE.find(x=>x.id===id);
}

function newMech(num, mType='mech'){ return {id:uid(),num,mType,chassis:mType==='mech'?'medio':null,codename:'',modules:[]}; }

function getBaseStats(mech){
  if(mech.mType==='mech' || !mech.mType) return CHASSIS[mech.chassis||'medio'];
  return GROUND_FORCES[mech.mType];
}

function newUnit(fid){
  const f=FACTIONS.find(x=>x.id===fid);
  const u={id:uid(),factionId:fid,unitName:'',budget:150000+f.budgetBonus,mechs:[1,2,3,4].map(n=>newMech(n))};
  if(fid==='mercs'){
    const allMods=[
      ...IMPROVEMENTS.map(x=>({type:'improvement',itemId:x.id})),
      ...RANGED.map(x=>({type:'ranged',itemId:x.id})),
      ...MELEE.map(x=>({type:'melee',itemId:x.id}))
    ];
    u.mercsBonus={
      module:allMods[Math.floor(Math.random()*allMods.length)],
      ammo:{id:AMMO[Math.floor(Math.random()*AMMO.length)].id}
    };
    u.mercsMod=false; u.mercsAmmo=false;
  }
  return u;
}

function computeStats(mech){
  const b=getBaseStats(mech);
  let v=b.v,ac=b.ac,ar=b.ar,ps=b.ps,lc=b.lc,md=b.md;
  for(const m of mech.modules){
    if(m.type!=='improvement') continue;
    switch(m.itemId){
      case 'armor_mk1': ar=Math.min(ar,5); break;
      case 'armor_mk2': ar=Math.min(ar,4); break;
      case 'thrusters': v+=1; break;
      case 'heavy_plate': ps+=1; break;
      case 'core_stab': lc+=2; break;
      case 'extra_mods': md+=1; break;
      case 'targeting': ac=Math.max(2,ac-1); break;
    }
  }
  return {v,ac,ar,ps,lc,md:Math.min(md,8)};
}

function slotsUsed(mech){
  return mech.modules.reduce((t,m)=>{ const it=getItem(m.type,m.itemId); return t+(it?it.slots:1); },0);
}

function totalSpent(unit){
  let s=0;
  let cap=4.0;
  const sorted = [...unit.mechs].sort((a,b)=>{
    const ca = a.mType==='mech'||!a.mType?50000:GROUND_FORCES[a.mType].cost;
    const cb = b.mType==='mech'||!b.mType?50000:GROUND_FORCES[b.mType].cost;
    return cb - ca;
  });
  for(const mech of sorted){
    const mt = mech.mType||'mech';
    const mCost = mt==='mech'?50000:GROUND_FORCES[mt].cost;
    const mCap  = mt==='mech'?1.0:GROUND_FORCES[mt].cap;
    if(cap >= mCap - 0.01) { cap -= mCap; }
    else { s += mCost; cap=0; }
  }

  for(const mech of unit.mechs)
    for(const m of mech.modules){
      if(!m.free){ const it=getItem(m.type,m.itemId); if(it) s+=it.cost; }
      if(m.ammoId&&!m.ammoFree){ const a=AMMO.find(x=>x.id===m.ammoId); if(a) s+=a.cost; }
    }
  return s;
}

function remaining(unit){ return unit.budget-totalSpent(unit); }

function canBuy(unit,mi,type,itemId){
  const mech=unit.mechs[mi]; const it=getItem(type,itemId); if(!it) return {ok:false,why:'Non trovato'};
  if((mech.mType&&mech.mType!=='mech') && type==='melee') return {ok:false,why:'Non equipaggiabile su Forze di Terra'};
  if(remaining(unit)<it.cost) return {ok:false,why:'Budget insufficiente'};
  const st=computeStats(mech); const su=slotsUsed(mech);
  if(it.slots>0 && su+it.slots>st.md) return {ok:false,why:'Slot MD insufficienti'};
  if(!it.rep && type === 'improvement' && mech.modules.some(m=>m.type===type&&m.itemId===itemId)) return {ok:false,why:'Già equipaggiato'};
  return {ok:true};
}

// ════════════════════════════════════════════════════════════
// § 4  RENDERING
// ════════════════════════════════════════════════════════════

const $app=document.getElementById('app');
function render(){ $app.innerHTML=''; if(S.view==='garage') renderGarage(); else if(S.view==='mode_select') renderModeSelect(); else renderWizard(); }

function renderModeSelect() {
  $app.innerHTML = `
  <div class="app-header">
    <div class="app-logo">
      <span class="flame-icon"></span>
      <div><h1 class="logo-title">FLAMES OF ORION</h1><span class="logo-sub">SELEZIONA MODALITÀ</span></div>
    </div>
  </div>
  <div class="main-wrap" style="max-width:800px;margin:40px auto;text-align:center;">
    <h2 class="sect-title" style="margin-bottom:30px">Scegli la modalità di creazione</h2>
    <div style="display:flex;gap:20px;justify-content:center;">
      <div class="fc-card" style="--fc:#ffaa00;--fcr:255,170,0;flex:1;cursor:pointer;" onclick="selectMode('rapido')">
        <div class="fc-top"><span class="fc-icon" style="font-size:3rem">⚡</span><div class="fc-names"><div class="fc-name" style="font-size:1.5rem">GIOCO RAPIDO</div></div></div>
        <p class="fc-desc" style="margin-top:15px;font-size:1rem;">Nessuna Fazione. Budget limitato a 25.000¢. Moduli scelti casualmente gratuiti per i Mech.</p>
      </div>
      <div class="fc-card" style="--fc:#0088ff;--fcr:0,136,255;flex:1;cursor:pointer;" onclick="selectMode('veterano')">
        <div class="fc-top"><span class="fc-icon" style="font-size:3rem">🎖️</span><div class="fc-names"><div class="fc-name" style="font-size:1.5rem">VETERANO</div></div></div>
        <p class="fc-desc" style="margin-top:15px;font-size:1rem;">Scegli una Fazione. Budget di 150.000¢. Personalizza tutto l'equipaggiamento.</p>
      </div>
    </div>
    <button class="btn btn-ghost" style="margin-top:30px" onclick="S.view='garage';render();">← Torna al Garage</button>
  </div>`;
}

window.selectMode = function(mode) {
  S.view = 'wizard';
  S.rolls = {}; S.openMech = null;
  if(mode === 'rapido') {
    S.step = 2;
    S.unit = newUnit('rapido');
    S.unit.mode = 'rapido';
  } else {
    S.step = 1;
    S.unit = null;
  }
  render();
};

/* ── GARAGE ── */
function renderGarage(){
  $app.innerHTML=`
  <div class="app-header">
    <div class="app-logo">
      <span class="flame-icon"></span>
      <div><h1 class="logo-title">FLAMES OF ORION</h1><span class="logo-sub">MECH BUILDER</span></div>
    </div>
    <div class="header-actions">
      <button class="btn btn-ghost btn-sm" id="btn-import" title="Importa garage da file JSON">📂 Importa JSON</button>
      <button class="btn btn-ghost btn-sm" id="btn-export" title="Esporta garage come file JSON" ${S.garage.length===0?'disabled':''}>📁 Esporta JSON</button>
      <button class="btn btn-primary" id="btn-new">+ NUOVA UNITÀ</button>
    </div>
  </div>
  <div class="main-wrap">
    <div class="garage-hdr">
      <h2 class="sect-title">IL TUO <span>GARAGE</span></h2>
      <p class="sect-sub">${S.garage.length} unit${S.garage.length===1?'à salvata':'à salvate'} · ${S.serverOk?'<span class="server-ok">🟢 server attivo — salvataggio su file</span>':'<span class="server-ko">🟡 server non disponibile — solo localStorage</span>'}  </p>
    </div>
    ${S.garage.length===0?`
      <div class="empty-garage">
        <div class="empty-icon">⚙</div>
        <h3 class="empty-title">IL GARAGE È VUOTO</h3>
        <p class="empty-text">Nessuna Unità da Combattimento creata. Inizia la tua prima campagna in Modalità Veterano.</p>
        <button class="btn btn-primary btn-lg" id="btn-new-empty">+ CREA NUOVA UNITÀ DA COMBATTIMENTO</button>
      </div>
    `:`<div class="garage-grid">${S.garage.map(unitCard).join('')}</div>`}
  </div>`;
  $q('#btn-new').onclick=startNew;
  $q('#btn-import').onclick=importJSON;
  $q('#btn-export').onclick=exportJSON;
  $q('#btn-new-empty')?.addEventListener('click',startNew);
  $qq('[data-act="pdf"]').forEach(b=>b.onclick=()=>genPDF(b.dataset.uid));
  $qq('[data-act="del"]').forEach(b=>b.onclick=()=>delUnit(b.dataset.uid));
  $qq('[data-act="edit"]').forEach(b=>b.onclick=()=>editUnit(b.dataset.uid));
  $qq('[data-act="add-credits"]').forEach(b=>b.onclick=()=>addCredits(b.dataset.uid));
}

function addCredits(uid) {
  const u = S.garage.find(x => x.id === uid);
  if (!u) return;
  const rem = remaining(u);
  const input = prompt(`Fondi attualmente in deposito: ${rem}¢\\n\\nInserisci il NUOVO SALDO da impostare nel deposito:`, rem);
  if (input === null || input.trim() === '') return;
  const num = parseInt(input, 10);
  if (isNaN(num)) {
    alert("Valore non valido. Devi inserire un numero intero.");
    return;
  }
  u.budget = totalSpent(u) + num;
  saveGarage();
  render();
}

function unitCard(u){
  const f=FACTIONS.find(x=>x.id===u.factionId);
  const rem=remaining(u);
  const isRapido = u.mode === 'rapido';
  return `
  <div class="unit-card" style="--fc:${f.color}">
    <div class="uc-head">
      <div style="display:flex;gap:4px">
        <span class="faction-badge">${f.icon} ${f.name}</span>
        ${isRapido ? '<span class="faction-badge" style="background:#ffaa00;color:#000;">⚡ GIOCO RAPIDO</span>' : '<span class="faction-badge" style="background:#0088ff;color:#fff;">🎖️ VETERANO</span>'}
      </div>
      <div class="uc-budget"><span class="uc-budget-lbl">RIMANENTI</span><span class="uc-budget-val ${rem<0?'over':''}">${fmt(rem)}</span></div>
    </div>
    <div class="uc-name ${u.unitName?'':'no-name'}">${esc(u.unitName)||'Unità Senza Nome'}</div>
    <div class="mech-preview-list">${u.mechs.map(m=>`
      <div class="mech-prev">
        <span class="mech-prev-name">${esc(m.codename)||'Mech '+m.num}</span>
        <span class="mech-prev-mods">${m.modules.length} MOD</span>
      </div>`).join('')}</div>
    <div class="uc-actions">
      <button class="btn btn-ghost btn-sm" data-act="edit" data-uid="${u.id}">✎ Modifica</button>
      <button class="btn btn-ghost btn-sm" data-act="add-credits" data-uid="${u.id}">💰 Deposito</button>
      <button class="btn btn-secondary btn-sm" data-act="pdf" data-uid="${u.id}">↓ Esporta PDF</button>
      <button class="btn btn-danger-g btn-sm" data-act="del" data-uid="${u.id}">✕ Elimina</button>
    </div>
  </div>`;
}

/* ── WIZARD ── */
function renderWizard(){
  const rem=S.unit?remaining(S.unit):0;
  $app.innerHTML=`
  <div class="app-header">
    <div class="app-logo">
      <span class="flame-icon"></span>
      <div><h1 class="logo-title">FLAMES OF ORION</h1><span class="logo-sub">CREA UNITÀ DA COMBATTIMENTO</span></div>
    </div>
    ${S.unit?`<div class="budget-display"><span class="budget-label">CREDITI DISPONIBILI</span><span class="budget-amount ${rem<0?'over':''}">${fmt(rem)}</span></div>`:''}
  </div>
  <div class="wizard-wrap">
    ${stepBar()}
    <div class="step-content">${stepContent()}</div>
  </div>`;
  bindWizard();
}

function stepBar(){
  const steps=[{n:1,l:'FAZIONE'},{n:2,l:'IDENTITÀ'},{n:3,l:'LOADOUT'},{n:4,l:'RIEPILOGO'}];
  return `<div class="step-bar">${steps.map((s,i)=>`
    <div class="step-item">
      <div class="step-circle ${S.step===s.n?'active':''} ${S.step>s.n?'done':''}">${S.step>s.n?'✓':s.n}</div>
      <span class="step-label ${S.step>=s.n?'active':''}">${s.l}</span>
      ${i<3?`<div class="step-line ${S.step>s.n?'done':''}"></div>`:''}
    </div>`).join('')}</div>`;
}

function stepContent(){
  switch(S.step){
    case 1: return step1();
    case 2: return step2();
    case 3: return step3();
    case 4: return step4();
  }
}

/* STEP 1 — FAZIONE */
function step1(){
  const selId=S.unit?.factionId||null;
  return `
  <div class="step-hdr"><h2 class="sect-title">SCEGLI LA <span>FAZIONE</span></h2>
  <p class="sect-sub">La fazione definisce background e bonus iniziali della tua Unità da Combattimento.</p></div>
  <div class="faction-grid">${FACTIONS.filter(f=>!f.hidden).map(f=>fcCard(f,f.id===selId)).join('')}</div>
  <div class="nav-row">
    <button class="btn btn-ghost" id="btn-back-garage">← Garage</button>
    <button class="btn btn-primary" id="btn-next" ${!selId?'disabled':''}>AVANTI →</button>
  </div>`;
}

function fcCard(f,sel){
  return `
  <div class="fc-card ${sel?'sel':''}" data-fid="${f.id}" role="button" tabindex="0"
       style="--fc:${f.color};--fcr:${f.rgb}">
    <div class="fc-top">
      <span class="fc-icon">${f.icon}</span>
      <div class="fc-names"><div class="fc-name">${f.name}</div><div class="fc-sub">${f.sub}</div></div>
      ${sel?'<div class="fc-check">✓</div>':''}
    </div>
    <p class="fc-desc">${f.desc}</p>
    <div class="fc-benefit">
      <div class="fc-ben-name">${f.benName}</div>
      <div class="fc-ben-desc">${f.benDesc}</div>
      ${f.budgetBonus>0?`<div class="fc-ben-bonus">+${fmt(f.budgetBonus)} BUDGET</div>`:''}
    </div>
  </div>`;
}

/* STEP 2 — IDENTITÀ E COMPOSIZIONE */
function step2(){
  const u=S.unit; const f=FACTIONS.find(x=>x.id===u.factionId);
  const mechsCount = u.mechs.filter(m=>(m.mType||'mech')==='mech').length;
  return `
  <div class="step-hdr"><h2 class="sect-title">IDENTITÀ E <span>COMPOSIZIONE</span></h2>
  <p class="sect-sub">Dai un nome all'Unità e componi il tuo roster. Devi avere almeno 2 Mech.</p></div>
  <div class="identity-grid">
    <div class="id-form">
      <label class="form-lbl" for="uname">NOME UNITÀ DA COMBATTIMENTO</label>
      <input type="text" id="uname" class="form-inp" placeholder="es. Ceneri di Orione, Ferro e Sangue, …" value="${esc(u.unitName)}" maxlength="50">
      
      <div class="roster-builder">
        <label class="form-lbl" style="margin-top:24px;">MODELLI NEL ROSTER</label>
        <p class="form-hint" style="margin-bottom:12px">Fino a 4 slot Mech equivalenti sono gratuiti.</p>
        <div class="roster-list">
          ${u.mechs.map((m,idx)=>{
            const isMech = (m.mType||'mech')==='mech';
            const name = isMech ? 'Mech' : GROUND_FORCES[m.mType].name;
            const cst = isMech ? 50000 : GROUND_FORCES[m.mType].cost;
            return `<div class="roster-item">
              <span class="type-badge ${isMech?'improvement':'ranged'}" style="width:120px;text-align:center">${name}</span>
              <span class="roster-item-num">Modello ${m.num}</span>
              <span class="summ-mod-cost" style="margin-left:auto">${fmt(cst)}</span>
              ${(!isMech || mechsCount > 2) ? `<button class="btn btn-sm btn-danger-g" data-rm-model="${idx}" style="padding:4px 8px;margin-left:8px">✕</button>` : `<button class="btn btn-sm btn-ghost" disabled style="padding:4px 8px;margin-left:8px;opacity:0.5">Min 2</button>`}
            </div>`;
          }).join('')}
        </div>
        <div class="roster-add-btns" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
          <button class="btn btn-sm btn-ghost" data-add-model="mech" style="flex:1;min-width:140px;border-color:#444">+ MECH</button>
          <button class="btn btn-sm btn-ghost" data-add-model="veicolo" style="flex:1;min-width:140px;border-color:#444">+ VEICOLO</button>
          <button class="btn btn-sm btn-ghost" data-add-model="velivolo" style="flex:1;min-width:140px;border-color:#444">+ VELIVOLO</button>
          <button class="btn btn-sm btn-ghost" data-add-model="fanteria" style="flex:1;min-width:140px;border-color:#444">+ FANTERIA</button>
        </div>
      </div>
    </div>
    <div class="fc-summary" style="--fc:${f.color};--fcr:${f.rgb}">
      <div class="fcs-head"><span class="fcs-icon">${f.icon}</span>
        <div><div class="fcs-name">${f.name}</div><div class="fcs-sub">${f.sub}</div></div>
      </div>
      <p class="fcs-desc">${f.desc}</p>
      <div class="fcs-benefit">
        <div class="ben-badge">${f.benName}</div>
        <p class="ben-text">${f.benDesc}</p>
        ${u.mercsBonus?`<div class="mercs-bonus-box">
          <div class="mbb-title">🎲 BONUS MERCS ASSEGNATO:</div>
          <div class="mbb-row"><span class="mbb-tag">MODULO</span>${esc(getItem(u.mercsBonus.module.type,u.mercsBonus.module.itemId)?.name||'?')}</div>
          <div class="mbb-row"><span class="mbb-tag">MUNIZIONI</span>${esc(AMMO.find(a=>a.id===u.mercsBonus.ammo.id)?.name||'?')}</div>
          <p class="mbb-hint">Potrai assegnarli a qualsiasi Mech nel passo successivo.</p>
        </div>`:''}
      </div>
      <div class="fcs-budget">
        <span class="budget-label">BUDGET DISPONIBILE</span>
        <span class="budget-amount ${remaining(u)<0?'over':''}">${fmt(remaining(u))}</span>
      </div>
    </div>
  </div>
  <div class="nav-row">
    <button class="btn btn-ghost" id="btn-prev">← Indietro</button>
    <button class="btn btn-primary" id="btn-next" ${remaining(u)<0?'disabled':''}>AVANTI →</button>
  </div>`;
}

/* STEP 3 — LOADOUT */
function step3(){
  const u=S.unit;
  return `
  <div class="step-hdr"><h2 class="sect-title">CONFIGURA I <span>MECH</span></h2>
  <p class="sect-sub">Assegna un nome in codice e acquista moduli e munizioni per ogni Mech.</p></div>
  ${u.factionId==='megacorps'?`<div class="faction-note"><span class="note-icon">ℹ</span><div><strong>MEGA CORPS — LAVORO FORZATO:</strong> La tua Unità riceve gratuitamente 1 modello di Fanteria con Arma Leggera (non conta nel limite dell'Unità).</div></div>`:''}
  <div class="mechs-stack">${u.mechs.map((m,i)=>mechCard(u,m,i)).join('')}</div>
  <div class="nav-row">
    <button class="btn btn-ghost" id="btn-prev">← Indietro</button>
    <button class="btn btn-primary" id="btn-next">AVANTI →</button>
  </div>`;
}

function mechCard(u,mech,mi){
  const open=S.openMech===mi;
  const st=computeStats(mech); const su=slotsUsed(mech);
  const isMech = (mech.mType||'mech')==='mech';
  const title = isMech ? `MECH ${mech.num}` : `${GROUND_FORCES[mech.mType].name.toUpperCase()} ${mech.num}`;
  return `
  <div class="mc-card ${open?'open':''}" id="mc-${mi}">
    <div class="mc-hdr" data-toggle="${mi}" role="button" tabindex="0">
      <div class="mc-hdr-left">
        <span class="mech-num-badge">${title}</span>
        <span class="mc-codename ${mech.codename?'':'unnamed'}">${esc(mech.codename)||'Nessun nome assegnato'}</span>
      </div>
      <div class="mc-hdr-right">
        <span class="slot-badge">${su}/${st.md} MD</span>
        <span class="toggle-arr">${open?'▲':'▼'}</span>
      </div>
    </div>
    ${open?mechBody(u,mech,mi,st,su):mechSummary(mech,st)}
  </div>`;
}

function mechSummary(mech,st){
  const mods=mech.modules;
  const isMech = (mech.mType||'mech')==='mech';
  const cname = isMech ? CHASSIS[mech.chassis||'medio'].name : null;
  return `<div class="mc-summary">
    ${isMech ? `<div style="margin-bottom:6px"><span class="badge-chassis">${cname}</span></div>` : ''}
    <div class="stats-tiny">
      <span>V:${st.v}</span><span>AC:${st.ac}+</span><span>AR:${st.ar}+</span>
      <span>PS:${st.ps}</span><span>LC:${st.lc}</span><span>MD:${st.md}</span>
    </div>
    ${mods.length?`<div class="mod-tags">${mods.map(m=>{const it=getItem(m.type,m.itemId);return `<span class="mod-tag ${m.type}">${it?.name||'?'}</span>`;}).join('')}</div>`
    :'<p class="no-mods-txt">Nessun modulo equipaggiato</p>'}
  </div>`;
}

function mechBody(u,mech,mi,st,su){
  const roll=S.rolls[mi];
  const isMech = (mech.mType||'mech')==='mech';
  return `<div class="mc-body">
    ${isMech ? `<div class="cdn-section">
      <div class="subsect">CLASSE DI TELAIO</div>
      <div class="chassis-selector">
        ${Object.values(CHASSIS).map(c=>`
          <button class="chassis-btn ${mech.chassis===c.id?'active':''}" data-chassis="${c.id}" data-cmi="${mi}">${c.name}</button>
        `).join('')}
      </div>
    </div>` : ''}
    <div class="cdn-section">
      <div class="subsect">NOME IN CODICE</div>
      <div class="cdn-input-row">
        <input type="text" class="form-inp cdn-input" data-cdn="${mi}" value="${esc(mech.codename)}" placeholder="Nome in codice…" maxlength="40">
        <button class="btn btn-roll" data-roll="${mi}">🎲 TIRA</button>
      </div>
      ${roll?rollResult(roll,mi):''}
    </div>
    <div>
      <div class="subsect">STATISTICHE</div>
      <div class="stats-row">
        ${statBox('V',st.v,6)} ${statBox('AC',st.ac+'+','4+')} ${statBox('AR',st.ar+'+','6+')}
        ${statBox('PS',st.ps,6)} ${statBox('LC',st.lc,10)} ${statBox('MD',st.md,4)}
      </div>
    </div>
    <div>
      <div class="subsect">MODULI EQUIPAGGIATI <span style="color:#ff6b1a;font-size:.6rem;">(${su}/${st.md} SLOT)</span></div>
      ${mech.modules.length?`<div class="eq-list">${mech.modules.map((m,idx)=>eqMod(m,mi,idx)).join('')}</div>`
      :'<p class="empty-eq">Nessun modulo. Usa il Mercato Nero qui sotto per acquistare armi e miglioramenti.</p>'}
      ${u.mode==='rapido' ? `
      <div class="rapido-rolls" style="background:rgba(255,170,0,0.1); border:1px solid #ffaa00; border-radius:4px; padding:10px; margin-bottom:12px;">
        <div style="font-size:0.8rem;color:#ffaa00;margin-bottom:8px;font-weight:bold;">⚡ TIRI GIOCO RAPIDO (MODULI GRATUITI)</div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-sm btn-ghost" style="flex:1;border-color:#ffaa00;color:#ffaa00" onclick="rollFreeModule(${mi},'improvement')" ${su>=st.md?'disabled':''}>MIGLIORAMENTO</button>
          <button class="btn btn-sm btn-ghost" style="flex:1;border-color:#ffaa00;color:#ffaa00" onclick="rollFreeModule(${mi},'ranged')" ${su>=st.md?'disabled':''}>ARMA DISTANZA</button>
          <button class="btn btn-sm btn-ghost" style="flex:1;border-color:#ffaa00;color:#ffaa00" onclick="rollFreeModule(${mi},'melee')" ${su>=st.md?'disabled':''}>ARMA MISCHIA</button>
        </div>
      </div>` : ''}
      <div class="shop-box">
        <div class="shop-tabs">
          <button class="s-tab ${S.shopTab==='improvement'?'active':''}" data-tab="improvement" data-mi="${mi}">MIGLIORAMENTI</button>
          <button class="s-tab ${S.shopTab==='ranged'?'active':''}" data-tab="ranged" data-mi="${mi}">ARMI DISTANZA</button>
          <button class="s-tab ${S.shopTab==='melee'?'active':''}" data-tab="melee" data-mi="${mi}">ARMI MISCHIA</button>
        </div>
        <div class="shop-scroll">${shopItems(u,mech,mi,st,su)}</div>
      </div>
      ${ammoShop(u,mech,mi)}
      ${u.mercsBonus&&!u.mercsMod?`<div class="mercs-free-box">
        <div class="mercs-free-title">🎁 BONUS MERCS — MODULO GRATUITO: ${esc(getItem(u.mercsBonus.module.type,u.mercsBonus.module.itemId)?.name||'?')}</div>
        <button class="btn btn-secondary btn-sm" data-mercs-mod="${mi}">Assegna a questo Mech</button>
      </div>`:''}
    </div>
  </div>`;
}

function rollResult(roll,mi){
  const combs=[`${roll.a.word} ${roll.b.word}`,`${roll.b.word} ${roll.a.word}`,roll.a.word,roll.b.word];
  return `<div class="roll-result">
    <div class="roll-pair">
      <div class="roll-item"><span class="roll-lbl">TABELLA A — d66: ${roll.a.row+1}${roll.a.col+1}</span><span class="roll-word">${esc(roll.a.word)}</span></div>
      <div class="roll-item"><span class="roll-lbl">TABELLA B — d66: ${roll.b.row+1}${roll.b.col+1}</span><span class="roll-word">${esc(roll.b.word)}</span></div>
    </div>
    <span class="sugg-lbl">COMBINAZIONI SUGGERITE:</span>
    <div class="sugg-list">${combs.map(c=>`<button class="sugg-btn" data-sugg="${esc(c)}" data-smi="${mi}">${esc(c)}</button>`).join('')}</div>
  </div>`;
}

function statBox(lbl,val,base){ return `<div class="stat-box ${val!=base?'mod':''}"><span class="stat-lbl">${lbl}</span><span class="stat-val">${val}</span></div>`; }

function eqMod(m,mi,idx){
  const it=getItem(m.type,m.itemId); if(!it) return '';
  const tl=m.type==='improvement'?'MIGL.':m.type==='ranged'?'DIST.':'MISCH.';
  const ammo=m.ammoId?AMMO.find(a=>a.id===m.ammoId):null;
  const canAmmo=m.type==='ranged'&&!it.noAmmo;
  return `<div class="eq-mod ${m.type} ${m.free?'free-mod':''}">
    <div class="eq-main">
      <div class="eq-info">
        <span class="type-badge ${m.type}">${tl}</span>
        <span class="eq-name" title="${esc(it.name)}">${esc(it.name)}</span>
        ${m.free?'<span class="free-chip">GRATUITO</span>':`<span class="eq-cost">${fmt(it.cost)}</span>`}
      </div>
      <button class="btn-remove" data-rm="${mi}" data-idx="${idx}">✕</button>
    </div>
    ${it.fx?`<p class="eq-effect">${esc(it.fx)}</p>`:''}
    ${it.dmg?`<span class="eq-meta">Danno: ${it.dmg}${it.range?` | Gittata: ${it.range}`:''}${it.slots>1?` | ${it.slots} MD`:''}</span>`:''}
    ${canAmmo?`<div class="ammo-row">
      <span class="ammo-lbl">MUNIZIONI:</span>
      ${ammo?`<span class="ammo-chip">${esc(ammo.name)} [${ammo.tag}]</span>
              <button class="btn-rm-ammo" data-rma="${mi}" data-idx="${idx}">✕</button>
              ${m.ammoFree?'<span class="free-chip sm">GRATUITO</span>':''}`
             :'<span class="no-ammo-txt">Nessuna munizione speciale</span>'}
    </div>`:''}
  </div>`;
}

function shopItems(u,mech,mi,st,su){
  const list=S.shopTab==='improvement'?IMPROVEMENTS:S.shopTab==='ranged'?RANGED:MELEE;
  const rem=remaining(u);
  return `<div class="shop-items">${list.map(it=>{
    const ck=canBuy(u,mi,S.shopTab,it.id);
    return `<div class="s-item ${ck.ok?'':'s-disabled'}">
      <div class="s-item-head">
        <span class="s-item-name">${it.n}. ${esc(it.name)}</span>
        <span class="s-item-cost ${rem<it.cost?'no-budget':''}">${fmt(it.cost)}</span>
      </div>
      ${it.dmg?`<div class="s-item-meta">Danno: ${it.dmg}${it.range?` | Gittata: ${it.range}`:''}${it.slots>1?` | ${it.slots} MD`:''}</div>`:''}
      ${it.fx?`<p class="s-item-fx">${esc(it.fx)}</p>`:''}
      <div class="s-item-foot">
        ${!ck.ok&&ck.why?`<span class="s-item-reason">${ck.why}</span>`:'<span></span>'}
        <div style="display:flex;gap:6px;align-items:center;">
          ${it.rep?'<span class="rep-badge">★ Ripetibile</span>':''}
          <button class="btn btn-buy btn-sm" ${ck.ok?'':' disabled'} data-buy="${mi}" data-type="${S.shopTab}" data-iid="${it.id}">+ ACQUISTA</button>
        </div>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function ammoShop(u,mech,mi){
  const rangedMods=mech.modules.filter(m=>m.type==='ranged'&&!getItem('ranged',m.itemId)?.noAmmo);
  const rem=remaining(u);
  return `<div class="ammo-shop">
    <div class="ammo-shop-title">MUNIZIONI SPECIALI (non occupano slot MD)</div>
    ${rangedMods.length===0?'<p class="no-ranged-txt">Acquista prima un\'Arma a Distanza compatibile.</p>':`
    <div class="ammo-items">${AMMO.map(a=>`
      <div class="ammo-item">
        <div class="ammo-head">
          <span class="ammo-name">${a.n}. ${esc(a.name)}</span>
          <span class="ammo-tag-chip">[${a.tag}]</span>
          <span class="ammo-cost ${rem<a.cost?'no-budget':''}">${fmt(a.cost)}</span>
        </div>
        <p class="ammo-desc">${esc(a.desc)}</p>
        <div class="ammo-assign-btns">
          ${rangedMods.map(rm=>{
            const ri=mech.modules.indexOf(rm);
            const rIt=getItem('ranged',rm.itemId);
            const hasThis=rm.ammoId===a.id;
            const hasAny=!!rm.ammoId;
            const canAfford=rem>=a.cost;
            return `<button class="btn-ammo-assign" ${(!canAfford||hasAny)?'disabled':''} data-bammo="${mi}" data-ridx="${ri}" data-aid="${a.id}">
              → ${esc(rIt?.name||'Arma')}${hasThis?' ✓':''}
            </button>`;
          }).join('')}
        </div>
        ${u.mercsBonus&&!u.mercsAmmo&&u.mercsBonus.ammo.id===a.id?`<div style="margin-top:8px;">
          <span style="font-size:.75rem;color:#ff8c00;">🎁 Hai questa munizione gratuita! Assegnala a:</span>
          <div class="ammo-assign-btns" style="margin-top:4px;">
            ${rangedMods.filter(rm=>!rm.ammoId).map(rm=>{
              const ri=mech.modules.indexOf(rm);
              const rIt=getItem('ranged',rm.itemId);
              return `<button class="btn btn-secondary btn-sm" data-mercs-ammo="${mi}" data-ridx="${ri}">→ ${esc(rIt?.name||'Arma')} (GRATIS)</button>`;
            }).join('')}
          </div>
        </div>`:''}
      </div>`).join('')}
    </div>`}
  </div>`;
}

/* STEP 4 — RIEPILOGO */
function step4(){
  const u=S.unit; const f=FACTIONS.find(x=>x.id===u.factionId);
  const rem=remaining(u); const sp=totalSpent(u);
  return `
  <div class="step-hdr"><h2 class="sect-title">RIEPILOGO <span>UNITÀ</span></h2>
  <p class="sect-sub">Verifica la tua Unità da Combattimento prima di salvarla nel Garage.</p></div>
  <div class="summ-head" style="--fc:${f.color}">
    <div>
      <div class="summ-unit-name">${esc(u.unitName)||'Unità Senza Nome'}</div>
      <div class="summ-faction">${f.icon} ${f.name} — ${f.benName}</div>
    </div>
    <div class="summ-budget-row">
      <span>Spesi: ${fmt(sp)}</span>
      <span>Rimanenti: <strong>${fmt(rem)}</strong></span>
    </div>
  </div>
  <div class="summ-mechs">${u.mechs.map((m,i)=>summMech(m)).join('')}</div>
  ${rem<0?`<div class="budget-warn">⚠ Hai superato il budget di ${fmt(Math.abs(rem))}! Torna al loadout per rimuovere dei moduli.</div>`:''}
  <div class="nav-row">
    <button class="btn btn-ghost" id="btn-prev">← Indietro</button>
    <button class="btn btn-success" id="btn-save">💾 SALVA NEL GARAGE</button>
  </div>`;
}

function summMech(mech){
  const st=computeStats(mech); const su=slotsUsed(mech);
  const isMech = (mech.mType||'mech')==='mech';
  const cname = isMech ? CHASSIS[mech.chassis||'medio'].name : GROUND_FORCES[mech.mType].name;
  const title = isMech ? `MECH ${mech.num}` : `${cname.toUpperCase()} ${mech.num}`;
  return `<div class="summ-mech">
    <div class="summ-mech-hdr">
      <span class="mech-num-badge">${title}</span>
      <span class="summ-mech-name">${esc(mech.codename)||'Senza nome'}</span>
      ${isMech ? `<span class="badge-chassis">${cname}</span>` : ''}
      <span class="slot-badge" style="margin-left:auto">${su}/${st.md} MD</span>
    </div>
    <div class="stats-row">
      ${statBox('V',st.v,6)} ${statBox('AC',st.ac+'+','4+')} ${statBox('AR',st.ar+'+','6+')}
      ${statBox('PS',st.ps,6)} ${statBox('LC',st.lc,10)} ${statBox('MD',st.md,4)}
    </div>
    ${mech.modules.length?`<div class="summ-mod-list">${mech.modules.map(m=>{
      const it=getItem(m.type,m.itemId); const a=m.ammoId?AMMO.find(x=>x.id===m.ammoId):null;
      const tl=m.type==='improvement'?'MIGL.':m.type==='ranged'?'DIST.':'MISCH.';
      return `<div class="summ-mod-row">
        <span class="type-badge ${m.type}">${tl}</span>
        <span class="summ-mod-name">${esc(it?.name||'?')}</span>
        ${a?`<span class="summ-ammo-chip">[${a.tag}]</span>`:''}
        ${m.free?'<span class="free-chip sm">GRATIS</span>':`<span class="summ-mod-cost">${fmt(it?.cost||0)}</span>`}
      </div>`;
    }).join('')}</div>`:'<p class="no-mods-txt">Nessun modulo</p>'}
  </div>`;
}

// ════════════════════════════════════════════════════════════
// § 5  EVENT BINDING
// ════════════════════════════════════════════════════════════

function $q(s){ return document.querySelector(s); }
function $qq(s){ return document.querySelectorAll(s); }

function bindWizard(){
  $q('#btn-next')?.addEventListener('click',goNext);
  $q('#btn-prev')?.addEventListener('click',goPrev);
  $qq('[data-rm-model]')?.forEach(b=>b.onclick=()=>{
    S.unit.mechs.splice(+b.dataset.rmModel, 1);
    S.unit.mechs.forEach((m,i)=>m.num=i+1);
    render();
  });
  $qq('[data-add-model]')?.forEach(b=>b.onclick=()=>{
    const mt = b.dataset.addModel;
    const num = S.unit.mechs.length + 1;
    S.unit.mechs.push(newMech(num, mt));
    render();
  });
  $q('#btn-back-garage')?.addEventListener('click',()=>{S.view='garage';render();});
  $q('#btn-save')?.addEventListener('click',saveUnit);
  $q('#uname')?.addEventListener('input',e=>S.unit.unitName=e.target.value);

  $qq('.fc-card').forEach(c=>{ c.onclick=()=>selFaction(c.dataset.fid); c.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')selFaction(c.dataset.fid);}; });
  $qq('[data-toggle]').forEach(el=>el.onclick=()=>{ const i=+el.dataset.toggle; S.openMech=S.openMech===i?null:i; S.shopTab='improvement'; render(); window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY-80); });
  $qq('[data-roll]').forEach(b=>b.onclick=()=>doRoll(+b.dataset.roll));
  $qq('[data-cdn]').forEach(inp=>inp.addEventListener('input',e=>{ S.unit.mechs[+e.target.dataset.cdn].codename=e.target.value; }));
  $qq('[data-sugg]').forEach(b=>b.onclick=()=>{ S.unit.mechs[+b.dataset.smi].codename=b.dataset.sugg; render(); });
  $qq('[data-tab]').forEach(t=>t.onclick=()=>{ S.shopTab=t.dataset.tab; render(); });
  $qq('[data-buy]').forEach(b=>{ if(!b.disabled) b.onclick=()=>doBuy(+b.dataset.buy,b.dataset.type,b.dataset.iid); });
  $qq('[data-rm]').forEach(b=>b.onclick=()=>{ S.unit.mechs[+b.dataset.rm].modules.splice(+b.dataset.idx,1); render(); });
  $qq('[data-chassis]').forEach(b=>b.onclick=()=>{
    const mi=+b.dataset.cmi; const nid=b.dataset.chassis;
    const mech=S.unit.mechs[mi]; const su=slotsUsed(mech);
    if(su > CHASSIS[nid].md) { alert(`Impossibile selezionare il ${CHASSIS[nid].name}: hai già equipaggiato moduli che occupano ${su} slot MD, ma questo telaio ne supporta solo ${CHASSIS[nid].md}. Vendi qualche modulo prima di cambiare.`); return; }
    mech.chassis=nid; render();
  });
  $qq('[data-bammo]').forEach(b=>{ if(!b.disabled) b.onclick=()=>buyAmmo(+b.dataset.bammo,+b.dataset.ridx,b.dataset.aid,false); });
  $qq('[data-rma]').forEach(b=>b.onclick=()=>{ const m=S.unit.mechs[+b.dataset.rma].modules[+b.dataset.idx]; m.ammoId=null; m.ammoFree=false; render(); });
  $qq('[data-mercs-mod]').forEach(b=>b.onclick=()=>applyMercsMod(+b.dataset.mercsMod));
  $qq('[data-mercs-ammo]').forEach(b=>b.onclick=()=>applyMercsAmmo(+b.dataset.mercsAmmo,+b.dataset.ridx));
}

function selFaction(fid){
  if(!S.unit||S.unit.factionId!==fid){ S.unit=newUnit(fid); S.rolls={}; S.openMech=null; }
  render();
}

function goNext(){
  if(S.step===1&&!S.unit) return;
  if(S.step===2){
    const mechsCount = S.unit.mechs.filter(m=>(m.mType||'mech')==='mech').length;
    if(mechsCount < 2) { alert("Devi avere almeno 2 Mech nell'Unità!"); return; }
  }
  if(S.step<4){ S.step++; S.openMech=null; render(); window.scrollTo(0,0); }
}
function goPrev(){
  if(S.unit && S.unit.mode === 'rapido' && S.step === 2){
    S.view = 'mode_select'; S.unit = null; render(); window.scrollTo(0,0);
  } else if(S.step>1){ 
    S.step--; S.openMech=null; render(); window.scrollTo(0,0); 
  }
}

function doRoll(mi){
  const ar=d6(),ac=d6(),br=d6(),bc=d6();
  S.rolls[mi]={a:{row:ar,col:ac,word:TABLE_A[ar][ac]},b:{row:br,col:bc,word:TABLE_B[br][bc]}};
  render();
}

function doBuy(mi,type,itemId){
  const ck=canBuy(S.unit,mi,type,itemId); if(!ck.ok) return;
  S.unit.mechs[mi].modules.push({id:uid(),type,itemId,free:false,ammoId:null,ammoFree:false});
  render();
}

window.rollFreeModule = function(mi, type) {
  const u = S.unit; const mech = u.mechs[mi];
  const st = computeStats(mech); const su = slotsUsed(mech);
  if(su >= st.md) { alert("Slot MD esauriti!"); return; }
  
  let list = [];
  if(type === 'improvement') list = IMPROVEMENTS;
  else if(type === 'ranged') list = RANGED;
  else list = MELEE;

  const available = list.filter(it => {
    if(it.slots > 0 && su + it.slots > st.md) return false;
    if(mech.mType && mech.mType !== 'mech' && type === 'melee') return false;
    if(!it.rep && type === 'improvement' && mech.modules.some(m => m.type === type && m.itemId === it.id)) return false;
    return true;
  });

  if(available.length === 0) {
    alert("Nessun modulo di questo tipo può essere equipaggiato al momento.");
    return;
  }

  const rolled = available[Math.floor(Math.random() * available.length)];
  mech.modules.push({id:uid(), type, itemId:rolled.id, free:true, ammoId:null, ammoFree:false});
  render();
};

function buyAmmo(mi,modIdx,ammoId,isFree){
  const mod=S.unit.mechs[mi].modules[modIdx];
  if(!isFree){const a=AMMO.find(x=>x.id===ammoId); if(!a||remaining(S.unit)<a.cost) return;}
  mod.ammoId=ammoId; mod.ammoFree=isFree; render();
}

function applyMercsMod(mi){
  const u=S.unit; const b=u.mercsBonus;
  const mech=u.mechs[mi]; const it=getItem(b.module.type,b.module.itemId);
  if(!it) return;
  const st=computeStats(mech); const su=slotsUsed(mech);
  if(it.slots>0&&su+it.slots>st.md){alert('Slot MD insufficienti per questo Mech. Prova un altro.'); return;}
  mech.modules.push({id:uid(),type:b.module.type,itemId:b.module.itemId,free:true,ammoId:null,ammoFree:false});
  u.mercsMod=true; render();
}

function applyMercsAmmo(mi,ridx){
  const u=S.unit; const mod=u.mechs[mi].modules[ridx];
  mod.ammoId=u.mercsBonus.ammo.id; mod.ammoFree=true; u.mercsAmmo=true; render();
}

function saveUnit(){
  const idx=S.garage.findIndex(x=>x.id===S.unit.id);
  if(idx>=0) S.garage[idx]=S.unit; else S.garage.push(S.unit);
  saveGarage(); S.view='garage'; S.unit=null; S.step=1; S.rolls={}; S.openMech=null; render();
}

function startNew(){ S.view='mode_select'; render(); }

function editUnit(uid){ const u=S.garage.find(x=>x.id===uid); if(!u) return; S.view='wizard'; S.step=1; S.unit=JSON.parse(JSON.stringify(u)); S.rolls={}; S.openMech=null; render(); }

function delUnit(uid){ if(!confirm('Eliminare questa Unità da Combattimento?')) return; S.garage=S.garage.filter(x=>x.id!==uid); saveGarage(); render(); }

// ════════════════════════════════════════════════════════════
// § 6  GENERAZIONE PDF
// ════════════════════════════════════════════════════════════

function genPDF(uid){
  const u=S.garage.find(x=>x.id===uid); if(!u) return;
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const f=FACTIONS.find(x=>x.id===u.factionId);
  const W=210,ML=14;

  // parse faction color
  const hex=f.color.replace('#','');
  const fr=parseInt(hex.substring(0,2),16);
  const fg_=parseInt(hex.substring(2,4),16);
  const fb=parseInt(hex.substring(4,6),16);

  function addHeader(pageNum){
    doc.setFillColor(8,8,20); doc.rect(0,0,W,22,'F');
    doc.setFontSize(14); doc.setFont('helvetica','bold'); doc.setTextColor(fr,fg_,fb);
    doc.text('FLAMES OF ORION — MECH BUILDER',ML,10);
    doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(180,180,200);
    doc.text(`MODALITÀ VETERANO  |  ${f.name.toUpperCase()}  |  ${f.benName}`,ML,16);
    doc.setFontSize(18); doc.setFont('helvetica','bold'); doc.setTextColor(fr,fg_,fb);
    doc.text(u.unitName||'Unità Senza Nome',ML,21);
    doc.setFontSize(8); doc.setTextColor(140,140,160);
    const sp=totalSpent(u); const rem=u.budget-sp;
    doc.text(`Budget: ${fmt(u.budget)}  |  Spesi: ${fmt(sp)}  |  Rimanenti: ${fmt(rem)}`,W-ML,21,{align:'right'});
    if(pageNum>1){
      doc.setFontSize(7); doc.setTextColor(100,100,120);
      doc.text(`Pagina ${pageNum}`,W-ML,10,{align:'right'});
    }
  }

  let y=26; let pageNum=1; addHeader(pageNum);

  for(let i=0;i<u.mechs.length;i++){
    const mech=u.mechs[i];
    const st=computeStats(mech); const su=slotsUsed(mech);

    if(y>250&&i>0){ doc.addPage(); pageNum++; y=26; addHeader(pageNum); }

    // Mech header bar
    const isMech = (mech.mType||'mech')==='mech';
    const cname = isMech ? CHASSIS[mech.chassis||'medio'].name : GROUND_FORCES[mech.mType].name;
    const title = isMech ? `MECH ${mech.num}  —  ${mech.codename||'Senza Nome'} (${cname})` : `${cname.toUpperCase()} ${mech.num}  —  ${mech.codename||'Senza Nome'}`;
    doc.setFillColor(15,15,30); doc.rect(ML,y,W-ML*2,9,'F');
    doc.setDrawColor(fr,fg_,fb); doc.setLineWidth(0.4); doc.rect(ML,y,W-ML*2,9,'S');
    doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(fr,fg_,fb);
    doc.text(title,ML+3,y+6.5);
    doc.setFontSize(7); doc.setTextColor(140,140,160);
    doc.text(`${su} / ${st.md} slot MD`,W-ML-3,y+6.5,{align:'right'});
    y+=12;

    // Stats table
    doc.autoTable({
      startY:y,
      head:[['VELOCITÀ','ABILITÀ COMB.','ARMATURA','PUNTI SCAFO','LIM. CALORE','MODULI']],
      body:[[`${st.v}"`,`${st.ac}+`,`${st.ar}+`,`${st.ps}`,`${st.lc}`,`${su}/${st.md}`]],
      theme:'grid',
      margin:{left:ML,right:ML},
      headStyles:{fillColor:[fr,fg_,fb],textColor:[8,8,20],fontSize:7,fontStyle:'bold',halign:'center',cellPadding:2},
      bodyStyles:{fillColor:[12,12,25],textColor:[220,220,230],fontSize:9,fontStyle:'bold',halign:'center',cellPadding:3},
    });
    y=doc.lastAutoTable.finalY+3;

    // Modules table
    if(mech.modules.length){
      const rows=mech.modules.map(m=>{
        const it=getItem(m.type,m.itemId)||{name:'?',cost:0,fx:'',dmg:''};
        const a=m.ammoId?AMMO.find(x=>x.id===m.ammoId):null;
        const tl=m.type==='improvement'?'MIGL.':m.type==='ranged'?'DISTANZA':'MISCHIA';
        const slots=it.slots>0?`${it.slots} MD`:'—';
        const costo=m.free?'GRATUITO':fmt(it.cost);
        const nome=a?`${it.name}  [${a.tag}]`:it.name;
        const effetto=(it.fx||'').substring(0,90)+(it.fx&&it.fx.length>90?'…':'');
        const danno=m.type==='improvement'?'':(it.dmg||'—');
        return [tl,nome,danno,slots,costo,effetto];
      });
      doc.autoTable({
        startY:y,
        head:[['TIPO','MODULO / ARMA','DANNO','SLOT','COSTO','EFFETTO / SPECIALE']],
        body:rows,
        theme:'striped',
        margin:{left:ML,right:ML},
        headStyles:{fillColor:[30,30,55],textColor:[fr,fg_,fb],fontSize:7,fontStyle:'bold'},
        bodyStyles:{fillColor:[10,10,22],textColor:[200,200,210],fontSize:7.5},
        alternateRowStyles:{fillColor:[16,16,32]},
        columnStyles:{0:{cellWidth:18},1:{cellWidth:48,fontStyle:'bold'},2:{cellWidth:14,halign:'center'},3:{cellWidth:14,halign:'center'},4:{cellWidth:20,halign:'right'},5:{cellWidth:'auto'}},
      });
      y=doc.lastAutoTable.finalY+5;
    } else {
      doc.setFontSize(7.5); doc.setTextColor(80,80,100);
      doc.text('Nessun modulo equipaggiato.',ML+3,y+4); y+=9;
    }
  }

  // Footer
  const tot=doc.internal.getNumberOfPages();
  for(let p=1;p<=tot;p++){
    doc.setPage(p);
    doc.setFontSize(6.5); doc.setTextColor(70,70,90);
    doc.text(`Flames of Orion — Mech Builder  |  ${f.name}  |  Modalità Veterano  |  Pagina ${p}/${tot}`,ML,291);
  }

  const fn=`${(u.unitName||'unita').toLowerCase().replace(/\s+/g,'-')}-foi-sheet.pdf`;
  doc.save(fn);
}

// ════════════════════════════════════════════════════════════
// § 7  INIT
// ════════════════════════════════════════════════════════════

async function init(){
  // Tenta di caricare dal server (garage.json su disco)
  try{
    const r=await fetch('/api/garage');
    if(r.ok){
      const data=await r.json();
      S.garage=data;
      S.serverOk=true;
      // Sincronizza anche localStorage
      try{ localStorage.setItem('foi_v1',JSON.stringify(data)); }catch(e){}
    } else {
      loadGarageLocal();
      S.serverOk=false;
    }
  }catch(e){
    // Server non disponibile: usa localStorage
    loadGarageLocal();
    S.serverOk=false;
  }
  render();
}

init();
