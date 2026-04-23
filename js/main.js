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
import { initAuth, logout } from './modules/auth.js';
import { initLocationTracking } from './modules/location.js';

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
    logout: logout,
    viewProof: (src) => {
        const modal = document.getElementById('proof-modal');
        const img = document.getElementById('proof-image-large');
        if (!modal || !img) return;
        if (src) {
            img.src = src;
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    },
    deleteLoan: (id) => { if(confirm("Confirm Deletion?")) { import('./modules/data.js').then(D => { D.db.deleteLoan(id); import('./modules/finance.js').then(F => F.initLoans()); }); } }
};

// Initialize Application
window.addEventListener('DOMContentLoaded', () => {
    // PRE-INITIALIZE UI (Instant Load from LocalStorage)
    UI.initApp();

    // Initialize Auth Sequence
    initAuth((user) => {
        // Refresh UI with authenticated profile
        UI.updateProfileHeader();

        // Initialize Real-time Cloud Sync
        initFirebaseSync(() => {
            UI.updateProfileHeader();
            UI.renderHome();
            console.log('ABD Cloud Sync: Data Updated');
        });

        // Initialize Location Tracking
        initLocationTracking();
    });

    // Start Clock
    setInterval(UI.updateClock, 1000);
    UI.updateClock();

    console.log('ABD Command System: Online');
});
