/**
 * ============================================================================
 * ABD LUXURY SYSTEM | CORE VIEW MANAGER (REINFORCED)
 * ============================================================================
 * PROTECTION STATUS: ACTIVE (ARCHITECTURAL ISOLATION)
 * VERSION: 4.1.0
 * DESCRIPTION: Centralized router with Enhanced Navigation History.
 * ============================================================================
 */
import * as Data from './data.js';
import * as Pages from './pages.js';
import * as Finance from './finance.js';
import * as Assets from './assets.js';
import * as Vision from './vision.js';
import * as Profile from './profile.js';

/**
 * NAVIGATION HISTORY SYSTEM
 */
let navHistory = [{ type: 'home' }];

function pushNav(type, id = null, subType = null) {
    if (type === 'view' && id === 'home') return;
    const last = navHistory[navHistory.length - 1];
    // Prevent duplicate entries
    if (last && last.type === type && last.id === id && last.subType === subType) return;
    navHistory.push({ type, id, subType });
}

export function goBack() {
    if (navHistory.length <= 1) {
        navHistory = [{ type: 'home' }];
        switchView('home', false);
        return;
    }
    navHistory.pop(); // remove current
    const prev = navHistory[navHistory.length - 1];

    if (prev.type === 'home') switchView('home', false);
    else if (prev.type === 'view') switchView(prev.id, false);
    else if (prev.type === 'shop') openShopDashboard(prev.id, false);
    else if (prev.type === 'shop-employees') showShopEmployees(prev.id, false);
    else if (prev.type === 'shop-finance') showShopFinance(prev.id, prev.subType, false);
    else if (prev.type === 'camera-detail') openCameraDetail(prev.id, false);
}

// Page Registry for strict isolation
const PAGE_MODULES = {
    'home': { render: renderHome, init: null },
    'sales': { render: Finance.getSalesPage, init: Finance.initSales },
    'employees': { render: Assets.getEmployeesPage, init: Assets.initEmployees },
    'loans': { render: Finance.getLoansPage, init: Finance.initLoans },
    'tasks': { render: Assets.getTasksPage, init: Assets.initTasks },
    'camera': { render: Vision.getCameraPage, init: null },
    'settings': { render: (cfg) => Profile.getProfilePageHTML(cfg), init: (cfg) => Profile.setupProfileInteractions(() => { updateProfileHeader(); renderHome(); }) }
};

