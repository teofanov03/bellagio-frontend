import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Pretpostavljam da koristite react-icons

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // 1. Logika za prikazivanje/skrivanje dugmeta
    const toggleVisibility = () => {
        if (window.scrollY > 300) { // Pojavljuje se nakon 300px skrolovanja
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // 2. Logika za skrolovanje na vrh
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        // OBAVEZNO: Čišćenje event listenera pri demontaži komponente
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-5 right-5 p-4 rounded-full bg-emerald-600 text-white shadow-xl transition-opacity duration-300 z-50 cursor-pointer hover:bg-emerald-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
            aria-label="Scroll to top"
        >
            <FaArrowUp className="w-5 h-5" />
        </button>
    );
};

export default ScrollToTopButton;