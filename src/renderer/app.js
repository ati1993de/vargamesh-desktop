"use strict";

const $ = id => document.getElementById(id);
const $$ = selector => [...document.querySelectorAll(selector)];
const api = window.vmesh;

const I18N = {
  de: {
    nav_dashboard:"Übersicht",nav_wallet:"Wallet",nav_send:"Senden",nav_receive:"Empfangen",nav_transactions:"Transaktionen",nav_node:"Node",nav_settings:"Einstellungen",
    network_label:"VARGAMESH MAINNET",new_wallet:"Neue Wallet",starting_core:"VargaMesh Core wird gestartet",starting_core_hint:"Lokaler Full Node und Wallet-RPC werden vorbereitet.",
    fullnode_wallet:"FULL NODE WALLET",hero_title:"Deine VMESH. Dein Node. Deine Schlüssel.",hero_text:"VargaMesh Desktop verbindet die grafische Wallet direkt mit deinem lokalen VargaMesh Core. Keine Cloud-Wallet, kein Custody-Dienst.",receive_vmesh:"VMESH empfangen",send_vmesh:"VMESH senden",
    balance:"Guthaben",block_height:"Blockhöhe",sync:"Synchronisation",peers:"Peers",wallet_activity:"WALLET-AKTIVITÄT",latest_transactions:"Letzte Transaktionen",show_all:"Alle anzeigen",no_transactions:"Noch keine Transaktionen geladen.",network_health:"NETZWERK",node_health:"Node-Status",core_version:"Core",difficulty:"Difficulty",disk:"Chain-Daten",best_block:"Best Block",
    wallet_management:"Wallet-Verwaltung",wallet_management_hint:"Wallets werden durch VargaMesh Core gespeichert und signiert.",load_wallet:"Wallet laden",active_wallet:"Aktive Wallet",available_balance:"Verfügbar",backup_wallet:"Wallet sichern",backup_hint:"Core-Backup als .dat erstellen",restore_wallet:"Backup wiederherstellen",restore_hint:"Vorhandenes Core-Wallet-Backup laden",lock_wallet:"Wallet sperren",lock_hint:"Entsperrte Wallet sofort sperren",rescan_wallet:"Blockchain neu scannen",rescan_hint:"Wallet-Transaktionen erneut suchen",migrate_wallet:"Legacy-Wallet migrieren",migrate_hint:"Core-Migration für ältere Wallets",restore_notice:"Wähle anschließend eine vertrauenswürdige VargaMesh-Core-Wallet-Sicherungsdatei aus.",migrate_notice:"Erstelle vor der Migration ein unabhängiges Backup. Falls die Legacy-Wallet verschlüsselt ist, gib ihre Passphrase ein.",passphrase_optional:"Passphrase (falls erforderlich)",unload_wallet:"Wallet entladen",unload_hint:"Wallet aus dem laufenden Core entfernen",unspent_outputs:"Nicht ausgegebene Outputs",refresh:"Aktualisieren",amount:"Betrag",confirmations:"Bestätigungen",address:"Adresse",
    send_warning:"Transaktionen sind nach Bestätigung durch das Netzwerk nicht rückgängig zu machen.",destination:"Empfängeradresse",amount_vmesh:"Betrag (VMESH)",fee_target:"Gebührenschätzung",comment_optional:"Notiz (optional, lokal)",subtract_fee:"Gebühr vom Betrag abziehen",estimated_fee:"Geschätzte Fee-Rate",from_wallet:"Von Wallet",review_transaction:"Transaktion prüfen",
    receive_hint:"Erzeuge eine neue Bech32-Adresse direkt in deiner aktiven Core-Wallet.",copy:"Kopieren",label_optional:"Label (optional)",generate_address:"Neue Adresse erzeugen",qr_local:"QR-Code wird vollständig lokal erzeugt.",transactions:"Transaktionen",date:"Datum",type:"Typ",
    node_network:"Node & Netzwerk",node_hint:"Status deines lokalen VargaMesh Core und der verbundenen Peers.",open_data_dir:"Datenordner",mempool:"Mempool",network_hash:"Netzwerk-Hashrate",connected_peers:"Verbundene Peers",direction:"Richtung",client:"Client",synced_block:"Sync Block",
    settings:"Einstellungen",appearance:"Darstellung",language:"Sprache",theme:"Theme",theme_system:"System",theme_light:"Hell",theme_dark:"Dunkel",hide_balances:"Guthaben standardmäßig ausblenden",security:"Sicherheit",unlock_time:"Wallet-Entsperrdauer",always_confirm_send:"Senden immer bestätigen",security_note:"Passwörter werden nicht in Desktop-Einstellungen gespeichert.",about_text:"Lokale Full-Node-Wallet für Windows x64. Private Schlüssel und Signaturen bleiben in VargaMesh Core.",
    create_wallet:"Wallet erstellen",wallet_name:"Wallet-Name",passphrase_recommended:"Passphrase (empfohlen)",repeat_passphrase:"Passphrase wiederholen",passphrase_warning:"Ohne Backup und Passphrase kann der Zugriff auf Coins dauerhaft verloren gehen.",unlock_wallet:"Wallet entsperren",passphrase:"Passphrase",confirm_transaction:"Transaktion bestätigen",irreversible_warning:"Prüfe Adresse und Betrag sorgfältig. Netzwerktransaktionen sind endgültig.",send_now:"Jetzt senden"
  },
  en: {
    nav_dashboard:"Dashboard",nav_wallet:"Wallet",nav_send:"Send",nav_receive:"Receive",nav_transactions:"Transactions",nav_node:"Node",nav_settings:"Settings",
    network_label:"VARGAMESH MAINNET",new_wallet:"New wallet",starting_core:"Starting VargaMesh Core",starting_core_hint:"Preparing the local full node and wallet RPC.",
    fullnode_wallet:"FULL NODE WALLET",hero_title:"Your VMESH. Your node. Your keys.",hero_text:"VargaMesh Desktop connects the graphical wallet directly to your local VargaMesh Core. No cloud wallet and no custodial service.",receive_vmesh:"Receive VMESH",send_vmesh:"Send VMESH",
    balance:"Balance",block_height:"Block height",sync:"Synchronization",peers:"Peers",wallet_activity:"WALLET ACTIVITY",latest_transactions:"Latest transactions",show_all:"Show all",no_transactions:"No transactions loaded yet.",network_health:"NETWORK",node_health:"Node health",core_version:"Core",difficulty:"Difficulty",disk:"Chain data",best_block:"Best block",
    wallet_management:"Wallet management",wallet_management_hint:"Wallets are stored and signed by VargaMesh Core.",load_wallet:"Load wallet",active_wallet:"Active wallet",available_balance:"Available",backup_wallet:"Backup wallet",backup_hint:"Create a Core .dat backup",restore_wallet:"Restore backup",restore_hint:"Load an existing Core wallet backup",lock_wallet:"Lock wallet",lock_hint:"Immediately lock an unlocked wallet",rescan_wallet:"Rescan blockchain",rescan_hint:"Search for wallet transactions again",migrate_wallet:"Migrate legacy wallet",migrate_hint:"Run Core migration for older wallets",restore_notice:"Next, select a trusted VargaMesh Core wallet backup file.",migrate_notice:"Create an independent backup before migration. If the legacy wallet is encrypted, enter its passphrase.",passphrase_optional:"Passphrase (if required)",unload_wallet:"Unload wallet",unload_hint:"Remove wallet from the running Core",unspent_outputs:"Unspent outputs",refresh:"Refresh",amount:"Amount",confirmations:"Confirmations",address:"Address",
    send_warning:"Transactions cannot be reversed after confirmation by the network.",destination:"Destination address",amount_vmesh:"Amount (VMESH)",fee_target:"Fee estimate",comment_optional:"Note (optional, local)",subtract_fee:"Subtract fee from amount",estimated_fee:"Estimated fee rate",from_wallet:"From wallet",review_transaction:"Review transaction",
    receive_hint:"Generate a new Bech32 address directly in your active Core wallet.",copy:"Copy",label_optional:"Label (optional)",generate_address:"Generate new address",qr_local:"QR code is generated entirely locally.",transactions:"Transactions",date:"Date",type:"Type",
    node_network:"Node & network",node_hint:"Status of your local VargaMesh Core and connected peers.",open_data_dir:"Data folder",mempool:"Mempool",network_hash:"Network hashrate",connected_peers:"Connected peers",direction:"Direction",client:"Client",synced_block:"Sync block",
    settings:"Settings",appearance:"Appearance",language:"Language",theme:"Theme",theme_system:"System",theme_light:"Light",theme_dark:"Dark",hide_balances:"Hide balances by default",security:"Security",unlock_time:"Wallet unlock duration",always_confirm_send:"Always confirm sending",security_note:"Passwords are never stored in Desktop settings.",about_text:"Local full-node wallet for Windows x64. Private keys and signatures stay in VargaMesh Core.",
    create_wallet:"Create wallet",wallet_name:"Wallet name",passphrase_recommended:"Passphrase (recommended)",repeat_passphrase:"Repeat passphrase",passphrase_warning:"Without a backup and passphrase, access to coins may be permanently lost.",unlock_wallet:"Unlock wallet",passphrase:"Passphrase",confirm_transaction:"Confirm transaction",irreversible_warning:"Carefully verify the address and amount. Network transactions are final.",send_now:"Send now"
  }
};

