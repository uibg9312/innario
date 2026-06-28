import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHymn } from '../context/HymnContext';

export default function RecentHymns() {
    const { recent } = useHymn();

    if (!recent || recent.length === 0) return null;

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
        >
            <h2 className="text-lg font-display text-primary dark:text-gold-accent mb-4 px-1 flex items-center gap-2">
                <span className="material-icons-round">history</span>
                RECENTI
            </h2>
            <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar -mx-4 px-4">
                {recent.map((canto, index) => (
                    <Link
                        key={`${canto.number}-${index}`}
                        to={`/canto/${canto.number}`}
                        className="flex-shrink-0 w-40 bg-white dark:bg-surface-dark p-4 rounded-xl shadow-card dark:shadow-none border border-transparent dark:border-gray-800 active:scale-95 transition-transform relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-4xl font-bold text-primary dark:text-gold-accent">{canto.number}</span>
                        </div>
                        <p className="text-xs font-bold text-primary/60 dark:text-gold-light uppercase tracking-wider mb-1">
                            INNO {canto.number}
                        </p>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight line-clamp-2 min-h-[2.5em]">
                            {canto.title}
                        </h3>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}
