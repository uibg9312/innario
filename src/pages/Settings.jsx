import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
    const {
        darkMode, toggleTheme,
        fontFamily, setFontFamily,
        fontSize, setFontSize,
        FONT_OPTIONS, FONT_SIZE_MIN, FONT_SIZE_MAX, FONT_SIZE_STEP
    } = useTheme();
    const navigate = useNavigate();
    const { canInstall, isInstalled, install } = usePWAInstall();
    const [showFontPicker, setShowFontPicker] = useState(false);
    const [installMessage, setInstallMessage] = useState('');
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const clickCountRef = useRef(0);
    const clickTimerRef = useRef(null);

    const handleTitleClick = () => {
        clickCountRef.current += 1;
        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 2000);
        if (clickCountRef.current >= 9) {
            clickCountRef.current = 0;
            setShowPasswordDialog(true);
            setAdminPassword('');
            setPasswordError(false);
        }
    };

    const handlePasswordSubmit = () => {
        if (adminPassword.trim() === 'Rosenrotmeister') {
            setShowPasswordDialog(false);
            navigate('/admin');
        } else {
            setPasswordError(true);
            setTimeout(() => setPasswordError(false), 2000);
        }
    };

    const currentFontLabel = FONT_OPTIONS.find(f => f.value === fontFamily)?.label || 'Lato';

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24 transition-colors duration-500">
            {/* Header */}
            <div className="bg-primary pt-12 pb-16 px-6 rounded-b-[3rem] shadow-lg relative z-0">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white hover:opacity-70 transition-opacity"
                    >
                        <span className="material-icons-round text-3xl">arrow_back</span>
                    </button>
                    <h1
                        onClick={handleTitleClick}
                        className="text-2xl font-bold text-gold-accent tracking-[0.2em] font-display uppercase select-none cursor-default"
                    >
                        IMPOSTAZIONI
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 -mt-8 relative z-10 space-y-6">

                {/* ASPETTO Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-surface-dark rounded-[2.2rem] p-8 shadow-card border border-transparent dark:border-gray-800"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <span className="material-icons-round text-primary dark:text-gold-accent text-xl">palette</span>
                        <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase">
                            ASPETTO
                        </h2>
                    </div>

                    <div className="space-y-10">

                        {/* Dark Mode Toggle */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <p className="text-[15px] font-bold text-gray-800 dark:text-gray-100">
                                        Modalità Notte
                                    </p>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                                        Tema scuro per ambienti poco illuminati
                                    </p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`w-14 h-7 rounded-full transition-all duration-300 relative ${darkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${darkMode ? 'left-8' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Font Family Selector */}
                        <div className="flex flex-col gap-2">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => setShowFontPicker(prev => !prev)}
                            >
                                <div className="flex-1">
                                    <p className="text-[15px] font-bold text-gray-800 dark:text-gray-100">
                                        Tipo di Carattere
                                    </p>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                                        {currentFontLabel}
                                    </p>
                                </div>
                                <span className={`material-icons-round text-gray-300 dark:text-gray-600 transition-transform duration-200 ${showFontPicker ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </div>

                            <AnimatePresence>
                                {showFontPicker && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-3 space-y-1 bg-gray-50 dark:bg-black/20 rounded-2xl p-3">
                                            {FONT_OPTIONS.map((font) => (
                                                <button
                                                    key={font.value}
                                                    onClick={() => {
                                                        setFontFamily(font.value);
                                                        setShowFontPicker(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${fontFamily === font.value
                                                        ? 'bg-primary/10 dark:bg-gold-accent/20 text-primary dark:text-gold-accent font-bold'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        }`}
                                                    style={{ fontFamily: font.value }}
                                                >
                                                    {font.label}
                                                    {fontFamily === font.value && (
                                                        <span className="material-icons-round text-sm float-right mt-0.5">check</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="h-[1px] bg-gray-50 dark:bg-gray-800 mt-2" />
                        </div>

                        {/* Font Size Slider */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <p className="text-[15px] font-bold text-gray-800 dark:text-gray-100">
                                        Dimensione Testo
                                    </p>
                                </div>
                                <div className="text-primary dark:text-gold-accent flex items-center gap-2 font-bold text-sm">
                                    <span className="text-xs">A</span>
                                    <span className="text-lg">A</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-gray-400 text-xs font-bold">A</span>
                                <input
                                    type="range"
                                    min={FONT_SIZE_MIN}
                                    max={FONT_SIZE_MAX}
                                    step={FONT_SIZE_STEP}
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseFloat(e.target.value))}
                                    className="flex-1 h-1 appearance-none bg-gray-200 dark:bg-gray-700 rounded-full outline-none cursor-pointer accent-primary dark:accent-gold-accent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:dark:bg-gold-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:dark:border-surface-dark"
                                />
                                <span className="text-gray-400 text-lg font-bold">A</span>
                            </div>

                            {/* Live Preview */}
                            <div
                                className="mt-3 p-4 bg-gray-50 dark:bg-black/20 rounded-2xl text-center text-gray-600 dark:text-gray-300"
                                style={{ fontFamily: fontFamily, fontSize: `${fontSize}rem` }}
                            >
                                Anteprima del testo
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* INFORMAZIONI Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-surface-dark rounded-[2.2rem] p-8 shadow-card border border-transparent dark:border-gray-800"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <span className="material-icons-round text-primary dark:text-gold-accent text-xl">info</span>
                        <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase">
                            INFORMAZIONI
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <button
                            className="flex justify-between items-center w-full group"
                            onClick={() => setShowHistoryDialog(true)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-icons-round text-primary/60 dark:text-gold-accent/60">auto_stories</span>
                                <p className="text-[15px] font-bold text-gray-800 dark:text-gray-100">
                                    Storia dell'Innario
                                </p>
                            </div>
                            <span className="material-icons-round text-gray-300 dark:text-gray-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </button>

                        <div className="h-[1px] bg-gray-50 dark:bg-gray-800" />

                        <button className="flex justify-between items-center w-full group">
                            <div className="flex items-center gap-3">
                                <span className="material-icons-round text-primary/60 dark:text-gold-accent/60">email</span>
                                <p className="text-[15px] font-bold text-gray-800 dark:text-gray-100">
                                    Contatti
                                </p>
                            </div>
                            <span className="material-icons-round text-gray-300 dark:text-gray-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </button>
                    </div>
                </motion.div>

                {/* INSTALLAZIONE Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-surface-dark rounded-[2.2rem] p-8 shadow-card border border-transparent dark:border-gray-800"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <span className="material-icons-round text-primary dark:text-gold-accent text-xl">install_mobile</span>
                        <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase">
                            INSTALLAZIONE
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {isInstalled ? (
                            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                                <span className="material-icons-round text-green-500 text-2xl">check_circle</span>
                                <div>
                                    <p className="text-[15px] font-bold text-gray-800 dark:text-gray-100">
                                        App già installata
                                    </p>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                                        L'Innario è installato sul tuo dispositivo
                                    </p>
                                </div>
                            </div>
                        ) : canInstall ? (
                            <>
                                <button
                                    onClick={async () => {
                                        const accepted = await install();
                                        setInstallMessage(accepted ? 'Installazione avviata!' : 'Installazione annullata');
                                        setTimeout(() => setInstallMessage(''), 3000);
                                    }}
                                    className="w-full flex items-center justify-center gap-3 p-4 bg-primary dark:bg-gold-accent/90 text-white dark:text-gray-900 rounded-2xl font-bold text-[15px] shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                                >
                                    <span className="material-icons-round">download</span>
                                    Installa l'App
                                </button>
                                {installMessage && (
                                    <p className="text-xs text-center text-primary dark:text-gold-accent font-medium mt-2">
                                        {installMessage}
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl">
                                <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Per installare l'app, apri il menu del browser e seleziona <strong>"Aggiungi alla schermata Home"</strong> o <strong>"Installa app"</strong>.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* CREDITI Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-surface-dark rounded-[2.2rem] p-8 shadow-card border border-transparent dark:border-gray-800"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <span className="material-icons-round text-primary dark:text-gold-accent text-xl">groups</span>
                        <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase">
                            CREDITI
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl">
                            <p className="text-[13px] text-gray-500 dark:text-gray-400 italic text-center">
                                Prossimamente...
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Admin Password Dialog */}
            <AnimatePresence>
                {showPasswordDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-8"
                        onClick={() => setShowPasswordDialog(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-surface-dark rounded-3xl p-8 w-full max-w-sm shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-icons-round text-primary dark:text-gold-accent text-2xl">admin_panel_settings</span>
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Accesso Admin</h3>
                            </div>
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={e => setAdminPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
                                placeholder="Password"
                                autoFocus
                                className={`w-full bg-gray-50 dark:bg-black/20 rounded-2xl px-5 py-4 text-sm text-gray-700 dark:text-gray-200 outline-none border-2 transition-all ${passwordError ? 'border-red-400 animate-shake' : 'border-transparent focus:border-primary/30'
                                    }`}
                            />
                            {passwordError && (
                                <p className="text-red-400 text-xs mt-2 text-center font-bold">Password errata</p>
                            )}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowPasswordDialog(false)}
                                    className="flex-1 py-3 rounded-2xl bg-gray-100 dark:bg-black/20 text-gray-500 text-sm font-bold"
                                >
                                    Annulla
                                </button>
                                <button
                                    onClick={handlePasswordSubmit}
                                    className="flex-1 py-3 rounded-2xl bg-primary dark:bg-gold-accent text-white dark:text-primary-dark text-sm font-bold"
                                >
                                    Accedi
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History/Chronology Dialog */}
            <AnimatePresence>
                {showHistoryDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-8"
                        onClick={() => setShowHistoryDialog(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-surface-dark rounded-3xl p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[80vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-icons-round text-primary dark:text-gold-accent text-3xl">auto_stories</span>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">Storia dell'Innario</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-primary dark:text-gold-accent uppercase tracking-widest mb-3">Cronologia Edizioni</h4>

                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-12 font-bold text-gray-800 dark:text-gray-200 text-sm shrink-0">1997</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-800 dark:text-gray-200">I Edizione</strong>, costituito da 14 inni. Venezia</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 font-bold text-gray-800 dark:text-gray-200 text-sm shrink-0">1999</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-800 dark:text-gray-200">II Edizione</strong>, costituito da 40 inni. Roma</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 font-bold text-gray-800 dark:text-gray-200 text-sm shrink-0">2000</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-800 dark:text-gray-200">III Edizione</strong>, costituito da 200 inni. Napoli</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 font-bold text-gray-800 dark:text-gray-200 text-sm shrink-0">2009</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-800 dark:text-gray-200">IV Edizione</strong>, costituito da 200 inni. Roma</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 font-bold text-gray-800 dark:text-gray-200 text-sm shrink-0">2016</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-800 dark:text-gray-200">V Edizione</strong>, costituito da 338 inni. Venezia</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 font-bold text-primary dark:text-gold-accent text-sm shrink-0">2020</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-primary dark:text-gold-accent">VI Edizione</strong>, aggiornata con 335 inni e 33 aggiuntivi. Napoli</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => setShowHistoryDialog(false)}
                                    className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors"
                                >
                                    Chiudi
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
