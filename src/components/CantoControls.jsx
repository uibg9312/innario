import clsx from 'clsx';
import { useTheme } from '../context/ThemeContext';

export default function CantoControls({
    onFontSizeChange,
    fontSize,
    isFavorite,
    onToggleFavorite,
    onClose,
    cantoNumber
}) {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <div className="fixed top-0 left-0 right-0 z-40 bg-background-light/90 dark:bg-surface-dark/95 backdrop-blur-md px-4 py-3 min-h-[80px] flex items-center justify-center transition-colors duration-300">
            <div className="w-full max-w-2xl flex items-center justify-between">
                <button
                    onClick={onClose}
                    className="p-2 -ml-2 rounded-full text-primary dark:text-gray-300 active:bg-gray-200 transition-colors"
                >
                    <span className="material-icons-round text-2xl font-bold">arrow_back</span>
                </button>

                <div className="flex flex-col items-center">
                    <span className="font-display font-bold text-xl text-primary dark:text-gold-accent tracking-[0.2em] leading-tight">
                        INNARIO
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.1em] uppercase">
                        La Luce del Mondo
                    </span>
                </div>

                <button
                    onClick={onToggleFavorite}
                    className="p-2 -mr-2 rounded-full text-primary active:scale-125 transition-transform"
                >
                    <span className={clsx(
                        "material-icons-round text-2xl",
                        isFavorite ? "text-red-500" : "text-primary/40 dark:text-gold-accent/40"
                    )}>
                        {isFavorite ? 'favorite' : 'favorite_border'}
                    </span>
                </button>
            </div>
        </div>
    );
}
