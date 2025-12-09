import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DishCard from './DishCard';
import { motion } from 'framer-motion';

// 1. Varijante za kontejner (listu)
const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.1, // Odlaganje pre nego što počnu animacije dece
            staggerChildren: 0.08, // Odlaganje između svake stavke
        },
    },
};

// 2. Varijante za pojedinačne stavke menija
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const MenuSection = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/dishes'); 
                setDishes(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dishes:', err);
                setError('Failed to load menu. Please try again later.');
                setLoading(false);
            }
        };
        fetchDishes();
    }, []);

    if (loading) {
        return (
            <section id="menu" className="py-20 bg-gray-900 text-center">
                <p className="text-xl text-yellow-100">Loading exquisite menu...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section id="menu" className="py-20 bg-gray-900 text-center">
                <p className="text-xl text-red-500">{error}</p>
            </section>
        );
    }

    return (
        <section id="menu" className="py-24 bg-gray-900 text-white">
            <div className="container mx-auto px-6">
                
                <h2 className="text-5xl font-serif text-center text-yellow-300 mb-4">
                    Our Exquisite Menu
                </h2>
                <p className="text-lg text-center text-gray-400 mb-16">
                    A selection of our finest traditional Italian dishes.
                </p>

                {/* GLAVNA KOREKCIJA: MOTION KONTEJNER SE NALAZI OVDE */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible" // <-- Pokreće se pri skrolovanju
                    viewport={{ once: true, amount: 0.2 }} // Pokreće se ranije (20% vidljivo)
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" // Grid klase idu na kontejner
                >
                    {dishes.length > 0 ? (
                        dishes.map(dish => (
                            <DishCard 
                                key={dish._id} 
                                dish={dish} 
                                itemVariants={itemVariants} // <-- PROSLEDIMO VARIJANTE
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">
                            The kitchen is preparing new delights! Menu coming soon.
                        </p>
                    )}
                </motion.div>
                
            </div>
        </section>
    );
};

export default MenuSection;