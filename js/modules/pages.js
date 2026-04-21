/**
 * ============================================================================
 * ABD LUXURY SYSTEM | PAGES GENERATOR MODULE
 * ============================================================================
 * STATUS: DEPRECATING (MOVING TO ISOLATED MODULES)
 * VERSION: 2.1.0
 * DESCRIPTION: Legacy UI generators being migrated to specialized modules.
 * ============================================================================
 */

import { shopsData } from './data.js';

export function getShopDashboardPage(shop) {
    return `
        <div class="h-full flex flex-col gap-3 overflow-hidden pb-2">
            <!-- Navigation & Header -->
            <div class="flex justify-between items-center shrink-0">
                <button onclick="window.app.goBack()" class="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-[#D4AF37] group transition-all">
                    <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i> Return
                </button>
                <div class="flex gap-2">
                    <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold rounded border border-emerald-500/20 uppercase tracking-widest">${shop.status}</span>
                </div>
            </div>

            <!-- Header with Minimal Vision -->
            <div class="flex gap-3 shrink-0 h-32">
                <!-- Compact Camera View -->
                <div class="w-1/2 luxury-card p-1 relative overflow-hidden group cursor-pointer" onclick="window.app.switchView('camera')">
                    <div class="w-full h-full bg-black rounded-lg overflow-hidden relative">
                        <div class="camera-overlay"></div>
                        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600" class="w-full h-full object-cover opacity-50">
                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <div class="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 mb-1">
                                 <i data-lucide="video" class="w-4 h-4 text-[#D4AF37]"></i>
                            </div>
                            <p class="text-[7px] font-black text-white uppercase tracking-widest">LIVE VISION</p>
                        </div>
                        <div class="absolute top-2 left-2 flex items-center gap-1.5">
                            <div class="rec-dot scale-50"></div>
                            <span class="text-[6px] font-bold text-emerald-500 uppercase">CAM_01</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats Summary -->
                <div class="w-1/2 grid grid-cols-1 gap-2">
                    <div class="luxury-card p-2 bg-emerald-500/5 border-emerald-500/10 flex flex-col justify-center">
                        <p class="text-[6px] font-black text-emerald-500 uppercase tracking-widest">DAILY REVENUE</p>
                        <h4 class="text-xs font-bold text-white mt-0.5">${shop.dailySales}</h4>
                    </div>
                    <div class="luxury-card p-2 bg-red-500/5 border-red-500/10 flex flex-col justify-center">
                        <p class="text-[6px] font-black text-red-400 uppercase tracking-widest">DAILY EXPENSE</p>
                        <h4 class="text-xs font-bold text-white mt-0.5">${shop.dailyExpense}</h4>
                    </div>
                </div>
            </div>

            <!-- Management Control Panel (The Buttons) -->
            <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div class="grid grid-cols-2 gap-3">
                    <!-- Employees Button -->
                    <button onclick="window.app.showShopEmployees('${shop.name}')" class="luxury-card p-4 bg-white/[0.03] border-white/5 flex flex-col items-center gap-3 hover:bg-white/[0.06] transition-all group">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8A6D3B] flex items-center justify-center text-black shadow-lg">
                            <i data-lucide="users" class="w-5 h-5"></i>
                        </div>
                        <div class="text-center">
                            <h4 class="text-[10px] font-black text-white uppercase tracking-widest">EMPLOYEES</h4>
                            <p class="text-[7px] text-slate-500 uppercase mt-1">${shop.staffCount} Registered</p>
                        </div>
                    </button>

                    <!-- Sales Button -->
                    <button onclick="window.app.showShopFinance('${shop.id}', 'sales')" class="luxury-card p-4 bg-white/[0.03] border-white/5 flex flex-col items-center gap-3 hover:bg-white/[0.06] transition-all group">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <i data-lucide="trending-up" class="w-5 h-5"></i>
                        </div>
                        <div class="text-center">
                            <h4 class="text-[10px] font-black text-white uppercase tracking-widest">SALES REPORT</h4>
                            <p class="text-[7px] text-emerald-500/70 uppercase mt-1">Monthly: ${shop.monthlySales}</p>
                        </div>
                    </button>

                    <!-- Expenses Button -->
                    <button onclick="window.app.showShopFinance('${shop.id}', 'expense')" class="luxury-card p-4 bg-white/[0.03] border-white/5 flex flex-col items-center gap-3 hover:bg-white/[0.06] transition-all group">
                        <div class="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/20">
                            <i data-lucide="pie-chart" class="w-5 h-5"></i>
                        </div>
                        <div class="text-center">
                            <h4 class="text-[10px] font-black text-white uppercase tracking-widest">EXPENSES</h4>
                            <p class="text-[7px] text-red-400/70 uppercase mt-1">Monthly: ${shop.monthlyExpense}</p>
                        </div>
                    </button>

                    <!-- Debt Button -->
                    <button onclick="window.app.showShopFinance('${shop.id}', 'debt')" class="luxury-card p-4 bg-white/[0.03] border-white/5 flex flex-col items-center gap-3 hover:bg-white/[0.06] transition-all group">
                        <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <i data-lucide="landmark" class="w-5 h-5"></i>
                        </div>
                        <div class="text-center">
                            <h4 class="text-[10px] font-black text-white uppercase tracking-widest">DEBT / LOANS</h4>
                            <p class="text-[7px] text-amber-500/70 uppercase mt-1">Total: ${shop.debt}</p>
                        </div>
                    </button>
                </div>

                <!-- Secondary Actions -->
                <div class="mt-4 grid grid-cols-1 gap-2">
                    <button class="w-full bg-[#D4AF37] text-black py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        <i data-lucide="plus-square" class="w-4 h-4"></i> CREATE NEW ENTRY
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function getShopEmployeesPage(shopName, employees) {
    return `
        <div class="h-full flex flex-col gap-6">
            <div class="flex justify-between items-center">
                <div>
                    <button onclick="window.app.goBack()" class="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-[#D4AF37] mb-1 group transition-all">
                        <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i> Return
                    </button>
                    <h2 class="text-xl font-light text-white uppercase tracking-tighter">${shopName} <span class="text-[#D4AF37] font-bold">STAFF</span></h2>
                </div>
                <button class="btn-luxury px-6 py-2 text-[9px]">Add Employee</button>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                ${employees.length > 0 ? employees.map(emp => `
                    <div class="luxury-card p-4 bg-white/[0.02] border-white/5 flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all">
                        <div class="flex items-center gap-4">
                            <div class="relative">
                                <img src="${emp.avatar}" class="w-12 h-12 rounded-xl object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all">
                                <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A0A0A]"></div>
                            </div>
                            <div>
                                <h4 class="text-[11px] font-bold text-white uppercase tracking-wider">${emp.name}</h4>
                                <p class="text-[8px] text-slate-500 uppercase font-bold tracking-widest">${emp.role} • <span class="text-[#D4AF37]">${emp.id}</span></p>
                                <div class="flex gap-0.5 mt-1">
                                    ${Array(5).fill(0).map((_, i) => `<i data-lucide="star" class="w-2.5 h-2.5 ${i < emp.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-white/10'}"></i>`).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-8 items-center">
                            <div class="text-right">
                                <p class="text-[7px] text-slate-500 uppercase tracking-widest">Status / Location</p>
                                <p class="text-[9px] font-bold text-emerald-500 uppercase flex items-center justify-end gap-1">
                                    <i data-lucide="map-pin" class="w-2.5 h-2.5"></i> ${emp.location}
                                </p>
                            </div>
                            <div class="text-right">
                                <p class="text-[7px] text-slate-500 uppercase tracking-widest">Monthly Salary</p>
                                <p class="text-[10px] font-black text-white">${emp.salary.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                `).join('') : '<p class="text-center text-slate-500 uppercase text-[10px] tracking-widest mt-10">No employees found for this shop.</p>'}
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

    // Filter real data based on shop and type
    const recordType = isSales ? 'Sale' : (isExpense ? 'Expense' : 'Debt');
    // For now using salesRecords as primary ledger, in a full system you'd have separate nodes
    import('./data.js').then(Data => {
        const records = Data.salesRecords.filter(r => r.shop === shop.name);
        // This is a simplified view for the live system
    });

    return `
        <div class="h-full flex flex-col gap-6">
            <div class="flex justify-between items-center">
                <div>
                    <button onclick="window.app.goBack()" class="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-[#D4AF37] mb-1 group transition-all">
                        <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i> Return
                    </button>
                    <h2 class="text-xl font-light text-white uppercase tracking-tighter">${shop.name} <span class="text-${color} font-bold">${title}</span></h2>
                </div>
                <div class="flex gap-2">
                    <button class="btn-luxury px-4 py-2 text-[8px] bg-white/5 border-white/10">Export Ledger</button>
                    <button onclick="window.app.switchView('${isSales ? 'sales' : (isDebt ? 'loans' : 'sales')}')" class="btn-luxury px-4 py-2 text-[8px]">New Entry</button>
                </div>
            </div>

            <!-- Financial Summary Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                <div class="luxury-card p-5 bg-${color}/5 border-${color}/10">
                    <p class="text-[8px] font-black text-${color} uppercase tracking-[0.2em] mb-1">${isSales ? 'Today Sales' : (isExpense ? 'Today Expense' : 'Total Debt')}</p>
                    <h3 class="text-2xl font-light text-white">${(isSales ? shop.dailySales : (isExpense ? shop.dailyExpense : shop.debt)).toLocaleString()}</h3>
                </div>
                <div class="luxury-card p-5 bg-white/[0.02] border-white/5">
                    <p class="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">${isDebt ? 'Account Status' : (isSales ? 'This Month' : 'This Month')}</p>
                    <h3 class="text-2xl font-light text-white">${isDebt ? 'Active' : (isSales ? shop.monthlySales : shop.monthlyExpense).toLocaleString()}</h3>
                </div>
                <div class="luxury-card p-5 bg-white/[0.02] border-white/5">
                    <p class="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">System Integrity</p>
                    <h3 class="text-2xl font-light text-emerald-500">Live</h3>
                </div>
            </div>

            <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                <!-- Detailed Breakdown Table -->
                <div class="luxury-card bg-white/[0.01] flex flex-col p-6 overflow-hidden">
                    <div class="flex items-center gap-2 mb-6">
                        <i data-lucide="layout-list" class="w-4 h-4 text-[#D4AF37]"></i>
                        <h3 class="text-[10px] font-black text-white uppercase tracking-widest">Performance Analysis</h3>
                    </div>

                    <div class="flex-1 overflow-y-auto custom-scrollbar">
                        <table class="w-full">
                            <thead>
                                <tr class="text-left border-b border-white/5">
                                    <th class="pb-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">Description</th>
                                    <th class="pb-3 text-[8px] font-black text-slate-500 uppercase tracking-widest text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody class="text-[10px] font-medium text-slate-300">
                                <tr class="border-b border-white/[0.03]">
                                    <td class="py-4 text-white font-bold">Base Revenue</td>
                                    <td class="py-4 text-right">${(isSales ? shop.monthlySales : 0).toLocaleString()}</td>
                                </tr>
                                <tr class="border-b border-white/[0.03]">
                                    <td class="py-4 text-white font-bold">Operating Costs</td>
                                    <td class="py-4 text-right">${(isExpense ? shop.monthlyExpense : 0).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td class="py-4 text-[#D4AF37] font-black uppercase">Net Position</td>
                                    <td class="py-4 text-right text-white font-black">${(shop.monthlySales - shop.monthlyExpense).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Transaction Ledger (Wired to Real Data) -->
                <div class="luxury-card bg-white/[0.01] flex flex-col p-6 overflow-hidden">
                    <div class="flex justify-between items-center mb-6">
                        <div class="flex items-center gap-2">
                            <i data-lucide="${icon}" class="w-4 h-4 text-${color}"></i>
                            <h3 class="text-[10px] font-black text-white uppercase tracking-widest">Recent Activity</h3>
                        </div>
                        <span class="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Secure Feed</span>
                    </div>

                    <div id="shop-activity-feed" class="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                        <p class="text-center text-slate-600 text-[8px] uppercase tracking-widest py-10">Initializing Real-time Ledger...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function getMetersHTML(totalSales, totalExpense, totalDebt) {
    // Calculate percentages for gauges (max targets)
    const salesPerc = Math.min(100, (totalSales / 5000000) * 100).toFixed(1);
    const expPerc = Math.min(100, (totalExpense / 2000000) * 100).toFixed(1);
    const debtPerc = Math.min(100, (totalDebt / 1000000) * 100).toFixed(1);

    // SVG Dash Array for 52 radius is ~314.
    // We use a simplified calculation for the dash-offset
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
                    <p class="gauge-percent">${salesPerc}% CAP</p>
                </div>
            </div>
            <div class="gauge-label">Total Revenue</div>
            <div class="gauge-status">${totalSales > totalExpense ? 'Revenue High' : 'Attention Required'}</div>
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
                    <p class="gauge-percent">${expPerc}% EXP</p>
                </div>
            </div>
            <div class="gauge-label">Total Expense</div>
            <div class="gauge-status">Operational</div>
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
                    <p class="gauge-percent">${debtPerc}% DEBT</p>
                </div>
            </div>
            <div class="gauge-label">Total Liability</div>
            <div class="gauge-status">${totalDebt > 500000 ? 'Review Risk' : 'Healthy'}</div>
        </div>
    `;
}


