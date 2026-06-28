import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useHymn } from '../context/HymnContext';

export default function BottomNav() {
    const { recent, cantos } = useHymn();

    // Calculate dynamic path for "ULTIMO"
    const lastVisitedUid = recent.length > 0
        ? recent[0].uid
        : cantos.find(c => (c.category === 'Standard' || !c.category) && c.number === 1)?.uid || '1';

    const navItems = [
        { path: '/', label: 'HOME', icon: 'home' },
        { path: '/indice', label: 'CERCA', icon: 'list_alt' },
        { path: `/canto/${lastVisitedUid}`, label: 'ULTIMO', icon: 'history' },
        { path: '/favoriti', label: 'PREFERITI', icon: 'favorite' },
        { path: '/impostazioni', label: 'OPZIONI', icon: 'settings' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-primary dark:bg-surface-dark pb-safe pt-2 px-2 z-50 transition-colors duration-300">
            <div className="flex justify-between items-center w-full max-w-lg mx-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-300 flex-1 min-w-0",
                            isActive ? "text-white" : "text-white/40 dark:text-gray-500 hover:text-white/60"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="relative p-1">
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-white/20 dark:bg-gold-accent/10 rounded-full"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <span className="material-icons-round text-2xl relative z-10">{item.icon}</span>
                                </div>
                                <span className="text-[9px] font-bold mt-1 tracking-tighter text-center leading-none uppercase">
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
