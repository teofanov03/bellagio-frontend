import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://bellagio-backend.onrender.com/api/';

// Pomoćna funkcija za dobijanje konfiguracije sa JWT tokenom
const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

const ReservationTable = ({ reservations, fetchReservations }) => {
    const [message, setMessage] = useState(''); // Poruka o uspehu/grešci

    // Funkcija za promenu statusa rezervacije
    const handleStatusUpdate = async (id, newStatus) => {
        setMessage('Processing...');
        try {
            // PUT /api/reservations/:id (Zaštićena Admin ruta)
            await axios.put(
                `${API_URL}reservations/${id}`,
                { status: newStatus },
                getAuthConfig()
            );
            
            setMessage(`Reservation ${id.slice(-4)} status updated to ${newStatus}.`);
            fetchReservations(); // Osveži listu nakon promene statusa

        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to update status.';
            setMessage(`Error: ${msg}`);
        }
    };

    // Funkcija za brisanje rezervacije
    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete reservation ${id.slice(-4)}?`)) return;

        setMessage('Deleting...');
        try {
            // DELETE /api/reservations/:id (Zaštićena Admin ruta)
            await axios.delete(`${API_URL}reservations/${id}`, getAuthConfig());

            setMessage(`Reservation ${id.slice(-4)} successfully deleted.`);
            fetchReservations(); // Osveži listu nakon brisanja

        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to delete reservation.';
            setMessage(`Error: ${msg}`);
        }
    };

    // Pomoćna funkcija za stilizovanje statusa
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-emerald-600 text-white';
            case 'Cancelled':
                return 'bg-red-700 text-gray-200';
            case 'Pending':
            default:
                return 'bg-yellow-600 text-gray-900';
        }
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-xl">
            <h3 className="text-3xl font-serif text-yellow-300 mb-6 border-b border-gray-700 pb-3">All Reservations</h3>
            
            {/* Poruka o uspehu/grešci */}
            {message && (
                <div className={`p-3 mb-4 rounded-lg font-semibold ${message.startsWith('Error') ? 'bg-red-900 text-red-300' : 'bg-emerald-900 text-emerald-300'}`}>
                    {message}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date/Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name/Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Guests</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-800">
                        {reservations.map((res) => (
                            <tr key={res._id} className="hover:bg-gray-800 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-yellow-100">{res.date}</div>
                                    <div className="text-xs text-gray-400">{res.time}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{res.name}</div>
                                    <div className="text-xs text-gray-400">{res.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{res.numberOfGuests}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(res.status)}`}>
                                        {res.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    
                                    {/* Dugme za Potvrdu */}
                                    {res.status === 'Pending' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(res._id, 'Confirmed')}
                                            className="text-emerald-400 hover:text-emerald-300 transition duration-150"
                                            title="Confirm Reservation"
                                        >
                                            Confirm
                                        </button>
                                    )}

                                    {/* Dugme za Otkaživanje (za potvrđene rezervacije) */}
                                    {res.status !== 'Cancelled' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(res._id, 'Cancelled')}
                                            className="text-red-400 hover:text-red-300 transition duration-150"
                                            title="Cancel Reservation"
                                        >
                                            Cancel
                                        </button>
                                    )}

                                    {/* Dugme za Brisanje */}
                                    <button 
                                        onClick={() => handleDelete(res._id)}
                                        className="text-gray-400 hover:text-white transition duration-150 ml-3"
                                        title="Permanently Delete"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reservations.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No reservations found.</div>
                )}
            </div>
        </div>
    );
};

export default ReservationTable;