import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HymnListItem({ number, title, subtitle, uid, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.03, duration: 0.3 }}
        >
            <Link
                to={`/canto/${uid || number}`}
                className="flex items-center p-4 bg-white dark:bg-surface-dark rounded-3xl shadow-card active:scale-[0.98] transition-all mb-4"
            >
                <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary-light/10 dark:bg-gold/10 text-primary dark:text-gold-accent font-bold text-lg rounded-full mr-4 font-display">
                    {number}
                </span>
                <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide truncate">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-[11px] italic font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5 truncate">
                            {subtitle}
                        </p>
                    )}
                </div>
                <span className="material-icons-round text-gray-300 dark:text-gray-600 ml-2">chevron_right</span>
            </Link>
        </motion.div>
    );
}
