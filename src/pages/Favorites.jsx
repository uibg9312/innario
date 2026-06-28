import HymnListItem from '../components/HymnListItem';
import { useHymn } from '../context/HymnContext';

export default function Favorites() {
    const { cantos, favorites } = useHymn();

    const favoriteCantos = cantos.filter(c => favorites.includes(c.number));

    return (
        <div className="pt-safe px-4 min-h-screen bg-background-light dark:bg-background-dark pb-20">
            <div className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm pt-4 pb-2">
                <h1 className="text-2xl font-display text-primary dark:text-gold-accent font-bold mb-4 ml-1 flex items-center gap-2">
                    <span className="material-icons-round text-red-500">favorite</span>
                    Favoriti
                </h1>
            </div>

            <div className="mt-4">
                {favoriteCantos.length > 0 ? (
                    favoriteCantos.map((canto, idx) => (
                        <HymnListItem
                            key={canto.number}
                            number={canto.number}
                            title={canto.title}
                            theme={canto.theme}
                            delay={idx * 0.05}
                        />
                    ))
                ) : (
                    <div className="text-center p-8 mt-10">
                        <span className="material-icons-round text-6xl text-gray-300 dark:text-gray-700 mb-4">
                            favorite_border
                        </span>
                        <p className="text-gray-500 dark:text-gray-400">
                            Non hai ancora aggiunto inni ai preferiti.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