export function getFeaturedCameraHTML() {
    return `
        <div class="camera-monitor">
            <div class="camera-overlay"></div>
            <div class="scanline-effect"></div>
            <div class="camera-hud">
                <div class="flex items-center gap-2">
                    <div class="rec-dot"></div>
                    <span class="text-[9px] font-black text-white uppercase tracking-[0.2em]">AIRPORT ROAD GRANDE - CAM_01</span>
                </div>
                <div class="flex gap-2">
                    <span class="text-[8px] font-mono text-emerald-500 bg-black/40 px-2 py-0.5 rounded border border-emerald-500/20">4K HDR</span>
                    <span class="text-[8px] font-mono text-[#D4AF37] bg-black/40 px-2 py-0.5 rounded border border-[#D4AF37]/20">60 FPS</span>
                </div>
            </div>

            <div class="video-feed-main">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200" alt="Main Feed" class="w-full h-full object-cover">
            </div>

            <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div class="flex gap-2">
                    <div class="camera-controls-mini !p-2 !gap-3">
                        <button class="btn-cam-mini" onclick="event.stopPropagation();"><i data-lucide="camera" class="w-4 h-4"></i></button>
                        <button class="btn-cam-mini" onclick="event.stopPropagation();"><i data-lucide="circle" class="w-4 h-4 text-red-500"></i></button>
                        <button class="btn-cam-mini" onclick="event.stopPropagation();"><i data-lucide="mic" class="w-4 h-4"></i></button>
                    </div>
                </div>
                <button class="btn-cam-mini !w-10 !h-10 bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37] backdrop-blur-xl">
                    <i data-lucide="maximize-2" class="w-5 h-5"></i>
                </button>
            </div>

            <div class="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-1 z-10 pointer-events-none opacity-40">
                <div class="w-16 h-0.5 bg-emerald-500/50"></div>
                <div class="w-10 h-0.5 bg-emerald-500/30"></div>
                <div class="w-20 h-0.5 bg-emerald-500/50"></div>
            </div>
        </div>
    `;
}


