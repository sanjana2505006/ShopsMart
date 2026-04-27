import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import MenuBoard from './pages/MenuBoard';
import AdminPanel from './pages/AdminPanel';
import { apiFetch } from './lib/api';

const mealPlans = [
    {
        id: 'weekly-veg',
        name: 'Weekly Veg',
        duration: '7 days',
        price: 1099,
        meals: '21 meals included',
        accent: 'veg',
        description: 'Balanced vegetarian meals with one festival special dinner each week.',
    },
    {
        id: 'monthly-nonveg',
        name: 'Monthly Non-Veg',
        duration: '30 days',
        price: 4299,
        meals: '90 meals included',
        accent: 'nonveg',
        description: 'Campus favorite with twice-weekly chef specials and flexible opt-outs.',
    },
    {
        id: 'day-pass',
        name: 'Exam Day Pass',
        duration: '24 hours',
        price: 179,
        meals: 'Breakfast, lunch, dinner',
        accent: 'express',
        description: 'Quick recharge for packed schedules, including a late-night snack add-on.',
    },
];

const dailyMenu = [
    {
        id: 1,
        name: 'Millet Idli Bowl',
        category: 'Breakfast',
        price: 45,
        tag: 'High Protein',
        description: 'Steamed idlis, sambar, peanut chutney, and fruit.',
    },
    {
        id: 2,
        name: 'Paneer Tikka Thali',
        category: 'Lunch',
        price: 120,
        tag: 'Veg',
        description: 'Paneer tikka, jeera rice, dal tadka, roti, and salad.',
    },
    {
        id: 3,
        name: 'Chicken Pepper Fry Combo',
        category: 'Dinner',
        price: 145,
        tag: 'Non-Veg',
        description: 'Pepper chicken, lemon rice, sauteed vegetables, and curd.',
    },
    {
        id: 4,
        name: 'Cold Coffee + Sandwich',
        category: 'Snack',
        price: 85,
        tag: 'Grab & Go',
        description: 'Mess cafe special for long lab sessions and late afternoons.',
    },
];

const weeklyMenu = [
    { day: 'Mon', main: 'Rajma Rice', side: 'Fruit Custard', crowd: 'High' },
    { day: 'Tue', main: 'Veg Biryani', side: 'Raita', crowd: 'Medium' },
    { day: 'Wed', main: 'Masala Dosa Night', side: 'Filter Coffee', crowd: 'High' },
    { day: 'Thu', main: 'Fish Curry Meal', side: 'Beans Poriyal', crowd: 'Medium' },
    { day: 'Fri', main: 'Pasta Bar', side: 'Garlic Bread', crowd: 'High' },
    { day: 'Sat', main: 'North Indian Thali', side: 'Gulab Jamun', crowd: 'Medium' },
];

const mealWindows = [
    { id: 'breakfast', title: 'Tomorrow Breakfast', time: '7:30 AM - 9:30 AM', booked: true, item: 'Poha, boiled eggs, banana' },
    { id: 'lunch', title: 'Tomorrow Lunch', time: '12:15 PM - 2:30 PM', booked: true, item: 'Dal makhani, pulao, cucumber salad' },
    { id: 'dinner', title: 'Tomorrow Dinner', time: '7:00 PM - 9:00 PM', booked: false, item: 'Veg noodles, manchurian, soup' },
];

const initialOrders = [
    { id: 'ORD-1042', item: 'Monthly Non-Veg', type: 'Plan', amount: 4299, date: 'Apr 24', status: 'Paid' },
    { id: 'ORD-1035', item: 'Chicken Pepper Fry Combo', type: 'Meal', amount: 145, date: 'Apr 23', status: 'Served' },
    { id: 'ORD-1028', item: 'Exam Day Pass', type: 'Plan', amount: 179, date: 'Apr 21', status: 'Completed' },
];

const notifications = [
    { id: 1, title: 'Menu updated for Wednesday dinner', detail: 'Masala dosa counter moved to Block B.', tone: 'info' },
    { id: 2, title: 'Payment reminder', detail: 'Your weekly plan renews in 2 days.', tone: 'warning' },
    { id: 3, title: 'Feedback reward unlocked', detail: 'Rate 3 meals this week to earn 5% snack credit.', tone: 'success' },
];

const adminStats = [
    { label: 'Active subscriptions', value: '842', note: '+7.4% vs last week' },
    { label: 'Expected lunch count', value: '618', note: '58 opt-outs recorded' },
    { label: 'Collections this month', value: 'Rs 8.4L', note: '96.2% payment success' },
    { label: 'Average meal rating', value: '4.3/5', note: 'Most loved: dosa night' },
];

