import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import HymnListItem from '../components/HymnListItem';
import { useHymn } from '../context/HymnContext';

// Theme icons (shared with Tematico page)
const THEME_ICONS = {
    'LODE': 'celebration', 'AMORE': 'favorite', 'FIDUCIA': 'shield',
    'CONSACRAZIONE': 'local_fire_department', 'INTERCESSIONE': 'front_hand',
    'LOTTARE': 'flash_on', 'GRATITUDINE': 'volunteer_activism', 'ELEZIONE': 'how_to_vote',
    'GIOIA': 'sentiment_very_satisfied', 'SANTA CENA': 'wine_bar',
    'LAVORO MISSIONARIO': 'public', 'BATTESIMO': 'water_drop', 'CHIAMATA': 'campaign',
    'PASSIONE': 'church', 'RESTAURAZIONE': 'autorenew', 'GRAZIA': 'spa',
    'AMICIZIA': 'handshake', 'SPERANZA': 'wb_sunny', 'NASCITA DI GESÙ': 'star',
    'ONORE': 'workspace_premium', 'RITORNO': 'flight_land', 'DIVINITÀ': 'auto_awesome',
    'PREGHIERA': 'self_improvement', 'ESORTAZIONE': 'record_voice_over',
    'DORMIRE': 'bedtime', 'CORI': 'groups', 'PERDONO': 'healing',
    'RESURREZIONE': 'brightness_high', 'GIOVENTÙ': 'emoji_people', 'MATTINO': 'light_mode',
    'BIBBIA': 'menu_book', 'AVVIVAMENTO': 'whatshot', 'CAPODANNO': 'event',
    'COMUNIONE': 'diversity_3', 'SALUTI': 'waving_hand', 'BAMBINI': 'child_care',
    'STORIA': 'history_edu', 'OFFERTA': 'card_giftcard', 'IDOLATRIA': 'block',
    'SALMI': 'library_books',
};

export default function Indice() {
    const { cantos, loading } = useHymn();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialFilter = searchParams.get('filter') || 'Regolare';

    const [searchTerm, setSearchTerm] = useState('');
    const [localCategory, setLocalCategory] = useState(initialFilter);
    const [expandedTheme, setExpandedTheme] = useState(null);

    // Sync state if URL param changes (e.g. from Home cards)
    const filterParam = searchParams.get('filter');
    useState(() => {
        if (filterParam) {
            if (filterParam === 'Addizionali') setLocalCategory('Addizionali');
            else if (filterParam === 'Editore') setLocalCategory('Editore');
            else setLocalCategory('Regolare');
        }
    });

    // Accent-insensitive normalization
    const strip = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    // === REGULAR HYMN LIST ===
    const filteredCantos = useMemo(() => {
        if (localCategory === 'Tematico') return [];
        return cantos.filter(c => {
            let catMatch;
            if (localCategory === 'Addizionali') catMatch = c.category === 'Adicional' || c.category === 'Adicionales';
            else if (localCategory === 'Editore') catMatch = c.category === 'Editore';
            else catMatch = c.category === 'Standard' || !c.category;

            let searchMatch = true;
            if (searchTerm) {
                const term = strip(searchTerm);
                const titleMatch = strip(c.title).includes(term);
                const titleEsMatch = strip(c.title_es).includes(term);
                const numberMatch = c.number.toString().includes(term);
                const themeMatch = strip(c.theme).includes(term);
                const lineMatch = c.lines?.length > 0 && strip(c.lines[0]).includes(term);
                searchMatch = titleMatch || titleEsMatch || numberMatch || themeMatch || lineMatch;
            }

            return catMatch && searchMatch;
        });
    }, [cantos, localCategory, searchTerm]);

    // === THEMATIC GROUPS ===
    const themeGroups = useMemo(() => {
        if (localCategory !== 'Tematico') return [];
        const groups = {};
        cantos.forEach(c => {
            let theme = (c.theme || '').trim().toUpperCase();
            if (theme === 'FIDUCIA - SPERANZA' || theme === 'GIOIA-SPERANZA') theme = 'SPERANZA';
            if (theme === 'MATTINO-LODE') theme = 'MATTINO';
            if (theme.startsWith('AUTORE:')) return;
            if (!theme) return;
            if (!groups[theme]) groups[theme] = [];
            groups[theme].push(c);
        });
        return Object.entries(groups)
            .sort(([a], [b]) => a.localeCompare(b, 'it'))
            .map(([theme, hymns]) => ({
                theme,
                hymns: hymns.sort((a, b) => a.number - b.number),
                icon: THEME_ICONS[theme] || 'label',
            }));
    }, [cantos, localCategory]);

    const filteredThemeGroups = useMemo(() => {
        if (!searchTerm) return themeGroups;
        const term = strip(searchTerm);
        return themeGroups
            .map(g => ({
                ...g,
                hymns: g.hymns.filter(h =>
                    strip(h.title).includes(term) ||
                    h.number.toString().includes(term) ||
                    strip(g.theme).includes(term)
                )
            }))
            .filter(g => g.hymns.length > 0 || strip(g.theme).includes(term));
    }, [themeGroups, searchTerm]);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
            <div className="sticky top-0 z-30 bg-primary dark:bg-surface-dark pt-10 pb-6 px-4 shadow-lg transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                        {localCategory === 'Tematico' ? 'INDICE TEMATICO' : 'INDICE'}
                    </h1>
                </div>
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder={localCategory === 'Tematico' ? 'Cerca per tema o titolo...' : undefined}
                />
                <div className="mt-6">
                    <CategoryFilter selected={localCategory} onSelect={(cat) => {
                        setLocalCategory(cat);
                        setSearchParams({});
                        setSearchTerm('');
                        setExpandedTheme(null);
                    }} />
                </div>

                {/* Stats for Tematico */}
                {localCategory === 'Tematico' && (
                    <div className="mt-3 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                            {filteredThemeGroups.length} temi · {filteredThemeGroups.reduce((sum, g) => sum + g.hymns.length, 0)} inni
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-6 px-4">
                {loading ? (
                    <div className="flex justify-center p-8"><span className="material-icons-round animate-spin text-primary">autorenew</span></div>
                ) : localCategory === 'Tematico' ? (
                    /* === THEMATIC ACCORDION === */
                    <div className="space-y-2">
                        {filteredThemeGroups.length > 0 ? (
                            filteredThemeGroups.map((group, idx) => (
                                <motion.div
                                    key={group.theme}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                                    className="bg-white dark:bg-surface-dark rounded-2xl shadow-card border border-gray-50 dark:border-gray-800 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedTheme(prev => prev === group.theme ? null : group.theme)}
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
                                                    {group.hymns.map((canto) => (
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
                ) : (
                    /* === REGULAR HYMN LIST === */
                    filteredCantos.length > 0 ? (
                        filteredCantos.map((canto, idx) => (
                            <HymnListItem
                                key={canto.uid}
                                uid={canto.uid}
                                number={canto.number}
                                title={canto.title}
                                subtitle={canto.title_es}
                                delay={idx < 10 ? idx : 0}
                            />
                        ))
                    ) : (
                        <div className="text-center p-8 text-gray-500">
                            Nessun inno trovato.
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
