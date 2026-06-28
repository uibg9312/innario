import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useHymn } from '../context/HymnContext';
import HymnListItem from '../components/HymnListItem';

// Map themes to Material Icons
const THEME_ICONS = {
    'LODE': 'celebration',
    'AMORE': 'favorite',
    'FIDUCIA': 'shield',
    'CONSACRAZIONE': 'local_fire_department',
    'INTERCESSIONE': 'front_hand',
    'LOTTARE': 'flash_on',
    'GRATITUDINE': 'volunteer_activism',
    'ELEZIONE': 'how_to_vote',
    'GIOIA': 'sentiment_very_satisfied',
    'SANTA CENA': 'wine_bar',
    'LAVORO MISSIONARIO': 'public',
    'BATTESIMO': 'water_drop',
    'CHIAMATA': 'campaign',
    'PASSIONE': 'church',
    'RESTAURAZIONE': 'autorenew',
    'GRAZIA': 'spa',
    'AMICIZIA': 'handshake',
    'SPERANZA': 'wb_sunny',
    'NASCITA DI GESÙ': 'star',
    'ONORE': 'workspace_premium',
    'RITORNO': 'flight_land',
    'DIVINITÀ': 'auto_awesome',
    'PREGHIERA': 'self_improvement',
    'ESORTAZIONE': 'record_voice_over',
    'DORMIRE': 'bedtime',
    'CORI': 'groups',
    'PERDONO': 'healing',
    'RESURREZIONE': 'brightness_high',
    'GIOVENTÙ': 'emoji_people',
    'MATTINO': 'light_mode',
    'BIBBIA': 'menu_book',
    'AVVIVAMENTO': 'whatshot',
    'CAPODANNO': 'event',
    'COMUNIONE': 'diversity_3',
    'SALUTI': 'waving_hand',
    'BAMBINI': 'child_care',
    'STORIA': 'history_edu',
    'OFFERTA': 'card_giftcard',
    'IDOLATRIA': 'block',
    'SALMI': 'library_books',
};

function getThemeIcon(theme) {
    return THEME_ICONS[theme] || 'label';
}

export default function Tematico() {
    const { cantos, loading } = useHymn();
    const [expandedTheme, setExpandedTheme] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Group cantos by theme
    const themeGroups = useMemo(() => {
        const groups = {};
        cantos.forEach(c => {
            let theme = (c.theme || '').trim().toUpperCase();
            // Normalize some combined themes
            if (theme === 'FIDUCIA - SPERANZA' || theme === 'GIOIA-SPERANZA') theme = 'SPERANZA';
            if (theme === 'MATTINO-LODE') theme = 'MATTINO';
            if (theme.startsWith('AUTORE:')) return; // Skip author-type entries
            if (!theme) return;

            if (!groups[theme]) groups[theme] = [];
            groups[theme].push(c);
        });
        // Sort themes alphabetically, sort cantos within each theme by number
        const sorted = Object.entries(groups)
            .sort(([a], [b]) => a.localeCompare(b, 'it'))
            .map(([theme, hymns]) => ({
                theme,
                hymns: hymns.sort((a, b) => a.number - b.number),
                icon: getThemeIcon(theme),
            }));
        return sorted;
    }, [cantos]);

    // Filter themes by search
    const filteredGroups = useMemo(() => {
        if (!searchTerm) return themeGroups;
        const lower = searchTerm.toLowerCase();
        return themeGroups
            .map(g => ({
                ...g,
                hymns: g.hymns.filter(h =>
                    h.title.toLowerCase().includes(lower) ||
                    h.number.toString().includes(lower) ||
                    g.theme.toLowerCase().includes(lower)
                )
            }))
            .filter(g => g.hymns.length > 0 || g.theme.toLowerCase().includes(lower));
    }, [themeGroups, searchTerm]);

    const toggleTheme = (theme) => {
        setExpandedTheme(prev => prev === theme ? null : theme);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-primary dark:bg-surface-dark pt-10 pb-6 px-4 shadow-lg transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">INDICE TEMATICO</h1>
                </div>

                {/* Search */}
                <div className="relative">
                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xl">search</span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cerca per tema o titolo..."
                        className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/10 text-white placeholder:text-white/30 text-sm font-medium outline-none focus:bg-white/15 transition-colors"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                        >
                            <span className="material-icons-round text-xl">close</span>
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center justify-center gap-4">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                        {filteredGroups.length} temi · {filteredGroups.reduce((sum, g) => sum + g.hymns.length, 0)} inni
                    </span>
                </div>
            </div>

            {/* Theme Accordion */}
            <div className="px-4 mt-4 space-y-2">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <span className="material-icons-round animate-spin text-primary">autorenew</span>
                    </div>
                ) : filteredGroups.length > 0 ? (
                    filteredGroups.map((group, idx) => (
                        <motion.div
                            key={group.theme}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                            className="bg-white dark:bg-surface-dark rounded-2xl shadow-card border border-gray-50 dark:border-gray-800 overflow-hidden"
                        >
                            {/* Theme Header (clickable) */}
                            <button
                                onClick={() => toggleTheme(group.theme)}
                                className="w-full flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <div className={clsx(
                                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                                    expandedTheme === group.theme
                                        ? "bg-primary dark:bg-gold-accent"
                                        : "bg-primary/10 dark:bg-gold-accent/20"
                                )}>
                                    <span className={clsx(
                                        "material-icons-round text-xl",
                                        expandedTheme === group.theme
                                            ? "text-white dark:text-gray-900"
                                            : "text-primary dark:text-gold-accent"
                                    )}>
                                        {group.icon}
                                    </span>
                                </div>

                                <div className="flex-1 text-left">
                                    <p className="text-[13px] font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
                                        {group.theme}
                                    </p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                        {group.hymns.length} {group.hymns.length === 1 ? 'inno' : 'inni'}
                                    </p>
                                </div>

                                <span className={clsx(
                                    "material-icons-round text-gray-300 dark:text-gray-600 transition-transform duration-300",
                                    expandedTheme === group.theme ? "rotate-180" : ""
                                )}>
                                    expand_more
                                </span>
                            </button>

                            {/* Expandable Hymn List */}
                            <AnimatePresence>
                                {expandedTheme === group.theme && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-3 border-t border-gray-50 dark:border-gray-800">
                                            {group.hymns.map((canto, i) => (
                                                <HymnListItem
                                                    key={canto.uid}
                                                    uid={canto.uid}
                                                    number={canto.number}
                                                    title={canto.title}
                                                    subtitle={canto.title_es}
                                                    delay={0}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center p-8 text-gray-500">
                        Nessun tema trovato.
                    </div>
                )}
            </div>
        </div>
    );
}
