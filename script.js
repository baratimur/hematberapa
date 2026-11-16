let lang = document.documentElement.lang === 'en' ? 'en' : 'id';

const dict = {
    id: {
        title: "Kalkulator Perbandingan Harga dan Promo Belanja",
        subtitle: "Bandingkan harga produk dengan ukuran kemasan berbeda, hitung harga per gram atau mililiter, dan cari tahu promo mana yang paling hemat. Gratis, mudah digunakan, dan tanpa perlu registrasi.",
        itemName: (n) => `Barang ${n}`,
        winBadge: "🏆 HEMAT",
        removeTitle: "Hapus barang",
        priceLabel: "Harga",
        modeUnit: "Satuan",
        modeTotal: "Total",
        pricePhUnit: "10.000",
        pricePhTotal: "25.000",
        qtyLabel: "Isi (ml/gr)",
        qtyPh: "200",
        copySize: "📋 = Brg 1",
        addPromo: "🏷️ Tambah Promo / Beli Banyak",
        promoHeader: "Atur Promo / Grosir",
        closePromo: "✕ Tutup",
        presetLabel: "Pilih cepat:",
        presets: {
            b1g1: "Beli 1 Gratis 1",
            b2g1: "Beli 2 Gratis 1",
            b3: "Beli 3",
            b12: "Beli 12"
        },
        buyLabel: "Beli (Pcs)",
        freeLabel: "Gratis (Pcs)",
        receiptEmpty: (b, f, tot) => `🧾 Beli <strong>${b}</strong>${f > 0 ? ` + Gratis <strong>${f}</strong>` : ''} = <strong>${tot} pcs</strong>. Isi harga di atas.`,
        receiptFull: (pay, tot, perPack) => `🧾 Bayar <strong>Rp ${pay}</strong> dapat <strong>${tot} pcs</strong> (@ Rp ${perPack}/pcs)`,
        addBtn: (n) => `➕ Barang Ke-${n}`,
        resetBtn: "🔄 Reset",
        emptyHint: "Isi harga & ukuran minimal 2 barang untuk membandingkan otomatis.",
        winHeadline: (name) => `🏆 Paling Hemat: ${name}`,
        tieHeadline: "⚖️ Keduanya Sama Murahnya",
        tieDetail: (unit) => `Harga per satuannya sama persis yaitu <strong>Rp ${unit}</strong>.`,
        saveBadge: (amt, pct) => `Hemat Rp ${amt} (${pct}%)`,
        saveDetail: (winner, runner, unitWin, unitLose) => `<strong>${winner}</strong> lebih hemat dibanding <strong>${runner}</strong> untuk isi yang setara.<br>(Rp ${unitWin}/satuan vs Rp ${unitLose}/satuan)`,
        budgetWarn: (winName, winPay, lowName, lowPay) => `<strong>💡 Pertimbangan Anggaran:</strong> ${winName} paling hemat per isinya, tapi bayar kasir <strong>Rp ${winPay}</strong>. Jika anggaran terbatas, ${lowName} cukup bayar <strong>Rp ${lowPay}</strong>.`
    },
    en: {
        title: "Price & Grocery Promo Comparison Calculator",
        subtitle: "Compare products across different package sizes, calculate price per gram or milliliter, and find the best shopping deal. Free, easy to use, and no sign-up required.",
        itemName: (n) => `Item ${n}`,
        winBadge: "🏆 BEST",
        removeTitle: "Remove item",
        priceLabel: "Price",
        modeUnit: "Unit",
        modeTotal: "Total",
        pricePhUnit: "10,000",
        pricePhTotal: "25,000",
        qtyLabel: "Size (ml/gr)",
        qtyPh: "200",
        copySize: "📋 = Item 1",
        addPromo: "🏷️ Add Promo / Multi-Buy",
        promoHeader: "Promo / Bulk Settings",
        closePromo: "✕ Close",
        presetLabel: "Quick presets:",
        presets: {
            b1g1: "Buy 1 Get 1",
            b2g1: "Buy 2 Get 1",
            b3: "Buy 3",
            b12: "Buy 12"
        },
        buyLabel: "Buy (Pcs)",
        freeLabel: "Free (Pcs)",
        receiptEmpty: (b, f, tot) => `🧾 Buy <strong>${b}</strong>${f > 0 ? ` + <strong>${f}</strong> Free` : ''} = <strong>${tot} pcs</strong>. Enter price above.`,
        receiptFull: (pay, tot, perPack) => `🧾 Pay <strong>$${pay}</strong> for <strong>${tot} pcs</strong> (@ $${perPack}/pcs)`,
        addBtn: (n) => `➕ Item #${n}`,
        resetBtn: "🔄 Reset",
        emptyHint: "Enter price & size for at least 2 items to compare automatically.",
        winHeadline: (name) => `🏆 Best Value: ${name}`,
        tieHeadline: "⚖️ Exact Same Value",
        tieDetail: (unit) => `Both cost the exact same at <strong>$${unit}</strong> per unit.`,
        saveBadge: (amt, pct) => `Save $${amt} (${pct}%)`,
        saveDetail: (winner, runner, unitWin, unitLose) => `<strong>${winner}</strong> gives better value than <strong>${runner}</strong> for an equivalent amount.<br>($${unitWin}/unit vs $${unitLose}/unit)`,
        budgetWarn: (winName, winPay, lowName, lowPay) => `<strong>💡 Budget Note:</strong> ${winName} has the lowest unit cost, but requires <strong>$${winPay}</strong> at checkout. For lower upfront spend, ${lowName} is only <strong>$${lowPay}</strong>.`
    }
};

