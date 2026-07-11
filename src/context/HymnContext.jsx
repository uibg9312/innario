import { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc
} from 'firebase/firestore';

const HymnContext = createContext();

// Firebase configuration loaded from environment variables.
// Copy .env.example to .env.local and fill in your own Firebase project credentials.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore targeting the custom "innario" database, with offline persistence enabled
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
}, "innario");

export function HymnProvider({ children }) {
    const [cantos, setCantos] = useState([]);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
    const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('recent')) || []);
    const [loading, setLoading] = useState(true);
    const [hasShownSplash, setHasShownSplashState] = useState(() => sessionStorage.getItem('hasShownSplash') === 'true');

    const setHasShownSplash = (value) => {
        sessionStorage.setItem('hasShownSplash', value);
        setHasShownSplashState(value);
    };

    const buildCantos = (baseData, overrides) => {
        // Merge base data with localStorage/Firestore overrides
        const overrideMap = {};
        overrides.forEach(o => {
            overrideMap[`${o.category || 'Standard'}-${o.number}`] = o;
        });

        let merged = baseData.map(c => {
            const key = `${c.category || 'Standard'}-${c.number}`;
            return overrideMap[key] ? { ...c, ...overrideMap[key] } : c;
        });

        // Add new cantos that don't exist in base
        const baseKeys = new Set(baseData.map(c => `${c.category || 'Standard'}-${c.number}`));
        overrides.forEach(o => {
            const key = `${o.category || 'Standard'}-${o.number}`;
            if (!baseKeys.has(key)) {
                merged.push(o);
            }
        });

        // Add UIDs and sort
        return merged.map((c, index) => ({
            ...c,
            uid: c.uid || `${c.category || 'Standard'}-${c.number}-${index}`
        })).sort((a, b) => {
            const catOrder = { 'Standard': 0, 'Adicional': 1, 'Adicionales': 1, 'Editore': 2 };
            const catA = catOrder[a.category || 'Standard'] ?? 3;
            const catB = catOrder[b.category || 'Standard'] ?? 3;
            if (catA !== catB) return catA - catB;
            return a.number - b.number;
        });
    };

    useEffect(() => {
        async function loadCantos() {
            try {
                // 1. Fetch base static hymns from local JSON
                const response = await fetch('/cantos.json');
                const baseData = await response.json();

                // 2. Fetch local storage overrides
                const localOverrides = JSON.parse(localStorage.getItem('admin_cantos') || '[]');

                // 3. Fetch custom overrides from Firestore 'innario' database 'innario' collection
                // Utilizing offline cache persistence prevents heavy document read quotas
                const querySnapshot = await getDocs(collection(db, "innario"));
                const firestoreOverrides = [];

                querySnapshot.forEach((docSnap) => {
                    const docData = docSnap.data();
                    firestoreOverrides.push({
                        uid: docSnap.id,
                        number: Number(docData.number),
                        title: docData.title || '',
                        title_es: docData.title_es || '',
                        theme: docData.theme || '',
                        category: docData.category || 'Standard',
                        lines: docData.lines || []
                    });
                });

                // Consolidate overrides (Firestore values overwrite local storage values)
                const consolidatedMap = {};
                localOverrides.forEach(o => {
                    const key = `${o.category || 'Standard'}-${o.number}`;
                    consolidatedMap[key] = o;
                });
                firestoreOverrides.forEach(o => {
                    const key = `${o.category || 'Standard'}-${o.number}`;
                    consolidatedMap[key] = o;
                });

                const finalOverrides = Object.values(consolidatedMap);

                // Update localStorage with consolidated overrides
                localStorage.setItem('admin_cantos', JSON.stringify(finalOverrides));

                // Rebuild consolidated hymns list
                setCantos(buildCantos(baseData, finalOverrides));
            } catch (error) {
                console.error("Failed to load cantos from Firestore, fallback to local storage", error);
                try {
                    const response = await fetch('/cantos.json');
                    const baseData = await response.json();
                    const localOverrides = JSON.parse(localStorage.getItem('admin_cantos') || '[]');
                    setCantos(buildCantos(baseData, localOverrides));
                } catch (fallbackError) {
                    console.error("Local fallback load failed", fallbackError);
                }
            } finally {
                setLoading(false);
            }
        }
        loadCantos();
    }, []);

    // Sync favorites to localStorage
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Sync recent to localStorage
    useEffect(() => {
        localStorage.setItem('recent', JSON.stringify(recent));
    }, [recent]);

    const toggleFavorite = (id) => {
        setFavorites(prev => {
            if (prev.includes(id)) return prev.filter(fid => fid !== id);
            return [...prev, id];
        });
    };

    const addToRecent = (uid) => {
        const canto = cantos.find(c => c.uid === uid);
        if (!canto) return;

        setRecent(prev => {
            const filtered = prev.filter(item => item.uid !== uid);
            const newRecent = [canto, ...filtered].slice(0, 50);
            return newRecent;
        });
    };

    // Admin: save a canto (add or update)
    const saveCanto = async (cantoData) => {
        const overrides = JSON.parse(localStorage.getItem('admin_cantos') || '[]');
        const key = `${cantoData.category || 'Standard'}-${cantoData.number}`;
        const idx = overrides.findIndex(o => `${o.category || 'Standard'}-${o.number}` === key);
        if (idx >= 0) {
            overrides[idx] = { ...overrides[idx], ...cantoData };
        } else {
            overrides.push(cantoData);
        }
        localStorage.setItem('admin_cantos', JSON.stringify(overrides));

        // Rebuild cantos in memory for instant feedback
        setCantos(prev => {
            const existingIdx = prev.findIndex(c =>
                (c.category || 'Standard') === (cantoData.category || 'Standard') &&
                c.number === cantoData.number
            );
            let updated;
            if (existingIdx >= 0) {
                updated = [...prev];
                updated[existingIdx] = { ...updated[existingIdx], ...cantoData };
            } else {
                updated = [...prev, cantoData];
            }
            return updated.sort((a, b) => {
                const catOrder = { 'Standard': 0, 'Adicional': 1, 'Adicionales': 1, 'Editore': 2 };
                const catA = catOrder[a.category || 'Standard'] ?? 3;
                const catB = catOrder[b.category || 'Standard'] ?? 3;
                if (catA !== catB) return catA - catB;
                return a.number - b.number;
            });
        });

        // Write updates asynchronously to Firestore in background
        try {
            const docId = `${(cantoData.category || 'Standard').toLowerCase()}_${cantoData.number}`;
            const docRef = doc(db, "innario", docId);
            const dataToSave = {
                number: Number(cantoData.number),
                title: cantoData.title || '',
                title_es: cantoData.title_es || '',
                theme: cantoData.theme || '',
                category: cantoData.category || 'Standard',
                lines: cantoData.lines || [],
                original_text: (cantoData.lines || []).join('\n'),
                issues: 'OK'
            };
            await setDoc(docRef, dataToSave);
            console.log("Successfully saved canto to Firestore:", docId);
        } catch (error) {
            console.error("Failed to write canto to Firestore", error);
        }
    };

    // Admin: delete a canto
    const deleteCanto = async (number, category) => {
        const key = `${category || 'Standard'}-${number}`;
        const overrides = JSON.parse(localStorage.getItem('admin_cantos') || '[]');
        const filtered = overrides.filter(o => `${o.category || 'Standard'}-${o.number}` !== key);
        localStorage.setItem('admin_cantos', JSON.stringify(filtered));

        setCantos(prev => prev.filter(c =>
            !((c.category || 'Standard') === (category || 'Standard') && c.number === number)
        ));

        // Delete asynchronously from Firestore in background
        try {
            const docId = `${(category || 'Standard').toLowerCase()}_${number}`;
            const docRef = doc(db, "innario", docId);
            await deleteDoc(docRef);
            console.log("Successfully deleted canto from Firestore:", docId);
        } catch (error) {
            console.error("Failed to delete canto from Firestore", error);
        }
    };

    // Admin: export full JSON
    const exportCantos = () => {
        const blob = new Blob([JSON.stringify(cantos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cantos.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <HymnContext.Provider value={{
            cantos, favorites, recent, loading,
            toggleFavorite, addToRecent,
            hasShownSplash, setHasShownSplash,
            saveCanto, deleteCanto, exportCantos
        }}>
            {children}
        </HymnContext.Provider>
    );
}

export const useHymn = () => useContext(HymnContext);
