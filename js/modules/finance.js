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
            const mode = document.getElementById('finance-mode').value; // 'sale' or 'expense'
            const shop = document.getElementById('sale-shop').value;
            const product = document.getElementById('sale-product').value;
            const price = parseFloat(document.getElementById('sale-price').value) || 0;
            const image = document.getElementById('finance-proof-preview').src;

            if (!product || price <= 0) {
                alert("Executive Error: Invalid Data");
                return;
            }

            let success;
            if (mode === 'sale') {
                success = Data.db.addSale({
                    shop,
                    product,
                    amount: price,
                    profit: price * 0.15,
                    proof: image.startsWith('data:') ? image : null
                });
            } else {
                success = Data.db.addExpense({
                    shop,
                    description: product,
                    amount: price,
                    proof: image.startsWith('data:') ? image : null
                });
            }

            if (success) {
                updateSalesUI();
                document.getElementById('sale-product').value = '';
                document.getElementById('sale-price').value = '';
                document.getElementById('finance-proof-preview').src = '';
                document.getElementById('finance-proof-wrapper').classList.add('hidden');
            }
        };
    }

    // Image Upload Handling
    const fileInput = document.getElementById('finance-proof-input');
    if (fileInput) {
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('finance-proof-preview');
                    const wrapper = document.getElementById('finance-proof-wrapper');
                    preview.src = event.target.result;
                    wrapper.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
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
            const dueDate = document.getElementById('loan-due-date').value;
            const proof = document.getElementById('loan-proof-preview').src;

            if (!entity || amount <= 0) {
                alert("Invalid Loan Data");
                return;
            }

            Data.db.addLoan({
                entity,
                type,
                amount,
                dueDate,
                status: 'Active',
                proof: proof.startsWith('data:') ? proof : null
            });
            updateLoansUI();

            // Reset
            document.getElementById('loan-entity').value = '';
            document.getElementById('loan-amount').value = '';
            document.getElementById('loan-proof-preview').src = '';
            document.getElementById('loan-proof-wrapper').classList.add('hidden');
        };
    }

    const loanFileInput = document.getElementById('loan-proof-input');
    if (loanFileInput) {
        loanFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('loan-proof-preview');
                    const wrapper = document.getElementById('loan-proof-wrapper');
                    preview.src = event.target.result;
                    wrapper.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        };
    }

    updateLoansUI();
}