let items = [
    { id: 1, price: '', priceMode: 'unit', qty: '', hasPromo: false, buyQty: 2, freeQty: '' },
    { id: 2, price: '', priceMode: 'unit', qty: '', hasPromo: false, buyQty: 2, freeQty: '' }
];

window.setLang = function(newLang) {
    lang = newLang;
    document.documentElement.lang = newLang;
    document.getElementById('btnId').classList.toggle('active', lang === 'id');
    document.getElementById('btnEn').classList.toggle('active', lang === 'en');
    document.getElementById('txtTitle').innerText = dict[lang].title;
    document.getElementById('txtSubtitle').innerText = dict[lang].subtitle;
    document.getElementById('btnReset').innerText = dict[lang].resetBtn;
    updateAddButton();
    renderItems();
    calculate();
};

function formatInt(num) {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '';
    return Math.round(num).toLocaleString(lang === 'id' ? 'id-ID' : 'en-US');
}

function formatDec(num, maxDec = 2) {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '';
    return num.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: maxDec });
}

window.setPriceMode = function(id, mode) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.priceMode = mode;
    renderItems();
    calculate();
};

window.togglePromo = function(id, state) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.hasPromo = state;
    if (state) {
        if (!item.buyQty || item.buyQty < 1) item.buyQty = 2;
        if (item.freeQty === 0 || item.freeQty === '0') item.freeQty = '';
    } else {
        item.priceMode = 'unit';
        item.buyQty = 2;
        item.freeQty = '';
    }
    renderItems();
    calculate();
};

window.applyPreset = function(id, presetKey) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.priceMode = 'unit';
    if (presetKey === 'b1g1') { item.buyQty = 1; item.freeQty = 1; }
    else if (presetKey === 'b2g1') { item.buyQty = 2; item.freeQty = 1; }
    else if (presetKey === 'b3') { item.buyQty = 3; item.freeQty = ''; }
    else if (presetKey === 'b12') { item.buyQty = 12; item.freeQty = ''; }
    renderItems();
    calculate();
};

function getActivePreset(item) {
    const b = parseInt(item.buyQty, 10) || 0;
    const f = parseInt(item.freeQty, 10) || 0;
    if (b === 1 && f === 1) return 'b1g1';
    if (b === 2 && f === 1) return 'b2g1';
    if (b === 3 && f === 0) return 'b3';
    if (b === 12 && f === 0) return 'b12';
    return '';
}

