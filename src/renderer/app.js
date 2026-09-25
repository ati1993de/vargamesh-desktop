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
    send_warning:"Transaktionen sind nach Bestätigung durch das Netzwerk nicht rückgängig zu machen.",destination:"Empfängeradresse",amount_vmesh:"Betrag (VMESH)",fee_target:"Gebührenschätzung",comment_optional:"Notiz (optional, lokal)",subtract_fee:"Gebühr vom Betrag abziehen",estimated_fee:"Geschätzte Fee-Rate",from_wallet:"Von Wallet",review_transaction:"Transaktion prüfen",fee_fallback:"Fallback",
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
    send_warning:"Transactions cannot be reversed after confirmation by the network.",destination:"Destination address",amount_vmesh:"Amount (VMESH)",fee_target:"Fee estimate",comment_optional:"Note (optional, local)",subtract_fee:"Subtract fee from amount",estimated_fee:"Estimated fee rate",from_wallet:"From wallet",review_transaction:"Review transaction",fee_fallback:"Fallback",
    receive_hint:"Generate a new Bech32 address directly in your active Core wallet.",copy:"Copy",label_optional:"Label (optional)",generate_address:"Generate new address",qr_local:"QR code is generated entirely locally.",transactions:"Transactions",date:"Date",type:"Type",
    node_network:"Node & network",node_hint:"Status of your local VargaMesh Core and connected peers.",open_data_dir:"Data folder",mempool:"Mempool",network_hash:"Network hashrate",connected_peers:"Connected peers",direction:"Direction",client:"Client",synced_block:"Sync block",
    settings:"Settings",appearance:"Appearance",language:"Language",theme:"Theme",theme_system:"System",theme_light:"Light",theme_dark:"Dark",hide_balances:"Hide balances by default",security:"Security",unlock_time:"Wallet unlock duration",always_confirm_send:"Always confirm sending",security_note:"Passwords are never stored in Desktop settings.",about_text:"Local full-node wallet for Windows x64. Private keys and signatures stay in VargaMesh Core.",
    create_wallet:"Create wallet",wallet_name:"Wallet name",passphrase_recommended:"Passphrase (recommended)",repeat_passphrase:"Repeat passphrase",passphrase_warning:"Without a backup and passphrase, access to coins may be permanently lost.",unlock_wallet:"Unlock wallet",passphrase:"Passphrase",confirm_transaction:"Confirm transaction",irreversible_warning:"Carefully verify the address and amount. Network transactions are final.",send_now:"Send now"
  }
};