const state = {
  settings:{ language:"de", theme:"system", activeWallet:"", autoLockSeconds:90, confirmSend:true, hideBalances:false, txPageSize:50 },
  appInfo:null, core:null, wallets:[], activeWallet:"", wallet:null, transactions:[], address:"", fee:null, pendingSend:null, timer:null
};

function tr(key){ return I18N[state.settings.language]?.[key] || I18N.de[key] || key; }
function unwrap(result){ if (!result?.ok) throw new Error(result?.error || "Operation failed"); return result.data; }
function showToast(message, error=false){ const el=$("toast"); el.textContent=message; el.className=`toast show${error?" error":""}`; clearTimeout(showToast.t); showToast.t=setTimeout(()=>el.className="toast",3500); }
function shortHash(value,n=12){ if(!value)return "—"; return value.length>n*2?`${value.slice(0,n)}…${value.slice(-n)}`:value; }
function formatBytes(n){ n=Number(n)||0; const units=["B","KB","MB","GB","TB"]; let i=0; while(n>=1024&&i<units.length-1){n/=1024;i++;} return `${n.toFixed(i?1:0)} ${units[i]}`; }
function formatNumber(n,max=2){ const v=Number(n); return Number.isFinite(v)?new Intl.NumberFormat(state.settings.language==="de"?"de-DE":"en-US",{maximumFractionDigits:max}).format(v):"—"; }
function formatVMESH(n){ if(state.settings.hideBalances)return "•••••••• VMESH"; const v=Number(n); return Number.isFinite(v)?`${new Intl.NumberFormat(state.settings.language==="de"?"de-DE":"en-US",{minimumFractionDigits:2,maximumFractionDigits:8}).format(v)} VMESH`:"—"; }
function formatDate(sec){ if(!sec)return "—"; return new Intl.DateTimeFormat(state.settings.language==="de"?"de-DE":"en-US",{dateStyle:"short",timeStyle:"short"}).format(new Date(sec*1000)); }
function balanceValues(){ const b=state.wallet?.balances; if(b?.mine)return {trusted:Number(b.mine.trusted||0),pending:Number(b.mine.untrusted_pending||0),immature:Number(b.mine.immature||0)}; const i=state.wallet?.info||{}; return {trusted:Number(i.balance||0),pending:Number(i.unconfirmed_balance||0),immature:Number(i.immature_balance||0)}; }

