import { useState, useEffect } from 'react';

let deferredPrompt = null;

export function usePWAInstall() {
    const [canInstall, setCanInstall] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            setIsInstalled(true);
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            deferredPrompt = e;
            setCanInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setCanInstall(false);
            deferredPrompt = null;
        });

        // If prompt was already captured before this component mounted
        if (deferredPrompt) {
            setCanInstall(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const install = async () => {
        if (!deferredPrompt) return false;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        setCanInstall(false);
        return outcome === 'accepted';
    };

    return { canInstall, isInstalled, install };
}