Object.assign(I18N.de, {
  unlock_hint:"Verschlüsselte Wallet vorübergehend entsperren",
  import_key_address:"Schlüssel / Adresse importieren",
  import_key_hint:"WIF privat oder Adresse nur beobachten",
  migrate_descriptor_hint:"Bereits Descriptor-Wallet – keine Migration nötig",
  wallet_type_descriptor:"Descriptor-Wallet",
  wallet_type_legacy:"Legacy-Wallet",
  wallet_type_unknown:"Wallet-Format unbekannt",
  import_mode:"Import-Art",
  import_wif:"Privater Schlüssel (WIF)",
  import_watch:"Adresse nur beobachten",
  wif_private_key:"WIF Private Key",
  address_type:"Adress-Typ",
  expected_address:"Erwartete Adresse (empfohlen)",
  wallet_passphrase_optional:"Wallet-Passphrase (nur falls Wallet gesperrt)",
  preview_key:"Schlüssel prüfen",
  derived_address:"Aus WIF abgeleitete Adresse",
  address_matches:"✓ Schlüssel gehört zur erwarteten Adresse",
  address_mismatch:"✕ Schlüssel gehört nicht zur erwarteten Adresse",
  watch_address:"Zu beobachtende Adresse",
  full_rescan_import:"Blockchain-Historie vollständig nach Guthaben/Transaktionen durchsuchen",
  wif_warning:"Ein WIF ist ein privater Schlüssel. Niemals an Support, Webseiten oder andere Personen senden. VargaMesh Desktop speichert den eingegebenen Schlüssel nicht dauerhaft.",
  watch_warning:"Watch-only bedeutet: Guthaben und Transaktionen beobachten, aber ohne privaten Schlüssel keine Coins ausgeben.",
  import_now:"Jetzt importieren",
  import_success:"Import abgeschlossen",
  background_mode:"Hintergrund & Tray",
  close_to_tray:"Beim Schließen im Tray weiterlaufen",
  minimize_to_tray:"Beim Minimieren ins Tray",
  start_minimized:"VargaMesh Desktop minimiert starten",
  launch_at_login:"Mit Windows starten (im Hintergrund)",
  tray_note:"Solange VargaMesh Desktop im Tray läuft, bleibt der lokale Core aktiv. Über „Beenden und Core stoppen“ wird sauber beendet.",
  wallet_unlocked:"Wallet entsperrt"
});
Object.assign(I18N.en, {
  unlock_hint:"Temporarily unlock an encrypted wallet",
  import_key_address:"Import key / address",
  import_key_hint:"Private WIF or watch-only address",
  migrate_descriptor_hint:"Already a descriptor wallet – no migration required",
  wallet_type_descriptor:"Descriptor wallet",
  wallet_type_legacy:"Legacy wallet",
  wallet_type_unknown:"Unknown wallet format",
  import_mode:"Import type",
  import_wif:"Private key (WIF)",
  import_watch:"Watch-only address",
  wif_private_key:"WIF private key",
  address_type:"Address type",
  expected_address:"Expected address (recommended)",
  wallet_passphrase_optional:"Wallet passphrase (only if wallet is locked)",
  preview_key:"Check key",
  derived_address:"Address derived from WIF",
  address_matches:"✓ Key matches the expected address",
  address_mismatch:"✕ Key does not match the expected address",
  watch_address:"Address to watch",
  full_rescan_import:"Scan full blockchain history for balance and transactions",
  wif_warning:"A WIF is a private key. Never send it to support, websites or other people. VargaMesh Desktop does not persist the entered key.",
  watch_warning:"Watch-only means balances and transactions can be monitored, but funds cannot be spent without the private key.",
  import_now:"Import now",
  import_success:"Import completed",
  background_mode:"Background & tray",
  close_to_tray:"Keep running in tray when the window is closed",
  minimize_to_tray:"Minimize to tray",
  start_minimized:"Start VargaMesh Desktop minimized",
  launch_at_login:"Start with Windows (in background)",
  tray_note:"While VargaMesh Desktop is running in the tray, the local Core remains active. Use “Quit and stop Core” for a clean shutdown.",
  wallet_unlocked:"Wallet unlocked"
});

