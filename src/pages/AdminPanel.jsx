import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHymn } from '../context/HymnContext';

// Intelligent text formatter: takes raw pasted text → clean lines array
function formatLyrics(rawText) {
    if (!rawText) return [];

    let lines = rawText.split('\n');

    // Remove leading/trailing empty lines
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();

    // Clean each line
    lines = lines.map(l => {
        let cleaned = l.trim();
        // Remove leading dashes or bullets
        cleaned = cleaned.replace(/^[-•]\s*/, '');
        return cleaned;
    });

    // Remove completely empty lines that are consecutive (keep single blank separators)
    const result = [];
    let lastWasEmpty = false;
    for (const line of lines) {
        if (!line) {
            if (!lastWasEmpty) result.push('');
            lastWasEmpty = true;
        } else {
            result.push(line);
            lastWasEmpty = false;
        }
    }

    return result;
}

// Generate UID for a canto
function generateUid(number, category) {
    const cat = category || 'Standard';
    if (cat === 'Standard') return `std-${number}`;
    if (cat === 'Adicional' || cat === 'Adicionales') return `adic-${number}`;
    if (cat === 'Editore') return `edit-${number}`;
    return `other-${number}`;
}

const CATEGORY_MAP = {
    'Standard': 'Standard',
    'Adicional': 'Adicional',
    'Editore': 'Editore'
};

const THEMES = [
    'AMORE', 'BATTESIMO', 'CIELO', 'CONSACRAZIONE', 'CROCE',
    'ESORTAZIONE', 'EVANGELIZZAZIONE', 'FAMIGLIA', 'FEDE', 'FIDUCIA',
    'GIOVENTÙ', 'GRATITUDINE', 'GRAZIA', 'INTERCESSIONE', 'LODE',
    'LOTTARE', 'MATRIMONIO', 'MATTINO', 'MISSIONE', 'NATALE',
    'NOZZE', 'OBBEDIENZA', 'PASQUA', 'PELLEGRINAGGIO', 'PENTIMENTO',
    'PREGHIERA', 'RAVVEDIMENTO', 'RESURREZIONE', 'RISVEGLIO',
    'SALVEZZA', 'SERA', 'SPERANZA', 'SPIRITO SANTO', 'VITTORIA'
];

