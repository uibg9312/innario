import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2000); // 2 seconds splash
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background-light dark:bg-background-dark"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.img
                src="/assets/logo_transparente.png"
                alt="Innario Logo"
                className="w-48 h-48 object-contain mb-8 filter drop-shadow-lg dark:drop-shadow-[0_0_15px_rgba(207,161,86,0.3)]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.h1
                className="text-4xl font-display text-primary dark:text-gold-accent tracking-widest"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                INNARIO
            </motion.h1>
            <motion.p
                className="text-gray-500 dark:text-gray-400 mt-2 font-light tracking-wide text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                LA LUCE DEL MONDO
            </motion.p>
        </motion.div>
    );
}