export function initApp() {
    // Apply saved theme on boot
    const savedTheme = localStorage.getItem('ABD_THEME') || 'dark';
    if (savedTheme === 'vibrant-light') {
        document.body.classList.add('theme-vibrant-light');
    }

    // Add Shop Modal to body if not exists
    if (!document.getElementById('shop-modal')) {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'shop-modal';
        modalDiv.className = 'fixed inset-0 bg-black/95 backdrop-blur-md z-[100] hidden flex items-center justify-center p-6';
        modalDiv.innerHTML = `
            <div class="luxury-card w-full max-w-sm p-6 border-[#D4AF37]/20 relative">
                <button onclick="window.app.toggleShopModal(false)" class="absolute top-4 right-4 text-slate-500 hover:text-white">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
                <h2 class="text-sm font-black text-white uppercase tracking-widest mb-6">Authorize New Hub</h2>
                <div class="space-y-4">
                    <div class="space-y-1">
                        <label class="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">Hub Designation</label>
                        <input type="text" id="new-shop-name" placeholder="Ex: AIRPORT ROAD MALL" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none focus:border-[#D4AF37]/50">
                    </div>
                    <button onclick="window.app.registerShop()" class="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] mt-4 active:scale-95 transition-all">Initialize Hub</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    }

    updateProfileHeader();
    renderHome();

    // Global Modal Access
    window.app.toggleShopModal = (show) => {
        const modal = document.getElementById('shop-modal');
        if (modal) modal.classList.toggle('hidden', !show);
    };

    window.app.registerShop = () => {
        const name = document.getElementById('new-shop-name').value;
        if (!name) {
            alert("Security Alert: Identify Hub Name");
            return;
        }

        const success = Data.db.addShop({ name });
        if (success) {
            renderHome();
            window.app.toggleShopModal(false);
            document.getElementById('new-shop-name').value = '';
        }
    };

    // Auto-save logic every 30 seconds as an extra safety layer
    setInterval(() => {
        Data.db.save();
    }, 30000);

    // Initialize Quick Entry Modal
    initQuickEntryModal();
    initMediaTerminalHandlers();
}

let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let currentMode = 'photo'; // photo or video
let cameraFacing = 'environment';

function initMediaTerminalHandlers() {
    window.app.openMediaTerminal = async () => {
        const terminal = document.getElementById('media-capture-terminal');
        terminal.classList.remove('hidden');

        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: cameraFacing },
                audio: true
            });
            const video = document.getElementById('capture-video-preview');
            video.srcObject = mediaStream;
            if (window.lucide) window.lucide.createIcons();
        } catch (err) {
            alert("Security Alert: Camera Access Denied");
            window.app.closeMediaTerminal();
        }
    };

    window.app.closeMediaTerminal = () => {
        const terminal = document.getElementById('media-capture-terminal');
        terminal.classList.add('hidden');
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
    };

    window.app.toggleCameraFlip = () => {
        cameraFacing = cameraFacing === 'user' ? 'environment' : 'user';
        window.app.closeMediaTerminal();
        window.app.openMediaTerminal();
    };

    const photoBtn = document.getElementById('media-mode-photo');
    const videoBtn = document.getElementById('media-mode-video');
    const trigger = document.getElementById('capture-trigger');
    const innerDot = document.getElementById('capture-inner-dot');

    photoBtn.onclick = () => {
        currentMode = 'photo';
        photoBtn.classList.add('text-[#D4AF37]', 'border-[#D4AF37]');
        photoBtn.classList.remove('text-slate-500');
        videoBtn.classList.remove('text-[#D4AF37]', 'border-[#D4AF37]');
        videoBtn.classList.add('text-slate-500');
        innerDot.classList.add('hidden');
    };

    videoBtn.onclick = () => {
        currentMode = 'video';
        videoBtn.classList.add('text-[#D4AF37]', 'border-[#D4AF37]');
        videoBtn.classList.remove('text-slate-500');
        photoBtn.classList.remove('text-[#D4AF37]', 'border-[#D4AF37]');
        photoBtn.classList.add('text-slate-500');
    };

    trigger.onclick = () => {
        if (currentMode === 'photo') takePhoto();
        else toggleVideoRecording();
    };
}

async function takePhoto() {
    const video = document.getElementById('capture-video-preview');
    const canvas = document.getElementById('capture-canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    updateQEPreview(dataUrl);
    window.app.closeMediaTerminal();
}

function toggleVideoRecording() {
    const indicator = document.getElementById('recording-indicator');
    const innerDot = document.getElementById('capture-inner-dot');
    const timer = document.getElementById('recording-timer');

    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        indicator.classList.add('hidden');
        innerDot.classList.add('hidden');
        return;
    }

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/mp4' });
        const reader = new FileReader();
        reader.onloadend = () => {
            updateQEPreview(reader.result, true);
            window.app.closeMediaTerminal();
        };
        reader.readAsDataURL(blob);
    };

    mediaRecorder.start();
    indicator.classList.remove('hidden');
    innerDot.classList.remove('hidden');

    // Simple timer
    let seconds = 0;
    const interval = setInterval(() => {
        if (!mediaRecorder || mediaRecorder.state !== 'recording') {
            clearInterval(interval);
            return;
        }
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timer.innerText = `${mins}:${secs}`;
    }, 1000);
}

function updateQEPreview(dataUrl, isVideo = false) {
    const preview = document.getElementById('qe-proof-preview');
    const wrapper = document.getElementById('qe-proof-preview-wrapper');
    const videoPreview = document.createElement('video');

    // Clear previous
    wrapper.innerHTML = '';

    if (isVideo) {
        const vid = document.createElement('video');
        vid.src = dataUrl;
        vid.className = "w-12 h-12 rounded object-cover border border-[#D4AF37]/30";
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        wrapper.appendChild(vid);
        window.app.currentMedia = { data: dataUrl, type: 'video' };
    } else {
        const img = document.createElement('img');
        img.src = dataUrl;
        img.id = "qe-proof-preview";
        img.className = "w-12 h-12 rounded object-cover border border-[#D4AF37]/30";
        wrapper.appendChild(img);
        window.app.currentMedia = { data: dataUrl, type: 'image' };
    }

    const p = document.createElement('p');
    p.className = "text-[7px] font-bold text-emerald-500 uppercase";
    p.innerText = isVideo ? "Secure Video Attached" : "Secure Photo Attached";
    wrapper.appendChild(p);

    wrapper.classList.remove('hidden');
}

function initQuickEntryModal() {
    if (!document.getElementById('quick-entry-modal')) {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'quick-entry-modal';
        modalDiv.className = 'fixed inset-0 bg-black/98 backdrop-blur-2xl z-[150] hidden flex items-center justify-center p-4';
        modalDiv.innerHTML = `
            <div class="luxury-card w-full max-w-sm p-6 border-[#D4AF37]/20 relative">
                <button onclick="window.app.toggleQuickEntry(false)" class="absolute top-4 right-4 text-slate-500 hover:text-white">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
                <h2 id="qe-title" class="text-xs font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-6">Initialize Entry</h2>

                <div class="space-y-4" id="qe-form-content">
                    <!-- Dynamic Content -->
                </div>

                <div id="qe-proof-preview-wrapper" class="hidden mt-4 p-2 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3">
                    <img id="qe-proof-preview" class="w-12 h-12 rounded object-cover">
                    <p class="text-[7px] font-bold text-emerald-500 uppercase">Secure Proof Attached</p>
                </div>

                <button id="qe-submit-btn" class="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] mt-6 active:scale-95 transition-all">
                    Authorize Entry
                </button>
            </div>
        `;
        document.body.appendChild(modalDiv);
    }

    window.app.toggleQuickEntry = (show) => {
        const modal = document.getElementById('quick-entry-modal');
        if (modal) modal.classList.toggle('hidden', !show);
    };

    window.app.showQuickEntry = (type, shopId) => {
        const shop = Data.shopsData.find(s => s.id === parseInt(shopId));
        const title = document.getElementById('qe-title');
        const content = document.getElementById('qe-form-content');
        const submitBtn = document.getElementById('qe-submit-btn');
        const previewWrapper = document.getElementById('qe-proof-preview-wrapper');

        previewWrapper.classList.add('hidden');
        window.app.currentQE = { type, shopId, shopName: shop.name };

        let html = '';
        if (type === 'sale') {
            title.innerText = 'Authorize Revenue Entry';
            html = `
                <div class="space-y-1">
                    <label class="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Description</label>
                    <input type="text" id="qe-input-desc" placeholder="Ex: Premium Watch" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none focus:border-[#D4AF37]/50">
                </div>
                <div class="space-y-1">
                    <label class="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">Market Value</label>
                    <input type="number" id="qe-input-amount" placeholder="0.00" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none focus:border-[#D4AF37]/50">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="window.app.openMediaTerminal()" class="bg-[#D4AF37]/10 border border-[#D4AF37]/30 py-3 rounded-xl flex items-center justify-center gap-2 text-[#D4AF37]">
                        <i data-lucide="camera" class="w-4 h-4"></i>
                        <span class="text-[8px] font-bold uppercase tracking-widest">Live Cam</span>
                    </button>
                    <button onclick="document.getElementById('qe-file-input').click()" class="bg-white/5 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-slate-400">
                        <i data-lucide="upload" class="w-4 h-4"></i>
                        <span class="text-[8px] font-bold uppercase tracking-widest">Gallery</span>
                    </button>
                </div>
                <input type="file" id="qe-file-input" class="hidden" accept="image/*,video/*" onchange="window.app.handleQEFile(event)">
            `;
        } else if (type === 'expense') {
            title.innerText = 'Authorize Expense Ledger';
            html = `
                <div class="space-y-1">
                    <label class="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">Expense Description</label>
                    <input type="text" id="qe-input-desc" placeholder="Ex: Utility Bill" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none focus:border-[#D4AF37]/50">
                </div>
                <div class="space-y-1">
                    <label class="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount</label>
                    <input type="number" id="qe-input-amount" placeholder="0.00" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none focus:border-[#D4AF37]/50">
                </div>
                <button onclick="document.getElementById('qe-file-input').click()" class="w-full bg-white/5 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-slate-400">
                    <i data-lucide="camera" class="w-4 h-4"></i>
                    <span class="text-[8px] font-bold uppercase tracking-widest">Attach Bill</span>
                </button>
                <input type="file" id="qe-file-input" class="hidden" accept="image/*" onchange="window.app.handleQEFile(event)">
            `;
        } else if (type === 'debt') {
             title.innerText = 'Authorize Debt Portfolio';
             html = `
                <div class="space-y-1">
                    <label class="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity Name</label>
                    <input type="text" id="qe-input-desc" placeholder="Target Entity" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none focus:border-[#D4AF37]/50">
                </div>
                <div class="space-y-1">
                    <label class="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">Portfolio Type</label>
                    <select id="qe-input-loan-type" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none focus:border-[#D4AF37]/50">
                        <option value="Receivable">Receivable</option>
                        <option value="Payable">Payable</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">Capital Amount</label>
                    <input type="number" id="qe-input-amount" placeholder="0.00" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none focus:border-[#D4AF37]/50">
                </div>
                <button onclick="document.getElementById('qe-file-input').click()" class="w-full bg-white/5 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-slate-400">
                    <i data-lucide="camera" class="w-4 h-4"></i>
                    <span class="text-[8px] font-bold uppercase tracking-widest">Attach Cheque/Proof</span>
                </button>
                <input type="file" id="qe-file-input" class="hidden" accept="image/*" onchange="window.app.handleQEFile(event)">
            `;
        } else if (type === 'proof') {
            title.innerText = 'Secure Visual Proof';
            html = `
                <div class="space-y-1">
                    <label class="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">Proof Context</label>
                    <input type="text" id="qe-input-desc" placeholder="Ex: Inventory Check" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white outline-none focus:border-[#D4AF37]/50">
                </div>
                <button onclick="document.getElementById('qe-file-input').click()" class="w-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 py-8 rounded-xl flex flex-col items-center justify-center gap-3 text-[#D4AF37]">
                    <i data-lucide="camera" class="w-8 h-8"></i>
                    <span class="text-[9px] font-black uppercase tracking-[0.2em]">Capture Document</span>
                </button>
                <input type="file" id="qe-file-input" class="hidden" accept="image/*" onchange="window.app.handleQEFile(event)">
            `;
        }

        content.innerHTML = html;
        submitBtn.onclick = () => processQuickEntry();
        window.app.toggleQuickEntry(true);
        if (window.lucide) window.lucide.createIcons();
    };

    window.app.exportShopData = (shopName, type) => {
        Data.db.exportToCSV(shopName, type);
    };

    window.app.deleteLoan = (id) => {
        if(confirm("Confirm deletion of this financial record?")) {
            Data.db.deleteLoan(id);
            // Refresh current view if it's loans
            if(document.getElementById('loans-list')) {
                // This logic is usually in finance.js but we can trigger it here or by re-rendering
                switchView('loans', false);
            }
        }
    };

    window.app.handleQEFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const isVideo = file.type.startsWith('video/');
            const reader = new FileReader();
            reader.onload = (event) => {
                updateQEPreview(event.target.result, isVideo);
            };
            reader.readAsDataURL(file);
        }
    };

    function processQuickEntry() {
        const { type, shopName, shopId } = window.app.currentQE;
        const desc = document.getElementById('qe-input-desc')?.value;
        const amount = parseFloat(document.getElementById('qe-input-amount')?.value) || 0;
        const media = window.app.currentMedia;
        const isProofAttached = media && media.data;

        if (!desc || (type !== 'proof' && amount <= 0)) {
            alert("Executive Security Alert: Invalid Data Signature");
            return;
        }

        let success = false;
        const mediaData = isProofAttached ? media.data : null;
        const mediaType = isProofAttached ? media.type : null;

        if (type === 'sale') {
            success = Data.db.addSale({
                shop: shopName,
                product: desc,
                amount,
                profit: amount * 0.15,
                proof: mediaData,
                mediaType: mediaType
            });
        } else if (type === 'expense') {
            success = Data.db.addExpense({
                shop: shopName,
                description: desc,
                amount,
                proof: mediaData,
                mediaType: mediaType
            });
        }
else if (type === 'debt') {
            const loanType = document.getElementById('qe-input-loan-type').value;
            success = Data.db.addLoan({ entity: desc, type: loanType, amount, dueDate: '', status: 'Active', proof: isProofAttached ? proof : null });
        } else if (type === 'proof') {
            success = Data.db.addExpense({ shop: shopName, description: `[PROOF] ${desc}`, amount: 0, proof: isProofAttached ? proof : null });
        }

        if (success) {
            // PROFESSIONAL UPGRADE: Don't close for continuous entries
            // Clear inputs and show success animation instead of closing
            const submitBtn = document.getElementById('qe-submit-btn');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = "✓ AUTHORIZED & SYNCED";
            submitBtn.classList.replace('bg-[#D4AF37]', 'bg-emerald-500');
            submitBtn.classList.add('text-white');

            // Reset only inputs, keep modal open
            if(document.getElementById('qe-input-desc')) document.getElementById('qe-input-desc').value = '';
            if(document.getElementById('qe-input-amount')) document.getElementById('qe-input-amount').value = '';
            document.getElementById('qe-proof-preview-wrapper').classList.add('hidden');
            document.getElementById('qe-proof-preview-wrapper').innerHTML = '';
            window.app.currentMedia = null;

            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.classList.replace('bg-emerald-500', 'bg-[#D4AF37]');
                submitBtn.classList.remove('text-white');
            }, 2000);

            // Optional: Refresh background dashboard data without full reload
            openShopDashboard(shopId, false);
        }
    }
}

export function updateProfileHeader() {
    try {
        const elements = {
            name: document.getElementById('admin-name-display'),
            role: document.getElementById('admin-role-display'),
            avatar: document.querySelector('.avatar-frame img'),
            verified: document.getElementById('admin-verified-badge'),
            avatarVerified: document.getElementById('admin-avatar-verified')
        };

        if (elements.name) elements.name.innerText = Data.config.adminName;
        if (elements.role) elements.role.innerText = Data.config.adminRole;
        if (elements.avatar) elements.avatar.src = Data.config.adminAvatar;

        const isVerified = Data.config.isVerified;
        if (elements.verified) elements.verified.classList.toggle('hidden', !isVerified);
        if (elements.avatarVerified) {
            elements.avatarVerified.classList.toggle('hidden', !isVerified);
            elements.avatarVerified.style.display = isVerified ? 'flex' : 'none';
        }

        if (window.lucide) window.lucide.createIcons();
    } catch (e) { console.error("Profile Sync Error:", e); }
}

export function renderHome() {
    try {
        const shops = Data.shopsData || [];
        const container = document.getElementById('shop-cards-container');
        if (container) {
            let html = shops.map(shop => `
                <button onclick="window.app.openShopDashboard(${shop.id})" class="hub-item group">
                    <span class="hub-title">${shop.name}</span>
                    <span class="hub-value">${(parseFloat(shop.monthlySales) || 0).toLocaleString()}</span>
                </button>
            `).join('');

            // Add Registration Trigger
            html += `
                <button onclick="window.app.toggleShopModal(true)" class="hub-item group border-dashed border-[#D4AF37]/30 bg-transparent flex flex-col items-center justify-center gap-1">
                    <i data-lucide="plus" class="w-5 h-5 text-[#D4AF37]"></i>
                    <span class="text-[7px] font-black text-slate-500 uppercase tracking-widest">New Hub</span>
                </button>
            `;

            container.innerHTML = html;
        }

        // Calculate Global Totals for Gauges
        const totalSales = shops.reduce((sum, s) => sum + (parseFloat(s.monthlySales) || 0), 0);
        const totalExpense = shops.reduce((sum, s) => sum + (parseFloat(s.monthlyExpense) || 0), 0);
        const totalDebt = shops.reduce((sum, s) => sum + (parseFloat(s.debt) || 0), 0);

        const metersGrid = document.querySelector('.stats-grid');
        if (metersGrid) {
            metersGrid.innerHTML = Pages.getMetersHTML(totalSales, totalExpense, totalDebt);
        }

        const featuredCam = document.getElementById('home-featured-camera');
        if (featuredCam) featuredCam.innerHTML = Vision.getFeaturedCameraHTML();

        if (window.lucide) window.lucide.createIcons();
    } catch (error) { console.error("Home Render Error:", error); }
}

export function switchView(viewId, record = true) {
    if (record) pushNav('view', viewId);
    if (viewId === 'home' && record) navHistory = [{ type: 'home' }];

    const home = document.getElementById('view-home');
    const page = document.getElementById('view-page');
    if (!home || !page) return;

    page.scrollTop = 0;

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.id === `nav-${viewId.substring(0, 3)}`) item.classList.add('active');
    });

    if (viewId === 'home') {
        page.classList.add('opacity-0', 'translate-y-10');
        setTimeout(() => {
            page.classList.add('hidden');
            home.classList.remove('hidden');
            setTimeout(() => home.classList.remove('opacity-0', '-translate-y-10'), 50);
            renderHome();
        }, 300);
    } else {
        home.classList.add('opacity-0', '-translate-y-10');
        setTimeout(() => {
            home.classList.add('hidden');
            page.classList.remove('hidden');
            loadPageContent(viewId);
            setTimeout(() => page.classList.remove('opacity-0', 'translate-y-10'), 50);
        }, 300);
    }
}

function loadPageContent(viewId) {
    const title = document.getElementById('page-title');
    const subtitle = document.getElementById('page-subtitle');
    const content = document.getElementById('page-content');
    const pageHeader = document.getElementById('view-page').querySelector('header');

    if (!content) return;
    if (pageHeader) pageHeader.classList.toggle('hidden', viewId === 'settings');

    const module = PAGE_MODULES[viewId];
    if (module) {
        updateTitles(viewId, title, subtitle);
        content.innerHTML = (viewId === 'settings') ? module.render(Data.config) : module.render();
        if (module.init) module.init(Data.config);
    }

    if (window.lucide) window.lucide.createIcons();
}

function updateTitles(viewId, title, subtitle) {
    if (!title || !subtitle) return;
    const titles = {
        'sales': { t: 'Revenue Intelligence', s: 'Global Transaction Monitoring' },
        'employees': { t: 'Human Capital', s: 'Global Talent Management' },
        'loans': { t: 'Capital Management', s: 'Liability & Credit Portfolio' },
        'tasks': { t: 'Daily Operations', s: 'Tactical Execution Schedule' },
        'camera': { t: 'Command Vision', s: 'Live Global Surveillance' },
        'settings': { t: '', s: '' }
    };
    if (titles[viewId]) {
        title.innerText = titles[viewId].t;
        subtitle.innerText = titles[viewId].s;
    }
}

export function updateClock() {
    const timeEl = document.getElementById('current-time');
    const camTimeEl = document.getElementById('cam-timestamp');
    const timeStr = new Date().toLocaleTimeString('en-US', {
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    if (timeEl) timeEl.innerText = timeStr;
    if (camTimeEl) camTimeEl.innerText = timeStr;
}

export function toggleTheme() {
    const isLight = document.body.classList.toggle('theme-vibrant-light');
    localStorage.setItem('ABD_THEME', isLight ? 'vibrant-light' : 'dark');
}

export function openCameraDetail(cameraName, record = true) {
    if (record) pushNav('camera-detail', cameraName);
    const content = document.getElementById('page-content');
    if (content) {
        content.innerHTML = Vision.getCameraDetailPage(cameraName);
        if (window.lucide) window.lucide.createIcons();
    }
}

export function openShopDashboard(shopId, record = true) {
    const shop = Data.shopsData.find(s => s.id === parseInt(shopId));
    if (!shop) return;
    if (record) pushNav('shop', shop.id);
    renderShopDashboard(shop);
}

export function openShopDetailByName(name, record = true) {
    const shop = Data.shopsData.find(s => s.name === name);
    if (!shop) return;
    if (record) pushNav('shop', shop.id);
    renderShopDashboard(shop);
}

function renderShopDashboard(shop) {
    const content = document.getElementById('page-content');
    if (content) {
        document.getElementById('page-title').innerText = shop.name;
        document.getElementById('page-subtitle').innerText = 'MANAGEMENT DASHBOARD';
        content.innerHTML = Pages.getShopDashboardPage(shop);
        switchView('shop-dashboard', false);
    }
}

export function showShopEmployees(shopName, record = true) {
    if (record) pushNav('shop-employees', shopName);
    const shopEmployees = Data.employeesData.filter(emp => emp.shop === shopName);
    const content = document.getElementById('page-content');
    if (content) {
        document.getElementById('page-title').innerText = shopName;
        document.getElementById('page-subtitle').innerText = 'HUMAN CAPITAL';
        content.innerHTML = Pages.getShopEmployeesPage(shopName, shopEmployees);
        if (window.lucide) window.lucide.createIcons();
    }
}

export function showShopFinance(shopId, type, record = true) {
    if (record) pushNav('shop-finance', shopId, type);
    const shop = Data.shopsData.find(s => s.id === parseInt(shopId));
    if (!shop) return;

    const content = document.getElementById('page-content');
    if (content) {
        const typeLabels = {
            'sales': 'REVENUE INTELLIGENCE',
            'expense': 'EXPENSE LEDGER',
            'debt': 'LIABILITY TRACKER'
        };
        document.getElementById('page-title').innerText = shop.name;
        document.getElementById('page-subtitle').innerText = typeLabels[type] || 'FINANCE';
        content.innerHTML = Pages.getShopFinancePage(shop, type);

        // Populate real-time activity feed
        const feed = document.getElementById('shop-activity-feed');
        if (feed) {
            const isSales = type === 'sales';
            const records = isSales
                ? Data.salesRecords.filter(r => r.shop === shop.name)
                : (type === 'expense' ? Data.expensesRecords.filter(r => r.shop === shop.name) : []);

            if (records.length > 0) {
                feed.innerHTML = records.map(r => `
                    <div class="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all">
                        <div class="flex items-center gap-3">
                            ${r.proof ? `<div class="w-8 h-8 rounded bg-white/5 overflow-hidden border border-white/10" onclick="window.app.viewProof('${r.proof}')"><img src="${r.proof}" class="w-full h-full object-cover"></div>` : ''}
                            <div>
                                <h4 class="text-[9px] font-bold text-white uppercase">${r.product || r.description}</h4>
                                <p class="text-[7px] text-slate-500 uppercase mt-0.5">${r.date} • ${r.time}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] font-black text-white">${r.amount.toLocaleString()}</p>
                            <p class="text-[7px] text-emerald-500 uppercase font-bold">Authorized</p>
                        </div>
                    </div>
                `).join('');
            } else {
                feed.innerHTML = '<p class="text-center text-slate-600 text-[8px] uppercase tracking-widest py-10">No recent transactions found.</p>';
            }
        }

        if (window.lucide) window.lucide.createIcons();
    }
}
