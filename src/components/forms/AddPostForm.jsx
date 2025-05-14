'use client'

import { useState } from 'react';
import LocationAutoComplete from '@/components/mapComponents/LocationAutoComplete';

/**
 * AddHackForm.jsx
 * Loaf Life - Add Hack Form
 * 
 * This form allows users to add a new hack to the database.
 * 
 * @author: Nathan O
 * @author: Conner P
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

export default function AddPostForm({ hackTags, onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [postType, setPostType] = useState('hack');
  const [price, setPrice] = useState('');
  const [showTagError, setShowTagError] = useState(false);
  const [coords, setCoords] = useState(null);
  const [location, setLocation] = useState({
    address: '',
    lat: null,
    lng: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tag validation for hacks
    if (postType === 'hack' && selectedTags.length === 0) {
      setShowTagError(true);
      return; // Prevent submission
    }
    setShowTagError(false);

    if (postType === 'deal' && (location.lat == null || location.lng == null)) {
      try {
        const params = new URLSearchParams({
          q: location.address,
          format: 'json',
          limit: '1',
          viewbox: '-123.5,49.5,-122.4,49.0',
          bounded: '1'
        });
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        if (data[0]) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          setLocation(loc => ({ ...loc, lat, lng }));
          setCoords([lat, lng]);
        }
      } catch (err) {
        console.error('fallback geocode failed', err);
      }
    }

    let formData = { title, postType };
    if (postType === 'hack' || postType === 'event') {
      formData = { ...formData, description,location, tags: selectedTags };
    } else {
      formData = { ...formData, location, coords, price: parseFloat(price) || 0 };
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
    <form onSubmit={handleSubmit} className="p-4 bg-[#FDFAF5] shadow-md rounded-lg space-y-6 mb-6 ">
      <h2 className="text-xl font-semibold text-[#8B4C24]">
        {postType === 'hack' ? 'Add a New Hack' : (postType === 'deal') ? 'Add a New Deal' : 'Add a new Event'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-[#6A401F] mb-2">
          Post Type
        </label>
        <div className="flex space-x-3 mt-1">
          <button
            type="button"
            onClick={() => setPostType('hack')}
            className={`py-2 px-6 rounded-full text-sm font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${postType === 'hack'
              ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
              : 'bg-white text-[#8B4C24] hover:bg-gray-100 border border-[#D1905A]'
              }`}
          >
            Hack
          </button>
          <button
            type="button"
            onClick={() => setPostType('deal')}
            className={`py-2 px-6 rounded-full text-sm font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${postType === 'deal'
              ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
              : 'bg-white text-[#8B4C24] hover:bg-gray-100 border border-[#D1905A]'
              }`}
          >
            Deal
          </button>
          <button
            type="button"
            onClick={() => setPostType('event')}
            className={`py-2 px-6 rounded-full text-sm font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${postType === 'event'
              ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
              : 'bg-white text-[#8B4C24] hover:bg-gray-100 border border-[#D1905A]'
              }`}
          >
            Event
          </button>
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
            <LocationAutoComplete
              placeholder="(Optional)"
              onSelect={({ address, lat, lng }) => {
                setLocation({ address, lat, lng });
                setCoords([lat, lng]);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6A401F] mb-2">
              Tags
            </label>
            <div className="mt-1 flex flex-wrap gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white">
              {hackTags && hackTags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  className={`py-2 px-4 rounded-full text-xs font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${selectedTags.includes(tag)
                    ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
                    : 'bg-white text-[#8B4C24] hover:bg-gray-100 ring-1 ring-inset ring-[#D1905A]'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {/* Basic validation message example - can be improved */}
            {showTagError && (
              <p className="text-xs text-red-500 mt-1">Please select at least one tag for a hack.</p>
            )}
          </div>
        </>
      )}

      {postType === 'deal' && (
        <>
          <div>
            <LocationAutoComplete
              placeholder="e.g., Canada Place"
              onSelect={({ address, lat, lng }) => {
                setLocation({ address, lat, lng });
                setCoords([lat, lng]);
              }}
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

      {postType === 'event' && (
        <>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#6A401F] mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={postType === 'event'}
              rows="4"
              className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
              placeholder="Share the details of your event..."
            />
          </div>
          <div>
            <LocationAutoComplete
              required={postType === 'event'}
              onSelect={({ address, lat, lng }) => {
                setLocation({ address, lat, lng });
                setCoords([lat, lng]);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6A401F] mb-2">
              Tags
            </label>
            <div className="mt-1 flex flex-wrap gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white">
              {hackTags && hackTags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  className={`py-2 px-4 rounded-full text-xs font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${selectedTags.includes(tag)
                    ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
                    : 'bg-white text-[#8B4C24] hover:bg-gray-100 ring-1 ring-inset ring-[#D1905A]'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {/* Basic validation message example - can be improved */}
            {showTagError && (
              <p className="text-xs text-red-500 mt-1">Please select at least one tag for the event.</p>
            )}
          </div>
        </>
      )}

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#77A06B] hover:bg-[#668d5b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#77A06B] transition duration-150 ease-in-out"
        >
          {postType === 'hack' ? 'Add Hack' : (postType === 'deal') ? 'Add Deal' : 'Add Event'}
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