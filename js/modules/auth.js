/**
 * ============================================================================
 * ABD LUXURY SYSTEM | AUTHENTICATION ENGINE
 * ============================================================================
 * WORLD-CLASS GOOGLE IDENTITY INTEGRATION
 * ============================================================================
 */
import { auth } from './firebase-init.js';
import { db, config } from './data.js';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

export const initAuth = (onAuthSuccess) => {
    const authScreen = document.getElementById('auth-screen');
    const loginBtn = document.getElementById('google-login-btn');
    const loadingIndicator = document.querySelector('.auth-loading');

    // Monitor Auth State
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("ABD Auth: Executive Access Granted -", user.displayName);

            // Sync user profile to global data
            config.adminName = user.displayName;
            config.adminEmail = user.email;
            config.adminAvatar = user.photoURL;
            db.save();

            authScreen.classList.add('hidden');
            if (onAuthSuccess) onAuthSuccess(user);
        } else {
            console.log("ABD Auth: Access Restricted - Login Required");
            authScreen.classList.remove('hidden');
        }
    });

    // Handle Login
    loginBtn.addEventListener('click', async () => {
        loadingIndicator.classList.add('active');
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("ABD Auth Error:", error);
            alert("Executive Access Denied: " + error.message);
        } finally {
            loadingIndicator.classList.remove('active');
        }
    });
};

export const logout = () => {
    signOut(auth).then(() => {
        window.location.reload();
    });
};
