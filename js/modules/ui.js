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

    updateProfileHeader();
    renderHome();

    // Auto-save logic every 30 seconds as an extra safety layer
    setInterval(() => {
        Data.db.save();
    }, 30000);
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
        const container = document.getElementById('shop-cards-container');
        if (container) {
            container.innerHTML = (Data.shopsData || []).map(shop => `
                <button onclick="window.app.openShopDashboard(${shop.id})" class="hub-item group">
                    <span class="hub-title">${shop.name}</span>
                    <span class="hub-value">${(parseFloat(shop.monthlySales) || 0).toLocaleString()}</span>
                </button>
            `).join('');
        }

        // Calculate Global Totals for Gauges
        const totalSales = Data.shopsData.reduce((sum, s) => sum + (parseFloat(s.monthlySales) || 0), 0);
        const totalExpense = Data.shopsData.reduce((sum, s) => sum + (parseFloat(s.monthlyExpense) || 0), 0);
        const totalDebt = Data.shopsData.reduce((sum, s) => sum + (parseFloat(s.debt) || 0), 0);

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
    if (timeEl) {
        timeEl.innerText = new Date().toLocaleTimeString('en-US', {
            hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }
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
            const records = Data.salesRecords.filter(r => r.shop === shop.name);
            if (records.length > 0) {
                feed.innerHTML = records.map(r => `
                    <div class="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all">
                        <div>
                            <h4 class="text-[9px] font-bold text-white uppercase">${r.product}</h4>
                            <p class="text-[7px] text-slate-500 uppercase mt-0.5">${r.date} • ${r.time}</p>
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