window.copySizeFromFirst = function(id) {
    const firstQty = items[0] ? items[0].qty : '';
    const item = items.find(i => i.id === id);
    if (!item || !firstQty) return;
    item.qty = firstQty;
    renderItems();
    calculate();
};

window.handlePriceInput = function(id, el) {
    const raw = el.value.replace(/\D/g, '');
    const item = items.find(i => i.id === id);
    item.price = raw;
    el.value = raw ? formatInt(parseInt(raw, 10)) : '';
    updateMiniReceipt(item);
    calculate();
};

window.handleQtyInput = function(id, el) {
    let val = el.value.replace(/[^0-9.,]/g, '').replace(',', '.');
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
    const item = items.find(i => i.id === id);
    item.qty = val;
    el.value = val;
    if (id === items[0].id) updateCopyButtonsVisibility();
    calculate();
};

window.handlePromoCountInput = function(id, field, el) {
    let raw = el.value.replace(/\D/g, '');
    if (raw !== '') {
        const num = parseInt(raw, 10);
        raw = num > 0 ? String(num) : '';
    }
    const item = items.find(i => i.id === id);
    item[field] = raw;
    el.value = raw;
    updatePresetHighlights(item);
    updateMiniReceipt(item);
    calculate();
};

function updatePresetHighlights(item) {
    const activePreset = getActivePreset(item);
    const card = document.getElementById(`card-${item.id}`);
    if (!card) return;
    card.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === activePreset);
    });
}

function getReceiptHTML(item) {
    const l = dict[lang];
    const p = parseFloat(item.price) || 0;
    const b = Math.max(1, parseInt(item.buyQty, 10) || 1);
    const f = Math.max(0, parseInt(item.freeQty, 10) || 0);
    const totalPcs = b + f;

    if (p <= 0) return l.receiptEmpty(b, f, totalPcs);

    const totalPay = item.priceMode === 'total' ? p : p * b;
    const perPack = totalPay / totalPcs;
    return l.receiptFull(formatInt(totalPay), totalPcs, formatDec(perPack, 0));
}

function updateMiniReceipt(item) {
    const el = document.getElementById(`receipt-${item.id}`);
    if (el) el.innerHTML = getReceiptHTML(item);
}

function updateCopyButtonsVisibility() {
    const firstQty = parseFloat(items[0]?.qty) || 0;
    items.forEach((item, idx) => {
        if (idx === 0) return;
        const btn = document.getElementById(`copy-btn-${item.id}`);
        if (btn) {
            const show = firstQty > 0 && item.qty !== items[0].qty;
            btn.style.display = show ? 'inline-block' : 'none';
        }
    });
}

window.addItem = function() {
    if (items.length >= 4) return;
    items.push({ id: Date.now(), price: '', priceMode: 'unit', qty: '', hasPromo: false, buyQty: 2, freeQty: '' });
    updateAddButton();
    renderItems();
    calculate();
};

window.removeItem = function(id) {
    if (items.length <= 2) return;
    items = items.filter(i => i.id !== id);
    updateAddButton();
    renderItems();
    calculate();
};

function updateAddButton() {
    const btn = document.getElementById('btnAdd');
    if (!btn) return;
    if (items.length >= 4) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'block';
        btn.innerText = dict[lang].addBtn(items.length + 1);
    }
}

window.resetAll = function() {
    items = [
        { id: 1, price: '', priceMode: 'unit', qty: '', hasPromo: false, buyQty: 2, freeQty: '' },
        { id: 2, price: '', priceMode: 'unit', qty: '', hasPromo: false, buyQty: 2, freeQty: '' }
    ];
    updateAddButton();
    renderItems();
    calculate();
};