export function getSalesPage() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div class="lg:col-span-4 space-y-8">
                <h3 class="gold-text text-xl font-bold uppercase">Execute Transaction</h3>
                <div class="space-y-6">
                    <div class="space-y-2"><label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Origin Hub</label><select id="sale-shop" class="input-luxury w-full">${shopsData.map(s => `<option>${s.name}</option>`).join('')}</select></div>
                    <div class="space-y-2"><label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Asset Name</label><input type="text" id="sale-product" class="input-luxury w-full" placeholder="Ex: Luxury Timepiece"></div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2"><label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Acquisition</label><input type="number" id="sale-cost" class="input-luxury w-full" placeholder="0"></div>
                        <div class="space-y-2"><label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Disposition</label><input type="number" id="sale-price" class="input-luxury w-full" placeholder="0"></div>
                    </div>
                    <button id="btn-add-sale" class="btn-luxury w-full py-5">Authorize Entry</button>
                </div>
            </div>
            <div class="lg:col-span-8 overflow-hidden">
                <div class="luxury-card border-none bg-white/[0.02] overflow-x-auto">
                    <table class="w-full">
                        <thead><tr><th>Trace ID</th><th>Hub</th><th>Asset</th><th>Value</th><th>Yield</th></tr></thead>
                        <tbody id="sales-table-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

