import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function QuickGo() {
    const [number, setNumber] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (number) {
            navigate(`/canto/${number}`);
        }
    };

    return (
        <motion.div
            className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-card relative overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase">
                    VAI AL NUMERO
                </h2>
                <span className="bg-primary/5 dark:bg-gold/10 text-primary dark:text-gold-accent px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    #Rapido
                </span>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-4 items-center mb-6">
                <div className="flex-1 bg-primary-light/10 dark:bg-black/20 rounded-2xl h-16 flex items-center justify-center border border-transparent focus-within:border-primary/20 transition-all">
                    <input
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="145"
                        className="w-full bg-transparent text-center text-3xl font-bold text-gray-400 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-700 outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-primary dark:bg-gold-accent text-white dark:text-primary-dark h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 dark:shadow-gold/20 active:scale-95 transition-transform"
                >
                    <span className="material-icons-round text-3xl">arrow_forward</span>
                </button>
            </form>

            <div className="flex justify-between px-1">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        onClick={() => navigate(`/canto/${num}`)}
                        className="w-12 h-12 rounded-2xl bg-primary-light/10 dark:bg-black/20 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-bold active:scale-90 transition-all hover:bg-primary/5 dark:hover:bg-gold/5"
                    >
                        {num}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