function updateLoansUI() {
    const list = document.getElementById('loans-list');
    if (!list) return;

    list.innerHTML = (Data.loansData || []).map(loan => `
        <div class="flex justify-between items-center p-3 bg-white/[0.03] rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all group">
            <div class="flex items-center gap-3">
                ${loan.proof ? `<div class="w-8 h-8 rounded bg-white/5 overflow-hidden border border-white/10" onclick="window.app.viewProof('${loan.proof}')"><img src="${loan.proof}" class="w-full h-full object-cover"></div>` : `<div class="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10"><i data-lucide="file-text" class="w-3.5 h-3.5 text-slate-700"></i></div>`}
                <div>
                    <h4 class="text-[9px] font-bold text-white uppercase tracking-wider">${loan.entity}</h4>
                    <p class="text-[7px] text-slate-500 uppercase tracking-widest mt-0.5">${loan.type} • ${loan.dueDate || 'No Due Date'}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <div class="text-right">
                    <p class="text-[10px] font-black ${loan.type === 'Receivable' ? 'text-emerald-400' : 'text-red-400'}">${parseFloat(loan.amount).toLocaleString()}</p>
                    <span class="text-[6px] font-black uppercase px-1.5 py-0.5 rounded ${loan.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}">${loan.status}</span>
                </div>
                <button onclick="window.app.deleteLoan('${loan.id}')" class="w-6 h-6 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500/50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                    <i data-lucide="trash-2" class="w-3 h-3"></i>
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

    const allRecords = [
        ...Data.salesRecords.map(r => ({ ...r, type: 'SALE' })),
        ...Data.expensesRecords.map(e => ({ ...e, type: 'EXPENSE', product: e.description }))
    ].sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

    tableBody.innerHTML = allRecords.map(r => `
        <tr class="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
            <td class="p-3">
                <div class="flex items-center gap-2">
                    <span class="text-[7px] font-black px-1.5 py-0.5 rounded ${r.type === 'SALE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}">${r.type}</span>
                    <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">#${r.id}</span>
                </div>
            </td>
            <td class="p-3">
                <div class="flex items-center gap-2">
                    ${r.proof ? `<div class="w-6 h-6 rounded bg-white/5 overflow-hidden border border-white/10" onclick="window.app.viewProof('${r.proof}')"><img src="${r.proof}" class="w-full h-full object-cover"></div>` : ''}
                    <div>
                        <h4 class="text-[10px] font-bold text-white uppercase">${r.product}</h4>
                        <p class="text-[7px] text-slate-500 uppercase">${r.shop}</p>
                    </div>
                </div>
            </td>
            <td class="p-3 text-right">
                <p class="text-[10px] font-black text-white">${r.amount.toLocaleString()}</p>
                <span class="text-[7px] font-black ${r.type === 'SALE' ? 'text-emerald-500' : 'text-slate-500'} uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">${r.type === 'SALE' ? '+' + r.profit.toLocaleString() : r.date}</span>
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
                <div class="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 class="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] flex items-center gap-2">
                        <i data-lucide="shield-check" class="w-3 h-3"></i> Secure Transaction Terminal
                    </h3>
                    <select id="finance-mode" class="bg-black/40 border border-[#D4AF37]/20 rounded px-2 py-0.5 text-[8px] font-black text-[#D4AF37] uppercase outline-none">
                        <option value="sale">Record Sale</option>
                        <option value="expense">Record Expense</option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Location Hub</label>
                        <select id="sale-shop" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#D4AF37]/50 outline-none">
                            ${Data.shopsData.map(s => `<option>${s.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Asset Identity / Desc</label>
                        <input type="text" id="sale-product" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#D4AF37]/50 outline-none" placeholder="Enter details">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Market Value</label>
                        <input type="number" id="sale-price" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#D4AF37]/50 outline-none" placeholder="0.00">
                    </div>
                    <div class="flex items-end gap-2">
                        <input type="file" id="finance-proof-input" class="hidden" accept="image/*">
                        <button onclick="document.getElementById('finance-proof-input').click()" class="flex-1 h-[34px] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all">
                            <i data-lucide="camera" class="w-4 h-4"></i>
                        </button>
                        <button id="btn-add-sale" class="flex-[2] h-[34px] bg-gradient-to-r from-[#D4AF37] to-[#8A6D3B] text-black font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg active:scale-95 transition-all">
                            Authorize
                        </button>
                    </div>
                </div>

                <div id="finance-proof-wrapper" class="hidden flex items-center gap-3 p-2 bg-black/40 rounded-lg border border-white/5">
                    <img id="finance-proof-preview" class="w-10 h-10 rounded object-cover border border-[#D4AF37]/30">
                    <p class="text-[7px] font-bold text-emerald-500 uppercase tracking-widest">Image Attached (Securely Cached)</p>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div class="luxury-card border-none bg-white/[0.02]">
                    <table class="w-full text-left">
                        <thead class="sticky top-0 bg-[#0A0A0A] z-10">
                            <tr class="border-b border-white/10">
                                <th class="p-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">Type / ID</th>
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
                            <option value="Receivable">Receivable (Lent)</option>
                            <option value="Payable">Payable (Borrowed)</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Capital Amount</label>
                        <input type="number" id="loan-amount" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#D4AF37]/50 outline-none" placeholder="0.00">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Due Date</label>
                        <input type="date" id="loan-due-date" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#D4AF37]/50 outline-none">
                    </div>
                </div>
                <div class="flex gap-2">
                    <input type="file" id="loan-proof-input" class="hidden" accept="image/*">
                    <button onclick="document.getElementById('loan-proof-input').click()" class="w-12 h-[34px] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all">
                        <i data-lucide="camera" class="w-4 h-4"></i>
                    </button>
                    <button id="btn-add-loan" class="flex-1 h-[34px] bg-gradient-to-r from-[#D4AF37] to-[#8A6D3B] text-black font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg active:scale-95 transition-all">
                        Register Portfolio
                    </button>
                </div>

                <div id="loan-proof-wrapper" class="hidden flex items-center gap-3 p-2 bg-black/40 rounded-lg border border-white/5">
                    <img id="loan-proof-preview" class="w-10 h-10 rounded object-cover border border-[#D4AF37]/30">
                    <p class="text-[7px] font-bold text-emerald-500 uppercase tracking-widest">Cheque/Bill Attached</p>
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
