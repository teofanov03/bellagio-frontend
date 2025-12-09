import React from 'react';
import { motion } from 'framer-motion';

// ISPRAVKA 1: Komponenta sada prima dish I itemVariants prop
const DishCard = ({ dish, itemVariants }) => { 
    const { name, description, price, isAvailable, category,imageUrl } = dish;
    const BACKEND_BASE_URL = 'http://localhost:5000';
    return (
        // KORISTIMO motion.div KAO JEDINI GLAVNI WRAPPER
        <motion.div
            variants={itemVariants} // <-- KORISTI PROSLEDJENE VARIJANTE
            // ISPRAVKA 2: Sve klase za stil (pozadina, senke, hover efekti) premeštamo ovde
            className="bg-gray-800 p-6 rounded-xl shadow-2xl transition duration-500 hover:shadow-emerald-500/20 transform hover:-translate-y-1"
        >
            {imageUrl && (
                <div className="mb-4 overflow-hidden rounded-lg">
                    <img 
                        src={`${BACKEND_BASE_URL}${dish.imageUrl}`} // Koristimo putanju iz Backenda/prop-a
                        alt={name} 
                        className="w-full h-40 object-cover transform transition duration-500 hover:scale-110"
                    />
                </div>
            )}
            {/* Status Dostupnosti */}
            <span 
                className={`text-xs font-bold uppercase py-1 px-3 rounded-full ${
                    isAvailable ? 'bg-emerald-600 text-white' : 'bg-red-700 text-gray-200'
                }`}
            >
                {isAvailable ? 'Available' : 'Sold Out'}
            </span>

            <h3 className="text-3xl font-serif text-yellow-100 mt-4 mb-2">
                {name}
            </h3>
            
            <p className="text-gray-400 mb-4 text-sm min-h-[60px]">
                {description}
            </p>

            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                
                {/* Cena (Zlatni Akcenat) */}
                <span className="text-3xl font-bold text-yellow-300">
                    ${price.toFixed(2)}
                </span>
                
                {/* Kategorija (Smaragdni Akcenat) */}
                <span className="text-sm font-semibold text-emerald-400">
                    {category}
                </span>
            </div>
            
        </motion.div> // <-- Samo jedan wrapper
    );
};

export default DishCard;