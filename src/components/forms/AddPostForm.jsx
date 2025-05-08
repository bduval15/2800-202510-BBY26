'use client'

import { useState } from 'react';
import { clientDB } from '@/services/supabaseClient';

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

export default function AddPostForm({ hackTags, onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [postType, setPostType] = useState('hack'); 
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = { title, postType };
    if (postType === 'hack') {
      formData = { ...formData, description, tags: selectedTags };
    } else { // postType === 'deal'
      formData = { ...formData, location, price: parseFloat(price) || 0 };
    }
    console.log(formData);
    if (onSubmit) {
      onSubmit(formData);
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
        return prevSelectedTags.filter(t => t !== tagValue);
      } else {
        return [...prevSelectedTags, tagValue]; 
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg space-y-4 mb-6">
      <h2 className="text-xl font-semibold text-[#8B4C24]">
        {postType === 'hack' ? 'Add a New Hack' : 'Add a New Deal'}
      </h2>
      <div>
        <label className="block text-sm font-medium text-[#6A401F] mb-1">
          Post Type
        </label>
        <div className="mt-1 flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="postType"
              value="hack"
              checked={postType === 'hack'}
              onChange={() => setPostType('hack')}
              className="form-radio h-4 w-4 text-[#8B4C24] border-[#D1905A] focus:ring-[#8B4C24]"
            />
            <span className="ml-2 text-sm text-gray-700">Hack</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="postType"
              value="deal"
              checked={postType === 'deal'}
              onChange={() => setPostType('deal')}
              className="form-radio h-4 w-4 text-[#8B4C24] border-[#D1905A] focus:ring-[#8B4C24]"
            />
            <span className="ml-2 text-sm text-gray-700">Deal</span>
          </label>
        </div>
      </div>
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
          placeholder={postType === 'hack' ? "e.g., Free BCIT Gym Access" : "e.g., Half-price Pizza at Campus Pub"}
        />
      </div>
      
      {postType === 'hack' && (
        <>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#6A401F] mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={postType === 'hack'}
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
            {postType === 'hack' && selectedTags.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Please select at least one tag for a hack.</p>
            )}
          </div>
        </>
      )}

      {postType === 'deal' && (
        <>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[#6A401F] mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required={postType === 'deal'}
              className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
              placeholder="e.g., SE12 Cafeteria"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-[#6A401F] mb-1">
              Price (CAD)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              required={postType === 'deal'}
              className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
              placeholder="e.g., 5.99"
            />
          </div>
        </>
      )}

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#8B4C24] hover:bg-[#7a421f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4C24] transition duration-150 ease-in-out"
        >
          {postType === 'hack' ? 'Add Hack' : 'Add Deal'}
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