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
import * as Location from './location.js';
import * as Attendance from './attendance.js';

/**
 * INITIALIZATION: Runs when Employees page is opened
 */
export function initEmployees() {
    updateStaffGrid();
    updateStaffStats();

    // Global Access for Modals (Controlled)
    window.app.showEmployeeProfile = (id) => {
        const emp = Data.employeesData.find(e => e.id === id);
        if (!emp) return;

        import('./ui.js').then(UI => {
            const content = document.getElementById('page-content');
            if (content) {
                document.getElementById('page-title').innerText = "Asset Profile";
                document.getElementById('page-subtitle').innerText = emp.name.toUpperCase();
                content.innerHTML = getEmployeeProfileHTML(emp);
                if (window.lucide) window.lucide.createIcons();
                UI.switchView('view-page', true);
            }
        });
    };

    window.app.toggleStaffModal = (show, editId = null) => {
        const modal = document.getElementById('staff-modal');
        if (!modal) return;

        modal.classList.toggle('hidden', !show);
        const modalTitle = modal.querySelector('h2');
        const submitBtnText = document.getElementById('submit-btn-text');

        if (show && editId) {
            const emp = Data.employeesData.find(e => e.id === editId);
            if (emp) {
                document.getElementById('new-emp-name').value = emp.name || '';
                document.getElementById('new-emp-role').value = emp.role || 'Associate';
                document.getElementById('new-emp-shop').value = emp.shop || '';
                document.getElementById('new-emp-salary').value = emp.salary || '';
                document.getElementById('new-emp-whatsapp').value = emp.whatsapp || '';
                document.getElementById('new-emp-supervisor-name').value = emp.supervisorName || '';
                document.getElementById('new-emp-supervisor-whatsapp').value = emp.supervisorWhatsapp || '';
                document.getElementById('new-emp-cnic').value = emp.cnic || '';
                document.getElementById('new-emp-address').value = emp.address || '';

                if (emp.joined) {
                    const [day, month, year] = emp.joined.split('/');
                    document.getElementById('new-emp-date').value = `${year}-${month}-${day}`;
                }

                modal.dataset.editId = editId;
                if (modalTitle) modalTitle.innerText = "Edit Asset Profile";
                if (submitBtnText) submitBtnText.innerText = "Update Asset Record";
            }
        } else {
            delete modal.dataset.editId;
            if (modalTitle) modalTitle.innerText = "Asset Onboarding";
            if (submitBtnText) submitBtnText.innerText = "Confirm Asset Registration";
            // Reset fields
            document.getElementById('new-emp-name').value = '';
            document.getElementById('new-emp-salary').value = '';
            document.getElementById('new-emp-date').value = '';
            document.getElementById('new-emp-whatsapp').value = '';
            document.getElementById('new-emp-supervisor-name').value = '';
            document.getElementById('new-emp-supervisor-whatsapp').value = '';
            document.getElementById('new-emp-cnic').value = '';
            document.getElementById('new-emp-address').value = '';
            document.getElementById('staff-image-input').value = '';
        }

        if (!show && window.staffCropper) {
            window.staffCropper.destroy();
            window.staffCropper = null;
            document.getElementById('cropper-wrapper').classList.add('hidden');
        }

        if (window.lucide) window.lucide.createIcons();
    };

    window.app.handleStaffImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const wrapper = document.getElementById('cropper-wrapper');
            const image = document.getElementById('cropper-image');
            wrapper.classList.remove('hidden');
            image.src = e.target.result;

            if (window.staffCropper) window.staffCropper.destroy();

            window.staffCropper = new Cropper(image, {
                aspectRatio: 1,
                viewMode: 1,
                background: false,
                autoCropArea: 1,
            });
        };
        reader.readAsDataURL(file);
    };

    window.app.deleteEmployee = (id) => {
        if (confirm("Security Protocol: Are you sure you want to decommission this asset?")) {
            if (Data.db.deleteEmployee(id)) {
                updateStaffGrid();
                updateStaffStats();
            }
        }
    };

    window.app.registerEmployee = () => {
        const modal = document.getElementById('staff-modal');
        const editId = modal ? modal.dataset.editId : null;
        // ... rest of registerEmployee ...
    };

    window.app.punchIn = (id, shop) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                const record = Attendance.punchIn(id, shop, coords);
                if (record) {
                    alert(`Punch-In Successful at ${record.checkIn}`);
                    window.app.showEmployeeProfile(id);
                }
            }, (err) => alert("Security Alert: Location Access Denied"));
        }
    };

    window.app.punchOut = (id, attendanceId) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                if (Attendance.punchOut(attendanceId, coords)) {
                    alert("Punch-Out Successful");
                    window.app.showEmployeeProfile(id);
                }
            }, (err) => alert("Security Alert: Location Access Denied"));
        }
    };
}

