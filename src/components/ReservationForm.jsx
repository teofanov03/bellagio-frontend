import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes, startOfToday, addDays } from 'date-fns';
import { motion } from 'framer-motion';

const ReservationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        // DateTime sada sadrži i datum i vreme
        dateTime: setHours(setMinutes(startOfToday(), 0), 20),
        guests: 2,
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'error' | 'loading'

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Specijalno rukovanje za guests da se osigura da je validan broj
        const newValue = name === 'guests' ? parseInt(value) : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));
        // Ukloni grešku čim korisnik počne kucati
        if (errors[name]) {
            setErrors(prev => {
                const { [name]: _removed, ...rest } = prev;
                return rest;
            });
        }
    };

    // FUNKCIJA ZA KLIJENTSKU VALIDACIJU (Pravilno definisana)
    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        // Provera Imena
        if (!formData.name.trim()) {
            tempErrors.name = 'Full Name is required.';
            isValid = false;
        }

        // Provera Emaila
        if (!formData.email || !emailRegex.test(formData.email)) {
            tempErrors.email = 'Valid email address is required.';
            isValid = false;
        }

        // Provera Broja Osoba
        if (formData.guests < 1 || formData.guests > 20 || isNaN(formData.guests)) {
            tempErrors.guests = 'Number of guests must be between 1 and 20.';
            isValid = false;
        }

        // Provera Datuma (Da nije u prošlosti)
        if (!formData.dateTime || new Date(formData.dateTime) < new Date()) {
            // NOTE: DatePicker sprečava odabir prošlih datuma, ali ova provera pokriva inicijalizaciju
            tempErrors.dateTime = 'Reservation date and time cannot be in the past.';
            isValid = false;
        }
        
        setErrors(tempErrors);
        return isValid;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus('loading');
        
        // KORAK 1: Pokreni validaciju forme
        if (!validateForm()) {
            setSubmissionStatus('error');
            // Kratka pauza za prikaz greške pre resetovanja statusa
            setTimeout(() => setSubmissionStatus(null), 3000); 
            return; // Zaustavi slanje ako validacija ne prođe
        }
        
        // Ako je validacija prošla, kreiramo objekat za slanje
        const reservationData = {
            guestName: formData.name,      
            email: formData.email,
            phone: formData.phone,
            message: formData.message,

            numberOfGuests: Number(formData.guests),
            // Šaljemo Date objekat
            date: formData.dateTime, 
        };

        try {
            const response = await axios.post('https://bellagio-backend.onrender.com/api/reservations', reservationData);
            
            if (response.data.success) {
                setSubmissionStatus('success');
                setErrors({}); // Očisti greške na uspešno slanje

                // Resetovanje forme
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    dateTime: setHours(setMinutes(startOfToday(), 0), 20),
                    guests: 2,
                    message: '',
                });
            } else {
                setSubmissionStatus('error: Unknown error.');
            }
        } catch (error) {
            console.error('Reservation error:', error.response?.data?.error || error.message);
            // Prikaz greške iz Backenda korisniku
            setSubmissionStatus(`error: ${error.response?.data?.error || 'Server Error. Please try again.'}`);
        }
    };
    
    // NOTE: OVAJ DEO JE ISTI KAO VAŠ KOD, SAMO ISPRAVNO ZATVOREN
    return (
        <section id="reservation" className="py-24 bg-gray-900 text-white">
            <motion.div
              initial={{ opacity: 0, y: 50 }} // Početno stanje
              whileInView={{ opacity: 1, y: 0 }} // <-- KOREKCIJA: Animiraj kada je u vidokrugu
              transition={{ duration: 0.6, delay: 0.2 }}
              // Dodajte viewport da se animacija desi samo jednom
              viewport={{ once: true, amount: 0.2 }} // Pokreće se kada je 40% elementa vidljivo
              className="container mx-auto px-6 max-w-2xl"
          >
                
                <h2 className="text-5xl font-serif text-center text-yellow-300 mb-4">
                    Book Your Table
                </h2>
                <p className="text-lg text-center text-gray-400 mb-12">
                    Secure your place for an unforgettable dining experience.
                </p>

                {/* Prikaz statusa */}
                {submissionStatus === 'loading' && (
                    <div className="p-4 mb-4 text-center text-lg text-emerald-400 border border-emerald-400 rounded-lg">
                        Sending your request...
                    </div>
                )}
                {submissionStatus === 'success' && (
                    <div className="p-4 mb-4 text-center text-lg text-white bg-emerald-600 rounded-lg">
                        🎉 Reservation successful! We will confirm your booking via email shortly.
                    </div>
                )}
                {submissionStatus && submissionStatus.startsWith('error') && (
                    <div className="p-4 mb-4 text-center text-lg text-red-500 border border-red-500 rounded-lg">
                        {submissionStatus.replace('error: ', 'Error: ')}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    
                    {/* Ime i Prezime */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name (Required)</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className={`mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm p-3 text-yellow-100 focus:ring-emerald-600 focus:border-emerald-600 ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                        )}
                    </div>

                    {/* Email i Telefon */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email (Required)</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm p-3 text-yellow-100 focus:ring-emerald-600 focus:border-emerald-600 ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone (Optional)</label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm p-3 text-yellow-100 focus:ring-emerald-600 focus:border-emerald-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="dateTime" className="block text-sm font-medium text-gray-300">Date & Time (Required)</label>
                            <DatePicker
                                selected={formData.dateTime} 
                                onChange={(date) => { 
                                  setFormData({ ...formData, dateTime: date });
                                  if (errors.dateTime) setErrors(prev => { 
                                      const { dateTime: _removed, ...rest } = prev; // <-- POPRAVKA OVDE
                                      return rest; 
                                  }); 
                                }}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={30}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                minDate={startOfToday()}
                                maxDate={addDays(startOfToday(), 90)}
                                minTime={setHours(setMinutes(startOfToday(), 0), 10)}
                                maxTime={setHours(setMinutes(startOfToday(), 0), 23)}
                                required
                                className={`mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm p-3 text-yellow-100 focus:ring-emerald-600 focus:border-emerald-600 ${errors.dateTime ? 'border-red-500' : ''}`}
                            />
                            {errors.dateTime && (
                                <p className="mt-1 text-sm text-red-400">{errors.dateTime}</p>
                            )}
                        </div>

                        {/* Input za Broj Osoba (Guests) */}
                        <div className="col-span-1 md:col-span-1">
                            <label htmlFor="guests" className="block text-sm font-medium text-gray-300">Guests (Required)</label>
                            <input
                                type="number"
                                name="guests"
                                id="guests"
                                required
                                min="1"
                                max="20"
                                value={formData.guests}
                                onChange={handleChange} // Koristimo generalni handleChange
                                className={`mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm p-3 text-yellow-100 focus:ring-emerald-600 focus:border-emerald-600 ${errors.guests ? 'border-red-500' : ''}`}
                            />
                            {errors.guests && (
                                <p className="mt-1 text-sm text-red-400">{errors.guests}</p>
                            )}
                        </div>
                        
                        <div className="hidden md:block"></div> 
                    </div>

                    {/* Poruka */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300">Special Requests (Optional)</label>
                        <textarea
                            name="message"
                            id="message"
                            rows="3"
                            value={formData.message}
                            onChange={handleChange}
                            className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm p-3 text-yellow-100 focus:ring-emerald-600 focus:border-emerald-600"
                        ></textarea>
                    </div>

                    {/* Dugme za Slanje */}
                    <div className="pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }} // Blago se poveća kada pređemo mišem
                          whileTap={{ scale: 0.98 }}   // Blago se smanji pri kliku
                          type="submit"
                          disabled={submissionStatus === 'loading'}
                          className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg shadow-xl hover:bg-emerald-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                      >
                          {submissionStatus === 'loading' ? 'Processing...' : 'Confirm Reservation'}
                      </motion.button>
                    </div>
                </form>
            </motion.div>
        </section>
    );
};

export default ReservationForm;