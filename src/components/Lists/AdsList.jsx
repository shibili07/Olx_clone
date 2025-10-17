import React, { useEffect, useState } from 'react';
import { Eye, Heart, MoreVertical, Download, Search } from 'lucide-react';
import { useAuth } from '../Context/Auth';
import { deleteItem } from '../Firebase/Firebase';
import { motion, AnimatePresence } from 'framer-motion';
import EditModal from '../Modal/EditModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdsList({ ads, setAds }) {
    const { user } = useAuth();
    const [deletingId, setDeletingId] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    const filters = [
        { key: 'all', label: 'View all', count: 2 },
        { key: 'active', label: 'Active Ads', count: 0 },
        { key: 'inactive', label: 'Inactive Ads', count: 0 },
        { key: 'pending', label: 'Pending Ads', count: 1 },
        { key: 'moderated', label: 'Moderated Ads', count: 1 }
    ];

    const handleDelete = async (itemId) => {
        setDeletingId(itemId); // start fade-out
        try {
            const result = await deleteItem(itemId);
            if (result.success) {
                setTimeout(() => {
                    setAds(prev => prev.filter(ad => ad.id !== itemId));
                    setDeletingId(null);
                    toast.success('Ad deleted successfully', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                }, 250); // match your animation duration
            }
        } catch (err) {
            console.error(err);
            setDeletingId(null);
            toast.error('Failed to delete ad', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    const handleUpdate = (updatedItem) => {
        setAds(ads.map(ad => ad.id === updatedItem.id ? updatedItem : ad));
        toast.success('Ad updated successfully', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer />
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Ads</h1>
                    <button className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                        <Download size={20} />
                        Download leads
                    </button>
                </div>

                {/* Promotional Banner */}
                <div className="bg-gray-100 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-500 rounded-full p-3 text-white text-xl">🎯</div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Want to sell more?</h3>
                            <p className="text-sm text-gray-600">Post more Ads for less. Save money with our packages.</p>
                        </div>
                    </div>
                    <button className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900">
                        Show me packages
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 items-center mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Ad Title"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="text-sm text-gray-600">Filter By:</div>
                    <div className="flex gap-2 flex-wrap">
                        {filters.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-3 py-1 rounded-full border transition-colors ${filter === f.key
                                        ? 'bg-blue-100 border-blue-400 text-blue-700'
                                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                            >
                                {f.label} ({f.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ads List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {ads.map(ad => (
                            <motion.div
                                key={ad.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div key={ad.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"> {/* removed overflow-hidden */}
                                    <div className="flex">
                                        {/* Left Date Section */}
                                        <div className="w-24 bg-white p-3 rounded-lg shadow flex flex-col justify-center space-y-1">
                                            {/* FROM date */}
                                            <div className="text-xs font-semibold text-gray-700">
                                                FROM  :  {ad.createAt.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                            </div>

                                            {/* TO date */}

                                            <div className="text-xs font-semibold text-gray-700">
                                                TO  :  {(() => {
                                                    const fromDate = ad.createAt.toDate();
                                                    const toDate = new Date(fromDate);
                                                    toDate.setDate(toDate.getDate() + 20);
                                                    return toDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                                                })()}
                                            </div>
                                        </div>





                                        {/* Main Content */}
                                        <div className="flex-1 p-4 flex items-center gap-4">
                                            {/* <div className="text-3xl">{ad.imageUrl}</div> */}
                                            <img src={ad.imageUrl} className="h-16 w-18"  alt={ad.title} />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{ad.title}</h3>
                                                <h5 className="font-bold text-gray-700">₹ {ad.price}</h5>
                                                {ad.category && <p className="text-sm text-gray-600">{ad.category}</p>}
                                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                    {ad.views !== null && (
                                                        <div className="flex items-center gap-1">
                                                            <Eye size={16} />
                                                            Views: 17
                                                        </div>
                                                    )}
                                                    {ad.likes !== null && (
                                                        <div className="flex items-center gap-1">
                                                            <Heart size={16} />
                                                            Likes:3
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                {ad.description && (
                                                    <p className="bg-gray-200 border border-blue-800 text-black rounded-lg p-2 text-xs text-center">
                                                        {ad.description}
                                                    </p>
                                                )}
                                            </div>



                                            {/* Status and Message */}
                                            <div className="flex-1 flex flex-col items-center justify-center">
                                                <span
                                                    className={`px-3 py-1 rounded text-xs font-semibold mb-2 bg-blue-100 text-blue-700`}
                                                >
                                                    Active
                                                </span>

                                            </div>


                                            {/* Action Button */}
                                            <div className="flex items-center gap-4 relative z-50"> {/* added z-50 */}
                                                {ad.status === 'PENDING' && (
                                                    <button className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm font-semibold">
                                                        Sell faster now
                                                    </button>
                                                )}
                                                <div className="relative">
                                                    <button
                                                        className="p-2 hover:bg-gray-100 rounded"
                                                        onClick={() => setOpenDropdownId(openDropdownId === ad.id ? null : ad.id)}
                                                    >
                                                        <MoreVertical size={20} className="text-gray-400" />
                                                    </button>

                                                    {/* Dropdown */}
                                                    {openDropdownId === ad.id && (
                                                        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg"
                                                                onClick={() => {
                                                                    setEditingItem(ad);
                                                                    setOpenDropdownId(null);
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                                                                onClick={() => handleDelete(ad.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add EditModal */}
            <EditModal 
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                item={editingItem}
                onUpdate={handleUpdate}
            />
        </div>
    );
}