export function getEmployeesPage() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div class="lg:col-span-4 space-y-8">
                <h3 class="gold-text text-xl font-bold uppercase">Onboard Associate</h3>
                <div class="space-y-6">
                    <input type="text" id="emp-name" placeholder="Full Legal Name" class="input-luxury w-full">
                    <select id="emp-role" class="input-luxury w-full"><option>Director</option><option>Operations</option><option>Security</option></select>
                    <select id="emp-shop" class="input-luxury w-full">${shopsData.map(s => `<option>${s.name}</option>`).join('')}</select>
                    <input type="number" id="emp-salary" placeholder="Base Salary" class="input-luxury w-full">
                    <button id="btn-add-employee" class="btn-luxury w-full py-5">Register Asset</button>
                </div>
            </div>
            <div class="lg:col-span-8">
                <div class="luxury-card border-none bg-white/[0.02] overflow-x-auto">
                    <table class="w-full">
                        <thead><tr><th>Asset ID</th><th>Name</th><th>Position</th><th>Hub</th><th>Salary</th></tr></thead>
                        <tbody id="emp-table-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

export function getCameraPage() {
    return `
        <div class="space-y-8">
            <div class="flex justify-between items-end">
                <div>
                    <h2 class="text-2xl font-light text-white uppercase tracking-tighter">Global Vision Network</h2>
                    <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Multi-Node Secure Surveillance</p>
                </div>
                <div class="flex gap-4">
                    <button class="btn-luxury px-6 py-2 text-[10px]"><i data-lucide="video" class="w-3 h-3 inline mr-2"></i> Record All</button>
                    <button class="btn-luxury px-6 py-2 text-[10px] border-white/5"><i data-lucide="layout-grid" class="w-3 h-3 inline mr-2"></i> Mosaic</button>
                </div>
            </div>

            <div class="camera-grid-layout">
                ${shopsData.map(shop => `
                    <div class="camera-preview-card group cursor-pointer" onclick="window.app.openCameraDetail('${shop.name}')">
                        <div class="camera-monitor">
                            <div class="camera-overlay"></div>
                            <div class="camera-hud">
                                <div class="flex items-center gap-2">
                                    <div class="rec-dot"></div>
                                    <span class="text-[8px] font-black text-white uppercase tracking-widest">Live: ${shop.name}</span>
                                </div>
                                <span class="text-[8px] font-mono text-emerald-500">4K HDR</span>
                            </div>
                            <div class="video-feed-main">
                                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600" alt="Cam Feed">
                            </div>
                            <div class="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10 opacity-0 group-hover:opacity-100 transition-all">
                                <div class="camera-controls-mini">
                                    <button class="btn-cam-mini" title="Capture"><i data-lucide="camera" class="w-3.5 h-3.5"></i></button>
                                    <button class="btn-cam-mini" title="Record"><i data-lucide="circle" class="w-3.5 h-3.5"></i></button>
                                </div>
                                <button class="btn-cam-mini" title="Expand"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></button>
                            </div>
                        </div>
                        <div class="camera-footer">
                            <div class="cam-meta">
                                <h4>NODE_${shop.id.toString().padStart(3, '0')}</h4>
                                <p>${shop.status} | 24.5 FPS</p>
                            </div>
                            <div class="flex -space-x-2">
                                <div class="w-6 h-6 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-[8px] text-white">SA</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

export function getCameraDetailPage(cameraName) {
    return `
        <div class="h-full flex flex-col gap-6">
            <div class="flex justify-between items-center">
                <button onclick="window.app.switchView('camera')" class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-[#D4AF37] transition-all">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i> Return to Grid
                </button>
                <div class="flex gap-3">
                    <span class="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-bold uppercase tracking-widest border border-emerald-500/20">Active Link</span>
                    <span class="px-3 py-1 bg-white/5 text-slate-400 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/10">AES-256 Encrypted</span>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                <div class="lg:col-span-3 luxury-card p-2 relative flex flex-col">
                    <div class="flex-1 bg-black rounded-xl overflow-hidden relative group">
                        <div class="camera-overlay"></div>
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-20 pointer-events-none">
                            <p class="text-white font-light tracking-[0.5em] uppercase text-xl">Interactive Stream</p>
                        </div>
                        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200" class="w-full h-full object-cover">

                        <!-- Dynamic HUD -->
                        <div class="absolute top-6 left-6 flex items-center gap-4 z-30">
                            <div class="rec-dot scale-150"></div>
                            <div>
                                <h2 class="text-white font-bold text-sm tracking-widest uppercase">${cameraName}</h2>
                                <p class="text-[9px] text-slate-400 uppercase tracking-[0.2em]">Primary Security Feed</p>
                            </div>
                        </div>

                        <div class="absolute bottom-6 right-6 flex gap-3 z-30">
                            <button class="btn-luxury px-6 bg-black/80 backdrop-blur-xl border-white/20"><i data-lucide="screenshot" class="w-4 h-4 mr-2"></i> Snapshot</button>
                            <button class="btn-luxury px-6 bg-red-600/80 border-none"><i data-lucide="circle" class="w-4 h-4 mr-2"></i> DVR Record</button>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-1 flex flex-col gap-6">
                    <div class="luxury-card p-6 flex-1">
                        <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Feed Intelligence</h3>
                        <div class="space-y-6">
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] text-slate-400 uppercase">Bitrate</span>
                                <span class="text-[10px] font-mono text-white">12.4 Mbps</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] text-slate-400 uppercase">Latency</span>
                                <span class="text-[10px] font-mono text-white">18ms</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] text-slate-400 uppercase">Signal</span>
                                <div class="flex gap-0.5">
                                    <div class="w-1 h-2 bg-emerald-500"></div>
                                    <div class="w-1 h-3 bg-emerald-500"></div>
                                    <div class="w-1 h-4 bg-emerald-500"></div>
                                    <div class="w-1 h-5 bg-slate-700"></div>
                                </div>
                            </div>
                        </div>

                        <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-10 mb-6 border-b border-white/5 pb-2">PTZ Controls</h3>
                        <div class="grid grid-cols-3 gap-2">
                            <div></div>
                            <button class="btn-cam-mini w-full aspect-square"><i data-lucide="chevron-up"></i></button>
                            <div></div>
                            <button class="btn-cam-mini w-full aspect-square"><i data-lucide="chevron-left"></i></button>
                            <button class="btn-cam-mini w-full aspect-square bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]"><i data-lucide="dot"></i></button>
                            <button class="btn-cam-mini w-full aspect-square"><i data-lucide="chevron-right"></i></button>
                            <div></div>
                            <button class="btn-cam-mini w-full aspect-square"><i data-lucide="chevron-down"></i></button>
                            <div></div>
                        </div>
                    </div>

                    <button class="btn-luxury w-full py-4 bg-white/5 border-white/10 text-red-400 hover:bg-red-500/10">
                        <i data-lucide="power" class="w-4 h-4 mr-2 inline"></i> Kill Feed
                    </button>
                </div>
            </div>
        </div>
    `;
}


export function getLoansPage() {
    return `
        <div class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="luxury-card p-6 bg-emerald-500/5 border-emerald-500/10">
                    <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Receivable</p>
                    <h3 class="text-2xl font-light text-white mt-2">850,000</h3>
                </div>
                <div class="luxury-card p-6 bg-red-500/5 border-red-500/10">
                    <p class="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">Payable</p>
                    <h3 class="text-2xl font-light text-white mt-2">120,000</h3>
                </div>
                <div class="luxury-card p-6 bg-amber-500/5 border-amber-500/10">
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Net Position</p>
                    <h3 class="text-2xl font-light text-white mt-2">730,000</h3>
                </div>
            </div>

            <div class="luxury-card p-8">
                <h3 class="gold-text text-lg font-bold uppercase mb-6">Active Credit Lines</h3>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th class="text-left text-[10px] text-slate-500 uppercase p-4">Entity</th>
                                <th class="text-left text-[10px] text-slate-500 uppercase p-4">Type</th>
                                <th class="text-left text-[10px] text-slate-500 uppercase p-4">Amount</th>
                                <th class="text-left text-[10px] text-slate-500 uppercase p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            <tr class="border-t border-white/5">
                                <td class="p-4 text-white">Global Logistics Corp</td>
                                <td class="p-4 text-slate-400">Receivable</td>
                                <td class="p-4 text-emerald-500 font-bold">450,000</td>
                                <td class="p-4"><span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase">Active</span></td>
                            </tr>
                            <tr class="border-t border-white/5">
                                <td class="p-4 text-white">Elite Real Estate</td>
                                <td class="p-4 text-slate-400">Receivable</td>
                                <td class="p-4 text-emerald-500 font-bold">400,000</td>
                                <td class="p-4"><span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase">Pending</span></td>
                            </tr>
                             <tr class="border-t border-white/5">
                                <td class="p-4 text-white">Central Bank</td>
                                <td class="p-4 text-slate-400">Payable</td>
                                <td class="p-4 text-red-500 font-bold">120,000</td>
                                <td class="p-4"><span class="px-2 py-0.5 rounded bg-red-500/20 text-red-500 text-[10px] font-bold uppercase">Due</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

export function getTasksPage() {
    return `
        <div class="space-y-8">
            <div class="flex justify-between items-center">
                <h3 class="gold-text text-xl font-bold uppercase">Daily Tactical List</h3>
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today: ${new Date().toLocaleDateString()}</span>
            </div>

            <div class="grid grid-cols-1 gap-4">
                <div class="luxury-card p-6 flex items-center justify-between border-l-4 border-l-emerald-500 bg-emerald-500/5">
                    <div class="flex items-center gap-6">
                        <div class="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <i data-lucide="arrow-down-left" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-bold uppercase tracking-wider">Collect Payment</h4>
                            <p class="text-[10px] text-slate-400 uppercase mt-1">From: Airport Road Branch | Amount: $15,000</p>
                        </div>
                    </div>
                    <button class="btn-luxury px-6 py-2 text-[10px]">Complete</button>
                </div>

                <div class="luxury-card p-6 flex items-center justify-between border-l-4 border-l-amber-500 bg-amber-500/5">
                    <div class="flex items-center gap-6">
                        <div class="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                            <i data-lucide="banknote" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-bold uppercase tracking-wider">Disburse Salaries</h4>
                            <p class="text-[10px] text-slate-400 uppercase mt-1">Staff Payroll | Target: 12 Employees</p>
                        </div>
                    </div>
                    <button class="btn-luxury px-6 py-2 text-[10px]">Execute</button>
                </div>

                <div class="luxury-card p-6 flex items-center justify-between border-l-4 border-l-red-500 bg-red-500/5">
                    <div class="flex items-center gap-6">
                        <div class="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                            <i data-lucide="alert-circle" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-bold uppercase tracking-wider">Outstanding Debt</h4>
                            <p class="text-[10px] text-slate-400 uppercase mt-1">Payment to Vendor: Alpha Tech | Due: EOD</p>
                        </div>
                    </div>
                    <button class="btn-luxury px-6 py-2 text-[10px]">Settled</button>
                </div>
            </div>
        </div>
    `;
}
