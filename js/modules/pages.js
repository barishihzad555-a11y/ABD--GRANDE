/**
 * ============================================================================
 * ABD LUXURY SYSTEM | PAGES GENERATOR MODULE (MODERNIZED)
 * ============================================================================
 * STATUS: ACTIVE
 * VERSION: 4.1.0
 * DESCRIPTION: High-performance UI generation with Tactical Vision (Map + Cam).
 * ============================================================================
 */

import * as Data from './data.js';
import { getMapEmbedHTML } from './location.js';

export function getShopDashboardPage(shop) {
    const shopEmployees = Data.employeesData.filter(emp => emp.shop === shop.name);

    return `
        <div class="shop-dashboard-grid">
            <!-- HEADER: Tactical Navigation -->
            <div class="flex justify-between items-center px-4 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <button onclick="window.app.goBack()" class="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] hover:text-[#B8964B] transition-all">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i> Return
                </button>
                <div class="flex items-center gap-2 bg-[#B8964B]/10 px-3 py-1.5 rounded-full border border-[#B8964B]/20">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span class="text-[9px] font-black text-[#B8964B] uppercase tracking-widest">${shop.status}</span>
                </div>
            </div>

            <!-- MAIN CONTENT: Zero-Scroll Executive View -->
            <div class="flex-1 flex flex-col gap-4 overflow-hidden px-3 pt-2">

                <!-- QUADRANT 1: Tactical Vision (Split Map + Camera) -->
                <div class="quadrant-vision h-[180px]">
                    <!-- Mini Map -->
                    <div class="vision-split luxury-card !rounded-2xl border-slate-200 overflow-hidden">
                        <div class="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded border border-slate-200">
                             <i data-lucide="map-pin" class="w-3 h-3 text-[#B8964B]"></i>
                             <span class="text-[7px] font-black text-slate-900 uppercase tracking-widest">Global GPS</span>
                        </div>
                        ${getMapEmbedHTML(shop.lat, shop.lng)}
                    </div>

                    <!-- Live Camera Feed -->
                    <div class="vision-split luxury-card !rounded-2xl border-slate-200 overflow-hidden bg-slate-900" onclick="window.app.openCameraDetail('${shop.name}')">
                        <div class="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded border border-slate-200">
                             <div class="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse mr-1"></div>
                             <span class="text-[7px] font-black text-slate-900 uppercase tracking-widest">Live Feed</span>
                        </div>
                        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600" class="w-full h-full object-cover opacity-60">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <i data-lucide="eye" class="w-8 h-8 text-white/40"></i>
                        </div>
                    </div>
                </div>

                <!-- QUADRANT 2: Financial Pulse -->
                <div class="quadrant-stats grid grid-cols-3 gap-3">
                    <div class="stat-pulse-card luxury-card !p-3 !border-emerald-500/30 bg-emerald-50/50 group active:scale-95 transition-all" onclick="window.app.showShopFinance(${shop.id}, 'sales')">
                        <p class="stat-label text-emerald-600">Revenue</p>
                        <h4 class="stat-value text-slate-900 text-sm">${(parseFloat(shop.dailySales) || 0).toLocaleString()}</h4>
                    </div>
                    <div class="stat-pulse-card luxury-card !p-3 !border-rose-500/30 bg-rose-50/50 group active:scale-95 transition-all" onclick="window.app.showShopFinance(${shop.id}, 'expense')">
                        <p class="stat-label text-rose-600">Expense</p>
                        <h4 class="stat-value text-slate-900 text-sm">${(parseFloat(shop.dailyExpense) || 0).toLocaleString()}</h4>
                    </div>
                    <div class="stat-pulse-card luxury-card !p-3 !border-amber-500/30 bg-amber-50/50 group active:scale-95 transition-all" onclick="window.app.showShopFinance(${shop.id}, 'debt')">
                        <p class="stat-label text-amber-600">Debt</p>
                        <h4 class="stat-value text-slate-900 text-sm">${(parseFloat(shop.debt) || 0).toLocaleString()}</h4>
                    </div>
                </div>

                <!-- QUADRANT 3: Staff Command -->
                <div class="quadrant-staff flex-1 flex flex-col luxury-card border-slate-200 !p-4 overflow-hidden mb-4 bg-white">
                    <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                        <h3 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Assets (${shopEmployees.length})</h3>
                        <button onclick="window.app.showShopEmployees('${shop.name}')" class="text-[8px] font-black text-[#B8964B] uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-200">Manage</button>
                    </div>
                    <div class="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        ${shopEmployees.length > 0 ? shopEmployees.map(emp => `
                            <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl staff-item">
                                <div class="flex items-center gap-3">
                                    <div class="relative">
                                        <img src="${emp.avatar}" class="w-10 h-10 rounded-xl object-cover border border-slate-200">
                                        <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${emp.status === 'Present' ? 'bg-emerald-500' : 'bg-amber-500'}"></div>
                                    </div>
                                    <div>
                                        <h4 class="text-[10px] font-bold text-slate-900 uppercase">${emp.name}</h4>
                                        <p class="text-[7px] text-slate-500 uppercase font-bold tracking-widest">${emp.role}</p>
                                    </div>
                                </div>
                                <span class="text-[8px] font-black uppercase tracking-widest ${emp.status === 'Present' ? 'text-emerald-600' : 'text-amber-600'}">${emp.status}</span>
                            </div>
                        `).join('') : `
                            <div class="flex-1 flex flex-col items-center justify-center opacity-40">
                                <i data-lucide="users-round" class="w-10 h-10 text-slate-400 mb-2"></i>
                                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">No Active Personnel</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>

            <!-- QUICK ENTRY HUB: Executive Command Bar -->
            <div class="quick-entry-bar bg-white/90 backdrop-blur-3xl border-t border-slate-200 px-4 py-4 flex justify-around gap-4 pb-12">
                <button onclick="window.app.showQuickEntry('sale', ${shop.id})" class="quick-btn group">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-active:scale-90 transition-all shadow-sm">
                        <i data-lucide="plus-circle" class="w-6 h-6 text-emerald-600"></i>
                    </div>
                    <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2">Sale</span>
                </button>
                <button onclick="window.app.showQuickEntry('expense', ${shop.id})" class="quick-btn group">
                    <div class="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center group-active:scale-90 transition-all shadow-sm">
                        <i data-lucide="minus-circle" class="w-6 h-6 text-rose-600"></i>
                    </div>
                    <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2">Expense</span>
                </button>
                <button onclick="window.app.showQuickEntry('debt', ${shop.id})" class="quick-btn group">
                    <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center group-active:scale-90 transition-all shadow-sm">
                        <i data-lucide="landmark" class="w-6 h-6 text-amber-600"></i>
                    </div>
                    <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2">Debt</span>
                </button>
                <button onclick="window.app.showQuickEntry('proof', ${shop.id})" class="quick-btn group">
                    <div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-active:scale-90 transition-all shadow-sm">
                        <i data-lucide="camera" class="w-6 h-6 text-blue-600"></i>
                    </div>
                    <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2">Proof</span>
                </button>
            </div>
        </div>
    `;
}

// ... rest of the file remains same ...
export function getShopEmployeesPage(shopName, employees) {
    return `
        <div class="h-full flex flex-col gap-4">
            <div class="flex justify-between items-center px-1">
                <div>
                    <button onclick="window.app.goBack()" class="flex items-center gap-1 text-[8px] font-black text-slate-600 uppercase tracking-widest hover:text-[#B8964B] mb-1 transition-all">
                        <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i> RETURN
                    </button>
                    <h2 class="text-sm font-light text-slate-900 uppercase tracking-tighter">${shopName} <span class="text-[#B8964B] font-bold">STAFF</span></h2>
                </div>
                <button class="btn-luxury px-4 py-1.5 text-[8px]">New Asset</button>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                ${employees.length > 0 ? employees.map(emp => `
                    <div class="luxury-card p-3 bg-white border-slate-200 flex items-center justify-between group">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <img src="${emp.avatar}" class="w-10 h-10 rounded-xl object-cover border border-slate-200 grayscale group-hover:grayscale-0 transition-all">
                                <div class="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h4 class="text-[10px] font-bold text-slate-900 uppercase">${emp.name}</h4>
                                <p class="text-[7px] text-slate-600 uppercase font-bold tracking-widest">${emp.role}</p>
                                <div class="flex gap-0.5 mt-0.5">
                                    ${Array(5).fill(0).map((_, i) => `<i data-lucide="star" class="w-2 h-2 ${i < emp.rating ? 'text-[#B8964B] fill-[#B8964B]' : 'text-slate-200'}"></i>`).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-[6px] text-slate-500 uppercase tracking-widest">Loc: ${emp.location || 'N/A'}</p>
                            <p class="text-[9px] font-black text-slate-900 mt-1">${(emp.salary || 0).toLocaleString()}</p>
                        </div>
                    </div>
                `).join('') : '<p class="text-center text-slate-500 uppercase text-[8px] tracking-widest mt-10">No personnel found.</p>'}
            </div>
        </div>
    `;
}

export function getShopFinancePage(shop, type) {
    const isSales = type === 'sales';
    const isExpense = type === 'expense';
    const isDebt = type === 'debt';

    const color = isSales ? 'emerald-500' : (isExpense ? 'red-500' : 'amber-500');
    const title = isSales ? 'REVENUE REPORT' : (isExpense ? 'EXPENSE LEDGER' : 'DEBT PORTFOLIO');
    const icon = isSales ? 'trending-up' : (isExpense ? 'pie-chart' : 'landmark');

    return `
        <div class="h-full flex flex-col gap-4">
            <div class="flex justify-between items-center px-1">
                <div>
                    <button onclick="window.app.goBack()" class="flex items-center gap-1 text-[8px] font-black text-slate-600 uppercase tracking-widest hover:text-[#B8964B] mb-1 transition-all">
                        <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i> RETURN
                    </button>
                    <h2 class="text-sm font-light text-slate-900 uppercase tracking-tighter">${shop.name} <span class="text-${color} font-bold">${title}</span></h2>
                </div>
                <div class="flex gap-2">
                    <button onclick="window.app.exportShopData('${shop.name}', '${type}')" class="btn-luxury px-3 py-1.5 text-[8px] bg-white border-slate-200 text-slate-900">Export</button>
                </div>
            </div>

            <!-- Financial Summary Grid -->
            <div class="grid grid-cols-3 gap-2 shrink-0">
                <div class="luxury-card p-3 bg-${isSales ? 'emerald' : (isExpense ? 'rose' : 'amber')}-50 border-${color}/20">
                    <p class="text-[7px] font-black text-${color} uppercase tracking-widest mb-1">${isSales ? 'Today' : (isExpense ? 'Today' : 'Total')}</p>
                    <h3 class="text-sm font-bold text-slate-900">${(isSales ? shop.dailySales : (isExpense ? shop.dailyExpense : shop.debt)).toLocaleString()}</h3>
                </div>
                <div class="luxury-card p-3 bg-white border-slate-200">
                    <p class="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Monthly</p>
                    <h3 class="text-sm font-bold text-slate-900">${(isSales ? shop.monthlySales : (isExpense ? shop.monthlyExpense : shop.debt)).toLocaleString()}</h3>
                </div>
                <div class="luxury-card p-3 bg-white border-slate-200">
                    <p class="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                    <h3 class="text-[9px] font-bold text-emerald-600 uppercase">Verifying</h3>
                </div>
            </div>

            <div class="flex-1 flex flex-col min-h-0 luxury-card bg-white overflow-hidden p-0 border-slate-200">
                <div class="flex justify-between items-center p-3 border-b border-slate-100">
                    <div class="flex items-center gap-2">
                        <i data-lucide="${icon}" class="w-3.5 h-3.5 text-${color}"></i>
                        <h3 class="text-[9px] font-black text-slate-900 uppercase tracking-widest">Transaction Feed</h3>
                    </div>
                    <span class="text-[7px] text-slate-500 uppercase font-bold tracking-widest">SECURE_LINK_OK</span>
                </div>

                <div id="shop-activity-feed" class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    <p class="text-center text-slate-600 text-[8px] uppercase tracking-widest py-10">Syncing Transaction Cloud...</p>
                </div>
            </div>
        </div>
    `;
}

export function getMetersHTML(totalSales, totalExpense, totalDebt) {
    const salesPerc = Math.min(100, (totalSales / 5000000) * 100).toFixed(1);
    const expPerc = Math.min(100, (totalExpense / 2000000) * 100).toFixed(1);
    const debtPerc = Math.min(100, (totalDebt / 1000000) * 100).toFixed(1);

    const getOffset = (perc) => 314 - (314 * (perc / 100));

    return `
        <div class="meter-wrapper meter-income">
            <div class="radial-gauge">
                <div class="gauge-glass"></div>
                <svg class="gauge-svg" viewBox="0 0 104 104">
                    <circle class="gauge-track" cx="52" cy="52" r="50"></circle>
                    <circle class="gauge-fill" cx="52" cy="52" r="50" style="--dash-offset: ${getOffset(salesPerc)};"></circle>
                </svg>
                <div class="gauge-content">
                    <p class="gauge-value">${(totalSales / 1000000).toFixed(2)}M</p>
                    <p class="gauge-percent">${salesPerc}%</p>
                </div>
            </div>
            <div class="gauge-label">Revenue</div>
        </div>

        <div class="meter-wrapper meter-expense">
            <div class="radial-gauge">
                <div class="gauge-glass"></div>
                <svg class="gauge-svg" viewBox="0 0 104 104">
                    <circle class="gauge-track" cx="52" cy="52" r="50"></circle>
                    <circle class="gauge-fill" cx="52" cy="52" r="50" style="--dash-offset: ${getOffset(expPerc)};"></circle>
                </svg>
                <div class="gauge-content">
                    <p class="gauge-value">${(totalExpense / 1000).toFixed(0)}K</p>
                    <p class="gauge-percent">${expPerc}%</p>
                </div>
            </div>
            <div class="gauge-label">Expense</div>
        </div>

        <div class="meter-wrapper meter-debt">
            <div class="radial-gauge">
                <div class="gauge-glass"></div>
                <svg class="gauge-svg" viewBox="0 0 104 104">
                    <circle class="gauge-track" cx="52" cy="52" r="50"></circle>
                    <circle class="gauge-fill" cx="52" cy="52" r="50" style="--dash-offset: ${getOffset(debtPerc)};"></circle>
                </svg>
                <div class="gauge-content">
                    <p class="gauge-value">${(totalDebt / 1000).toFixed(0)}K</p>
                    <p class="gauge-percent">${debtPerc}%</p>
                </div>
            </div>
            <div class="gauge-label">Liability</div>
        </div>
    `;
}

export function getLoansPage() {
    return `
        <div class="h-full flex flex-col gap-4 overflow-hidden">
            <div class="flex items-center gap-2 mb-2 px-1">
                <button onclick="window.app.goBack()" class="flex items-center gap-1 text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-[#B8964B] transition-colors">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i> BACK
                </button>
                <h2 class="text-sm font-light text-slate-900 uppercase tracking-tighter">Global <span class="text-amber-600 font-bold">Credit Portfolio</span></h2>
            </div>

            <div class="shrink-0 luxury-card p-4 space-y-4 border-slate-200 bg-white">
                <h3 class="text-[10px] font-black text-[#B8964B] uppercase tracking-[0.3em] border-b border-slate-100 pb-2">Record Credit Line</h3>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Entity Name</label>
                        <input type="text" id="loan-entity" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] text-slate-900 focus:border-[#B8964B]/50 outline-none" placeholder="Target Entity">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Portfolio Type</label>
                        <select id="loan-type" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] text-slate-900 focus:border-[#B8964B]/50 outline-none">
                            <option value="Receivable">Receivable (Lent)</option>
                            <option value="Payable">Payable (Borrowed)</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Capital Amount</label>
                        <input type="number" id="loan-amount" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] text-slate-900 focus:border-[#B8964B]/50 outline-none" placeholder="0.00">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Due Date</label>
                        <input type="date" id="loan-due-date" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] text-slate-900 focus:border-[#B8964B]/50 outline-none">
                    </div>
                </div>
                <div class="flex gap-2">
                    <input type="file" id="loan-proof-input" class="hidden" accept="image/*">
                    <button onclick="document.getElementById('loan-proof-input').click()" class="w-12 h-[34px] bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all">
                        <i data-lucide="camera" class="w-4 h-4"></i>
                    </button>
                    <button id="btn-add-loan" class="flex-1 h-[34px] bg-gradient-to-r from-[#B8964B] to-[#D4AF37] text-black font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg active:scale-95 transition-all">
                        Register Portfolio
                    </button>
                </div>

                <div id="loan-proof-wrapper" class="hidden flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <img id="loan-proof-preview" class="w-10 h-10 rounded object-cover border border-[#B8964B]/30">
                    <p class="text-[7px] font-bold text-emerald-600 uppercase tracking-widest">Cheque/Bill Attached</p>
                </div>
            </div>

            <div class="shrink-0 grid grid-cols-3 gap-2">
                <div class="luxury-card p-3 bg-emerald-50 border-emerald-100">
                    <p class="text-[7px] font-black text-emerald-600 uppercase tracking-widest">Receivable</p>
                    <h3 id="total-receivable" class="text-sm font-bold text-slate-900 mt-1">0</h3>
                </div>
                <div class="luxury-card p-3 bg-rose-50 border-rose-100">
                    <p class="text-[7px] font-black text-rose-600 uppercase tracking-widest">Liabilities</p>
                    <h3 id="total-payable" class="text-sm font-bold text-slate-900 mt-1">0</h3>
                </div>
                <div class="luxury-card p-3 bg-blue-50 border-blue-100">
                    <p class="text-[7px] font-black text-blue-600 uppercase tracking-widest">Net Position</p>
                    <h3 id="total-net" class="text-sm font-bold text-slate-900 mt-1">0</h3>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div class="luxury-card p-3 bg-white border-slate-200">
                    <div class="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                        <h3 class="text-[9px] font-black text-[#B8964B] uppercase tracking-[0.2em]">Active Credit Portfolio</h3>
                        <i data-lucide="trending-up" class="w-3 h-3 text-emerald-600"></i>
                    </div>
                    <div id="loans-list" class="space-y-2"></div>
                </div>
            </div>
        </div>
    `;
}
