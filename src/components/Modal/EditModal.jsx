import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { fireStore } from '../Firebase/Firebase';

export default function EditModal({ isOpen, onClose, item, onUpdate }) {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: ''
    });

    const [errors, setErrors] = useState({
        title: '',
        price: '',
        description: '',
        category: ''
    });

    useEffect(() => {
        if (item) {
            setFormData({
                title: item.title || '',
                price: item.price || '',
                description: item.description || '',
                category: item.category || ''
            });
        }
    }, [item]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            title: '',
            price: '',
            description: '',
            category: ''
        };

        // Title validation
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
            isValid = false;
        }

        // Price validation
        if (!formData.price) {
            newErrors.price = 'Price is required';
            isValid = false;
        } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
            newErrors.price = 'Price must be a valid positive number';
            isValid = false;
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
            isValid = false;
        }

        // Category validation
        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const docRef = doc(fireStore, "Products", item.id);
            await updateDoc(docRef, formData);
            onUpdate({ ...item, ...formData });
            onClose();
        } catch (error) {
            console.error("Error updating document: ", error);
            alert('Failed to update item');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={`mt-1 w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300'} p-2`}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className={`mt-1 w-full rounded-md border ${errors.price ? 'border-red-500' : 'border-gray-300'} p-2`}
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`mt-1 w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} p-2`}
                            rows="3"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className={`mt-1 w-full rounded-md border ${errors.category ? 'border-red-500' : 'border-gray-300'} p-2`}
                        />
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
