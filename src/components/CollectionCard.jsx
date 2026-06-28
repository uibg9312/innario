import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function CollectionCard({ title, subtitle, icon, path, delay, variant = 'standard' }) {
    const isFeatured = variant === 'featured';

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay }}
        >
            <Link
                to={path}
                className={clsx(
                    "block p-6 rounded-[2rem] relative overflow-hidden group active:scale-[0.98] transition-all",
                    isFeatured
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-white dark:bg-surface-dark shadow-card border border-transparent dark:border-gray-800"
                )}
            >
                <div className="flex justify-between items-center z-10 relative">
                    <div className="flex items-center gap-4">
                        {!isFeatured && (
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary-light/10 dark:bg-gold/10 text-gold-accent">
                                <span className="material-icons-round text-lg">{icon || 'star'}</span>
                            </div>
                        )}
                        <div>
                            <h3 className={clsx(
                                "font-bold text-[15px] font-display uppercase tracking-wide",
                                isFeatured ? "text-white text-lg" : "text-gray-700 dark:text-gray-100"
                            )}>
                                {title}
                            </h3>
                            {subtitle && (
                                <p className={clsx(
                                    "text-[10px] font-bold uppercase tracking-widest mt-1",
                                    isFeatured ? "text-white/60" : "text-gray-400 dark:text-gray-500"
                                )}>
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={clsx(
                        "flex items-center justify-center transition-transform group-hover:translate-x-1",
                        isFeatured ? "text-gold-accent" : "text-gray-300 dark:text-gray-600"
                    )}>
                        <span className="material-icons-round text-2xl">
                            {isFeatured ? 'library_music' : 'chevron_right'}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
