import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://bellagio-backend.onrender.com/api/';

// Pomoćna funkcija za dobijanje konfiguracije sa JWT tokenom
const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken');
    return {
        headers: {
            'Authorization': `Bearer ${token}` // Slanje tokena za zaštićene rute
        }
    };
};

const DishManagement = ({ dishes, fetchDishes }) => {
    const initialState = {
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        isAvailable: true,
    };
    const [formData, setFormData] = useState(initialState);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);
    const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];
    const handleFileChange = (e) => {
    // Skladišti prvu izabranu datoteku
    setFile(e.target.files[0]);
};
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // FUNKCIJA ZA KREIRANJE ILI AŽURIRANJE
   // ZAMENITE CELU OVU FUNKCIJU:
const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...');
    setError('');

    // --- NOVO: KREIRANJE FormData OBJEKTA ---
    const formDataObj = new FormData();
    
    // Dodavanje svih tekstualnih polja (iz state-a)
    for (const key in formData) {
        // Axios/Backend ce automatski konvertovati 'true'/'false' u boolean, 
        // a broj u string, sto je u redu za FormData.
        formDataObj.append(key, formData[key]); 
    }
    
    // Dodavanje fajla (Samo ako je izabran)
    if (file) {
        // Ključ 'dishImage' MORA se poklapati sa imenom polja u Multer ruti!
        formDataObj.append('dishImage', file); 
    }
    // ----------------------------------------
    
    try {
        const token = localStorage.getItem('adminToken');
        const config = {
            headers: {
                // NE POSTAVLJAMO Content-Type: multipart/form-data
                // Browser to automatski radi za FormData
                'Authorization': `Bearer ${token}`,
            },
        };

        if (isEditing) {
            // PUT ZAHTEV: Ažuriranje
            await axios.put(`${API_URL}dishes/${editId}`, formDataObj, config); // Koristi formDataObj
            setMessage('Dish successfully updated!');
        } else {
            // POST ZAHTEV: Kreiranje
            await axios.post(`${API_URL}dishes`, formDataObj, config); // Koristi formDataObj
            setMessage('New dish successfully created!');
        }

        setFormData(initialState);
        setIsEditing(false);
        setEditId(null);
        setFile(null); // <-- NOVO: Resetujte stanje fajla
        fetchDishes(); 

    } catch (err) {
        const msg = err.response?.data?.error || 'Operation failed.';
        setError(`Error: ${msg}`);
        setMessage('');
    }
};

    // FUNKCIJA ZA POKRETANJE AŽURIRANJA
    const handleEdit = (dish) => {
        setFormData({
            name: dish.name,
            description: dish.description,
            price: dish.price,
            category: dish.category,
            isAvailable: dish.isAvailable,
            imageUrl: dish.imageUrl || '',
        });
        setEditId(dish._id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Skroluje na formu
    };

    // FUNKCIJA ZA BRISANJE
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this dish?")) return;

        setMessage('Deleting...');
        setError('');
        try {
            // DELETE ZAHTEV
            await axios.delete(`${API_URL}dishes/${id}`, getAuthConfig());
            setMessage('Dish successfully deleted.');
            fetchDishes(); // Osveži listu
        } catch (err) {
            const msg = err.response?.data?.error || 'Deletion failed.';
            setError(`Error: ${msg}`);
            setMessage('');
        }
    };

    // Resetovanje forme
    const handleCancel = () => {
        setFormData(initialState);
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div className="space-y-12">
            
            {/* 1. FORMA ZA KREIRANJE/AŽURIRANJE */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl">
                <h3 className="text-3xl font-serif text-emerald-400 mb-6 border-b border-gray-700 pb-3">
                    {isEditing ? `Edit Dish: ${formData.name}` : 'Add New Dish'}
                </h3>
                
                {message && <div className="p-3 mb-4 rounded-lg bg-emerald-900 text-emerald-300 font-semibold">{message}</div>}
                {error && <div className="p-3 mb-4 rounded-lg bg-red-900 text-red-300 font-semibold">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    
                    {/* Naziv i Cena */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-800 border-gray-700 p-2 rounded text-yellow-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="w-full bg-gray-800 border-gray-700 p-2 rounded text-yellow-100" />
                        </div>
                    </div>

                    {/* Kategorija i Dostupnost */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-gray-800 border-gray-700 p-2 rounded text-yellow-100">
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end pb-1">
                            <label className="flex items-center text-sm font-medium text-gray-300">
                                <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="form-checkbox h-5 w-5 text-emerald-600 bg-gray-800 border-gray-700 rounded mr-2" />
                                Available for Order
                            </label>
                        </div>
                    </div>

                    {/* Opis */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full bg-gray-800 border-gray-700 p-2 rounded text-yellow-100"></textarea>
                    </div>
                    <div className="pt-2">
            <label htmlFor="dishImage" className="block text-sm font-medium text-gray-300 mb-1">Dish Image</label>
            <input 
                type="file" 
                name="dishImage" 
                id="dishImage"
                accept="image/*" 
                onChange={handleFileChange} 
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
            />
            {/* Prikažite trenutnu putanju za editovanje radi lakše provere */}
            {isEditing && !file && dishes.find(d => d._id === editId)?.imageUrl && (
                 <p className="mt-2 text-xs text-gray-500">
                    Current path: {dishes.find(d => d._id === editId).imageUrl}
                 </p>
            )}
            {file && <p className="mt-2 text-xs text-emerald-400">New file selected: {file.name}</p>}
        </div>

                    {/* Dugmad za Formu */}
                    <div className="pt-2 flex space-x-4">
                        <button type="submit" className="flex-1 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition duration-300">
                            {isEditing ? 'Save Changes' : 'Create Dish'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={handleCancel} className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-300">
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* 2. LISTA POSTOJEĆIH JELA */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl">
                <h3 className="text-3xl font-serif text-yellow-300 mb-6 border-b border-gray-700 pb-3">Current Menu Items</h3>
                <div className="grid grid-cols-1 gap-4">
                    {dishes.map(dish => (
                        <div key={dish._id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-emerald-600 transition duration-200">
                            <div className="flex-1">
                                <p className="text-xl font-semibold text-yellow-100">{dish.name}</p>
                                <p className="text-sm text-gray-400">
                                    {dish.category} | ${dish.price.toFixed(2)} | {dish.isAvailable ? 'Available' : 'Out of Stock'}
                                </p>
                            </div>
                            <div className="space-x-4">
                                <button 
                                    onClick={() => handleEdit(dish)}
                                    className="text-emerald-400 hover:text-emerald-300 transition duration-150"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(dish._id)}
                                    className="text-red-400 hover:text-red-300 transition duration-150"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {dishes.length === 0 && (
                         <p className="text-center text-gray-500 py-4">No dishes currently on the menu.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DishManagement;