import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://bellagio-backend.onrender.com/api/v1/auth/';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Za preusmeravanje nakon uspešnog logovanja

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    axios.defaults.withCredentials = true;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // POST /api/v1/auth/login
           await axios.post(`${API_URL}login`, {
                email: formData.email,
                password: formData.password
            }, { withCredentials: true });
           
            
            // 2. Preusmeravanje na Dashboard
            navigate('/admin'); 

        } catch (err) {
            console.error('Login Error:', err);
            const msg = err.response?.data?.error || 'Login failed. Check server status or credentials.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
                
                <h1 className="text-4xl font-serif text-yellow-300 text-center mb-6">Admin Login</h1>
                <p className="text-center text-gray-400 mb-8">Ristorante Bellagio Management</p>

                {error && (
                    <div className="p-3 mb-4 rounded-lg bg-red-900 text-red-300 font-semibold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 text-yellow-100 focus:ring-emerald-600 focus:border-emerald-600"
                        />
                    </div>

                    {/* Lozinka */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 text-yellow-100 focus:ring-emerald-600 focus:border-emerald-600"
                        />
                    </div>

                    {/* Dugme za Slanje */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg shadow-xl hover:bg-emerald-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;