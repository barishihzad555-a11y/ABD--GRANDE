/**
 * ============================================================================
 * ABD LUXURY SYSTEM | CORE KERNEL (PROTECTED)
 * ============================================================================
 * This is the primary entry point of the application.
 * Structural changes here may affect the entire boot sequence.
 * ============================================================================
 */
import * as UI from './modules/ui.js';
import { initFirebaseSync } from './modules/data.js';

// Global access for HTML onclick handlers
window.app = {
    switchView: UI.switchView,
    toggleTheme: UI.toggleTheme,
    openCameraDetail: UI.openCameraDetail,
    openShopDashboard: UI.openShopDashboard,
    showShopEmployees: UI.showShopEmployees,
    showShopFinance: UI.showShopFinance,
    openShopDetailByName: UI.openShopDetailByName,
    goBack: UI.goBack,
    deleteLoan: (id) => { if(confirm("Confirm Deletion?")) { import('./modules/data.js').then(D => { D.db.deleteLoan(id); import('./modules/finance.js').then(F => F.initLoans()); }); } }
};

// Initialize Application
window.addEventListener('DOMContentLoaded', () => {
    // Initial render and profile sync
    UI.initApp();

    // Initialize Real-time Cloud Sync (World-Class connectivity)
    initFirebaseSync(() => {
        UI.updateProfileHeader();
        UI.renderHome();
        console.log('ABD Cloud Sync: Data Updated');
    });

    // Start Clock
    setInterval(UI.updateClock, 1000);
    UI.updateClock();

    console.log('ABD Command System: Online');
});
