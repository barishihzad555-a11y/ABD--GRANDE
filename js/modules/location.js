/**
 * ============================================================================
 * ABD LUXURY SYSTEM | LOCATION INTELLIGENCE MODULE
 * ============================================================================
 * PROTECTION STATUS: ACTIVE
 * DESCRIPTION: Real-time geolocation tracking and map integration.
 * ============================================================================
 */

import * as Data from './data.js';
import * as Attendance from './attendance.js';

let watchId = null;

export function initLocationTracking() {
    console.log("ABD Location: Initializing Tactical Tracking...");

    if (!navigator.geolocation) {
        console.warn("ABD Location: Geolocation not supported by this device.");
        return;
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    // Start watching position
    watchId = navigator.geolocation.watchPosition(
        handleLocationUpdate,
        handleLocationError,
        options
    );
}

function handleLocationUpdate(position) {
    const { latitude, longitude } = position.coords;
    console.log(`ABD Location: Positional Update - Lat: ${latitude}, Lng: ${longitude}`);

    // Find if the current user is an employee
    const currentUserName = Data.config.adminName;
    const emp = Data.employeesData.find(e => e.name === currentUserName);

    if (emp) {
        Data.db.updateEmployeeLocation(emp.id, latitude, longitude);

        // AUTOMATIC ATTENDANCE LOGIC
        // Check if employee is near their assigned shop
        const assignedShop = Data.shopsData.find(s => s.name === emp.shop);
        if (assignedShop) {
            const distance = Attendance.getDistance(latitude, longitude, assignedShop.lat, assignedShop.lng);
            const isInside = distance <= assignedShop.radius;

            if (isInside && emp.status !== 'Present') {
                Attendance.punchIn(emp.id, assignedShop.name, { lat: latitude, lng: longitude });
                Data.db.updateEmployee(emp.id, { status: 'Present' });
                console.log(`ABD Intelligence: Auto-Punched IN for ${emp.name} at ${assignedShop.name}`);
            } else if (!isInside && emp.status === 'Present') {
                // Find active attendance record to punch out
                const activeRecord = Data.attendanceRecords.find(a => a.employeeId === emp.id && !a.checkOut);
                if (activeRecord) {
                    Attendance.punchOut(activeRecord.id, { lat: latitude, lng: longitude });
                    Data.db.updateEmployee(emp.id, { status: 'Away' });
                    console.log(`ABD Intelligence: Auto-Punched OUT for ${emp.name} from ${assignedShop.name}`);
                }
            }
        }
    }
}

function handleLocationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.error("ABD Location: User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("ABD Location: Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.error("ABD Location: The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.error("ABD Location: An unknown error occurred.");
            break;
    }
}

export function stopTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

export function getMapEmbedHTML(lat, lng) {
    if (!lat || !lng) {
        return `
            <div class="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-3">
                <i data-lucide="map-pin-off" class="w-8 h-8 text-slate-700"></i>
                <p class="text-[8px] font-black text-slate-700 uppercase tracking-widest">No Tactical Data Available</p>
            </div>
        `;
    }

    // World-class Google Maps Embed (No API Key required for basic view)
    return `
        <iframe
            width="100%"
            height="100%"
            frameborder="0"
            style="border:0; filter: invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%);"
            src="https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&amp;output=embed"
            allowfullscreen>
        </iframe>
    `;
}
