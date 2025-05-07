'use client'

import { useState } from 'react';

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
  const [selectedTag, setSelectedTag] = useState(hackTags.length > 0 ? hackTags[0] : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description, tag: selectedTag });
    if (onSubmit) {
      onSubmit({ title, description, tag: selectedTag });
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg space-y-4 mb-6">
      <h2 className="text-xl font-semibold text-[#8B4C24]">Add a New Hack</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="3"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
          Tag
        </label>
        <select
          id="tag"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm rounded-md"
        >
          {hackTags.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B4C24] hover:bg-[#7a421f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4C24]"
        >
          Add Hack
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4C24]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 