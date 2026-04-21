/**
 * ============================================================================
 * ABD LUXURY SYSTEM | FINANCE MODULE (REINFORCED)
 * ============================================================================
 * PROTECTION STATUS: ACTIVE (STRICT ISOLATION)
 * VERSION: 2.0.0
 * DESCRIPTION: Self-contained module for Revenue and Capital management.
 * ============================================================================
 */

import * as Data from './data.js';

/**
 * INITIALIZATION: This runs when the Sales page is opened.
 */
export function initSales() {
    updateSalesUI();

    // Secure Event Binding
    const authBtn = document.getElementById('btn-add-sale');
    if (authBtn) {
        authBtn.onclick = () => {
            const shop = document.getElementById('sale-shop').value;
            const product = document.getElementById('sale-product').value;
            const price = parseFloat(document.getElementById('sale-price').value) || 0;

            if (!product || price <= 0) {
                alert("Executive Error: Invalid Asset Data");
                return;
            }

            const success = Data.db.addSale({
                shop,
                product,
                amount: price,
                profit: price * 0.15
            });

            if (success) {
                updateSalesUI();
                document.getElementById('sale-product').value = '';
                document.getElementById('sale-price').value = '';
            }
        };
    }
}

export function initLoans() {
    const addLoanBtn = document.getElementById('btn-add-loan');
    if (addLoanBtn) {
        addLoanBtn.onclick = () => {
            const entity = document.getElementById('loan-entity').value;
            const type = document.getElementById('loan-type').value;
            const amount = parseFloat(document.getElementById('loan-amount').value) || 0;

            if (!entity || amount <= 0) {
                alert("Invalid Loan Data");
                return;
            }

            Data.db.addLoan({ entity, type, amount, status: 'Active' });
            updateLoansUI();
            document.getElementById('loan-entity').value = '';
            document.getElementById('loan-amount').value = '';
        };
    }
    updateLoansUI();
}

