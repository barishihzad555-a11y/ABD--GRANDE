/**
 * ============================================================================
 * ABD LUXURY SYSTEM | CORE DATA ENGINE (SECURE & PERSISTENT)
 * ============================================================================
 * PROTECTION STATUS: ACTIVE (DATA ENCAPSULATION)
 * VERSION: 4.0.0
 * DESCRIPTION: Centralized state management with LocalStorage persistence.
 * ============================================================================
 */

import { db as firebaseDb } from './firebase-init.js';
import { doc, setDoc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initial Default State
const DEFAULT_STATE = {
    config: {
        adminName: 'ALEXANDER ABD',
        adminRole: 'Executive Owner',
        adminEmail: 'admin@abd-global.com',
        adminPhone: '+92 300 1234567',
        adminAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
        adminCover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200',
        adminBio: 'Chief Executive Officer & Founder of ABD Global Enterprises.',
        adminLocation: 'Quetta, Pakistan',
        adminJoined: 'Jan 2024',
        isVerified: true,
        isAdmin: true,
        theme: 'luxury'
    },
    shops: [
        { id: 1, name: 'AIRPORT ROAD GRANDE', status: 'Online', dailySales: 0, monthlySales: 0, dailyExpense: 0, monthlyExpense: 0, debt: 0, staffCount: 0 },
        { id: 2, name: 'MANAN CHOWK GRANDE', status: 'Online', dailySales: 0, monthlySales: 0, dailyExpense: 0, monthlyExpense: 0, debt: 0, staffCount: 0 },
        { id: 3, name: 'AIRPORT ROAD MALL', status: 'Online', dailySales: 0, monthlySales: 0, dailyExpense: 0, monthlyExpense: 0, debt: 0, staffCount: 0 },
        { id: 4, name: 'ECCO SHOES', status: 'Online', dailySales: 0, monthlySales: 0, dailyExpense: 0, monthlyExpense: 0, debt: 0, staffCount: 0 },
        { id: 5, name: 'WAREHOUSE HQ', status: 'Online', dailySales: 0, monthlySales: 0, dailyExpense: 0, monthlyExpense: 0, debt: 0, staffCount: 0 }
    ],
    employees: [],
    sales: [],
    loans: [],
    tasks: [
        { id: 1, label: 'Daily Cash Audit', from: 'System', amount: 'N/A', status: 'Pending', color: 'amber' },
        { id: 2, label: 'Staff Attendance', from: 'HR', amount: 'N/A', status: 'Active', color: 'blue' }
    ]
};

// Private State (Loaded from LocalStorage or Default)
let state = (function() {
    const saved = localStorage.getItem('ABD_SYSTEM_STATE');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Ensure new structures exist
            if (!parsed.loans) parsed.loans = [];
            if (!parsed.tasks) parsed.tasks = DEFAULT_STATE.tasks;
            return parsed;
        } catch (e) {
            return DEFAULT_STATE;
        }
    }
    return DEFAULT_STATE;
})();

// Persistence Helper
const saveState = async () => {
    localStorage.setItem('ABD_SYSTEM_STATE', JSON.stringify(state));

    try {
        await setDoc(doc(firebaseDb, "system", "state"), state);
    } catch (e) {
        console.warn("Firebase Sync Failed:", e);
    }
};

/**
 * FIREBASE REAL-TIME SYNC ENGINE
 */
export const initFirebaseSync = (onUpdate) => {
    onSnapshot(doc(firebaseDb, "system", "state"), (docSnap) => {
        if (docSnap.exists()) {
            const cloudData = docSnap.data();

            // Sync all major data nodes
            if (cloudData.config) Object.assign(state.config, cloudData.config);
            if (cloudData.shops) { state.shops.length = 0; state.shops.push(...cloudData.shops); }
            if (cloudData.employees) { state.employees.length = 0; state.employees.push(...cloudData.employees); }
            if (cloudData.sales) { state.sales.length = 0; state.sales.push(...cloudData.sales); }
            if (cloudData.loans) { state.loans.length = 0; state.loans.push(...cloudData.loans); }
            if (cloudData.tasks) { state.tasks.length = 0; state.tasks.push(...cloudData.tasks); }

            localStorage.setItem('ABD_SYSTEM_STATE', JSON.stringify(state));
            if (onUpdate) onUpdate();
        } else {
            saveState();
        }
    });
};

