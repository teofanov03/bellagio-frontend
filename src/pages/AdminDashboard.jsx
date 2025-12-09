import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Uvoz komponenti za prikaz (npr. ReservationTable, DishForm - koje ćemo kreirati)
import ReservationTable from '../components/admin/ReservationTable'; 
import DishManagement from '../components/admin/DishManagement';

// Postavite osnovni URL Backenda
const API_URL = 'https://bellagio-backend.onrender.com/api/';

const AdminDashboard = () => {
    const [view, setView] = useState('reservations'); // 'reservations' ili 'menu'
    const [reservations, setReservations] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FUNKCIJA ZA DOHVATANJE SVIH REZERVACIJA
    // (Koristi se autentifikacija: Token mora biti poslat u zaglavlju)
    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('adminToken'); // Token bi se inače čitao iz HTTP-only cookie-ja (sigurnije)
                                                              // Za ovaj primer, pretpostavimo da ga čitamo iz localStorage
            
            if (!token) {
                throw new Error('No authorization token found. Please log in.');
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}` // SLANJE JWT TOKENA!
                }
            };
            
            // GET /api/reservations (Zaštićena Admin ruta)
            const res = await axios.get(`${API_URL}reservations`, config);
            setReservations(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Auth Error:', err);
            setError('Authentication required or session expired.');
            setLoading(false);
        }
    };

    // FUNKCIJA ZA DOHVATANJE SVIH JELA
    const fetchDishes = async () => {
        // GET /api/dishes (Javna ruta, ali je dohvatamo da prikažemo Adminu)
        // Admin Management dio će koristiti zaštićene rute!
        try {
             const res = await axios.get(`${API_URL}dishes`); 
             setDishes(res.data.data);
        } catch (err) {
             console.error('Dish fetch error', err);
        }
    };


    useEffect(() => {
        fetchReservations();
        fetchDishes(); // Dohvati jela i prilikom inicijalizacije
    }, []);

    if (loading) {
        return <div className="min-h-screen pt-24 bg-gray-900 text-center text-yellow-300">Loading Admin Data...</div>;
    }

    if (error) {
        return <div className="min-h-screen pt-24 bg-gray-900 text-center text-red-500">ERROR: {error}</div>;
    }
    
    return (
        <div className="min-h-screen pt-24 bg-gray-800 text-white">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-serif text-yellow-300 mb-8">Admin Dashboard - Ristorante Bellagio</h1>

                {/* Navigacija unutar Dashboarda */}
                <div className="flex space-x-4 mb-8 border-b border-gray-700">
                    <button 
                        onClick={() => setView('reservations')}
                        className={`py-2 px-4 text-lg font-semibold transition duration-200 ${view === 'reservations' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        Reservations ({reservations.length})
                    </button>
                    <button 
                        onClick={() => setView('menu')}
                        className={`py-2 px-4 text-lg font-semibold transition duration-200 ${view === 'menu' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        Menu Management ({dishes.length})
                    </button>
                </div>

                {/* Prikazivanje selektovanog pogleda */}
                <div className="py-4">
                    {view === 'reservations' && (
                        <ReservationTable reservations={reservations} fetchReservations={fetchReservations} />
                    )}
                    {view === 'menu' && (
                        <DishManagement dishes={dishes} fetchDishes={fetchDishes} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;