const feedbackItems = [
    { id: 1, student: 'Aarya CSE-2', meal: 'Paneer Tikka Thali', rating: 5, note: 'Loved the spice level and portion size.' },
    { id: 2, student: 'Rohan ECE-1', meal: 'Fish Curry Meal', rating: 3, note: 'Good taste, but serve hotter during peak rush.' },
    { id: 3, student: 'Mitali ME-3', meal: 'Millet Idli Bowl', rating: 4, note: 'Healthy and filling. Please keep fruit daily.' },
];

const AUTH_STORAGE_KEY = 'smartshop-auth';

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [bookings, setBookings] = useState(mealWindows);
    const [orders, setOrders] = useState(initialOrders);
    const [authToken, setAuthToken] = useState('');
    const [isAuthReady, setIsAuthReady] = useState(false);

    const activePlan = mealPlans[1];

    const dashboardStats = useMemo(() => ([
        { label: 'Active Plan', value: activePlan.name, helper: 'Renews on May 2' },
        { label: 'Remaining Meals', value: '18', helper: '3 already opted out' },
        { label: 'Mess Wallet', value: 'Rs 640', helper: 'Snacks and add-ons' },
        { label: 'Waste Saved', value: '12 plates', helper: 'From your opt-in updates' },
    ]), []);

    useEffect(() => {
        const restoreSession = async () => {
            const savedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

            if (!savedAuth) {
                setIsAuthReady(true);
                return;
            }

            try {
                const parsedAuth = JSON.parse(savedAuth);
                const response = await apiFetch('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${parsedAuth.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Session expired');
                }

                setAuthToken(parsedAuth.token);
                setUser(response.data.user);
                setCurrentPage(response.data.user.role === 'admin' ? 'admin' : 'dashboard');
            } catch (error) {
                window.localStorage.removeItem(AUTH_STORAGE_KEY);
            } finally {
                setIsAuthReady(true);
            }
        };

        restoreSession();
    }, []);

    const handleAuthSuccess = ({ token, user: nextUser }) => {
        setAuthToken(token);
        setUser(nextUser);
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token }));
        setCurrentPage(nextUser.role === 'admin' ? 'admin' : 'dashboard');
    };

    const handleNavigate = (page) => {
        if (page === 'logout') {
            setUser(null);
            setAuthToken('');
            setCart([]);
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
            setCurrentPage('login');
            return;
        }

        if (page === 'admin' && user?.role !== 'admin') {
            setCurrentPage('dashboard');
            return;
        }

        setCurrentPage(page);
    };

    const handleAddMeal = (meal) => {
        setCart((current) => [...current, meal]);
        setOrders((current) => [
            {
                id: `ORD-${1050 + current.length}`,
                item: meal.name,
                type: 'Meal',
                amount: meal.price,
                date: 'Today',
                status: 'Preparing',
            },
            ...current,
        ]);
    };

    const handleBuyPlan = (plan) => {
        setOrders((current) => [
            {
                id: `ORD-${1060 + current.length}`,
                item: plan.name,
                type: 'Plan',
                amount: plan.price,
                date: 'Today',
                status: 'Paid',
            },
            ...current,
        ]);
        setCurrentPage('dashboard');
    };

    const toggleBooking = (mealId) => {
        setBookings((current) =>
            current.map((meal) =>
                meal.id === mealId ? { ...meal, booked: !meal.booked } : meal
            )
        );
    };

    const totalCartValue = cart.reduce((sum, item) => sum + item.price, 0);

    if (!isAuthReady) {
        return (
            <div className="app-shell">
                <main className="app-main">
                    <section className="page">
                        <div className="container">
                            <div className="auth-loading-card">
                                <span className="mini-label">SmartShop</span>
                                <h1>Restoring your campus session...</h1>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return <Login onAuthSuccess={handleAuthSuccess} />;
            case 'dashboard':
                return (
                    <StudentDashboard
                        user={user}
                        mealPlans={mealPlans}
                        stats={dashboardStats}
                        bookings={bookings}
                        orders={orders}
                        notifications={notifications}
                        onBuyPlan={handleBuyPlan}
                        onToggleBooking={toggleBooking}
                        onNavigate={setCurrentPage}
                    />
                );
            case 'menu':
                return (
                    <MenuBoard
                        menuItems={dailyMenu}
                        weeklyMenu={weeklyMenu}
                        cart={cart}
                        totalCartValue={totalCartValue}
                        onAddMeal={handleAddMeal}
                    />
                );
            case 'admin':
                return (
                    <AdminPanel
                        stats={adminStats}
                        plans={mealPlans}
                        weeklyMenu={weeklyMenu}
                        feedbackItems={feedbackItems}
                        orders={orders}
                    />
                );
            default:
                return <Login onAuthSuccess={handleAuthSuccess} />;
        }
    };

    return (
        <div className="app-shell">
            <Navbar
                currentPage={currentPage}
                user={user}
                cartCount={cart.length}
                onNavigate={handleNavigate}
            />
            <main className="app-main">{renderPage()}</main>
        </div>
    );
}

export default App;