export const config = state.config;
export const shopsData = state.shops;
export const employeesData = state.employees;
export const salesRecords = state.sales;
export const loansData = state.loans;
export const tasksData = state.tasks;

export const db = {
    save: () => saveState(),
    updateConfig: (newConfig) => { Object.assign(state.config, newConfig); saveState(); },

    addSale: (record) => {
        const newEntry = {
            id: `TX-${Math.floor(10000 + Math.random() * 89999)}`,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString(),
            ...record
        };
        state.sales.unshift(newEntry);

        // Update Shop Totals
        const shop = state.shops.find(s => s.name === record.shop);
        if (shop) {
            shop.dailySales = (parseFloat(shop.dailySales) || 0) + parseFloat(record.amount);
            shop.monthlySales = (parseFloat(shop.monthlySales) || 0) + parseFloat(record.amount);
        }

        saveState();
        return true;
    },

    addEmployee: (emp) => {
        const newEntry = {
            id: `EMP-${Math.floor(100 + Math.random() * 899)}`,
            avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
            joined: new Date().toLocaleDateString('en-GB'),
            status: 'Present',
            location: 'In Store',
            rating: 5,
            ...emp
        };
        state.employees.unshift(newEntry);

        // Update Shop Staff Count
        const shop = state.shops.find(s => s.name === emp.shop);
        if (shop) shop.staffCount = (shop.staffCount || 0) + 1;

        saveState();
        return true;
    },

    deleteEmployee: (id) => {
        const index = state.employees.findIndex(e => e.id === id);
        if (index !== -1) {
            const emp = state.employees[index];
            const shop = state.shops.find(s => s.name === emp.shop);
            if (shop) shop.staffCount = Math.max(0, (shop.staffCount || 0) - 1);
            state.employees.splice(index, 1);
            saveState();
            return true;
        }
        return false;
    },

    addShop: (shop) => {
        const newShop = {
            id: state.shops.length > 0 ? Math.max(...state.shops.map(s => s.id)) + 1 : 1,
            status: 'Online',
            dailySales: 0,
            monthlySales: 0,
            dailyExpense: 0,
            monthlyExpense: 0,
            debt: 0,
            staffCount: 0,
            ...shop
        };
        state.shops.push(newShop);
        saveState();
        return true;
    },

    deleteShop: (id) => {
        const index = state.shops.findIndex(s => s.id === id);
        if (index !== -1) {
            state.shops.splice(index, 1);
            saveState();
            return true;
        }
        return false;
    },

    addLoan: (loan) => {
        const newLoan = {
            id: `LN-${Math.floor(1000 + Math.random() * 8999)}`,
            date: new Date().toISOString().split('T')[0],
            ...loan
        };
        state.loans.unshift(newLoan);
        saveState();
        return true;
    },

    deleteLoan: (id) => {
        const index = state.loans.findIndex(l => l.id === id);
        if (index !== -1) {
            state.loans.splice(index, 1);
            saveState();
            return true;
        }
        return false;
    },

    addTask: (task) => {
        const newTask = {
            id: state.tasks.length > 0 ? Math.max(...state.tasks.map(t => t.id)) + 1 : 1,
            status: 'Pending',
            color: 'blue',
            ...task
        };
        state.tasks.unshift(newTask);
        saveState();
        return true;
    },

    deleteTask: (id) => {
        const index = state.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            state.tasks.splice(index, 1);
            saveState();
            return true;
        }
        return false;
    },

    updateTaskStatus: (id, status) => {
        const task = state.tasks.find(t => t.id === id);
        if (task) { task.status = status; saveState(); }
    },

    // Get specific shop data
    getShop: (id) => state.shops.find(s => s.id === id),

    // Reset System (Debug/Emergency)
    factoryReset: () => {
        if (confirm("WARNING: All data will be wiped. Proceed?")) {
            localStorage.removeItem('ABD_SYSTEM_STATE');
            location.reload();
        }
    }
};

