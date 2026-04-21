/**
 * ============================================================================
 * ABD LUXURY SYSTEM | VISION (SURVEILLANCE) MODULE
 * ============================================================================
 * PROTECTION STATUS: ACTIVE (ISOLATED)
 * VERSION: 1.0.0
 * DESCRIPTION: Handles Global Vision Network and Camera Surveillance logic.
 * ============================================================================
 */

import { shopsData } from './data.js';

/**
 * Compact featured camera for Home screen (No-scroll optimized)
 */
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
        </div>
    `;
}

/**
 * Global Vision Grid (No-scroll optimized for mobile)
 */
export function getCameraPage() {
    return `
        <div class="h-full flex flex-col gap-4 overflow-hidden">
            <div class="flex justify-between items-end shrink-0">
                <div>
                    <h2 class="text-xl font-light text-white uppercase tracking-tighter">Command Vision</h2>
                    <p class="text-[8px] text-slate-500 font-bold uppercase tracking-[0.3em]">Global Surveillance</p>
                </div>
                <div class="flex gap-2">
                    <button class="btn-luxury px-4 py-1.5 text-[8px]"><i data-lucide="video" class="w-3 h-3 inline mr-1"></i> REC ALL</button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scroll pr-1">
                <div class="grid grid-cols-1 gap-4">
                    ${shopsData.map(shop => `
                        <div class="camera-preview-card group cursor-pointer" onclick="window.app.openCameraDetail('${shop.name}')">
                            <div class="camera-monitor !h-40">
                                <div class="camera-overlay"></div>
                                <div class="camera-hud">
                                    <div class="flex items-center gap-2">
                                        <div class="rec-dot"></div>
                                        <span class="text-[8px] font-black text-white uppercase tracking-widest">${shop.name}</span>
                                    </div>
                                    <span class="text-[8px] font-mono text-emerald-500">LIVE</span>
                                </div>
                                <div class="video-feed-main">
                                    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600" alt="Cam Feed" class="w-full h-full object-cover">
                                </div>
                            </div>
                            <div class="p-3 flex justify-between items-center bg-black/20">
                                <div class="cam-meta">
                                    <h4 class="text-[9px] font-bold text-white uppercase tracking-widest">NODE_${shop.id.toString().padStart(3, '0')}</h4>
                                    <p class="text-[7px] text-slate-500 uppercase">${shop.status} | 24 FPS</p>
                                </div>
                                <i data-lucide="maximize-2" class="w-4 h-4 text-slate-500"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Camera Detail View
 */
export function getCameraDetailPage(cameraName) {
    return `
        <div class="h-full flex flex-col gap-4 overflow-hidden">
            <div class="flex justify-between items-center shrink-0">
                <button onclick="window.app.goBack()" class="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i> GRID
                </button>
                <span class="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-bold uppercase tracking-widest border border-emerald-500/20">ENCRYPTED</span>
            </div>

            <div class="flex-1 luxury-card p-1 relative overflow-hidden">
                <div class="w-full h-full bg-black rounded-xl overflow-hidden relative group">
                    <div class="camera-overlay"></div>
                    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200" class="w-full h-full object-cover">

                    <div class="absolute top-4 left-4 flex items-center gap-3 z-30">
                        <div class="rec-dot scale-125"></div>
                        <div>
                            <h2 class="text-white font-bold text-[10px] tracking-widest uppercase">${cameraName}</h2>
                            <p class="text-[7px] text-slate-400 uppercase">Primary Feed</p>
                        </div>
                    </div>

                    <div class="absolute bottom-4 right-4 flex gap-2 z-30">
                        <button class="btn-cam-mini !w-8 !h-8 bg-black/60"><i data-lucide="camera" class="w-4 h-4"></i></button>
                        <button class="btn-cam-mini !w-8 !h-8 bg-red-600/60 border-none"><i data-lucide="circle" class="w-4 h-4"></i></button>
                    </div>
                </div>
            </div>

            <div class="shrink-0 luxury-card p-4 grid grid-cols-3 gap-4 items-center">
                <div class="space-y-1">
                    <p class="text-[7px] text-slate-500 uppercase font-black">Bitrate</p>
                    <p class="text-[10px] font-mono text-white">12.4 Mbps</p>
                </div>
                <div class="flex justify-center">
                    <div class="grid grid-cols-3 gap-1">
                        <div></div><button class="w-6 h-6 flex items-center justify-center bg-white/5 rounded"><i data-lucide="chevron-up" class="w-3 h-3"></i></button><div></div>
                        <button class="w-6 h-6 flex items-center justify-center bg-white/5 rounded"><i data-lucide="chevron-left" class="w-3 h-3"></i></button>
                        <div class="w-6 h-6 bg-[#D4AF37]/20 rounded"></div>
                        <button class="w-6 h-6 flex items-center justify-center bg-white/5 rounded"><i data-lucide="chevron-right" class="w-3 h-3"></i></button>
                        <div></div><button class="w-6 h-6 flex items-center justify-center bg-white/5 rounded"><i data-lucide="chevron-down" class="w-3 h-3"></i></button><div></div>
                    </div>
                </div>
                <div class="text-right space-y-1">
                    <p class="text-[7px] text-slate-500 uppercase font-black">Latency</p>
                    <p class="text-[10px] font-mono text-emerald-500">18ms</p>
                </div>
            </div>
        </div>
    `;
}
