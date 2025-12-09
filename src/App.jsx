import React, { useState } from 'react'; // <-- ISPRAVKA 1: UVEZEN useState
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Uvoz Frontend Komponenti
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import ReservationForm from './components/ReservationForm';
import ScrollToTopButton from './components/ScrollToTopButton';
// Uvoz Admin Stranica (pretpostavka lokacije)
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';


// ------------------------------------------
// Custom Hook za Logout
// ------------------------------------------
// Kreiramo hook koji obavlja Logout logiku
const useAdminLogout = () => {
    const navigate = useNavigate();
    
    // Vraćamo samu funkciju logout
    const logout = () => {
        localStorage.removeItem('adminToken'); // Brišemo token
        navigate('/login');
    };
    return logout;
};


// ------------------------------------------
// Navigacija Komponenta (Navbar)
// ------------------------------------------

// ISPRAVKA 2 & 3: Navbar je sada čista komponenta koja koristi hookove interno
const Navbar = () => {
    // Hooks moraju biti pozvani unutar funkcionalne komponente
    const token = localStorage.getItem('adminToken');
    const logout = useAdminLogout(); // Koristi useNavigate i vraća funkciju

    // Stanje za mobilni meni
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="fixed w-full z-30 bg-gray-900 bg-opacity-90 shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* 1. Bellagio Naslov */}
                <Link 
                    to="/" 
                    className="text-2xl sm:text-3xl font-serif text-yellow-300 font-bold tracking-widest"
                    onClick={closeMenu} // Zatvara meni ako se klikne na logo
                >
                    Bellagio
                </Link>
                
                {/* 2. GLAVNI LINKOVI - Desktop Prikaz */}
                <div className="hidden md:flex space-x-6 lg:space-x-8 text-lg font-light items-center">
                    
                    <Link to="/" className="text-gray-300 hover:text-emerald-400 transition duration-200">Home</Link>
                    
                    {/* Admin link / Logout / Login */}
                    {token ? (
                        <>
                            <Link to="/admin" className="text-sm font-semibold text-yellow-100 bg-emerald-700 py-1 px-3 rounded-full hover:bg-emerald-600">Dashboard</Link>
                            <button onClick={logout} className="text-sm font-semibold text-white bg-red-700 py-1 px-3 rounded-full hover:bg-red-600">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="text-sm font-semibold text-yellow-100 bg-emerald-700 py-1 px-3 rounded-full hover:bg-emerald-600">Admin Login</Link>
                    )}
                </div>
                
                {/* 3. HAMBURGER IKONA - Mobilni Prikaz */}
                <div className="md:hidden">
                    <button 
                        onClick={toggleMenu} // <-- Povezano sa funkcijom
                        className="text-gray-300 hover:text-emerald-400 focus:outline-none"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* 4. MOBILNI MENI (Uslovno prikazivanje) */}
            <div 
                className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} border-t border-gray-800 py-2`}
            >
                <div className="flex flex-col space-y-2 px-6">
                    {/* Linkovi u mobilnom meniju, zatvaraju meni nakon klika */}
                    <Link to="/" onClick={closeMenu} className="text-gray-300 hover:text-emerald-400 transition duration-200 py-1">Home</Link>
                    
                    {token ? (
                        <>
                            <Link to="/admin" onClick={closeMenu} className="text-sm font-semibold text-yellow-100 bg-emerald-700 py-1 px-3 rounded-full hover:bg-emerald-600 w-max">Dashboard</Link>
                            {/* NAPOMENA: Logout poziva funkciju, koja zatim poziva closeMenu */}
                            <button onClick={() => { logout(); closeMenu(); }} className="text-sm font-semibold text-white bg-red-700 py-1 px-3 rounded-full hover:bg-red-600 w-max">Logout</button> 
                        </>
                    ) : (
                        <Link to="/login" onClick={closeMenu} className="text-sm font-semibold text-yellow-100 bg-emerald-700 py-1 px-3 rounded-full hover:bg-emerald-600 w-max">Admin Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

// Footer (Bez izmena, ispravan kod)
const Footer = () => (
    // ... (Sadržaj Footera)
    <footer className="bg-gray-900 border-t border-gray-800 py-12 text-gray-500">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                
                {/* 1. Copyright i Slogan */}
                <div>
                    <h4 className="text-xl font-serif text-emerald-400 mb-4">Ristorante Bellagio</h4>
                    <p className="mb-2">© {new Date().getFullYear()} | Italian Elegance</p>
                    <p className="text-sm">Made with passion and React.</p>
                </div>

                {/* 2. Kontakt i Lokacija */}
                <div>
                    <h4 className="text-xl font-serif text-yellow-300 mb-4">Contact Info</h4>
                    <p>123 Via Roma, 00100 Rome, Italy</p>
                    <p>Phone: +39 06 1234 5678</p>
                </div>

                {/* 3. RADNO VREME */}
                <div>
                    <h4 className="text-xl font-serif text-yellow-300 mb-4">Working Hours</h4>
                    <p className="text-gray-400">
                        **Monday - Friday:** 11:00 AM - 11:00 PM
                    </p>
                    <p className="text-gray-400">
                        **Saturday:** 12:00 PM - 12:00 AM
                    </p>
                    <p className="text-gray-400">
                        **Sunday:** Closed
                    </p>
                </div>

            </div>
        </div>
    </footer>
);


// ------------------------------------------
// Komponenta za Home Stranicu (Bez izmena, ispravan kod)
// ------------------------------------------

const HomePage = () => (
    // ... (Sadržaj HomePage)
    <>
        <HeroSection />
        <MenuSection />
        <ReservationForm />
        <section id="about" className="py-24 bg-gray-900 text-center text-white">
            <h3 className="text-4xl font-serif text-yellow-300 mb-6">Our Story</h3>
            <p className="max-w-3xl mx-auto text-gray-400 px-6">
                Founded on the passion for authentic Italian cuisine and the art of fine dining, Bellagio offers an experience that transports you straight to the heart of Tuscany.
            </p>
        </section>
        <ScrollToTopButton />
    </>
);


// ------------------------------------------
// Glavna Aplikacija sa Rutiranjem (App)
// ------------------------------------------

function App() {
    return (
        <Router>
            <div className="bg-gray-900 min-h-screen">
                <Navbar /> 
                
                <main className="pt-16">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminDashboard />} /> 
                    </Routes>
                </main>
                
                <Footer />
            </div>
        </Router>
    );
}

export default App;