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

export default function AddPostForm({ tags, onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [postType, setPostType] = useState('hack');
  const [price, setPrice] = useState('');
  const [showTagError, setShowTagError] = useState(false);
  const [showTagLimitError, setShowTagLimitError] = useState(false);
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [showDateOrderError, setShowDateOrderError] = useState(false);
  const [showDateRangeError, setShowDateRangeError] = useState(false);
  const [coords, setCoords] = useState(null);
  const [location, setLocation] = useState({
    address: '',
    lat: null,
    lng: null
  });
  const [locationKey, setLocationKey] = useState(0);

  const MIN_DATE = '1900-01-01';
  const MAX_DATE = '2100-01-01';

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setSelectedTags([]);
    setPostType('hack');
    setPrice('');
    setShowTagError(false);
    setShowTagLimitError(false);
    setEventStartDate('');
    setEventEndDate('');
    setShowDateOrderError(false);
    setShowDateRangeError(false);
    setCoords(null);
    setLocation({
      address: '',
      lat: null,
      lng: null
    });
    setLocationKey(prevKey => prevKey + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tag validation for both hacks and deals
    if (selectedTags.length === 0) {
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

    if (postType === 'event') {
      setShowDateOrderError(false);
      setShowDateRangeError(false);

      if (!eventStartDate || !eventEndDate) {
        // This should be caught by 'required' but as a safeguard
        return;
      }

      const startDate = new Date(eventStartDate);
      const endDate = new Date(eventEndDate);
      const minDate = new Date(MIN_DATE);
      const maxDate = new Date(MAX_DATE);

      if (startDate < minDate || startDate > maxDate || endDate < minDate || endDate > maxDate) {
        setShowDateRangeError(true);
        return;
      }

      if (endDate < startDate) {
        setShowDateOrderError(true);
        return;
      }
    }

    let formData = { title, postType };
    if (postType === 'hack') {
      formData = { ...formData, description,location, tags: selectedTags };
    } else if (postType === 'event') {
      formData = { ...formData, description, location, tags: selectedTags, startDate: eventStartDate, endDate: eventEndDate };
    } else {
      const dealLocationString = JSON.stringify(location);
      formData = { ...formData, description, location: dealLocationString, price: parseFloat(price) || 0, tags: selectedTags };
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
        setShowTagLimitError(false); 
        return prevSelectedTags.filter(t => t !== tagValue);
      } else {
        if (prevSelectedTags.length < 5) {
          setShowTagLimitError(false); 
          return [...prevSelectedTags, tagValue];
        } else {
          setShowTagLimitError(true);
          return prevSelectedTags; b
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-[#FDFAF5] shadow-md rounded-lg space-y-6 mb-6 ">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#8B4C24]">
          {postType === 'hack' ? 'Add a New Hack' : (postType === 'deal') ? 'Add a New Deal' : 'Add a new Event'}
        </h2>
        <div className="flex flex-col items-end">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none px-2 py-1 rounded hover:bg-gray-100 transition-colors duration-150 ease-in-out"
          >
            Clear Form
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-600 -mt-4 mb-2">* Indicates a required field</p>

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
          Title*
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

      {(postType === 'hack' || postType === 'deal') && (
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#6A401F] mb-1">
            Description*
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
            placeholder={postType === 'hack' ? "Share the details of your hack..." : "Share the details of your deal..."}
          />
        </div>
      )}

      {postType === 'hack' && (
        <div>
          <label className="block text-sm font-medium text-[#6A401F] mb-1">
            Location
          </label>
          <LocationAutoComplete
            key={locationKey}
            placeholder="(Optional)"
            initialValue={location.address}
            onSelect={({ address, lat, lng }) => {
              setLocation({ address, lat, lng });
              setCoords([lat, lng]);
            }}
          />
        </div>
      )}

      {postType === 'deal' && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#6A401F] mb-1">
              Location*
            </label>
            <LocationAutoComplete
              key={locationKey}
              placeholder="e.g., The Pub"
              initialValue={location.address}
              onSelect={({ address, lat, lng }) => {
                setLocation({ address, lat, lng });
                setCoords([lat, lng]);
              }}
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-[#6A401F] mb-1">
              Price (CAD)*
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
              max="1000000"
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
              Description*
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
            <label className="block text-sm font-medium text-[#6A401F] mb-1">
              Location*
            </label>
            <LocationAutoComplete
              key={locationKey}
              required={postType === 'event'}
              initialValue={location.address}
              onSelect={({ address, lat, lng }) => {
                setLocation({ address, lat, lng });
                setCoords([lat, lng]);
              }}
            />
          </div>
          <div>
            <label htmlFor="eventStartDate" className="block text-sm font-medium text-[#6A401F] mb-1">
              Start Date*
            </label>
            <input
              type="date"
              id="eventStartDate"
              value={eventStartDate}
              onChange={(e) => {
                setEventStartDate(e.target.value);
                setShowDateOrderError(false);
                setShowDateRangeError(false);
              }}
              required={postType === 'event'}
              min={MIN_DATE}
              max={MAX_DATE}
              className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="eventEndDate" className="block text-sm font-medium text-[#6A401F] mb-1">
              End Date*
            </label>
            <input
              type="date"
              id="eventEndDate"
              value={eventEndDate}
              onChange={(e) => {
                setEventEndDate(e.target.value);
                setShowDateOrderError(false);
                setShowDateRangeError(false);
              }}
              required={postType === 'event'}
              min={MIN_DATE}
              max={MAX_DATE}
              className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
            />
            {showDateOrderError && (
              <p className="text-xs text-red-500 mt-1">End date cannot be before start date.</p>
            )}
            {showDateRangeError && (
              <p className="text-xs text-red-500 mt-1">Date must be between Jan 1, 1900 and Jan 1, 2100.</p>
            )}
          </div>
        </>
      )}

       {/* Tag Selection */}
      <div>
        <label className="block text-sm font-medium text-[#6A401F] mb-2">
          Tags*
        </label>
        <div className="mt-1 flex flex-wrap gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white">
          {tags && tags.map(tag => (
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
        {showTagError && (
          <p className="text-xs text-red-500 mt-1">Please select at least one tag.</p>
        )}
        {showTagLimitError && (
          <p className="text-xs text-red-500 mt-1">You can select a maximum of 5 tags.</p>
        )}
      </div>

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