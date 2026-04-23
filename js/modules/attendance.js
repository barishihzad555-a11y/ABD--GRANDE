/**
 * ============================================================================
 * ABD LUXURY SYSTEM | ATTENDANCE & BIOMETRIC MODULE
 * ============================================================================
 * PROTECTION STATUS: ACTIVE
 * DESCRIPTION: Location-based attendance tracking for shop assets.
 * ============================================================================
 */

import * as Data from './data.js';

export function punchIn(employeeId, shopName, coords) {
    const existing = Data.attendanceRecords.find(a =>
        a.employeeId === employeeId &&
        a.date === new Date().toISOString().split('T')[0] &&
        !a.checkOut
    );

    if (existing) {
        alert("Security Alert: Already punched in for today.");
        return null;
    }

    const record = Data.db.addAttendance({
        employeeId,
        shop: shopName,
        checkInCoords: coords,
        status: 'On-Site'
    });

    return record;
}

export function punchOut(attendanceId, coords) {
    const record = Data.attendanceRecords.find(a => a.id === attendanceId);
    if (!record) return false;

    const checkOutTime = new Date();
    const checkInTime = new Date(`${record.date} ${record.checkIn}`);

    // Calculate duration in minutes
    const durationMs = checkOutTime - checkInTime;
    const durationMins = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(durationMins / 60);
    const mins = durationMins % 60;

    return Data.db.updateAttendance(attendanceId, {
        checkOut: checkOutTime.toLocaleTimeString(),
        checkOutCoords: coords,
        duration: `${hours}h ${mins}m`,
        status: 'Completed'
    });
}

export function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
}

export function getAttendanceSummary(employeeId) {
    return Data.attendanceRecords.filter(a => a.employeeId === employeeId).slice(0, 10);
}
