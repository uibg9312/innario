import clsx from 'clsx';

const categories = ['Regolare', 'Addizionali', 'Editore'];

export default function CategoryFilter({ selected, onSelect }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 justify-start md:justify-center px-4 md:px-0 hide-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={clsx(
                        "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300",
                        selected === cat
                            ? "bg-white text-primary dark:bg-gold-accent dark:text-primary-dark shadow-gold"
                            : "bg-transparent text-white/60 dark:text-gray-400 hover:text-white"
                    )}
                >
                    {cat}
                </button>
            ))}

            {/* Separator */}
            <div className="w-[1px] bg-white/20 dark:bg-gray-700 self-stretch my-1 flex-shrink-0" />

            {/* Tematico tab */}
            <button
                onClick={() => onSelect('Tematico')}
                className={clsx(
                    "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5",
                    selected === 'Tematico'
                        ? "bg-white text-primary dark:bg-gold-accent dark:text-primary-dark shadow-gold"
                        : "bg-transparent text-white/60 dark:text-gray-400 hover:text-white"
                )}
            >
                <span className="material-icons-round text-sm">category</span>
                Tematico
            </button>
        </div>
    );
}
