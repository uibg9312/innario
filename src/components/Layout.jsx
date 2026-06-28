import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
    const location = useLocation();
    // Hide bottom nav on splash screen if we had one as a route, but typically splash is conditional in App.
    // For now, always show bottom nav except maybe on specific fullscreen views if needed.

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <main className="flex-1 pb-24 overflow-y-auto hide-scrollbar relative">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