const state = {
  settings:{ language:"de", theme:"system", activeWallet:"", autoLockSeconds:90, confirmSend:true, hideBalances:false, txPageSize:50, closeToTray:true, minimizeToTray:false, startMinimized:false, launchAtLogin:false },
  appInfo:null, core:null, wallets:[], activeWallet:"", wallet:null, transactions:[], address:"", fee:null, pendingSend:null, timer:null, unlockPurpose:"wallet"
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
  const encrypted=info.unlocked_until!==undefined;
  const unlocked=encrypted&&info.unlocked_until>Math.floor(Date.now()/1000);
  $("walletEncryption").textContent=encrypted?(unlocked?(state.settings.language==='de'?'Verschlüsselt · entsperrt':'Encrypted · unlocked'):(state.settings.language==='de'?'Verschlüsselt · gesperrt':'Encrypted · locked')):(state.activeWallet?(state.settings.language==='de'?'Nicht verschlüsselt':'Not encrypted'):'—');
  $("walletType").textContent=state.activeWallet?(info.descriptors===true?tr('wallet_type_descriptor'):info.descriptors===false?tr('wallet_type_legacy'):tr('wallet_type_unknown')):'—';
  $("sendBtn").disabled=!state.activeWallet; $("newAddressBtn").disabled=!state.activeWallet;
  $("backupBtn").disabled=!state.activeWallet; $("lockBtn").disabled=!state.activeWallet||!encrypted||!unlocked; $("unlockBtn").disabled=!state.activeWallet||!encrypted||unlocked;
  $("importBtn").disabled=!state.activeWallet; $("rescanBtn").disabled=!state.activeWallet; $("unloadBtn").disabled=!state.activeWallet;
  const descriptor=info.descriptors===true; $("migrateBtn").disabled=!state.activeWallet||descriptor; $("migrateHint").textContent=descriptor?tr('migrate_descriptor_hint'):tr('migrate_hint');
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
async function estimateFee(){try{const f=unwrap(await api.estimateFee(Number($("feeTarget").value)));state.fee=f;if(f?.feerate!==undefined){const suffix=f?.fallback?` · ${tr('fee_fallback')}`:'';$("estimatedFee").textContent=`${formatNumber(Number(f.feerate)*100000,2)} sat/vB${suffix}`;}else{$("estimatedFee").textContent=f?.errors?.[0]||'—';}}catch{$("estimatedFee").textContent='—';}}

async function reviewSend(){
  if(!state.activeWallet)return showToast('No active wallet',true);
  if(!(await validateSendAddress()))return;
  const amount=Number($("sendAmount").value); if(!Number.isFinite(amount)||amount<=0)return showToast(state.settings.language==='de'?'Ungültiger Betrag':'Invalid amount',true);
  state.pendingSend={wallet:state.activeWallet,address:$("sendAddress").value.trim(),amount,comment:$("sendComment").value.trim(),subtractFee:$("subtractFee").checked,feeTarget:Number($("feeTarget").value)||6};
  $("confirmAddress").textContent=state.pendingSend.address;$("confirmAmount").textContent=formatVMESH(amount);$("confirmWallet").textContent=state.activeWallet;if(state.settings.confirmSend)$("confirmDialog").showModal();else await sendNow();
}
async function sendNow(){
  if(!state.pendingSend)return;
  $("sendConfirmBtn").disabled=true;
  try{
    const result=await api.send(state.pendingSend);
    if(!result.ok && /passphrase|wallet.*locked|unlock/i.test(result.error||'')){
      $("confirmDialog").close(); $("unlockPass").value=''; state.unlockPurpose='send'; $("unlockDialog").showModal(); return;
    }
    const txid=unwrap(result); $("confirmDialog").close(); showToast(`${state.settings.language==='de'?'Gesendet':'Sent'}: ${shortHash(txid,10)}`); $("sendAmount").value=''; $("sendComment").value=''; state.pendingSend=null; await refreshWallet();
  }catch(err){showToast(err.message,true);}finally{$("sendConfirmBtn").disabled=false;}
}
async function unlockAndContinue(){const pass=$("unlockPass").value;if(!pass)return;$("unlockConfirm").disabled=true;try{unwrap(await api.unlockWallet(state.activeWallet,pass,state.settings.autoLockSeconds));$("unlockPass").value='';$("unlockDialog").close();const purpose=state.unlockPurpose;state.unlockPurpose='wallet';await refreshWallet();if(purpose==='send')await sendNow();else showToast(tr('wallet_unlocked'));}catch(err){showToast(err.message,true);}finally{$("unlockConfirm").disabled=false;}}

function toggleImportMode(){
  const watch=$("importMode").value==='watch';
  $("importWifFields").classList.toggle('hidden',watch);
  $("importWatchFields").classList.toggle('hidden',!watch);
  $("importWarning").textContent=watch?tr('watch_warning'):tr('wif_warning');
}
function openImportDialog(){
  if(!state.activeWallet)return showToast(state.settings.language==='de'?'Keine aktive Wallet':'No active wallet',true);
  $("importMode").value='wif'; $("importWif").value=''; $("importExpectedAddress").value=''; $("importDerivedAddress").textContent='—'; $("importPreviewNote").textContent=''; $("importPreviewNote").className='field-note'; $("importWalletPass").value=''; $("importWatchAddress").value=''; $("importLabel").value=''; $("importRescan").checked=true; $("importAddressType").value='bech32'; toggleImportMode(); $("importDialog").showModal();
}
async function previewImportKey(){
  const wif=$("importWif").value.trim(); if(!wif)return showToast(state.settings.language==='de'?'WIF Private Key fehlt.':'WIF private key is required.',true);
  $("importPreviewBtn").disabled=true;
  try{
    const result=unwrap(await api.previewPrivateKey({wif,addressType:$("importAddressType").value}));
    $("importDerivedAddress").textContent=result.address||'—';
    const expected=$("importExpectedAddress").value.trim(), note=$("importPreviewNote");
    if(expected){const match=$("importAddressType").value==='bech32'?String(result.address).toLowerCase()===expected.toLowerCase():String(result.address)===expected;note.textContent=match?tr('address_matches'):tr('address_mismatch');note.className=`field-note ${match?'ok':'bad'}`;}else{note.textContent='';note.className='field-note';}
  }catch(err){$("importDerivedAddress").textContent='—';showToast(err.message,true);}finally{$("importPreviewBtn").disabled=false;}
}

async function importKeyOrAddress(){
  if(!state.activeWallet)return;
  const mode=$("importMode").value, rescan=$("importRescan").checked, label=$("importLabel").value.trim();
  $("importConfirm").disabled=true;
  const original=$("importConfirm").textContent;
  $("importConfirm").textContent=state.settings.language==='de'?'Import läuft…':'Importing…';
  try{
    let result;
    if(mode==='wif'){
      const wif=$("importWif").value.trim(); if(!wif)throw new Error(state.settings.language==='de'?'WIF Private Key fehlt.':'WIF private key is required.');
      result=unwrap(await api.importPrivateKey({wallet:state.activeWallet,wif,addressType:$("importAddressType").value,expectedAddress:$("importExpectedAddress").value.trim(),passphrase:$("importWalletPass").value,label,rescan}));
    }else{
      const address=$("importWatchAddress").value.trim(); if(!address)throw new Error(state.settings.language==='de'?'Adresse fehlt.':'Address is required.');
      result=unwrap(await api.importWatchAddress({wallet:state.activeWallet,address,label,rescan}));
    }
    $("importDialog").close();
    showToast(`${tr('import_success')}: ${shortHash(result.address||'',10)}`);
    await refreshWallet(); await loadTransactions(false); await loadUtxos();
  }catch(err){showToast(err.message,true);}finally{
    $("importWif").value=''; $("importWalletPass").value=''; $("importConfirm").disabled=false; $("importConfirm").textContent=original;
  }
}

async function createWallet(){const name=$("createWalletName").value.trim(),p1=$("createWalletPass").value,p2=$("createWalletPass2").value;if(!name)return;if(p1!==p2)return showToast(state.settings.language==='de'?'Passphrasen stimmen nicht überein':'Passphrases do not match',true);$("createWalletConfirm").disabled=true;try{unwrap(await api.createWallet({name,passphrase:p1}));$("walletDialog").close();$("createWalletPass").value=$("createWalletPass2").value='';state.activeWallet=name;await refreshWallets();showToast(state.settings.language==='de'?'Wallet erstellt':'Wallet created');}catch(err){showToast(err.message,true);}finally{$("createWalletConfirm").disabled=false;}}
async function openLoadDialog(){try{const data=unwrap(await api.listWallets()),box=$("availableWallets");box.innerHTML='';const unloaded=(data.wallets||[]).filter(w=>!w.loaded);if(!unloaded.length){box.innerHTML='<div class="muted">No unloaded wallets found.</div>';}unloaded.forEach(w=>{const d=document.createElement('div');d.className='wallet-option';const b=document.createElement('button');b.className='btn secondary';b.textContent=state.settings.language==='de'?'Laden':'Load';b.onclick=async()=>{try{unwrap(await api.loadWallet(w.name));$("loadDialog").close();state.activeWallet=w.name;await refreshWallets();}catch(err){showToast(err.message,true);}};d.innerHTML=`<b>${escapeHtml(w.name)}</b>`;d.appendChild(b);box.appendChild(d);});$("loadDialog").showModal();}catch(err){showToast(err.message,true);}}

function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function escapeAttr(value){return escapeHtml(value);}

async function saveSettings(patch){try{state.settings=unwrap(await api.updateSettings(patch));applyTheme();applyI18n();renderWallet();if($("importDialog")?.open)toggleImportMode();}catch(err){showToast(err.message,true);}}

function bind(){
  $$('.nav-item').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view))); $$('[data-goto]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.goto)));
  $("refreshBtn").onclick=async()=>{await refreshCore();await loadNodeExtras();showToast(tr('refresh'));};
  $("newWalletBtn").onclick=$("walletCreateBtn").onclick=()=>$("walletDialog").showModal(); $("createWalletConfirm").onclick=createWallet; $("loadWalletBtn").onclick=openLoadDialog;
  $("walletSelect").onchange=async e=>{state.activeWallet=e.target.value;await refreshWallet();};
  $("reloadTxBtn").onclick=()=>loadTransactions(true); $("reloadUtxoBtn").onclick=loadUtxos; $("reloadPeersBtn").onclick=loadNodeExtras;
  $("newAddressBtn").onclick=generateAddress; $("copyAddressBtn").onclick=async()=>{if(state.address){unwrap(await api.copy(state.address));showToast(tr('copy'));}};
  $("sendAddress").addEventListener('blur',validateSendAddress); $("feeTarget").onchange=estimateFee; $("sendBtn").onclick=reviewSend; $("sendConfirmBtn").onclick=sendNow; $("unlockConfirm").onclick=unlockAndContinue;
  $("backupBtn").onclick=async()=>{if(!state.activeWallet)return;try{const r=unwrap(await api.backupWallet(state.activeWallet));if(!r.canceled)showToast(state.settings.language==='de'?'Backup erstellt':'Backup created');}catch(err){showToast(err.message,true);}};
  $("restoreBtn").onclick=()=>{$("restoreWalletName").value='';$("restoreDialog").showModal();};
  $("restoreConfirm").onclick=async()=>{const name=$("restoreWalletName").value.trim();if(!name)return;$("restoreConfirm").disabled=true;try{const r=unwrap(await api.restoreWallet(name));if(!r.canceled){state.activeWallet=name;$("restoreDialog").close();await refreshWallets();showToast(state.settings.language==='de'?'Wallet wiederhergestellt':'Wallet restored');}}catch(err){showToast(err.message,true);}finally{$("restoreConfirm").disabled=false;}};
  $("unlockBtn").onclick=()=>{if(!state.activeWallet)return;state.unlockPurpose='wallet';$("unlockPass").value='';$("unlockDialog").showModal();};
  $("lockBtn").onclick=async()=>{if(!state.activeWallet)return;try{unwrap(await api.lockWallet(state.activeWallet));showToast(state.settings.language==='de'?'Wallet gesperrt':'Wallet locked');await refreshWallet();}catch(err){showToast(err.message,true);}};
  $("importBtn").onclick=openImportDialog; $("importMode").onchange=toggleImportMode; $("importPreviewBtn").onclick=previewImportKey; $("importConfirm").onclick=importKeyOrAddress;
  $("importDialog").addEventListener('close',()=>{$("importWif").value='';$("importWalletPass").value='';$("importDerivedAddress").textContent='—';$("importPreviewNote").textContent='';}); $("unlockDialog").addEventListener('close',()=>{$("unlockPass").value='';}); $("migrateDialog").addEventListener('close',()=>{$("migratePass").value='';});
  $("rescanBtn").onclick=async()=>{if(!state.activeWallet)return;if(!confirm(state.settings.language==='de'?'Blockchain-Rescan starten? Dies kann länger dauern.':'Start blockchain rescan? This may take some time.'))return;showToast(state.settings.language==='de'?'Rescan gestartet':'Rescan started');api.rescanWallet(state.activeWallet).then(r=>{if(!r.ok)showToast(r.error,true);}).catch(err=>showToast(err.message,true));};
  $("migrateBtn").onclick=()=>{if(!state.activeWallet)return;if(state.wallet?.info?.descriptors===true)return showToast(tr('migrate_descriptor_hint'));$("migratePass").value='';$("migrateDialog").showModal();};
  $("migrateConfirm").onclick=async()=>{if(!state.activeWallet)return;const passphrase=$("migratePass").value;$("migrateConfirm").disabled=true;try{unwrap(await api.migrateWallet(state.activeWallet,passphrase));$("migratePass").value='';$("migrateDialog").close();showToast(state.settings.language==='de'?'Migration abgeschlossen':'Migration completed');await refreshWallets();}catch(err){showToast(err.message,true);}finally{$("migrateConfirm").disabled=false;}};
  $("unloadBtn").onclick=async()=>{if(!state.activeWallet)return;const name=state.activeWallet;try{unwrap(await api.unloadWallet(name));state.activeWallet='';await refreshWallets();showToast(state.settings.language==='de'?`Wallet ${name} entladen`:`Wallet ${name} unloaded`);}catch(err){showToast(err.message,true);}};
  $("dataDirBtn").onclick=async()=>{try{unwrap(await api.showDataDir());}catch(err){showToast(err.message,true);}}; $("debugLogBtn").onclick=async()=>{try{unwrap(await api.showDebugLog());}catch(err){showToast(err.message,true);}};
  $("languageSelect").onchange=e=>saveSettings({language:e.target.value}); $("themeSelect").onchange=e=>saveSettings({theme:e.target.value}); $("hideBalances").onchange=e=>saveSettings({hideBalances:e.target.checked}); $("confirmSend").onchange=e=>saveSettings({confirmSend:e.target.checked}); $("autoLock").onchange=e=>saveSettings({autoLockSeconds:Number(e.target.value)}); $("closeToTray").onchange=e=>saveSettings({closeToTray:e.target.checked}); $("minimizeToTray").onchange=e=>saveSettings({minimizeToTray:e.target.checked}); $("startMinimized").onchange=e=>saveSettings({startMinimized:e.target.checked}); $("launchAtLogin").onchange=e=>saveSettings({launchAtLogin:e.target.checked});
  $$('.ext').forEach(b=>b.onclick=async()=>{try{unwrap(await api.openExternal(b.dataset.url));}catch(err){showToast(err.message,true);}});
}

async function init(){
  bind();
  try{state.appInfo=unwrap(await api.appInfo());state.settings=unwrap(await api.getSettings());state.activeWallet=state.settings.activeWallet;$("versionText").textContent=`VargaMesh Desktop v${state.appInfo.version}`;$("aboutVersion").textContent=`v${state.appInfo.version}`;$("languageSelect").value=state.settings.language;$("themeSelect").value=state.settings.theme;$("hideBalances").checked=state.settings.hideBalances;$("confirmSend").checked=state.settings.confirmSend;$("autoLock").value=String(state.settings.autoLockSeconds);$("closeToTray").checked=state.settings.closeToTray;$("minimizeToTray").checked=state.settings.minimizeToTray;$("startMinimized").checked=state.settings.startMinimized;$("launchAtLogin").checked=state.settings.launchAtLogin;applyTheme();applyI18n();unwrap(await api.startCore());await refreshCore();await estimateFee();state.timer=setInterval(refreshCore,5000);}catch(err){
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