export default function AdminPanel() {
    const navigate = useNavigate();
    const { cantos, saveCanto, deleteCanto, exportCantos } = useHymn();
    const [mode, setMode] = useState('list'); // list | add | edit
    const [editingCanto, setEditingCanto] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCat, setFilterCat] = useState('Standard');
    const [saveMsg, setSaveMsg] = useState('');

    // Form state
    const [form, setForm] = useState({
        number: '',
        title: '',
        title_es: '',
        theme: '',
        category: 'Standard',
        rawLyrics: '',
    });

    const filteredCantos = useMemo(() => {
        return cantos.filter(c => {
            const cat = c.category || 'Standard';
            const catMatch = cat === filterCat ||
                (filterCat === 'Adicional' && (cat === 'Adicional' || cat === 'Adicionales'));
            if (!catMatch) return false;
            if (!searchTerm) return true;
            const lc = searchTerm.toLowerCase();
            return c.title.toLowerCase().includes(lc) || c.number.toString().includes(lc);
        });
    }, [cantos, filterCat, searchTerm]);

    const resetForm = () => {
        setForm({ number: '', title: '', title_es: '', theme: '', category: 'Standard', rawLyrics: '' });
        setEditingCanto(null);
    };

    const startEdit = (canto) => {
        setForm({
            number: canto.number.toString(),
            title: canto.title || '',
            title_es: canto.title_es || '',
            theme: canto.theme || '',
            category: canto.category || 'Standard',
            rawLyrics: (canto.lines || []).join('\n'),
        });
        setEditingCanto(canto);
        setMode('edit');
    };

    const startAdd = () => {
        resetForm();
        setMode('add');
    };

    const handleSave = () => {
        const number = parseInt(form.number);
        if (!number || !form.title.trim()) {
            setSaveMsg('⚠️ Numero e titolo sono obbligatori');
            setTimeout(() => setSaveMsg(''), 3000);
            return;
        }

        const lines = formatLyrics(form.rawLyrics);
        const uid = generateUid(number, form.category);

        const cantoData = {
            number,
            title: form.title.trim().toUpperCase(),
            title_es: form.title_es.trim(),
            theme: form.theme.trim().toUpperCase(),
            category: form.category,
            lines,
            uid,
        };

        saveCanto(cantoData);
        setSaveMsg('✅ Salvato con successo!');
        setTimeout(() => {
            setSaveMsg('');
            setMode('list');
            resetForm();
        }, 1500);
    };

    const handleDelete = (canto) => {
        if (window.confirm(`Eliminare #${canto.number} ${canto.title}?`)) {
            deleteCanto(canto.number, canto.category);
            setSaveMsg('🗑️ Eliminato');
            setTimeout(() => setSaveMsg(''), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-primary dark:bg-surface-dark pt-10 pb-4 px-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={() => navigate('/impostazioni')} className="text-white/60 flex items-center gap-1">
                        <span className="material-icons-round text-xl">arrow_back</span>
                    </button>
                    <h1 className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                        PANNELLO ADMIN
                    </h1>
                    <button
                        onClick={exportCantos}
                        className="text-white/60 flex items-center gap-1 text-xs"
                        title="Esporta JSON"
                    >
                        <span className="material-icons-round text-lg">download</span>
                    </button>
                </div>

                {/* Mode Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => { setMode('list'); resetForm(); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'list' ? 'bg-white text-primary' : 'bg-white/10 text-white/60'}`}
                    >
                        📋 Lista
                    </button>
                    <button
                        onClick={startAdd}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'add' ? 'bg-white text-primary' : 'bg-white/10 text-white/60'}`}
                    >
                        ➕ Aggiungi
                    </button>
                </div>
            </div>

            {/* Save Message */}
            <AnimatePresence>
                {saveMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mx-4 mt-4 p-3 bg-white dark:bg-surface-dark rounded-2xl text-center text-sm font-bold text-primary dark:text-gold-accent shadow-card"
                    >
                        {saveMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LIST MODE */}
            {mode === 'list' && (
                <div className="px-4 mt-4 space-y-3">
                    {/* Search & Filter */}
                    <div className="flex gap-2">
                        <div className="flex-1 bg-white dark:bg-surface-dark rounded-2xl px-4 py-3 flex items-center gap-2 shadow-card">
                            <span className="material-icons-round text-gray-400 text-lg">search</span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Cerca per titolo o numero..."
                                className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 justify-center">
                        {['Standard', 'Adicional', 'Editore'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCat(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterCat === cat ? 'bg-primary text-white dark:bg-gold-accent dark:text-primary-dark' : 'bg-gray-100 dark:bg-black/20 text-gray-500'}`}
                            >
                                {cat === 'Adicional' ? 'Addizionali' : cat === 'Editore' ? 'Editore' : 'Regolare'}
                            </button>
                        ))}
                    </div>

                    <p className="text-xs text-gray-400 text-center">{filteredCantos.length} inni</p>

                    {/* Canto list */}
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {filteredCantos.map(c => (
                            <div
                                key={c.uid}
                                className="bg-white dark:bg-surface-dark rounded-2xl p-3 shadow-card flex items-center gap-3"
                            >
                                <span className="w-10 h-10 flex items-center justify-center bg-primary/10 dark:bg-gold/10 text-primary dark:text-gold-accent font-bold text-sm rounded-full flex-shrink-0">
                                    {c.number}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{c.title}</p>
                                    <p className="text-xs text-gray-400 truncate">{c.title_es || '—'} · {c.theme || 'Sin tema'}</p>
                                    <p className="text-[10px] text-gray-300">{(c.lines || []).length} righe</p>
                                </div>
                                <button
                                    onClick={() => startEdit(c)}
                                    className="p-2 text-primary dark:text-gold-accent"
                                >
                                    <span className="material-icons-round text-lg">edit</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ADD / EDIT MODE */}
            {(mode === 'add' || mode === 'edit') && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 mt-4 space-y-4"
                >
                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-card space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                            {mode === 'add' ? '➕ Nuovo Inno' : `✏️ Modificare #${editingCanto?.number}`}
                        </h3>

                        {/* Number + Category */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Numero</label>
                                <input
                                    type="number"
                                    value={form.number}
                                    onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-black/20 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none border border-transparent focus:border-primary/30"
                                    placeholder="30"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Collezione</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-black/20 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200 outline-none border border-transparent focus:border-primary/30"
                                >
                                    <option value="Standard">Regolare</option>
                                    <option value="Adicional">Addizionali</option>
                                    <option value="Editore">Editore</option>
                                </select>
                            </div>
                        </div>

                        {/* Title IT */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Titolo (Italiano)</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                className="w-full bg-gray-50 dark:bg-black/20 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200 outline-none border border-transparent focus:border-primary/30"
                                placeholder="BEATO SARÀ"
                            />
                        </div>

                        {/* Title ES */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Título (Español)</label>
                            <input
                                type="text"
                                value={form.title_es}
                                onChange={e => setForm(f => ({ ...f, title_es: e.target.value }))}
                                className="w-full bg-gray-50 dark:bg-black/20 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200 outline-none border border-transparent focus:border-primary/30"
                                placeholder="BIENAVENTURADO SERÁ"
                            />
                        </div>

                        {/* Theme */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Tema</label>
                            <div className="flex gap-2">
                                <select
                                    value={THEMES.includes(form.theme) ? form.theme : '__custom__'}
                                    onChange={e => {
                                        if (e.target.value !== '__custom__') {
                                            setForm(f => ({ ...f, theme: e.target.value }));
                                        }
                                    }}
                                    className="flex-1 bg-gray-50 dark:bg-black/20 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200 outline-none border border-transparent focus:border-primary/30"
                                >
                                    <option value="">— Scegli —</option>
                                    {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                                    {form.theme && !THEMES.includes(form.theme) && (
                                        <option value="__custom__">✏️ Personalizzato</option>
                                    )}
                                </select>
                                <input
                                    type="text"
                                    value={form.theme}
                                    onChange={e => setForm(f => ({ ...f, theme: e.target.value.toUpperCase() }))}
                                    className="flex-1 bg-gray-50 dark:bg-black/20 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200 outline-none border border-transparent focus:border-primary/30"
                                    placeholder="O scrivi qui..."
                                />
                            </div>
                        </div>

                        {/* Lyrics */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                                Testo (incolla o scrivi — formattazione automatica)
                            </label>
                            <textarea
                                value={form.rawLyrics}
                                onChange={e => setForm(f => ({ ...f, rawLyrics: e.target.value }))}
                                rows={12}
                                className="w-full bg-gray-50 dark:bg-black/20 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200 outline-none border border-transparent focus:border-primary/30 font-mono leading-relaxed resize-y"
                                placeholder={"1\nA Dio sia la gloria,\nche grande amor ci diè!\nDonandoci il Figliolo\nche il mondo redimé.\n\nCORO\nLodiam, lodiam il Signor,\nlodiam, lodiam il Signor!"}
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                                {formatLyrics(form.rawLyrics).filter(l => l.trim()).length} righe · Formattazione intelligente applicata
                            </p>
                        </div>

                        {/* Preview */}
                        {form.rawLyrics && (
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Anteprima</label>
                                <div className="bg-gray-50 dark:bg-black/30 rounded-xl p-4 max-h-48 overflow-y-auto">
                                    {formatLyrics(form.rawLyrics).map((line, i) => (
                                        <p key={i} className={`text-sm leading-relaxed ${!line ? 'h-3' :
                                                /^\d+$/.test(line.trim()) ? 'font-bold text-primary dark:text-gold-accent mt-3' :
                                                    line.trim() === 'CORO' || line.trim() === 'RITORNELLO' ? 'font-bold text-gray-500 italic mt-2' :
                                                        'text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {line || '\u00A0'}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => { setMode('list'); resetForm(); }}
                                className="flex-1 py-3 rounded-2xl bg-gray-100 dark:bg-black/20 text-gray-500 dark:text-gray-400 text-sm font-bold"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 rounded-2xl bg-primary dark:bg-gold-accent text-white dark:text-primary-dark text-sm font-bold shadow-lg active:scale-95 transition-transform"
                            >
                                💾 Salva
                            </button>
                        </div>

                        {mode === 'edit' && editingCanto && (
                            <button
                                onClick={() => handleDelete(editingCanto)}
                                className="w-full py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold mt-2"
                            >
                                🗑️ Elimina questo inno
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