function renderItems() {
    const container = document.getElementById('itemsContainer');
    if (!container) return;
    const l = dict[lang];
    const curr = lang === 'id' ? 'Rp' : '$';
    const firstQtyVal = parseFloat(items[0]?.qty) || 0;

    container.innerHTML = items.map((item, idx) => {
        const activePreset = getActivePreset(item);
        const showCopyBtn = idx > 0 && firstQtyVal > 0 && item.qty !== items[0].qty;
        const pricePlaceholder = item.priceMode === 'total' ? l.pricePhTotal : l.pricePhUnit;
        const formattedPrice = item.price ? formatInt(parseInt(item.price, 10)) : '';
        const freeDisplayVal = (item.freeQty === 0 || item.freeQty === '0' || !item.freeQty) ? '' : item.freeQty;

        return `
            <div class="item-card" id="card-${item.id}">
                <div class="card-header">
                    <div class="card-title-group">
                        <span class="card-title">${l.itemName(idx + 1)}</span>
                        <span class="win-badge">${l.winBadge}</span>
                    </div>
                    <div class="card-header-right">
                        <div class="mode-toggle">
                            <button type="button" class="mode-btn ${item.priceMode === 'unit' ? 'active' : ''}" onclick="setPriceMode(${item.id}, 'unit')">${l.modeUnit}</button>
                            <button type="button" class="mode-btn ${item.priceMode === 'total' ? 'active' : ''}" onclick="setPriceMode(${item.id}, 'total')">${l.modeTotal}</button>
                        </div>
                        ${idx >= 2 ? `<button type="button" class="remove-btn" onclick="removeItem(${item.id})" title="${l.removeTitle}" aria-label="${l.removeTitle}">✕</button>` : ''}
                    </div>
                </div>

                <div class="fields-row">
                    <div class="field">
                        <div class="label-row">
                            <label for="price-${item.id}">${l.priceLabel}</label>
                        </div>
                        <div class="input-wrap">
                            <span class="prefix">${curr}</span>
                            <input type="text" id="price-${item.id}" class="has-prefix" inputmode="numeric"
                                   placeholder="${pricePlaceholder}" value="${formattedPrice}"
                                   oninput="handlePriceInput(${item.id}, this)">
                        </div>
                    </div>

                    <div class="field">
                        <div class="label-row">
                            <label for="qty-${item.id}">${l.qtyLabel}</label>
                            <button type="button" id="copy-btn-${item.id}" class="copy-size-btn"
                                    style="display: ${showCopyBtn ? 'inline-block' : 'none'};"
                                    onclick="copySizeFromFirst(${item.id})">${l.copySize}</button>
                        </div>
                        <input type="text" id="qty-${item.id}" inputmode="decimal"
                               placeholder="${l.qtyPh}" value="${item.qty}"
                               oninput="handleQtyInput(${item.id}, this)">
                    </div>
                </div>

                ${!item.hasPromo ? `
                    <button type="button" class="promo-trigger" onclick="togglePromo(${item.id}, true)">${l.addPromo}</button>
                ` : `
                    <div class="promo-drawer">
                        <div class="promo-header">
                            <span class="promo-title">${l.promoHeader}</span>
                            <button type="button" class="close-promo-btn" onclick="togglePromo(${item.id}, false)">${l.closePromo}</button>
                        </div>

                        <span class="preset-label">${l.presetLabel}</span>
                        <div class="preset-grid">
                            <button type="button" data-preset="b1g1" class="preset-btn ${activePreset === 'b1g1' ? 'active' : ''}" onclick="applyPreset(${item.id}, 'b1g1')">${l.presets.b1g1}</button>
                            <button type="button" data-preset="b2g1" class="preset-btn ${activePreset === 'b2g1' ? 'active' : ''}" onclick="applyPreset(${item.id}, 'b2g1')">${l.presets.b2g1}</button>
                            <button type="button" data-preset="b3" class="preset-btn ${activePreset === 'b3' ? 'active' : ''}" onclick="applyPreset(${item.id}, 'b3')">${l.presets.b3}</button>
                            <button type="button" data-preset="b12" class="preset-btn ${activePreset === 'b12' ? 'active' : ''}" onclick="applyPreset(${item.id}, 'b12')">${l.presets.b12}</button>
                        </div>

                        <div class="promo-inputs-row">
                            <div>
                                <label for="buy-${item.id}">${l.buyLabel}</label>
                                <input type="text" id="buy-${item.id}" inputmode="numeric" placeholder="1" value="${item.buyQty}"
                                       onfocus="setTimeout(() => this.select(), 0)"
                                       oninput="handlePromoCountInput(${item.id}, 'buyQty', this)">
                            </div>
                            <div>
                                <label for="free-${item.id}">${l.freeLabel}</label>
                                <input type="text" id="free-${item.id}" inputmode="numeric" placeholder="0" value="${freeDisplayVal}"
                                       onfocus="setTimeout(() => this.select(), 0)"
                                       oninput="handlePromoCountInput(${item.id}, 'freeQty', this)">
                            </div>
                        </div>

                        <div class="mini-receipt" id="receipt-${item.id}">${getReceiptHTML(item)}</div>
                    </div>
                `}
            </div>
        `;
    }).join('');
}

