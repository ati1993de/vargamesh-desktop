"use strict";

(() => {
  const api = window.vmesh;
  const $ = id => document.getElementById(id);
  const t = key => window.VargaI18N?.tr(key) || key;
  const locale = () => window.VargaI18N?.locale() || "en-US";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[c]));
  const short = (value, n = 10) => {
    const s = String(value || "");
    return s.length > n * 2 ? `${s.slice(0,n)}…${s.slice(-n)}` : s;
  };
  const unwrap = result => {
    if (!result?.ok) throw new Error(result?.error || "Operation failed");
    return result.data;
  };
  const toast = (message, error = false) => {
    const el = $("toast");
    if (!el) return;
    el.textContent = message;
    el.className = `toast show${error ? " error" : ""}`;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { el.className = "toast"; }, 4500);
  };
  const wallet = () => $("walletSelect")?.value || "";
  const fmt = (value, decimals = 8) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return new Intl.NumberFormat(locale(), {
      minimumFractionDigits: 0,
      maximumFractionDigits: Math.min(8, Number(decimals) || 0)
    }).format(n);
  };

  const state = {
    data: null,
    selected: null,
    candidate: null,
    logoCache: new Map()
  };

  function setBusy(value) {
    for (const id of ["vmtRefresh","vmtCreateBtn","vmtActionPrepare","vmtDirectorySearchBtn"]) {
      if ($(id)) $(id).disabled = !!value;
    }
  }

  function policyHtml() {
    const status = state.data?.status;
    const p = status?.policy?.create_fee;
    if (!p) return '<span class="vmt-pill warn">VMT API —</span>';
    const active = !!p.active;
    return [
      `<span class="vmt-pill ${active ? "ok" : "warn"}">${active ? t('vmt_create_fee_active') : t('vmt_create_fee_scheduled')}</span>`,
      `<span class="vmt-pill"><b>${esc(p.minimum_vmesh)}</b> VMESH</span>`,
      `<span class="vmt-pill mono">#${esc(p.activation_height ?? "—")}</span>`,
      `<span class="vmt-pill mono">${esc(short(status.policy?.sha256,8))}</span>`
    ].join("");
  }

  async function logo(tokenId) {
    if (state.logoCache.has(tokenId)) return state.logoCache.get(tokenId);
    try {
      const data = unwrap(await api.vmtTokenLogo(tokenId));
      state.logoCache.set(tokenId, data);
      return data;
    } catch (_) {
      state.logoCache.set(tokenId, "");
      return "";
    }
  }

  async function renderAssets() {
    const host = $("vmtAssets");
    if (!host) return;
    const holdings = state.data?.holdings || [];
    if (!holdings.length) {
      host.innerHTML = `<div class="empty-state">${t('vmt_no_balances')}</div>`;
      return;
    }
    host.innerHTML = holdings.map((t, i) => `
      <article class="vmt-asset-card" data-vmt-index="${i}">
        <div class="vmt-asset-main">
          <div class="vmt-token-logo" data-logo="${esc(t.token_id)}">${esc((t.symbol || "VMT").slice(0,4))}</div>
          <div>
            <div class="vmt-title-row"><strong>${esc(t.name)}</strong><span class="vmt-badge ${esc(t.metadata_status || "none")}">${esc(String(t.metadata_status || "none").toUpperCase())}</span></div>
            <div class="muted small">${esc(t.symbol)} · VMT-1</div>
          </div>
        </div>
        <div class="vmt-holding">
          <strong>${esc(t.balance)} ${esc(t.symbol)}</strong>
          <small class="mono">${esc(t.owner_address)}</small>
        </div>
        ${t.spendable ? "" : `<div class="vmt-utxo-note">${t('vmt_spendable_note')}</div>`}
        <div class="vmt-card-actions">
          <button class="btn primary" data-vmt-action="transfer" data-vmt-index="${i}" ${t.spendable ? "" : "disabled"}>${t('vmt_send')}</button>
          <button class="btn secondary" data-vmt-action="receive" data-vmt-index="${i}">${t('vmt_receive')}</button>
          <button class="btn secondary" data-vmt-action="burn" data-vmt-index="${i}" ${t.spendable ? "" : "disabled"}>${t("vmt_burn")}</button>
          ${t.is_issuer && t.mintable ? `<button class="btn secondary" data-vmt-action="mint" data-vmt-index="${i}" ${t.spendable ? "" : "disabled"}>${t("vmt_mint")}</button>` : ""}
          <button class="text-btn" data-vmt-action="detail" data-vmt-index="${i}">${t('vmt_details_action')}</button>
        </div>
      </article>
    `).join("");

    host.querySelectorAll("[data-vmt-action]").forEach(btn => btn.addEventListener("click", onAssetAction));

    for (const node of host.querySelectorAll("[data-logo]")) {
      const tokenId = node.dataset.logo;
      const t = holdings.find(x => x.token_id === tokenId);
      if (!t?.logo_url) continue;
      const src = await logo(tokenId);
      if (src) {
        node.textContent = "";
        const img = document.createElement("img");
        img.alt = t.symbol || "VMT";
        img.src = src;
        node.appendChild(img);
      }
    }
  }

  function renderAddresses() {
    const select = $("vmtCreateAuthorizer");
    if (!select) return;
    const rows = (state.data?.addresses || []).filter(x => x.is_mine && Number(x.spendable_utxos || 0) > 0);
    select.innerHTML = rows.map(a => `<option value="${esc(a.address)}">${esc(a.address)} · ${esc(a.spendable_vmesh)} VMESH · ${a.spendable_utxos} UTXO</option>`).join("");
    if (!rows.length) select.innerHTML = `<option value="">${t('vmt_no_authorizer_address')}</option>`;
  }

  function renderActivity() {
    const host = $("vmtActivity");
    if (!host) return;
    const rows = state.data?.activity || [];
    if (!rows.length) {
      host.innerHTML = `<div class="empty-state">${t('vmt_no_activity_wallet')}</div>`;
      return;
    }
    host.innerHTML = `<div class="table-wrap"><table><thead><tr><th>${t('block')}</th><th>${t('action')}</th><th>${t("token")}</th><th>${t('amount')}</th><th>TXID</th></tr></thead><tbody>${rows.map(e => `
      <tr><td>#${esc(e.height)}</td><td>${esc(e.direction || e.op)}</td><td>${esc(e.symbol || short(e.token_id,6))}</td><td>${esc(e.amount || "—")}</td><td><code>${esc(short(e.txid,9))}</code></td></tr>
    `).join("")}</tbody></table></div>`;
  }

  async function refresh() {
    const name = wallet();
    if (!name) {
      state.data = null;
      if ($("vmtAssets")) $("vmtAssets").innerHTML = `<div class="empty-state">${t('vmt_load_wallet_first')}</div>`;
      return;
    }
    setBusy(true);
    try {
      state.data = unwrap(await api.vmtPortfolio(name));
      $("vmtPolicy").innerHTML = policyHtml();
      $("vmtApiStatus").textContent = `VMT-1 · ${state.data.status?.version || "—"} · #${state.data.status?.indexed_height ?? "—"}`;
      renderAddresses();
      await renderAssets();
      renderActivity();
    } catch (err) {
      toast(err.message, true);
      if ($("vmtAssets")) $("vmtAssets").innerHTML = `<div class="warning-box">${esc(err.message)}</div>`;
    } finally {
      setBusy(false);
    }
  }

  function openAction(token, operation) {
    state.selected = { token, operation };
    const panel = $("vmtActionPanel");
    panel.classList.remove("hidden");
    $("vmtActionTitle").textContent = operation === "transfer"
      ? t('vmt_send_token')
      : operation === "burn" ? t("vmt_burn")
      : operation === "mint" ? t("vmt_mint") : t('vmt_token_action');
    $("vmtActionToken").textContent = `${token.name} (${token.symbol}) · ${token.balance} ${token.symbol}`;
    $("vmtActionOwner").textContent = token.owner_address;
    $("vmtActionRecipientWrap").classList.toggle("hidden", operation !== "transfer");
    $("vmtActionAmount").value = "";
    $("vmtActionRecipient").value = "";
    $("vmtActionResult").innerHTML = "";
    $("vmtActionPrepare").textContent = t('vmt_review_sign');
  }

  async function onAssetAction(event) {
    const i = Number(event.currentTarget.dataset.vmtIndex);
    const token = state.data?.holdings?.[i];
    if (!token) return;
    const action = event.currentTarget.dataset.vmtAction;
    if (action === "receive") {
      unwrap(await api.copy(token.owner_address));
      toast(t('vmt_receive_address_copied') + ': ' + token.owner_address);
      return;
    }
    if (action === "detail") {
      await showTokenDetail(token.token_id);
      return;
    }
    openAction(token, action);
  }

  async function prepareAction() {
    const selected = state.selected;
    if (!selected) return;
    const request = {
      operation: selected.operation.toUpperCase(),
      authorizer: selected.token.owner_address,
      tokenId: selected.token.token_id,
      amount: $("vmtActionAmount").value,
      recipient: $("vmtActionRecipient").value.trim(),
      feeTarget: Number($("vmtActionFeeTarget").value || 6)
    };
    $("vmtActionPrepare").disabled = true;
    try {
      const result = unwrap(await api.vmtPrepare(wallet(), request));
      state.candidate = result;
      const pf = result.preflight;
      $("vmtActionResult").innerHTML = `
        <div class="vmt-review">
          <div><span>VMT</span><b class="ok">PASS · ${esc(pf.operation?.operation)}</b></div>
          <div><span>${t('authorizer')}</span><code>${esc(pf.authorizer)}</code></div>
          <div><span>${t('amount')}</span><b>${esc(pf.operation?.amount || "—")} ${esc(pf.operation?.symbol || selected.token.symbol)}</b></div>
          <div><span>${t('network_fee')}</span><b>${esc(pf.network_fee?.vmesh)} VMESH</b></div>
          <div><span>Mempool</span><b class="ok">PASS</b></div>
          <div><span>TXID</span><code>${esc(pf.txid)}</code></div>
        </div>
        <button class="btn primary wide" id="vmtBroadcastBtn">${t('vmt_broadcast_after_preflight')}</button>
        <p class="muted small">${t('vmt_nothing_broadcast')}</p>
      `;
      $("vmtBroadcastBtn").onclick = broadcastCandidate;
    } catch (err) {
      $("vmtActionResult").innerHTML = `<div class="warning-box">${esc(err.message)}</div>`;
    } finally {
      $("vmtActionPrepare").disabled = false;
    }
  }

  async function broadcastCandidate() {
    const id = state.candidate?.candidate_id;
    if (!id) return;
    if (!confirm(t('vmt_broadcast_confirm'))) return;
    const btn = $("vmtBroadcastBtn");
    btn.disabled = true;
    try {
      const result = unwrap(await api.vmtBroadcast(wallet(), id));
      state.candidate = null;
      $("vmtActionResult").innerHTML = `<div class="vmt-success"><b>${t('vmt_broadcast_success')}</b><code>${esc(result.txid)}</code></div>`;
      toast(t('vmt_transaction_broadcast'));
      setTimeout(refresh, 4000);
    } catch (err) {
      toast(err.message, true);
      btn.disabled = false;
    }
  }

  async function prepareCreate() {
    const request = {
      operation: "CREATE",
      authorizer: $("vmtCreateAuthorizer").value,
      name: $("vmtCreateName").value.trim(),
      symbol: $("vmtCreateSymbol").value.trim().toUpperCase(),
      decimals: Number($("vmtCreateDecimals").value),
      mintable: $("vmtCreateMintable").checked,
      initialSupply: $("vmtCreateInitial").value,
      maxSupply: $("vmtCreateMax").value,
      feeTarget: Number($("vmtCreateFeeTarget").value || 6)
    };
    if (!request.mintable) request.maxSupply = request.initialSupply;
    $("vmtCreateBtn").disabled = true;
    try {
      const result = unwrap(await api.vmtPrepare(wallet(), request));
      state.candidate = result;
      const pf = result.preflight;
      const createFee = pf.create_fee;
      $("vmtCreateResult").innerHTML = `
        <div class="vmt-review">
          <div><span>VMT</span><b class="ok">PASS · CREATE</b></div>
          <div><span>${t("token")}</span><b>${esc(pf.operation?.name)} (${esc(pf.operation?.symbol)})</b></div>
          <div><span>${t('vmt_initial_supply')}</span><b>${esc(pf.operation?.initial)}</b></div>
          <div><span>${t('maximum')}</span><b>${esc(pf.operation?.maximum)}</b></div>
          <div><span>CREATE Fee</span><b>${createFee?.required ? esc(createFee.paid_vmesh) + " VMESH" : t('vmt_not_required')}</b></div>
          <div><span>${t('network_fee')}</span><b>${esc(pf.network_fee?.vmesh)} VMESH</b></div>
          <div><span>TXID / Token ID</span><code>${esc(pf.txid)}</code></div>
        </div>
        <button class="btn primary wide" id="vmtCreateBroadcastBtn">${t('vmt_create_broadcast')}</button>
        <p class="warning-box">${t('vmt_create_fee_warning')}</p>
      `;
      $("vmtCreateBroadcastBtn").onclick = broadcastCandidate;
    } catch (err) {
      $("vmtCreateResult").innerHTML = `<div class="warning-box">${esc(err.message)}</div>`;
    } finally {
      $("vmtCreateBtn").disabled = false;
    }
  }

  async function directorySearch() {
    const q = $("vmtDirectoryQuery").value.trim();
    $("vmtDirectorySearchBtn").disabled = true;
    try {
      const result = unwrap(await api.vmtDirectory(q));
      const host = $("vmtDirectoryResults");
      host.innerHTML = (result.items || []).map(t => `
        <button class="vmt-directory-row" data-token-id="${esc(t.token_id)}">
          <span><b>${esc(t.name)}</b><small>${esc(t.symbol)} · ${esc(String(t.metadata?.status || "none").toUpperCase())}</small></span>
          <span><b>${esc(t.supply?.current || "—")}</b><small>${esc(t.holders)} ${t('holders')}</small></span>
        </button>
      `).join("") || `<div class="empty-state">${t('vmt_no_tokens_found')}</div>`;
      host.querySelectorAll("[data-token-id]").forEach(x => x.onclick = () => showTokenDetail(x.dataset.tokenId));
    } catch (err) {
      toast(err.message, true);
    } finally {
      $("vmtDirectorySearchBtn").disabled = false;
    }
  }

  async function showTokenDetail(tokenId) {
    try {
      const t = unwrap(await api.vmtTokenDetail(tokenId));
      const logoSrc = t.metadata?.logo_url ? await logo(tokenId) : "";
      $("vmtDetail").innerHTML = `
        <div class="vmt-detail-head">
          <div class="vmt-token-logo large">${logoSrc ? `<img src="${esc(logoSrc)}" alt="">` : esc((t.symbol || "VMT").slice(0,4))}</div>
          <div><h3>${esc(t.name)} <span class="muted">${esc(t.symbol)}</span></h3><code>${esc(t.token_id)}</code></div>
        </div>
        <div class="vmt-detail-grid">
          <div><span>${t('issuer')}</span><code>${esc(t.issuer?.address)}</code></div>
          <div><span>${t('current_supply')}</span><b>${esc(t.supply?.current)}</b></div>
          <div><span>${t("maximum")}</span><b>${esc(t.supply?.maximum)}</b></div>
          <div><span>${t("vmt_mintable")}</span><b>${t.mintable ? t("yes") : t("no")}</b></div>
          <div><span>${t("holders")}</span><b>${esc(t.holders)}</b></div>
          <div><span>${t("transfers")}</span><b>${esc(t.transfers)}</b></div>
          <div><span>${t("metadata")}</span><b>${esc(String(t.metadata?.status || "none").toUpperCase())}</b></div>
          <div><span>${t("genesis")}</span><b>#${esc(t.genesis?.height)}</b></div>
        </div>
        ${t.metadata?.description ? `<p>${esc(t.metadata.description)}</p>` : ""}
        ${t.metadata?.website ? `<p class="mono">${esc(t.metadata.website)}</p>` : ""}
      `;
    } catch (err) {
      toast(err.message, true);
    }
  }

  function bind() {
    $("vmtRefresh").onclick = refresh;
    $("vmtActionPrepare").onclick = prepareAction;
    $("vmtActionClose").onclick = () => $("vmtActionPanel").classList.add("hidden");
    $("vmtCreateBtn").onclick = prepareCreate;
    $("vmtDirectorySearchBtn").onclick = directorySearch;
    $("vmtDirectoryQuery").addEventListener("keydown", e => { if (e.key === "Enter") directorySearch(); });
    document.querySelector('.nav-item[data-view="vmt"]')?.addEventListener("click", refresh);
    $("walletSelect")?.addEventListener("change", () => setTimeout(refresh, 150));
    window.addEventListener("vmesh-language-changed", () => {
      if ($("vmtPolicy")) $("vmtPolicy").innerHTML = policyHtml();
      renderAddresses();
      void renderAssets();
      renderActivity();
      if (state.selected) openAction(state.selected.token, state.selected.operation);
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    if (!$("view-vmt")) return;
    bind();
  });
})();