function updateLoansUI() {
    const list = document.getElementById('loans-list');
    if (!list) return;

    list.innerHTML = (Data.loansData || []).map(loan => `
        <div class="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all">
            <div>
                <h4 class="text-[10px] font-bold text-white uppercase">${loan.entity}</h4>
                <p class="text-[7px] text-slate-500 uppercase tracking-widest mt-0.5">${loan.type}</p>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-right">
                    <p class="text-[10px] font-black ${loan.type === 'Receivable' ? 'text-emerald-400' : 'text-red-400'}">${parseFloat(loan.amount).toLocaleString()}</p>
                    <span class="text-[6px] font-black uppercase px-2 py-0.5 rounded-full ${loan.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}">${loan.status}</span>
                </div>
                <button onclick="window.app.deleteLoan('${loan.id}')" class="text-slate-600 hover:text-red-500 transition-colors">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();

    // Update Totals
    const rec = (Data.loansData || []).filter(l => l.type === 'Receivable').reduce((s, l) => s + parseFloat(l.amount), 0);
    const pay = (Data.loansData || []).filter(l => l.type === 'Payable').reduce((s, l) => s + parseFloat(l.amount), 0);

    const recEl = document.getElementById('total-receivable');
    const payEl = document.getElementById('total-payable');
    const netEl = document.getElementById('total-net');

    if (recEl) recEl.innerText = rec.toLocaleString();
    if (payEl) payEl.innerText = pay.toLocaleString();
    if (netEl) netEl.innerText = (rec - pay).toLocaleString();
}

/**
 * INTERNAL UI UPDATE: Only accessible within this module
 */
function updateSalesUI() {
    const tableBody = document.getElementById('sales-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = (Data.salesRecords || []).map(r => `
        <tr class="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
            <td class="p-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">#${r.id}</td>
            <td class="p-3">
                <h4 class="text-[10px] font-bold text-white uppercase">${r.product}</h4>
                <p class="text-[7px] text-slate-500 uppercase">${r.shop}</p>
            </td>
            <td class="p-3 text-right">
                <p class="text-[10px] font-black text-white">${r.amount.toLocaleString()}</p>
                <span class="text-[7px] font-black text-emerald-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">+${r.profit.toLocaleString()}</span>
            </td>
        </tr>
    `).join('');
}

/**
 * PAGE RENDERING: Returns the structural HTML
 */
export function getSalesPage() {
    return `
        <div class="h-full flex flex-col gap-4 overflow-hidden">
            <div class="flex items-center gap-2 mb-2 px-1">
                <button onclick="window.app.goBack()" class="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i> BACK
                </button>
            </div>
            <div class="shrink-0 luxury-card p-4 space-y-4 border-[#D4AF37]/10 bg-[#D4AF37]/[0.02]">
                <h3 class="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] border-b border-white/5 pb-2 flex items-center gap-2">
                    <i data-lucide="shield-check" class="w-3 h-3"></i> Secure Transaction Terminal
                </h3>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Location Hub</label>
                        <select id="sale-shop" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#D4AF37]/50 outline-none">
                            ${Data.shopsData.map(s => `<option>${s.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Asset Identity</label>
                        <input type="text" id="sale-product" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#D4AF37]/50 outline-none" placeholder="Enter product name">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Market Value</label>
                        <input type="number" id="sale-price" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#D4AF37]/50 outline-none" placeholder="0.00">
                    </div>
                    <div class="flex items-end">
                        <button id="btn-add-sale" class="w-full h-[34px] bg-gradient-to-r from-[#D4AF37] to-[#8A6D3B] text-black font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg active:scale-95 transition-all">
                            Authorize & Log
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div class="luxury-card border-none bg-white/[0.02]">
                    <table class="w-full text-left">
                        <thead class="sticky top-0 bg-[#0A0A0A] z-10">
                            <tr class="border-b border-white/10">
                                <th class="p-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">Trace ID</th>
                                <th class="p-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">Asset Details</th>
                                <th class="p-3 text-[8px] font-black text-slate-500 uppercase tracking-widest text-right">Yield Status</th>
                            </tr>
                        </thead>
                        <tbody id="sales-table-body" class="divide-y divide-white/5"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

export function getLoansPage() {
    return `
        <div class="h-full flex flex-col gap-4 overflow-hidden">
            <div class="flex items-center gap-2 mb-2 px-1">
                <button onclick="window.app.goBack()" class="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i> BACK
                </button>
            </div>

            <div class="shrink-0 luxury-card p-4 space-y-4 border-[#D4AF37]/10 bg-[#D4AF37]/[0.02]">
                <h3 class="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] border-b border-white/5 pb-2">Record Credit Line</h3>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Entity Name</label>
                        <input type="text" id="loan-entity" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#D4AF37]/50 outline-none" placeholder="Target Entity">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Portfolio Type</label>
                        <select id="loan-type" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#D4AF37]/50 outline-none">
                            <option value="Receivable">Receivable (In)</option>
                            <option value="Payable">Payable (Out)</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Capital Amount</label>
                        <input type="number" id="loan-amount" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#D4AF37]/50 outline-none" placeholder="0.00">
                    </div>
                    <div class="flex items-end">
                        <button id="btn-add-loan" class="w-full h-[34px] bg-gradient-to-r from-[#D4AF37] to-[#8A6D3B] text-black font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg active:scale-95 transition-all">
                            Register Portfolio
                        </button>
                    </div>
                </div>
            </div>

            <div class="shrink-0 grid grid-cols-3 gap-3">
                <div class="luxury-card p-4 bg-emerald-500/5 border-emerald-500/10">
                    <p class="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Receivable</p>
                    <h3 id="total-receivable" class="text-lg font-bold text-white mt-1">0</h3>
                </div>
                <div class="luxury-card p-4 bg-red-500/5 border-red-500/10">
                    <p class="text-[7px] font-black text-red-500 uppercase tracking-widest">Liabilities</p>
                    <h3 id="total-payable" class="text-lg font-bold text-white mt-1">0</h3>
                </div>
                <div class="luxury-card p-4 bg-blue-500/5 border-white/10">
                    <p class="text-[7px] font-black text-slate-400 uppercase tracking-widest">Net Position</p>
                    <h3 id="total-net" class="text-lg font-bold text-white mt-1">0</h3>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div class="luxury-card p-4 bg-white/[0.01]">
                    <div class="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                        <h3 class="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Active Credit Portfolio</h3>
                        <i data-lucide="trending-up" class="w-3 h-3 text-emerald-500"></i>
                    </div>
                    <div id="loans-list" class="space-y-3"></div>
                </div>
            </div>
        </div>
    `;
}
