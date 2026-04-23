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
            <div class="shrink-0 relative h-56 group">
                <img id="profile-cover-preview" src="${config.adminCover || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200'}"
                     class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>

                <label for="profile-cover-input" class="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl cursor-pointer hover:bg-[#D4AF37]/20 transition-all shadow-2xl group/btn">
                    <i data-lucide="camera" class="w-4 h-4 text-[#D4AF37] group-hover/btn:scale-110 transition-transform"></i>
                    <input type="file" id="profile-cover-input" class="hidden" accept="image/*">
                </label>

                <button onclick="window.app.goBack()" class="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-[#D4AF37]/20 transition-all group/back">
                    <i data-lucide="chevron-left" class="w-6 h-6 text-[#D4AF37] group-hover/back:-translate-x-1 transition-transform"></i>
                </button>
            </div>

            <!-- PROFILE IDENTITY CARD -->
            <div class="shrink-0 px-6 -mt-20 relative z-10">
                <div class="flex flex-col items-center">
                    <div class="relative group">
                        <div class="w-36 h-36 rounded-[2.8rem] overflow-hidden border-4 border-[#050505] p-1 bg-gradient-to-br from-[#D4AF37] via-[#FFD700] to-[#8A6D3B] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <img id="profile-avatar-preview" src="${config.adminAvatar}" class="w-full h-full object-cover rounded-[2.3rem] bg-black" alt="Profile">
                        </div>
                        <label for="profile-avatar-input" class="absolute bottom-1 right-1 w-11 h-11 bg-[#D4AF37] rounded-2xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-xl border-4 border-[#050505]">
                            <i data-lucide="edit-3" class="w-5 h-5 text-black"></i>
                            <input type="file" id="profile-avatar-input" class="hidden" accept="image/*">
                        </label>
                    </div>

                    <div class="text-center mt-6">
                        <div class="flex items-center justify-center gap-2 mb-2">
                            <h2 id="display-name-live" class="text-3xl font-black text-white tracking-tight uppercase drop-shadow-lg">${config.adminName}</h2>
                            ${config.isVerified ? `<i data-lucide="badge-check" class="w-7 h-7 text-blue-400 fill-blue-400/20"></i>` : ''}
                        </div>
                        <div class="inline-flex items-center gap-2 px-5 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full">
                            <span class="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                            <span class="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">${role}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-10 space-y-10">
                <!-- CORE IDENTITY SETTINGS -->
                <section class="space-y-6">
                    <div class="flex items-center justify-between px-1">
                        <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                            <i data-lucide="fingerprint" class="w-3 h-3 text-[#D4AF37]"></i> Identity Protocol
                        </h3>
                        <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Verified Account</span>
                    </div>

                    <div class="luxury-card p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-8">
                        <!-- Full Name -->
                        <div class="space-y-3">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Executive Name (اصلی نام)</label>
                            <div class="relative group">
                                <i data-lucide="user" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors"></i>
                                <input type="text" id="set-admin-name" value="${config.adminName}" placeholder="Enter full name"
                                       class="w-full bg-black/60 border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-5 text-base text-white focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all font-semibold">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- Email -->
                            <div class="space-y-3">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Secure Email</label>
                                <div class="relative group">
                                    <i data-lucide="mail" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors"></i>
                                    <input type="email" id="set-admin-email" value="${config.adminEmail || ''}" placeholder="executive@abd.com"
                                           class="w-full bg-black/60 border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-5 text-sm text-white focus:border-[#D4AF37] outline-none transition-all">
                                </div>
                            </div>
                            <!-- Phone -->
                            <div class="space-y-3">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Encrypted Phone</label>
                                <div class="relative group">
                                    <i data-lucide="phone" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors"></i>
                                    <input type="text" id="set-admin-phone" value="${config.adminPhone || ''}" placeholder="+92 ..."
                                           class="w-full bg-black/60 border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-5 text-sm text-white focus:border-[#D4AF37] outline-none transition-all">
                                </div>
                            </div>
                        </div>

                        <!-- Bio / Description -->
                        <div class="space-y-3">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Executive Bio</label>
                            <div class="relative group">
                                <i data-lucide="file-text" class="absolute left-5 top-6 w-5 h-5 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors"></i>
                                <textarea id="set-admin-bio" rows="3" placeholder="Describe your executive mission..."
                                       class="w-full bg-black/60 border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-5 text-sm text-white focus:border-[#D4AF37] outline-none transition-all resize-none">${config.adminBio || ''}</textarea>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- Role Selection -->
                            <div class="space-y-3">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Strategic Role</label>
                                <div class="relative group">
                                    <i data-lucide="shield" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors"></i>
                                    <select id="set-admin-role-select" class="w-full bg-black/60 border border-white/10 rounded-[1.5rem] pl-14 pr-10 py-5 text-sm text-white outline-none appearance-none focus:border-[#D4AF37] cursor-pointer">
                                        <option value="Executive Owner" ${role === 'Executive Owner' ? 'selected' : ''}>Owner (دکان مالک)</option>
                                        <option value="Operations Manager" ${role === 'Operations Manager' ? 'selected' : ''}>Manager (منیجر)</option>
                                        <option value="Staff Executive" ${role === 'Staff Executive' ? 'selected' : ''}>Employee (ملازم)</option>
                                    </select>
                                    <i data-lucide="chevron-down" class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"></i>
                                </div>
                            </div>
                            <!-- Location -->
                            <div class="space-y-3">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary HQ Location</label>
                                <div class="relative group">
                                    <i data-lucide="map-pin" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors"></i>
                                    <input type="text" id="set-admin-location" value="${config.adminLocation || ''}" placeholder="City, Country"
                                           class="w-full bg-black/60 border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-5 text-sm text-white focus:border-[#D4AF37] outline-none transition-all">
                                </div>
                            </div>
                        </div>

                        <button id="btn-save-profile" class="w-full py-6 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8962F] text-black font-black text-xs uppercase tracking-[0.4em] rounded-[1.5rem] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_25px_50px_rgba(212,175,85,0.2)] flex items-center justify-center gap-4 group">
                            <i data-lucide="refresh-cw" class="w-5 h-5 group-hover:rotate-180 transition-transform duration-700"></i> Synchronize Cloud Profile
                        </button>
                    </div>
                </section>

                <!-- HUB MANAGEMENT (SIMPLIFIED) -->
                <section class="space-y-6">
                    <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                        <i data-lucide="layout-grid" class="w-3 h-3 text-[#D4AF37]"></i> Enterprise Infrastructure
                    </h3>
                    <div class="luxury-card p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-8">
                        <div id="settings-shops-list" class="space-y-4">
                            <!-- Shop items would be injected here if needed, but for now we focus on profile -->
                        </div>

                        <div class="pt-6 border-t border-white/5">
                             <p class="text-[9px] text-slate-500 text-center uppercase tracking-[0.3em]">Infrastructure controlled by Global Command</p>
                        </div>
                    </div>
                </section>

                <div class="flex flex-col items-center gap-4 pb-12">
                    <img src="https://images.unsplash.com/photo-1599305090598-fe179d501c27?q=80&w=100" class="w-12 opacity-20 grayscale" alt="Logo">
                    <p class="text-[8px] text-slate-600 uppercase tracking-[0.6em]">ABD ENTERPRISE IDENTITY MANAGEMENT v4.5</p>
                </div>
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
            const originalHTML = saveBtn.innerHTML;
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> SYNCING TO CLOUD...';
            if (window.lucide) window.lucide.createIcons();

            const updates = {
                adminName: document.getElementById('set-admin-name').value.trim() || 'ALEXANDER ABD',
                adminEmail: document.getElementById('set-admin-email').value.trim(),
                adminPhone: document.getElementById('set-admin-phone').value.trim(),
                adminBio: document.getElementById('set-admin-bio').value.trim(),
                adminLocation: document.getElementById('set-admin-location').value.trim(),
                adminRole: document.getElementById('set-admin-role-select').value
            };

            try {
                // Perform Update
                await Data.db.updateConfig(updates);

                // Success State
                saveBtn.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5"></i> PROFILE UPDATED';
                saveBtn.classList.replace('from-[#D4AF37]', 'from-emerald-500');
                saveBtn.classList.replace('to-[#B8962F]', 'to-emerald-600');
                if (window.lucide) window.lucide.createIcons();

                // Trigger Global UI Update
                if (onComplete) onComplete();

                setTimeout(() => {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = originalHTML;
                    saveBtn.classList.replace('from-emerald-500', 'from-[#D4AF37]');
                    saveBtn.classList.replace('to-emerald-600', 'to-[#B8962F]');
                    if (window.lucide) window.lucide.createIcons();
                }, 3000);

            } catch (error) {
                console.error("Profile Sync Failed:", error);
                saveBtn.innerHTML = '<i data-lucide="alert-circle" class="w-5 h-5"></i> SYNC FAILED';
                saveBtn.classList.replace('from-[#D4AF37]', 'from-red-500');
                setTimeout(() => {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = originalHTML;
                    saveBtn.classList.replace('from-red-500', 'from-[#D4AF37]');
                    if (window.lucide) window.lucide.createIcons();
                }, 3000);
            }
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
                    const modal = document.createElement('div');
                    modal.id = 'crop-modal';
                    modal.className = 'fixed inset-0 bg-black/95 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-6';
                    modal.innerHTML = `
                        <div class="luxury-card w-full max-w-lg p-6 border-[#D4AF37]/20 relative">
                            <h2 class="text-sm font-black text-white uppercase tracking-widest mb-6">Adjust Identity Frame</h2>
                            <div class="w-full aspect-video bg-black rounded-lg overflow-hidden border border-[#D4AF37]/20 mb-6">
                                <img id="crop-image" src="${event.target.result}" class="max-w-full">
                            </div>
                            <div class="flex gap-4">
                                <button onclick="document.getElementById('crop-modal').remove()" class="flex-1 bg-white/5 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em]">Cancel</button>
                                <button id="confirm-crop" class="flex-1 bg-[#D4AF37] text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em]">Save Identity</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(modal);

                    const image = document.getElementById('crop-image');
                    const cropper = new Cropper(image, {
                        aspectRatio: configKey === 'adminAvatar' ? 1 : 16/9,
                        viewMode: 1,
                        background: false
                    });

                    document.getElementById('confirm-crop').onclick = () => {
                        cropper.getCroppedCanvas({ width: configKey === 'adminAvatar' ? 400 : 1200 }).toBlob((blob) => {
                            const finalReader = new FileReader();
                            finalReader.onloadend = () => {
                                preview.src = finalReader.result;
                                const updateObj = {};
                                updateObj[configKey] = finalReader.result;
                                Data.db.updateConfig(updateObj);
                                document.getElementById('crop-modal').remove();
                                if (onComplete) onComplete();
                            };
                            finalReader.readAsDataURL(blob);
                        }, 'image/jpeg', 0.8);
                    };
                };
                reader.readAsDataURL(file);
            }
        };
    }
}
