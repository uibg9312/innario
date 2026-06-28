import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useHymn } from '../context/HymnContext';
import { useTheme } from '../context/ThemeContext';
import CantoControls from '../components/CantoControls';

export default function Canto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cantos, toggleFavorite, favorites, addToRecent } = useHymn();
    const { fontFamily, fontSize } = useTheme();
    const [canto, setCanto] = useState(null);

    // Find canto data
    useEffect(() => {
        if (cantos.length > 0) {
            const found = cantos.find(c => c.uid === id)
                || cantos.find(c => c.number.toString() === id && (c.category === 'Standard' || !c.category))
                || cantos.find(c => c.number.toString() === id);
            setCanto(found);
            if (found) addToRecent(found.uid);
        }
    }, [id, cantos]);

    // Filter cantos to same category for horizontal navigation
    const sameCategoryCantos = canto
        ? cantos.filter(c => (c.category || 'Standard') === (canto.category || 'Standard'))
        : [];

    const nextCanto = () => {
        if (!canto) return;
        const idx = sameCategoryCantos.findIndex(c => c.uid === canto.uid);
        if (idx !== -1 && idx < sameCategoryCantos.length - 1) {
            navigate(`/canto/${sameCategoryCantos[idx + 1].uid}`);
        }
    };

    const prevCanto = () => {
        if (!canto) return;
        const idx = sameCategoryCantos.findIndex(c => c.uid === canto.uid);
        if (idx > 0) {
            navigate(`/canto/${sameCategoryCantos[idx - 1].uid}`);
        }
    };

    // Gesture Handler
    const handleDragEnd = (e, { offset, velocity }) => {
        const swipe = offset.x; // > 0 is right (prev), < 0 is left (next)

        if (swipe < -100 || (swipe < -50 && velocity.x < -500)) {
            nextCanto();
        } else if (swipe > 100 || (swipe > 50 && velocity.x > 500)) {
            prevCanto();
        }
    };

    if (!canto) return <div className="p-8 text-center mt-20">Caricamento...</div>;

    const isFavorite = favorites.includes(canto.number);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24 overflow-x-hidden">
            <CantoControls
                cantoNumber={canto.number}
                isFavorite={isFavorite}
                onToggleFavorite={() => toggleFavorite(canto.number)}
                onClose={() => navigate('/indice')}
            />

            {/* Navigation Arrows */}
            <button
                className="fixed left-0 top-0 bottom-20 w-16 z-20 hidden md:flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity focus:outline-none group"
                onClick={prevCanto}
                aria-label="Canto Precedente"
            >
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm p-3 rounded-full shadow-lg group-active:scale-95 transition-transform">
                    <span className="material-icons-round text-3xl text-primary dark:text-gold-accent">chevron_left</span>
                </div>
            </button>
            <button
                className="fixed right-0 top-0 bottom-20 w-16 z-20 hidden md:flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity focus:outline-none group"
                onClick={nextCanto}
                aria-label="Canto Successivo"
            >
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm p-3 rounded-full shadow-lg group-active:scale-95 transition-transform">
                    <span className="material-icons-round text-3xl text-primary dark:text-gold-accent">chevron_right</span>
                </div>
            </button>

            {/* Content with Drag Gesture */}
            <motion.div
                key={canto.uid}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="pt-24 px-4 max-w-2xl mx-auto relative z-10 touch-pan-y"
            >
                <div className="text-center mb-10">
                    <div className="inline-block bg-primary/10 dark:bg-gold-accent/20 px-4 py-1.5 rounded-full mb-6">
                        <span className="text-[11px] font-bold text-primary dark:text-gold-accent tracking-widest uppercase">
                            INNO #{canto.number}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-primary dark:text-gold-accent mb-3 font-display tracking-tight uppercase px-4 leading-tight">
                        {canto.title}
                    </h1>

                    {canto.title_es && (
                        <p className="text-xs italic font-medium text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-8 leading-relaxed">
                            {canto.title_es}
                        </p>
                    )}
                </div>

                <div className="px-2 select-none cursor-grab active:cursor-grabbing" style={{ fontSize: `${fontSize}rem`, fontFamily: fontFamily }}>
                    <LyricsDisplay lines={canto.lines || []} fontSize={fontSize} />
                </div>

                <div className="h-32" /> {/* Bottom Spacer */}
            </motion.div>
        </div>
    );
}

// Logic to group verses and chorus
function LyricsDisplay({ lines = [], fontSize }) {
    if (!lines || !Array.isArray(lines) || lines.length === 0) return <div className="text-center text-gray-400 italic mt-8">Testo non disponibile</div>;

    const blocks = [];
    let currentBlock = { type: 'verse', lines: [] };

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed === 'CORO') {
            if (currentBlock.lines.length > 0) blocks.push(currentBlock);
            currentBlock = { type: 'chorus', lines: [] };
        } else if (!isNaN(trimmed) && trimmed !== '') {
            if (currentBlock.lines.length > 0) blocks.push(currentBlock);
            currentBlock = { type: 'verse', number: trimmed, lines: [] };
        } else {
            currentBlock.lines.push(line);
        }
    });
    if (currentBlock.lines.length > 0) blocks.push(currentBlock);

    return (
        <div className="space-y-8 text-center">
            {blocks.map((block, idx) => (
                <div
                    key={idx}
                    className={clsx(
                        "transition-all duration-300 relative",
                        block.type === 'chorus'
                            ? "bg-white dark:bg-surface-dark px-6 py-8 rounded-[2rem] shadow-card border border-gray-50 dark:border-gray-800 my-6 mx-1"
                            : ""
                    )}
                >
                    {block.type === 'chorus' && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2">
                            <span className="text-[10px] font-bold text-primary/40 dark:text-gold-accent/40 uppercase tracking-[0.3em]">CORO</span>
                        </div>
                    )}

                    {block.number && (
                        <div className="font-bold text-primary/30 dark:text-gold-accent/30 text-xs mb-4 font-display tracking-widest">
                            {block.number}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        {block.lines.map((l, i) => (
                            <p key={i} className={clsx(
                                "leading-snug mb-0 transition-all text-gray-700 dark:text-gray-300",
                                block.type === 'chorus' ? "font-bold italic text-gray-900 dark:text-gray-100" : ""
                            )} style={{ fontSize: `${fontSize}rem` }}>
                                {l}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
