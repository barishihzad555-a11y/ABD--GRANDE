/**
 * ============================================================================
 * ABD LUXURY SYSTEM | EXECUTIVE PROFILE MODULE (GLOBAL STANDARD)
 * ============================================================================
 */

import * as Data from './data.js';

export function getProfilePageHTML(config) {
    const role = config.adminRole || 'Executive Owner';

    return `
        <div class="h-full flex flex-col bg-[#050505] overflow-hidden animate-fade-in font-['Plus_Jakarta_Sans']">
            <!-- LUXURY HEADER & COVER -->
            <div class="shrink-0 relative h-48 group">
                <img id="profile-cover-preview" src="${config.adminCover || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200'}"
                     class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity">
                <div class="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>

                <label for="profile-cover-input" class="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl cursor-pointer hover:bg-[#D4AF37]/20 transition-all">
                    <i data-lucide="image" class="w-4 h-4 text-[#D4AF37]"></i>
                    <input type="file" id="profile-cover-input" class="hidden" accept="image/*">
                </label>

                <button onclick="window.app.goBack()" class="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-[#D4AF37]/20 transition-all group">
                    <i data-lucide="chevron-left" class="w-6 h-6 text-[#D4AF37] group-hover:-translate-x-1 transition-transform"></i>
                </button>
            </div>

            <!-- PROFILE IDENTITY CARD -->
            <div class="shrink-0 px-6 -mt-16 relative z-10">
                <div class="flex flex-col items-center">
                    <div class="relative group">
                        <div class="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-[#050505] p-1 bg-gradient-to-br from-[#D4AF37] to-[#8A6D3B] shadow-2xl">
                            <img id="profile-avatar-preview" src="${config.adminAvatar}" class="w-full h-full object-cover rounded-[2rem] bg-black" alt="Profile">
                        </div>
                        <label for="profile-avatar-input" class="absolute bottom-1 right-1 w-10 h-10 bg-[#D4AF37] rounded-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-xl border-4 border-[#050505]">
                            <i data-lucide="camera" class="w-5 h-5 text-black"></i>
                            <input type="file" id="profile-avatar-input" class="hidden" accept="image/*">
                        </label>
                    </div>

                    <div class="text-center mt-4">
                        <div class="flex items-center justify-center gap-2 mb-1">
                            <h2 id="display-name-live" class="text-2xl font-black text-white tracking-tight uppercase">${config.adminName}</h2>
                            ${config.isVerified ? `<i data-lucide="badge-check" class="w-6 h-6 text-blue-400 fill-blue-400/20"></i>` : ''}
                        </div>
                        <div class="px-4 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full inline-block">
                            <span class="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">${role}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 space-y-8">
                <!-- CORE IDENTITY SETTINGS -->
                <section class="space-y-4">
                    <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                        <i data-lucide="fingerprint" class="w-3 h-3 text-[#D4AF37]"></i> Identity Protocol
                    </h3>
                    <div class="luxury-card p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name (اصلی نام)</label>
                            <div class="relative">
                                <i data-lucide="user" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
                                <input type="text" id="set-admin-name" value="${config.adminName}"
                                       class="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm text-white focus:border-[#D4AF37] outline-none transition-all font-medium">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-6">
                            <div class="space-y-2">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Protocol</label>
                                <div class="relative">
                                    <i data-lucide="phone" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
                                    <input type="text" id="set-admin-phone" value="${config.adminPhone || ''}" placeholder="+92 ..."
                                           class="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm text-white focus:border-[#D4AF37] outline-none transition-all">
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assigned Role</label>
                                <div class="relative">
                                    <i data-lucide="shield" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
                                    <select id="set-admin-role-select" class="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm text-white outline-none appearance-none focus:border-[#D4AF37]">
                                        <option value="Executive Owner" ${role === 'Executive Owner' ? 'selected' : ''}>Owner (دکان مالک)</option>
                                        <option value="Operations Manager" ${role === 'Operations Manager' ? 'selected' : ''}>Manager (منیجر)</option>
                                        <option value="Staff Executive" ${role === 'Staff Executive' ? 'selected' : ''}>Employee (ملازم)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button id="btn-save-profile" class="w-full py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8962F] text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(212,175,85,0.15)] flex items-center justify-center gap-3">
                            <i data-lucide="refresh-cw" class="w-4 h-4"></i> Synchronize Cloud Profile
                        </button>
                    </div>
                </section>

                <!-- SHOP MANAGEMENT -->
                <section class="space-y-4">
                    <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                        <i data-lucide="layout-grid" class="w-3 h-3 text-[#D4AF37]"></i> Enterprise Hubs (دکانیں)
                    </h3>
                    <div class="luxury-card p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                        <div id="settings-shops-list" class="space-y-3">
                            <!-- Populated by JS -->
                        </div>

                        <div class="pt-4 border-t border-white/5 space-y-4">
                            <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Register New Hub</h4>
                            <div class="relative">
                                <i data-lucide="plus" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
                                <input type="text" id="new-shop-name" placeholder="Hub Name (e.g. ABID MARKET)"
                                       class="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm text-white focus:border-[#D4AF37] outline-none transition-all">
                            </div>
                            <button id="btn-add-shop-settings" class="w-full py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                                Initialize New Hub
                            </button>
                        </div>
                    </div>
                </section>

                <p class="text-center text-[8px] text-slate-600 uppercase tracking-[0.6em] pb-10">ABD ENTERPRISE IDENTITY MANAGEMENT</p>
            </div>
        </div>
    `;
}

export function setupProfileInteractions(onComplete) {
    const saveBtn = document.getElementById('btn-save-profile');
    const nameInput = document.getElementById('set-admin-name');
    const liveNameDisplay = document.getElementById('display-name-live');

    // Live Name Preview
    if (nameInput && liveNameDisplay) {
        nameInput.oninput = (e) => {
            liveNameDisplay.innerText = e.target.value.toUpperCase();
        };
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            saveBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> SYNCING...';
            if (window.lucide) window.lucide.createIcons();

            const updates = {
                adminName: document.getElementById('set-admin-name').value,
                adminPhone: document.getElementById('set-admin-phone').value,
                adminRole: document.getElementById('set-admin-role-select').value
            };

            await Data.db.updateConfig(updates);

            if (onComplete) onComplete();

            saveBtn.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4"></i> PROFILE UPDATED';
            setTimeout(() => {
                saveBtn.innerHTML = '<i data-lucide="refresh-cw" class="w-4 h-4"></i> Synchronize Cloud Profile';
                if (window.lucide) window.lucide.createIcons();
            }, 3000);
        };
    }

    // Avatar Upload Handler
    handleImageUpload('profile-avatar-input', 'profile-avatar-preview', 'adminAvatar', onComplete);

    // Cover Upload Handler
    handleImageUpload('profile-cover-input', 'profile-cover-preview', 'adminCover', onComplete);

    if (window.lucide) window.lucide.createIcons();
}

function handleImageUpload(inputId, previewId, configKey, onComplete) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (input && preview) {
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        // Compress image using Canvas
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const maxSide = 800;

                        if (width > height && width > maxSide) {
                            height *= maxSide / width;
                            width = maxSide;
                        } else if (height > maxSide) {
                            width *= maxSide / height;
                            height = maxSide;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                        preview.src = compressedBase64;

                        const updateObj = {};
                        updateObj[configKey] = compressedBase64;
                        Data.db.updateConfig(updateObj);

                        if (onComplete) onComplete();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
    }
}
