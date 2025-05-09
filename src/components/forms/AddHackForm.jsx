'use client'

import { useState } from 'react';
import { clientDB } from '../../../supabaseClient';

/**
 * AddHackForm.jsx
 * Loaf Life - Add Hack Form
 * 
 * This form allows users to add a new hack to the database.
 * 
 * @author: Nathan O
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

export default function AddHackForm({ hackTags, onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ title, description, tags: selectedTags });
    if (onSubmit) {
      onSubmit({ title, description, tags: selectedTags });
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleTagChange = (tagValue) => {
    setSelectedTags(prevSelectedTags => {
      if (prevSelectedTags.includes(tagValue)) {
        return prevSelectedTags.filter(t => t !== tagValue); // Remove tag
      } else {
        return [...prevSelectedTags, tagValue]; // Add tag
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg space-y-4 mb-6">
      <h2 className="text-xl font-semibold text-[#8B4C24]">Add a New Hack</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[#6A401F] mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
          placeholder="e.g., Free BCIT Gym Access"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[#6A401F] mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="4"
          className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
          placeholder="Share the details of your hack..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[#6A401F] mb-1">
          Tags
        </label>
        <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white">
          {hackTags && hackTags.map(tag => (
            <div key={tag} className="flex items-center">
              <input
                type="checkbox"
                id={`tag-${tag}`}
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
                className="h-4 w-4 text-[#8B4C24] border-[#D1905A] rounded focus:ring-[#8B4C24] cursor-pointer"
              />
              <label htmlFor={`tag-${tag}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                {tag}
              </label>
            </div>
          ))}
        </div>
        {/* Basic validation message example - can be improved */}
        {selectedTags.length === 0 && (
          <p className="text-xs text-red-500 mt-1">Please select at least one tag.</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#8B4C24] hover:bg-[#7a421f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4C24] transition duration-150 ease-in-out"
        >
          Add Hack
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="w-full flex justify-center py-3 px-4 border border-[#D1905A] rounded-lg shadow-sm text-sm font-medium text-[#8B4C24] bg-transparent hover:bg-[#F5E3C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4C24] transition duration-150 ease-in-out"
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 