function updateStaffGrid() {
    const container = document.getElementById('staff-grid-container');
    if (!container) return;

    container.innerHTML = Data.employeesData.map(e => `
        <div onclick="window.app.showEmployeeProfile('${e.id}')" class="luxury-card p-4 flex items-center gap-4 bg-white border-slate-200 hover:border-[#B8964B]/50 transition-all group relative overflow-hidden cursor-pointer shadow-sm">
            <div class="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 p-0.5 shrink-0 bg-slate-50">
                <img src="${e.avatar || `https://i.pravatar.cc/150?u=${e.id}`}" class="w-full h-full rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt="Staff">
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="text-[11px] font-black text-slate-900 uppercase truncate">${e.name}</h4>
                <p class="text-[7px] text-slate-500 uppercase tracking-widest truncate">${e.role} | ${e.shop}</p>
                <p class="text-[6px] text-[#B8964B] uppercase tracking-widest mt-0.5">Joined: ${e.joined || 'N/A'}</p>
            </div>
            <div class="text-right shrink-0">
                <p class="text-[9px] font-black text-slate-900">${(e.salary || 0).toLocaleString()}</p>
                <div class="flex items-center justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onclick="event.stopPropagation(); window.app.toggleStaffModal(true, '${e.id}')" class="text-blue-600 hover:text-blue-700">
                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="event.stopPropagation(); window.app.deleteEmployee('${e.id}')" class="text-rose-600 hover:text-rose-700">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
}

function getEmployeeProfileHTML(emp) {
    const lat = emp.location ? emp.location.lat : null;
    const lng = emp.location ? emp.location.lng : null;

    const todayRecord = Data.attendanceRecords.find(a =>
        a.employeeId === emp.id &&
        a.date === new Date().toISOString().split('T')[0] &&
        !a.checkOut
    );

    const history = Attendance.getAttendanceSummary(emp.id);

    return `
        <div class="h-full flex flex-col gap-4 overflow-y-auto pb-10 custom-scrollbar pr-1">
            <!-- Executive Profile Header -->
            <div class="luxury-card p-6 bg-white border-slate-200 relative overflow-hidden shadow-sm">
                <div class="absolute top-0 right-0 w-32 h-32 bg-[#B8964B]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div class="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div class="w-24 h-24 rounded-2xl border-2 border-[#B8964B]/30 p-1 bg-slate-50">
                        <img src="${emp.avatar || `https://i.pravatar.cc/150?u=${emp.id}`}" class="w-full h-full rounded-xl object-cover shadow-xl">
                    </div>
                    <div class="text-center md:text-left flex-1">
                        <div class="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <h2 class="text-xl font-black text-slate-900 uppercase tracking-wider">${emp.name}</h2>
                            <div class="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center border border-white">
                                <i data-lucide="check" class="w-2.5 h-2.5 text-white"></i>
                            </div>
                        </div>
                        <p class="text-[10px] text-[#B8964B] font-black uppercase tracking-[0.3em] mb-3">${emp.role} • ${emp.shop}</p>

                        <div class="flex flex-wrap justify-center md:justify-start gap-3">
                            ${todayRecord ? `
                                <button onclick="window.app.punchOut('${emp.id}', '${todayRecord.id}')" class="flex items-center gap-2 bg-rose-50 border border-rose-200 px-6 py-2 rounded-xl text-[9px] font-black text-rose-600 uppercase tracking-widest hover:bg-rose-100 transition-all">
                                    <i data-lucide="log-out" class="w-3.5 h-3.5"></i> Punch Out
                                </button>
                            ` : `
                                <button onclick="window.app.punchIn('${emp.id}', '${emp.shop}')" class="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-6 py-2 rounded-xl text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-100 transition-all">
                                    <i data-lucide="log-in" class="w-3.5 h-3.5"></i> Punch In
                                </button>
                            `}
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div class="luxury-card p-4 bg-slate-50 border-slate-200 text-center">
                            <p class="text-[7px] text-slate-500 uppercase font-black mb-1">Status</p>
                            <p class="text-[10px] font-black ${todayRecord ? 'text-emerald-600' : 'text-slate-400'} uppercase">${todayRecord ? 'On-Site' : 'Off-Duty'}</p>
                        </div>
                        <div class="luxury-card p-4 bg-slate-50 border-slate-200 text-center">
                            <p class="text-[7px] text-slate-500 uppercase font-black mb-1">Join Date</p>
                            <p class="text-[10px] font-black text-slate-900 uppercase">${emp.joined || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Tactical Intelligence (Map) -->
                <div class="luxury-card p-1 bg-white border-slate-200 h-64 overflow-hidden relative group">
                    <div class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                        <div class="rec-dot"></div>
                        <p class="text-[8px] font-black text-slate-900 uppercase tracking-widest">Live Tactical Feed</p>
                    </div>
                    ${Location.getMapEmbedHTML(lat, lng)}
                </div>

                <!-- Attendance History -->
                <div class="luxury-card p-6 bg-white border-slate-200 flex flex-col">
                    <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Attendance Terminal</h3>
                    <div class="flex-1 overflow-y-auto space-y-2">
                        ${history.length > 0 ? history.map(h => `
                            <div class="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <p class="text-[8px] font-black text-slate-900 uppercase">${h.date}</p>
                                    <p class="text-[7px] text-slate-500 uppercase">${h.checkIn} - ${h.checkOut || 'Active'}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[9px] font-black text-[#B8964B]">${h.duration || '--'}</p>
                                </div>
                            </div>
                        `).join('') : '<p class="text-center text-slate-400 text-[8px] uppercase tracking-widest py-10">No History Found</p>'}
                    </div>
                </div>
            </div>

                <!-- Personal Documentation -->
                <div class="luxury-card p-6 bg-white border-slate-200 space-y-4 shadow-sm">
                    <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Asset Documentation</h3>

                    <div class="grid grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <p class="text-[7px] text-slate-500 uppercase font-black">National Identity (CNIC)</p>
                            <p class="text-[11px] text-slate-900 font-bold">${emp.cnic || 'NOT RECORDED'}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-[7px] text-slate-500 uppercase font-black">Monthly Remuneration</p>
                            <p class="text-[11px] text-[#B8964B] font-black">${(emp.salary || 0).toLocaleString()} PKR</p>
                        </div>
                    </div>

                    <div class="space-y-1 mt-4">
                        <p class="text-[7px] text-slate-500 uppercase font-black">Residential Command</p>
                        <p class="text-[11px] text-slate-900 font-medium leading-relaxed">${emp.address || 'NO ADDRESS ON FILE'}</p>
                    </div>
                </div>
            </div>

            <!-- Command Chain (Supervisor) -->
            <div class="luxury-card p-6 bg-white border-slate-200 shadow-sm">
                <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Command Chain Isolation</h3>
                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-[#B8964B]/10 flex items-center justify-center text-[#B8964B] border border-[#B8964B]/20">
                            <i data-lucide="shield-check" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h4 class="text-[11px] font-black text-slate-900 uppercase">${emp.supervisorName || 'System Admin'}</h4>
                            <p class="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Immediate Reporting Officer</p>
                        </div>
                    </div>
                    <a href="https://wa.me/${emp.supervisorWhatsapp?.replace(/\D/g, '')}" target="_blank" class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                        <i data-lucide="phone" class="w-4 h-4"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
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
                <div class="luxury-card p-3 bg-white border-slate-200 shadow-sm">
                    <p class="text-[7px] font-black text-slate-500 uppercase tracking-widest">Total Assets</p>
                    <h3 class="text-lg font-bold text-slate-900 mt-1" id="stat-total-staff">0</h3>
                </div>
                <div class="luxury-card p-3 bg-emerald-50 border-emerald-100 shadow-sm">
                    <p class="text-[7px] font-black text-emerald-600 uppercase tracking-widest">Active Status</p>
                    <h3 class="text-lg font-bold text-slate-900 mt-1">100%</h3>
                </div>
                <div class="luxury-card p-3 bg-blue-50 border-blue-100 shadow-sm">
                    <p class="text-[7px] font-black text-blue-600 uppercase tracking-widest">Monthly Payroll</p>
                    <h3 class="text-lg font-bold text-slate-900 mt-1" id="stat-payroll-total">0</h3>
                </div>
                <div class="luxury-card p-3 bg-amber-50 border-amber-100 shadow-sm">
                    <p class="text-[7px] font-black text-[#B8964B] uppercase tracking-widest">Performance</p>
                    <h3 class="text-lg font-bold text-slate-900 mt-1">Elite</h3>
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
            <div id="staff-modal" class="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] hidden flex items-center justify-center p-4">
                <div class="luxury-card w-full max-w-lg max-h-[90vh] flex flex-col border-slate-200 relative overflow-hidden bg-white shadow-2xl">
                    <!-- Sticky Header -->
                    <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 backdrop-blur-xl shrink-0">
                        <h2 class="text-sm font-black text-slate-900 uppercase tracking-widest">Asset Onboarding</h2>
                        <button onclick="window.app.toggleStaffModal(false)" class="text-slate-400 hover:text-slate-900 transition-colors">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Scrollable Content -->
                    <div class="p-6 overflow-y-auto custom-scrollbar space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div class="space-y-1.5">
                                <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Name</label>
                                <input type="text" id="new-emp-name" placeholder="Full Legal Name" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all">
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp Number</label>
                                <input type="text" id="new-emp-whatsapp" placeholder="+92 3XX XXXXXXX" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div class="space-y-1.5">
                                <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Supervisor Name</label>
                                <input type="text" id="new-emp-supervisor-name" placeholder="Supervisor Name" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all">
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Supervisor WhatsApp</label>
                                <input type="text" id="new-emp-supervisor-whatsapp" placeholder="+92 3XX XXXXXXX" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div class="space-y-1.5">
                                <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">CNIC Number</label>
                                <input type="text" id="new-emp-cnic" placeholder="XXXXX-XXXXXXX-X" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all">
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Joining Date</label>
                                <input type="date" id="new-emp-date" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all appearance-none">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div class="space-y-1.5">
                                <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Executive Role</label>
                                <div class="relative">
                                    <select id="new-emp-role" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] text-slate-900 outline-none appearance-none focus:border-[#B8964B]/50 transition-all">
                                        <option class="bg-white">Director</option>
                                        <option class="bg-white">Manager</option>
                                        <option class="bg-white">Associate</option>
                                        <option class="bg-white">Security</option>
                                    </select>
                                    <i data-lucide="chevron-down" class="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                </div>
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Hub</label>
                                <div class="relative">
                                    <select id="new-emp-shop" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] text-slate-900 outline-none appearance-none focus:border-[#B8964B]/50 transition-all">
                                        ${Data.shopsData.map(s => `<option class="bg-white">${s.name}</option>`).join('')}
                                    </select>
                                    <i data-lucide="chevron-down" class="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div class="space-y-1.5">
                                <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Monthly Remuneration</label>
                                <input type="number" id="new-emp-salary" placeholder="0.00" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all">
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Profile Image</label>
                                <div class="relative">
                                    <input type="file" id="staff-image-input" accept="image/*" onchange="window.app.handleStaffImageUpload(event)" class="hidden">
                                    <label for="staff-image-input" class="w-full flex items-center justify-center gap-2.5 bg-[#B8964B]/5 border border-[#B8964B]/20 rounded-xl px-4 py-3 text-[10px] text-[#B8964B] font-bold cursor-pointer hover:bg-[#B8964B]/10 transition-all group">
                                        <i data-lucide="image-plus" class="w-4 h-4 group-hover:scale-110 transition-transform"></i>
                                        <span>CHOOSE IDENTITY PHOTO</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Residential Address</label>
                            <textarea id="new-emp-address" rows="2" placeholder="Full Home Address" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all"></textarea>
                        </div>

                        <!-- Cropper UI (Enhanced) -->
                        <div id="cropper-wrapper" class="hidden animate-in fade-in slide-in-from-top-4 duration-500 space-y-3">
                            <div class="flex justify-between items-center px-1">
                                <label class="text-[8px] font-black text-[#B8964B] uppercase tracking-widest">Adjust Perspective</label>
                                <button onclick="document.getElementById('staff-image-input').click()" class="text-[7px] font-bold text-slate-400 uppercase hover:text-slate-900 transition-colors">Change Photo</button>
                            </div>
                            <div class="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                                <img id="cropper-image" src="" class="max-w-full">
                            </div>
                        </div>
                    </div>

                    <!-- Sticky Footer -->
                    <div class="p-6 border-t border-slate-100 bg-slate-50 backdrop-blur-xl shrink-0">
                        <button onclick="window.app.registerEmployee()" class="w-full bg-gradient-to-r from-[#B8964B] via-[#D4AF37] to-[#B8964B] text-white py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.25em] shadow-lg active:scale-[0.97] transition-all flex items-center justify-center gap-2">
                            <i data-lucide="shield-check" class="w-4 h-4"></i>
                            <span id="submit-btn-text">Confirm Asset Registration</span>
                        </button>
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
        <div class="luxury-card p-4 flex items-center justify-between border-l-4 border-l-${task.color === 'emerald' ? 'emerald' : task.color === 'amber' ? 'amber' : 'blue'}-500 bg-white hover:bg-slate-50 transition-all group shadow-sm">
            <div>
                <h4 class="text-slate-900 font-bold text-[10px] uppercase tracking-wider">${task.label}</h4>
                <p class="text-[7px] text-slate-500 uppercase mt-0.5">${task.from} | ${task.amount}</p>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-[7px] font-black text-${task.color === 'emerald' ? 'emerald' : task.color === 'amber' ? 'amber' : 'blue'}-600 uppercase tracking-widest">${task.status}</span>
                <button onclick="window.app.deleteTask(${task.id})" class="text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100">
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
                <button onclick="window.app.goBack()" class="flex items-center gap-1 text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-[#B8964B] transition-colors">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i> BACK
                </button>
            </div>
            <div class="shrink-0 flex justify-between items-center px-1">
                <h3 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Tactical Schedule</h3>
                <button onclick="window.app.toggleTaskModal(true)" class="text-[7px] font-bold text-[#B8964B] uppercase tracking-widest border border-[#B8964B]/30 px-3 py-1 rounded-full hover:bg-[#B8964B]/10 transition-all">Add Objective</button>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div id="tasks-container" class="grid grid-cols-1 gap-3"></div>
            </div>

            <div id="task-modal" class="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] hidden flex items-center justify-center p-6">
                <div class="luxury-card w-full max-w-sm p-6 border-slate-200 bg-white relative shadow-2xl">
                    <button onclick="window.app.toggleTaskModal(false)" class="absolute top-4 right-4 text-slate-400 hover:text-slate-900">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                    <h2 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Tactical Objective</h2>
                    <div class="space-y-4">
                        <div class="space-y-1">
                            <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Objective Label</label>
                            <input type="text" id="new-task-label" placeholder="Objective Label" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-[10px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Source Hub</label>
                            <input type="text" id="new-task-from" placeholder="Source Hub" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-[10px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Target Volume/Value</label>
                            <input type="text" id="new-task-amount" placeholder="Target Volume/Value" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-[10px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[7px] font-black text-slate-500 uppercase ml-1">Priority Level</label>
                            <select id="new-task-color" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-[10px] text-slate-900 outline-none focus:border-[#B8964B]/50 transition-all appearance-none">
                                <option value="blue">Standard (Blue)</option>
                                <option value="amber">Priority (Amber)</option>
                                <option value="emerald">Critical (Emerald)</option>
                            </select>
                        </div>
                        <button onclick="window.app.createTask()" class="w-full bg-gradient-to-r from-[#B8964B] to-[#D4AF37] text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] mt-4 shadow-lg active:scale-95 transition-all">Initialize Objective</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
