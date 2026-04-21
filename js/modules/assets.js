/**
 * ============================================================================
 * ABD LUXURY SYSTEM | ASSET & HUMAN CAPITAL MODULE (REINFORCED)
 * ============================================================================
 * PROTECTION STATUS: ACTIVE (STRICT ISOLATION)
 * VERSION: 2.0.0
 * DESCRIPTION: Self-contained module for Staff and Operations.
 * ============================================================================
 */

import * as Data from './data.js';

/**
 * INITIALIZATION: Runs when Employees page is opened
 */
export function initEmployees() {
    updateStaffGrid();
    updateStaffStats();

    // Global Access for Modals (Controlled)
    window.app.toggleStaffModal = (show) => {
        const modal = document.getElementById('staff-modal');
        if (modal) modal.classList.toggle('hidden', !show);
    };

    window.app.registerEmployee = () => {
        const name = document.getElementById('new-emp-name').value;
        const role = document.getElementById('new-emp-role').value;
        const shop = document.getElementById('new-emp-shop').value;
        const salary = parseFloat(document.getElementById('new-emp-salary').value) || 0;

        if (!name || salary <= 0) {
            alert("Security Alert: Incomplete Asset Documentation");
            return;
        }

        const success = Data.db.addEmployee({
            name,
            role,
            shop,
            salary
        });

        if (success) {
            updateStaffGrid();
            updateStaffStats();
            window.app.toggleStaffModal(false);

            // Form Reset
            document.getElementById('new-emp-name').value = '';
            document.getElementById('new-emp-salary').value = '';
        } else {
            alert("Security Alert: Enrollment Failed");
        }
    };
}

function updateStaffGrid() {
    const container = document.getElementById('staff-grid-container');
    if (!container) return;

    container.innerHTML = Data.employeesData.map(e => `
        <div class="luxury-card p-4 flex items-center gap-4 bg-white/[0.02] border-white/5 hover:border-[#D4AF37]/30 transition-all group">
            <div class="w-12 h-12 rounded-full border-2 border-[#D4AF37]/20 p-0.5">
                <img src="${e.avatar}" class="w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all" alt="Staff">
            </div>
            <div class="flex-1">
                <h4 class="text-[11px] font-black text-white uppercase">${e.name}</h4>
                <p class="text-[7px] text-slate-500 uppercase tracking-widest">${e.role} | ${e.shop}</p>
            </div>
            <div class="text-right">
                <p class="text-[9px] font-black text-white">${e.salary.toLocaleString()}</p>
                <span class="text-[6px] font-black text-emerald-500 uppercase">Active</span>
            </div>
        </div>
    `).join('');
}

function updateStaffStats() {
    const total = Data.employeesData.length;
    const payroll = Data.employeesData.reduce((sum, e) => sum + e.salary, 0);

    const elTotal = document.getElementById('stat-total-staff');
    const elPayroll = document.getElementById('stat-payroll-total');

    if (elTotal) elTotal.innerText = total;
    if (elPayroll) elPayroll.innerText = `${payroll.toLocaleString()}`;
}