function calculate() {
    const panel = document.getElementById('resultPanel');
    if (!panel) return;
    const l = dict[lang];

    items.forEach(i => {
        const card = document.getElementById(`card-${i.id}`);
        if (card) card.classList.remove('winner');
    });
    panel.classList.remove('has-winner');

    const validItems = items.map((item, idx) => {
        const p = parseFloat(item.price);
        const q = parseFloat(item.qty);
        if (!p || p <= 0 || !q || q <= 0) return null;

        const b = item.hasPromo ? Math.max(1, parseInt(item.buyQty, 10) || 1) : 1;
        const f = item.hasPromo ? Math.max(0, parseInt(item.freeQty, 10) || 0) : 0;
        const totalPcs = b + f;
        const totalPay = item.priceMode === 'total' ? p : p * b;
        const totalSize = q * totalPcs;
        const unitPrice = totalPay / totalSize;

        return { id: item.id, name: l.itemName(idx + 1), unitPrice, totalPay, totalSize };
    }).filter(Boolean);

    if (validItems.length < 2) {
        panel.innerHTML = `<p class="empty-hint" id="emptyHint">${l.emptyHint}</p>`;
        return;
    }

    validItems.sort((a, b) => a.unitPrice - b.unitPrice);
    const winner = validItems[0];
    const runnerUp = validItems[1];

    if (Math.abs(winner.unitPrice - runnerUp.unitPrice) < 0.0001) {
        panel.innerHTML = `
            <div class="res-headline" style="color: var(--text);">${l.tieHeadline}</div>
            <p class="res-detail">${l.tieDetail(formatDec(winner.unitPrice, 2))}</p>
        `;
        return;
    }

    const winCard = document.getElementById(`card-${winner.id}`);
    if (winCard) winCard.classList.add('winner');
    panel.classList.add('has-winner');

    const equivalentCost = winner.totalSize * runnerUp.unitPrice;
    const savedAmount = equivalentCost - winner.totalPay;
    const savedPct = Math.round((savedAmount / equivalentCost) * 100);

    const lowestOutlayItem = [...validItems].sort((a, b) => a.totalPay - b.totalPay)[0];
    let budgetHTML = '';
    if (winner.totalPay > lowestOutlayItem.totalPay) {
        budgetHTML = `<div class="budget-warn">${l.budgetWarn(winner.name, formatInt(winner.totalPay), lowestOutlayItem.name, formatInt(lowestOutlayItem.totalPay))}</div>`;
    }

    panel.innerHTML = `
        <div class="res-headline">${l.winHeadline(winner.name)}</div>
        <div class="savings-box"><span class="savings-pill">${l.saveBadge(formatInt(savedAmount), savedPct)}</span></div>
        <p class="res-detail">${l.saveDetail(winner.name, runnerUp.name, formatDec(winner.unitPrice, 2), formatDec(runnerUp.unitPrice, 2))}</p>
        ${budgetHTML}
    `;
}

renderItems();
calculate();

const currentScriptSrc = document.currentScript ? document.currentScript.src : '';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swUrl = currentScriptSrc ? new URL('sw.js', currentScriptSrc).href : './sw.js';
        navigator.serviceWorker.register(swUrl).catch(() => {});
    });
}