function applyI18n(){
  document.documentElement.lang=state.settings.language;
  $$('[data-i18n]').forEach(el=>{ const k=el.dataset.i18n; if(I18N[state.settings.language]?.[k]) el.textContent=tr(k); });
  const active=document.querySelector('.nav-item.active'); if(active) $("pageTitle").textContent=active.querySelector("b")?.textContent || tr("nav_dashboard");
}
function applyTheme(){ document.documentElement.dataset.theme=state.settings.theme; }

function setView(name){
  $$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${name}`));
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  const btn=document.querySelector(`.nav-item[data-view="${name}"]`); $("pageTitle").textContent=btn?.querySelector('b')?.textContent||name;
  if(name==='transactions') loadTransactions(true);
  if(name==='node') loadNodeExtras();
  if(name==='wallet') loadUtxos();
}

async function refreshCore(){
  try{
    state.core=unwrap(await api.coreStatus());
    const online=!!state.core.running;
    $("coreDot").className=`dot ${online?'online':''}`;
    $("coreText").textContent=online?`Core ${state.core.blocks ?? 'online'}`:(state.settings.language==='de'?'Core offline':'Core offline');
    $("startupBanner").classList.toggle('hidden',online);
    renderCore();
    if(online) await refreshWallets(false);
  }catch(err){ $("coreDot").className='dot error'; $("coreText").textContent='Core error'; }
}

function renderCore(){
  const c=state.core||{}; const progress=Math.max(0,Math.min(1,Number(c.verificationprogress||0)));
  $("dashBlocks").textContent=c.running?formatNumber(c.blocks,0):'—'; $("dashHeaders").textContent=c.running?`${formatNumber(c.headers,0)} headers`:'—';
  $("dashSync").textContent=c.running?`${(progress*100).toFixed(progress>.9999?2:1)} %`:'—'; $("syncBar").style.width=`${progress*100}%`;
  $("dashPeers").textContent=c.running?formatNumber(c.connections,0):'—'; $("dashConnections").textContent=c.running?`${c.connections_in||0} in / ${c.connections_out||0} out`:'—';
  $("healthCore").textContent=c.subversion||'—'; $("healthDifficulty").textContent=c.running?formatNumber(c.difficulty,4):'—'; $("healthDisk").textContent=c.running?formatBytes(c.size_on_disk):'—'; $("healthBestBlock").textContent=c.bestblockhash?shortHash(c.bestblockhash,8):'—';
  $("nodeBlocks").textContent=c.running?formatNumber(c.blocks,0):'—'; $("nodeHeaders").textContent=c.running?`${formatNumber(c.headers,0)} headers`:'—'; $("nodePeers").textContent=c.running?formatNumber(c.connections,0):'—'; $("nodePeerSplit").textContent=c.running?`${c.connections_in||0} inbound · ${c.connections_out||0} outbound`:'—';
}

async function refreshWallets(force=true){
  if(!state.core?.running)return;
  try{
    const data=unwrap(await api.listWallets()); state.wallets=data.wallets||[];
    let active=state.activeWallet || state.settings.activeWallet;
    if(!data.loaded.includes(active)) active=data.loaded[0]||'';
    state.activeWallet=active;
    renderWalletSelect(data.loaded);
    if(active) await refreshWallet(); else { state.wallet=null; renderWallet(); }
  }catch(err){ if(force) showToast(err.message,true); }
}

function renderWalletSelect(loaded){
  const select=$("walletSelect"); select.innerHTML='';
  if(!loaded.length){ const o=document.createElement('option'); o.textContent=state.settings.language==='de'?'Keine Wallet geladen':'No wallet loaded'; o.value=''; select.appendChild(o); return; }
  loaded.forEach(name=>{ const o=document.createElement('option'); o.value=name;o.textContent=name;o.selected=name===state.activeWallet;select.appendChild(o); });
}

async function refreshWallet(){
  if(!state.activeWallet){state.wallet=null;renderWallet();return;}
  try{
    state.wallet=unwrap(await api.walletSummary(state.activeWallet));
    if(state.settings.activeWallet!==state.activeWallet){ state.settings=unwrap(await api.updateSettings({activeWallet:state.activeWallet})); }
    renderWallet(); await loadTransactions(false);
  }catch(err){ showToast(err.message,true); }
}

function renderWallet(){
  const name=state.activeWallet||'—', info=state.wallet?.info||{}, b=balanceValues();
  $("walletName").textContent=name; $("sendWalletName").textContent=name; $("walletBalance").textContent=formatVMESH(b.trusted); $("dashBalance").textContent=formatVMESH(b.trusted);
  $("walletPending").textContent=`${formatVMESH(b.pending)} pending · ${formatVMESH(b.immature)} immature`; $("dashUnconfirmed").textContent=`${formatVMESH(b.pending)} pending`;
  $("walletEncryption").textContent=info.unlocked_until!==undefined?(info.unlocked_until>Math.floor(Date.now()/1000)?'Unlocked':'Encrypted / locked'):'Wallet ready';
  $("sendBtn").disabled=!state.activeWallet; $("newAddressBtn").disabled=!state.activeWallet;
}

function renderTransactions(target,rows){
  target.innerHTML='';
  if(!rows.length){ const trr=document.createElement('tr');trr.innerHTML='<td colspan="5" class="muted">—</td>';target.appendChild(trr);return; }
  rows.forEach(tx=>{
    const amount=Number(tx.amount||0), row=document.createElement('tr');
    row.innerHTML=`<td>${formatDate(tx.time||tx.timereceived)}</td><td>${escapeHtml(tx.category||'—')}</td><td><code title="${escapeAttr(tx.txid||'')}">${shortHash(tx.txid||'',10)}</code></td><td class="${amount>=0?'tx-amount positive':'tx-amount negative'}">${formatVMESH(amount)}</td><td>${tx.confirmations??0}</td>`;
    target.appendChild(row);
  });
}
function renderRecent(rows){
  const el=$("recentTransactions"); el.innerHTML='';
  if(!rows.length){el.textContent=tr('no_transactions');el.className='transaction-list empty-state';return;} el.className='transaction-list';
  rows.slice(0,5).forEach(tx=>{const amount=Number(tx.amount||0),d=document.createElement('div');d.className='tx-mini';d.innerHTML=`<div class="tx-icon">${amount>=0?'↙':'↗'}</div><div><b>${escapeHtml(tx.category||'transaction')}</b><small>${formatDate(tx.time||tx.timereceived)} · ${shortHash(tx.txid||'',7)}</small></div><div class="tx-amount ${amount>=0?'positive':'negative'}"><b>${formatVMESH(amount)}</b><small>${tx.confirmations??0} conf</small></div>`;el.appendChild(d);});
}
async function loadTransactions(showErrors=true){ if(!state.activeWallet)return; try{state.transactions=unwrap(await api.transactions(state.activeWallet,state.settings.txPageSize,0))||[];renderTransactions($("txBody"),state.transactions);renderRecent(state.transactions);}catch(err){if(showErrors)showToast(err.message,true);} }
async function loadUtxos(){ if(!state.activeWallet)return; try{const rows=unwrap(await api.unspent(state.activeWallet))||[];const body=$("utxoBody");body.innerHTML='';if(!rows.length){body.innerHTML='<tr><td colspan="5" class="muted">—</td></tr>';return;}rows.slice(0,200).forEach(u=>{const r=document.createElement('tr');r.innerHTML=`<td><code title="${escapeAttr(u.txid||'')}">${shortHash(u.txid||'',9)}</code></td><td>${u.vout??'—'}</td><td>${formatVMESH(u.amount)}</td><td>${u.confirmations??0}</td><td><code>${escapeHtml(u.address||'—')}</code></td>`;body.appendChild(r);});}catch(err){showToast(err.message,true);} }

async function loadNodeExtras(){
  if(!state.core?.running)return;
  const [mp,mi,pe]=await Promise.allSettled([api.mempool(),api.mining(),api.peers()]);
  if(mp.status==='fulfilled'&&mp.value.ok){const v=mp.value.data||{};$("nodeMempool").textContent=formatNumber(v.size,0);$("nodeMempoolBytes").textContent=formatBytes(v.bytes||v.usage);}
  if(mi.status==='fulfilled'&&mi.value.ok){const v=mi.value.data||{};$("nodeHashrate").textContent=formatHashrate(v.networkhashps);$("nodeDifficulty").textContent=`Diff ${formatNumber(v.difficulty,4)}`;}
  if(pe.status==='fulfilled'&&pe.value.ok)renderPeers(pe.value.data||[]);
}
function renderPeers(peers){const body=$("peerBody");body.innerHTML='';if(!peers.length){body.innerHTML='<tr><td colspan="5" class="muted">—</td></tr>';return;}peers.forEach(p=>{const r=document.createElement('tr');r.innerHTML=`<td><code>${escapeHtml(p.addr||'—')}</code></td><td>${p.inbound?'in':'out'}</td><td>${escapeHtml(p.subver||'—')}</td><td>${p.pingtime?`${(p.pingtime*1000).toFixed(0)} ms`:'—'}</td><td>${p.synced_blocks??'—'}</td>`;body.appendChild(r);});}
function formatHashrate(v){v=Number(v)||0;const units=['H/s','kH/s','MH/s','GH/s','TH/s','PH/s','EH/s'];let i=0;while(v>=1000&&i<units.length-1){v/=1000;i++;}return `${v.toFixed(v>=100?0:v>=10?1:2)} ${units[i]}`;}

async function generateAddress(){ if(!state.activeWallet)return showToast('No active wallet',true); try{const addr=unwrap(await api.newAddress(state.activeWallet,$("receiveLabel").value.trim()));state.address=addr;$("receiveAddress").textContent=addr;window.VargaQR.draw($("qrCanvas"),`vargamesh:${addr}`,6);showToast(state.settings.language==='de'?'Neue Adresse erzeugt':'New address generated');}catch(err){showToast(err.message,true);} }
async function validateSendAddress(){const val=$("sendAddress").value.trim(),note=$("addressValidation");if(!val){note.textContent='';note.className='field-note';return false;}try{const v=unwrap(await api.validateAddress(val));note.textContent=v?.isvalid?(state.settings.language==='de'?'✓ Gültige VargaMesh-Adresse':'✓ Valid VargaMesh address'):(state.settings.language==='de'?'✕ Ungültige Adresse':'✕ Invalid address');note.className=`field-note ${v?.isvalid?'ok':'bad'}`;return !!v?.isvalid;}catch(err){note.textContent=err.message;note.className='field-note bad';return false;}}
async function estimateFee(){try{const f=unwrap(await api.estimateFee(Number($("feeTarget").value)));state.fee=f;$("estimatedFee").textContent=f?.feerate!==undefined?`${formatNumber(Number(f.feerate)*100000,2)} sat/vB`:(f?.errors?.[0]||'—');}catch{$("estimatedFee").textContent='—';}}

async function reviewSend(){
  if(!state.activeWallet)return showToast('No active wallet',true);
  if(!(await validateSendAddress()))return;
  const amount=Number($("sendAmount").value); if(!Number.isFinite(amount)||amount<=0)return showToast(state.settings.language==='de'?'Ungültiger Betrag':'Invalid amount',true);
  state.pendingSend={wallet:state.activeWallet,address:$("sendAddress").value.trim(),amount,comment:$("sendComment").value.trim(),subtractFee:$("subtractFee").checked};
  $("confirmAddress").textContent=state.pendingSend.address;$("confirmAmount").textContent=formatVMESH(amount);$("confirmWallet").textContent=state.activeWallet;if(state.settings.confirmSend)$("confirmDialog").showModal();else await sendNow();
}
async function sendNow(){
  if(!state.pendingSend)return;
  $("sendConfirmBtn").disabled=true;
  try{
    const result=await api.send(state.pendingSend);
    if(!result.ok && /passphrase|wallet.*locked|unlock/i.test(result.error||'')){
      $("confirmDialog").close(); $("unlockPass").value=''; $("unlockDialog").showModal(); return;
    }
    const txid=unwrap(result); $("confirmDialog").close(); showToast(`${state.settings.language==='de'?'Gesendet':'Sent'}: ${shortHash(txid,10)}`); $("sendAmount").value=''; $("sendComment").value=''; state.pendingSend=null; await refreshWallet();
  }catch(err){showToast(err.message,true);}finally{$("sendConfirmBtn").disabled=false;}
}
async function unlockAndSend(){const pass=$("unlockPass").value;if(!pass)return;$("unlockConfirm").disabled=true;try{unwrap(await api.unlockWallet(state.activeWallet,pass,state.settings.autoLockSeconds));$("unlockPass").value='';$("unlockDialog").close();await sendNow();}catch(err){showToast(err.message,true);}finally{$("unlockConfirm").disabled=false;}}

async function createWallet(){const name=$("createWalletName").value.trim(),p1=$("createWalletPass").value,p2=$("createWalletPass2").value;if(!name)return;if(p1!==p2)return showToast(state.settings.language==='de'?'Passphrasen stimmen nicht überein':'Passphrases do not match',true);$("createWalletConfirm").disabled=true;try{unwrap(await api.createWallet({name,passphrase:p1}));$("walletDialog").close();$("createWalletPass").value=$("createWalletPass2").value='';state.activeWallet=name;await refreshWallets();showToast(state.settings.language==='de'?'Wallet erstellt':'Wallet created');}catch(err){showToast(err.message,true);}finally{$("createWalletConfirm").disabled=false;}}
async function openLoadDialog(){try{const data=unwrap(await api.listWallets()),box=$("availableWallets");box.innerHTML='';const unloaded=(data.wallets||[]).filter(w=>!w.loaded);if(!unloaded.length){box.innerHTML='<div class="muted">No unloaded wallets found.</div>';}unloaded.forEach(w=>{const d=document.createElement('div');d.className='wallet-option';const b=document.createElement('button');b.className='btn secondary';b.textContent=state.settings.language==='de'?'Laden':'Load';b.onclick=async()=>{try{unwrap(await api.loadWallet(w.name));$("loadDialog").close();state.activeWallet=w.name;await refreshWallets();}catch(err){showToast(err.message,true);}};d.innerHTML=`<b>${escapeHtml(w.name)}</b>`;d.appendChild(b);box.appendChild(d);});$("loadDialog").showModal();}catch(err){showToast(err.message,true);}}

function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function escapeAttr(value){return escapeHtml(value);}

async function saveSettings(patch){try{state.settings=unwrap(await api.updateSettings(patch));applyTheme();applyI18n();renderWallet();}catch(err){showToast(err.message,true);}}

function bind(){
  $$('.nav-item').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view))); $$('[data-goto]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.goto)));
  $("refreshBtn").onclick=async()=>{await refreshCore();await loadNodeExtras();showToast(tr('refresh'));};
  $("newWalletBtn").onclick=$("walletCreateBtn").onclick=()=>$("walletDialog").showModal(); $("createWalletConfirm").onclick=createWallet; $("loadWalletBtn").onclick=openLoadDialog;
  $("walletSelect").onchange=async e=>{state.activeWallet=e.target.value;await refreshWallet();};
  $("reloadTxBtn").onclick=()=>loadTransactions(true); $("reloadUtxoBtn").onclick=loadUtxos; $("reloadPeersBtn").onclick=loadNodeExtras;
  $("newAddressBtn").onclick=generateAddress; $("copyAddressBtn").onclick=async()=>{if(state.address){unwrap(await api.copy(state.address));showToast(tr('copy'));}};
  $("sendAddress").addEventListener('blur',validateSendAddress); $("feeTarget").onchange=estimateFee; $("sendBtn").onclick=reviewSend; $("sendConfirmBtn").onclick=sendNow; $("unlockConfirm").onclick=unlockAndSend;
  $("backupBtn").onclick=async()=>{if(!state.activeWallet)return;try{const r=unwrap(await api.backupWallet(state.activeWallet));if(!r.canceled)showToast(state.settings.language==='de'?'Backup erstellt':'Backup created');}catch(err){showToast(err.message,true);}};
  $("restoreBtn").onclick=()=>{$("restoreWalletName").value='';$("restoreDialog").showModal();};
  $("restoreConfirm").onclick=async()=>{const name=$("restoreWalletName").value.trim();if(!name)return;$("restoreConfirm").disabled=true;try{const r=unwrap(await api.restoreWallet(name));if(!r.canceled){state.activeWallet=name;$("restoreDialog").close();await refreshWallets();showToast(state.settings.language==='de'?'Wallet wiederhergestellt':'Wallet restored');}}catch(err){showToast(err.message,true);}finally{$("restoreConfirm").disabled=false;}};
  $("lockBtn").onclick=async()=>{if(!state.activeWallet)return;try{unwrap(await api.lockWallet(state.activeWallet));showToast(state.settings.language==='de'?'Wallet gesperrt':'Wallet locked');await refreshWallet();}catch(err){showToast(err.message,true);}};
  $("rescanBtn").onclick=async()=>{if(!state.activeWallet)return;if(!confirm(state.settings.language==='de'?'Blockchain-Rescan starten? Dies kann länger dauern.':'Start blockchain rescan? This may take some time.'))return;showToast(state.settings.language==='de'?'Rescan gestartet':'Rescan started');api.rescanWallet(state.activeWallet).then(r=>{if(!r.ok)showToast(r.error,true);}).catch(err=>showToast(err.message,true));};
  $("migrateBtn").onclick=()=>{if(!state.activeWallet)return;$("migratePass").value='';$("migrateDialog").showModal();};
  $("migrateConfirm").onclick=async()=>{if(!state.activeWallet)return;const passphrase=$("migratePass").value;$("migrateConfirm").disabled=true;try{unwrap(await api.migrateWallet(state.activeWallet,passphrase));$("migratePass").value='';$("migrateDialog").close();showToast(state.settings.language==='de'?'Migration abgeschlossen':'Migration completed');await refreshWallets();}catch(err){showToast(err.message,true);}finally{$("migrateConfirm").disabled=false;}};
  $("unloadBtn").onclick=async()=>{if(!state.activeWallet)return;const name=state.activeWallet;try{unwrap(await api.unloadWallet(name));state.activeWallet='';await refreshWallets();showToast(state.settings.language==='de'?`Wallet ${name} entladen`:`Wallet ${name} unloaded`);}catch(err){showToast(err.message,true);}};
  $("dataDirBtn").onclick=async()=>{try{unwrap(await api.showDataDir());}catch(err){showToast(err.message,true);}}; $("debugLogBtn").onclick=async()=>{try{unwrap(await api.showDebugLog());}catch(err){showToast(err.message,true);}};
  $("languageSelect").onchange=e=>saveSettings({language:e.target.value}); $("themeSelect").onchange=e=>saveSettings({theme:e.target.value}); $("hideBalances").onchange=e=>saveSettings({hideBalances:e.target.checked}); $("confirmSend").onchange=e=>saveSettings({confirmSend:e.target.checked}); $("autoLock").onchange=e=>saveSettings({autoLockSeconds:Number(e.target.value)});
  $$('.ext').forEach(b=>b.onclick=async()=>{try{unwrap(await api.openExternal(b.dataset.url));}catch(err){showToast(err.message,true);}});
}

async function init(){
  bind();
  try{state.appInfo=unwrap(await api.appInfo());state.settings=unwrap(await api.getSettings());state.activeWallet=state.settings.activeWallet;$("versionText").textContent=`VargaMesh Desktop v${state.appInfo.version}`;$("aboutVersion").textContent=`v${state.appInfo.version}`;$("languageSelect").value=state.settings.language;$("themeSelect").value=state.settings.theme;$("hideBalances").checked=state.settings.hideBalances;$("confirmSend").checked=state.settings.confirmSend;$("autoLock").value=String(state.settings.autoLockSeconds);applyTheme();applyI18n();unwrap(await api.startCore());await refreshCore();await estimateFee();state.timer=setInterval(refreshCore,5000);}catch(err){
    showToast(err.message,true);
    $("coreDot").className='dot error';
    $("coreText").textContent='Core error';
    const banner=$("startupBanner");
    banner.classList.add('error');
    const strong=banner.querySelector('strong');
    const span=banner.querySelector('span');
    if(strong)strong.textContent=state.settings.language==='de'?'VargaMesh Core konnte nicht gestartet werden':'VargaMesh Core could not start';
    if(span)span.textContent=err.message;
  }
}

window.addEventListener('DOMContentLoaded',init);