export function getEmployeesPage() {
    const isAdmin = Data.config.isAdmin;

    return `
        <div class="h-full flex flex-col gap-4 overflow-hidden pb-4">
            <div class="flex items-center gap-2 mb-2">
                <button onclick="window.app.goBack()" class="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i> BACK
                </button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
                <div class="luxury-card p-3 bg-white/[0.02] border-white/5">
                    <p class="text-[7px] font-black text-slate-500 uppercase tracking-widest">Total Assets</p>
                    <h3 class="text-lg font-bold text-white mt-1" id="stat-total-staff">0</h3>
                </div>
                <div class="luxury-card p-3 bg-emerald-500/5 border-emerald-500/10">
                    <p class="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Active Status</p>
                    <h3 class="text-lg font-bold text-white mt-1">100%</h3>
                </div>
                <div class="luxury-card p-3 bg-blue-500/5 border-blue-500/10">
                    <p class="text-[7px] font-black text-blue-400 uppercase tracking-widest">Monthly Payroll</p>
                    <h3 class="text-lg font-bold text-white mt-1" id="stat-payroll-total">0</h3>
                </div>
                <div class="luxury-card p-3 bg-amber-500/5 border-amber-500/10">
                    <p class="text-[7px] font-black text-[#D4AF37] uppercase tracking-widest">Performance</p>
                    <h3 class="text-lg font-bold text-white mt-1">Elite</h3>
                </div>
            </div>

            <div class="flex justify-between items-center px-1 shrink-0">
                <h3 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Personnel Inventory</h3>
                ${isAdmin ? `
                    <button onclick="window.app.toggleStaffModal(true)" class="bg-gradient-to-r from-[#D4AF37] to-[#8A6D3B] text-black px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest active:scale-95 transition-all">
                        New Registration
                    </button>
                ` : ''}
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div id="staff-grid-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"></div>
            </div>

            <!-- MODAL ISOLATED IN MODULE -->
            <div id="staff-modal" class="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] hidden flex items-center justify-center p-6">
                <div class="luxury-card w-full max-w-lg p-6 border-[#D4AF37]/20 relative">
                    <button onclick="window.app.toggleStaffModal(false)" class="absolute top-4 right-4 text-slate-500 hover:text-white">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                    <h2 class="text-sm font-black text-white uppercase tracking-widest mb-6">Asset Onboarding</h2>
                    <div class="space-y-4">
                        <input type="text" id="new-emp-name" placeholder="Full Identity" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none focus:border-[#D4AF37]/50">
                        <select id="new-emp-role" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none">
                            <option>Director</option>
                            <option>Manager</option>
                            <option>Associate</option>
                        </select>
                        <select id="new-emp-shop" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none">
                            ${Data.shopsData.map(s => `<option>${s.name}</option>`).join('')}
                        </select>
                        <input type="number" id="new-emp-salary" placeholder="Remuneration" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none focus:border-[#D4AF37]/50">
                        <button onclick="window.app.registerEmployee()" class="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] mt-4">Confirm Registration</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initTasks() {
    updateTasksUI();

    window.app.toggleTaskModal = (show) => {
        const modal = document.getElementById('task-modal');
        if (modal) modal.classList.toggle('hidden', !show);
    };

    window.app.createTask = () => {
        const label = document.getElementById('new-task-label').value;
        const from = document.getElementById('new-task-from').value;
        const amount = document.getElementById('new-task-amount').value;
        const color = document.getElementById('new-task-color').value;

        if (!label || !from) {
            alert("Incomplete Task Data");
            return;
        }

        Data.db.addTask({ label, from, amount, color });
        updateTasksUI();
        window.app.toggleTaskModal(false);

        document.getElementById('new-task-label').value = '';
        document.getElementById('new-task-from').value = '';
    };

    window.app.deleteTask = (id) => {
        if (confirm("Delete this task?")) {
            Data.db.deleteTask(id);
            updateTasksUI();
        }
    };
}

function updateTasksUI() {
    const container = document.getElementById('tasks-container');
    if (!container) return;

    container.innerHTML = (Data.tasksData || []).map(task => `
        <div class="luxury-card p-4 flex items-center justify-between border-l-2 border-l-${task.color === 'emerald' ? 'emerald' : task.color === 'amber' ? 'amber' : 'blue'}-500 bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
            <div>
                <h4 class="text-white font-bold text-[10px] uppercase tracking-wider">${task.label}</h4>
                <p class="text-[7px] text-slate-500 uppercase mt-0.5">${task.from} | ${task.amount}</p>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-[7px] font-black text-${task.color === 'emerald' ? 'emerald' : task.color === 'amber' ? 'amber' : 'blue'}-500 uppercase tracking-widest">${task.status}</span>
                <button onclick="window.app.deleteTask(${task.id})" class="text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
}

export function getTasksPage() {
    return `
        <div class="h-full flex flex-col gap-4 overflow-hidden">
            <div class="flex items-center gap-2 mb-2">
                <button onclick="window.app.goBack()" class="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i> BACK
                </button>
            </div>
            <div class="shrink-0 flex justify-between items-center px-1">
                <h3 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Tactical Schedule</h3>
                <button onclick="window.app.toggleTaskModal(true)" class="text-[7px] font-bold text-[#D4AF37] uppercase tracking-widest border border-[#D4AF37]/30 px-3 py-1 rounded-full hover:bg-[#D4AF37]/10 transition-all">Add Objective</button>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div id="tasks-container" class="grid grid-cols-1 gap-3"></div>
            </div>

            <div id="task-modal" class="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] hidden flex items-center justify-center p-6">
                <div class="luxury-card w-full max-w-sm p-6 border-[#D4AF37]/20 relative">
                    <button onclick="window.app.toggleTaskModal(false)" class="absolute top-4 right-4 text-slate-500 hover:text-white">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                    <h2 class="text-sm font-black text-white uppercase tracking-widest mb-6">Tactical Objective</h2>
                    <div class="space-y-4">
                        <input type="text" id="new-task-label" placeholder="Objective Label" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none">
                        <input type="text" id="new-task-from" placeholder="Source Hub" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none">
                        <input type="text" id="new-task-amount" placeholder="Target Volume/Value" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none">
                        <select id="new-task-color" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none">
                            <option value="blue">Standard (Blue)</option>
                            <option value="amber">Priority (Amber)</option>
                            <option value="emerald">Critical (Emerald)</option>
                        </select>
                        <button onclick="window.app.createTask()" class="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] mt-4">Initialize Objective</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
