import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from '../components/SplashScreen';
import QuickGo from '../components/QuickGo';
import RecentHymns from '../components/RecentHymns';
import CollectionCard from '../components/CollectionCard';
import { useHymn } from '../context/HymnContext';

export default function Home() {
    const { cantos, hasShownSplash, setHasShownSplash } = useHymn();
    const [showSplash, setShowSplash] = useState(!hasShownSplash);

    // Skip all entrance animations after first visit
    const skipAnim = hasShownSplash && !showSplash;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24 relative overflow-hidden">
            <AnimatePresence mode="wait">
                {showSplash && <SplashScreen onComplete={() => {
                    setShowSplash(false);
                    setHasShownSplash(true);
                }} />}
            </AnimatePresence>

            {/* Header / Logo Section */}
            <header className="pt-12 pb-10 flex flex-col items-center justify-center relative z-10">
                <motion.div
                    initial={skipAnim ? false : { opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: showSplash ? 2.1 : 0.1 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-display font-bold tracking-[0.2em] text-primary dark:text-gold-accent flex flex-col items-center">
                        INNARIO
                        <span className="text-[10px] tracking-[0.4em] font-sans font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase">
                            LA LUCE DEL MONDO
                        </span>
                    </h1>
                </motion.div>
            </header>

            <div className="px-5 max-w-lg mx-auto space-y-8 relative z-20">
                <QuickGo />

                <motion.div
                    className="mt-8 grid grid-cols-1 gap-4"
                    initial={skipAnim ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">
                        RACCOLTE
                    </h2>

                    <CollectionCard
                        title="COLLEZIONE REGOLARE"
                        subtitle="INNI 1 - 330"
                        icon="auto_stories"
                        path="/indice?filter=Regolare"
                        delay={skipAnim ? 0 : 0.2}
                        variant="featured"
                    />

                    <div className="grid grid-cols-1 gap-4">
                        <CollectionCard
                            title="CANTI ADDIZIONALI"
                            subtitle=""
                            icon="star"
                            path="/indice?filter=Addizionali"
                            delay={skipAnim ? 0 : 0.3}
                        />
                        <CollectionCard
                            title="CANTI ADDIZIONALI DELL'EDITORE"
                            subtitle=""
                            icon="edit"
                            path="/indice?filter=Editore"
                            delay={skipAnim ? 0 : 0.4}
                        />
                    </div>

                    <CollectionCard
                        title="INDICE TEMATICO"
                        subtitle="INNI PER ARGOMENTO"
                        icon="category"
                        path="/tematico"
                        delay={skipAnim ? 0 : 0.5}
                        variant="featured"
                    />
                </motion.div>

                <RecentHymns />
            </div>
        </div>
    );
}
