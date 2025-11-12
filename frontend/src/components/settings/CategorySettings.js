// File: src/components/settings/CategorySettings.js
// ACTION: Create this new file.

import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import './SettingsForms.css';
import { FaTrash, FaPlus } from 'react-icons/fa';

const CategorySettings = () => {
    const { dataVersion, triggerDataRefresh } = useAuth();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', color: '#cccccc' });
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setIsLoading(true);
        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error("Failed to fetch categories", err))
            .finally(() => setIsLoading(false));
    }, [dataVersion]); // Refetch when data is refreshed globally

    const handleNewCategoryChange = (e) => {
        setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name) {
            setMessage({ type: 'error', text: 'Category name cannot be empty.' });
            return;
        }
        try {
            await api.post('/categories', newCategory);
            setMessage({ type: 'success', text: 'Category added successfully!' });
            setNewCategory({ name: '', color: '#cccccc' }); // Reset form
            triggerDataRefresh(); // Trigger a global refresh
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to add category.' });
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure? Deleting a category will also delete its associated expenses.")) {
            return;
        }
        try {
            // NOTE: This assumes your backend has a `DELETE /api/categories/:id` route.
            await api.delete(`/categories/${id}`);
            setMessage({ type: 'success', text: 'Category deleted.' });
            triggerDataRefresh();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete category.' });
        }
    };

    return (
        <div className="settings-card">
            <h2>Manage Categories</h2>
            <p>Add, edit, or remove expense categories to personalize your tracking.</p>

            <div className="category-list">
                {isLoading ? <p>Loading categories...</p> : categories.map(cat => (
                    <div key={cat.id} className="category-item">
                        <span className="color-swatch" style={{ backgroundColor: cat.color }}></span>
                        <span className="category-name">{cat.name}</span>
                        <button className="delete-btn" onClick={() => handleDeleteCategory(cat.id)}>
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddCategory} className="settings-form add-category-form">
                <h3>Add New Category</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Category Name</label>
                        <input type="text" name="name" value={newCategory.name} onChange={handleNewCategoryChange} placeholder="e.g., Groceries" />
                    </div>
                    <div className="form-group">
                        <label>Color</label>
                        <input type="color" name="color" value={newCategory.color} onChange={handleNewCategoryChange} className="color-input" />
                    </div>
                </div>
                <button type="submit"><FaPlus /> Add Category</button>
                {message && <div className={`message ${message.type}`}>{message.text}</div>}
            </form>
        </div>
    );
};

export default CategorySettings;