/**
 * File: AddPostForm.jsx
 *
 * Loaf Life
 *   Enables users to create new posts (hacks, deals, or events). This form
 *   allows authenticated users to contribute new content to the platform. It
 *   dynamically adjusts input fields based on the selected post type and
 *   handles form submission, data validation, and geocoding of addresses.
 *   Utilizes React for UI components and interacts with OpenStreetMap Nominatim for geocoding.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author Conner Ponton
 *   @author Brady Duval
 *   @author https://gemini.google.com/app
 */

'use client';

import { useState } from 'react';
import LocationAutoComplete from '@/components/mapComponents/LocationAutoComplete';
import ConfirmCancelModal from '@/components/ConfirmCancelModal';

/**
 * @function AddPostForm
 * @description Renders a form for creating new posts (hacks, deals, or events).
 *   It manages form state for various fields like title, description, tags,
 *   location, price, and event dates. Handles dynamic field visibility based
 *   on post type, input validation, and geocoding for locations.
 * @param {object} props - The component's props.
 * @param {string[]} props.tags - An array of available tags for selection.
 * @param {function} props.onSubmit - Callback function executed upon successful form submission.
 * @param {function} props.onClose - Callback function executed when the form is closed or cancelled.
 * @returns {JSX.Element} A form for adding new posts.
 */
export default function AddPostForm({ tags, onSubmit, onClose }) {
  // State for the post title.
  const [title, setTitle] = useState('');
  // State for the post description.
  const [description, setDescription] = useState('');
  // State for the list of selected tags.
  const [selectedTags, setSelectedTags] = useState([]);
  // State for the type of post being created (hack, deal, or event).
  const [postType, setPostType] = useState('hack');
  // State for the price, relevant for 'deal' post type.
  const [price, setPrice] = useState('');
  // State to control visibility of the tag selection error message.
  const [showTagError, setShowTagError] = useState(false);
  // State to control visibility of the tag limit error message.
  const [showTagLimitError, setShowTagLimitError] = useState(false);
  // State for the event start date, relevant for 'event' post type.
  const [eventStartDate, setEventStartDate] = useState('');
  // State for the event end date, relevant for 'event' post type.
  const [eventEndDate, setEventEndDate] = useState('');
  // State to control visibility of the date order error message.
  const [showDateOrderError, setShowDateOrderError] = useState(false);
  // State to control visibility of the date range error message.
  const [showDateRangeError, setShowDateRangeError] = useState(false);
  // State for the raw address input by the user.
  const [rawAddress, setRawAddress] = useState('');
  // State for the geographic coordinates [latitude, longitude].
  const [coords, setCoords] = useState(null);
  // State for the structured location information (address, lat, lng).
  const [location, setLocation] = useState({
    address: '',
    lat: null,
    lng: null
  });
  // State key to force re-render of LocationAutoComplete component.
  const [locationKey, setLocationKey] = useState(0);
  // State to control visibility of the cancel confirmation modal.
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  // Minimum selectable date for event date pickers.
  const MIN_DATE = '1900-01-01';
  // Maximum selectable date for event date pickers.
  const MAX_DATE = '2100-01-01';

  /**
   * @function handleClear
   * @description Resets all form fields and error states to their initial values.
   *   It also increments the locationKey to reset the LocationAutoComplete component.
   */
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
    setLocationKey(prevKey => prevKey + 1); // Increment key to reset LocationAutoComplete
  };

  /**
   * @function handleSubmit
   * @description Handles the form submission process. It prevents default submission,
   *   validates inputs (title, tags, event dates), geocodes the address if necessary,
   *   constructs the form data object, and calls the onSubmit prop with the data.
   * @async
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      console.error("Title cannot be empty or just whitespace.");
      return;
    }

    let resolvedLocation = location;

    if (selectedTags.length === 0) {
      setShowTagError(true);
      return;
    }
    setShowTagError(false);

    // Date validation specific to 'event' post type
    if (postType === 'event') {
      if (!eventStartDate || !eventEndDate) {
        console.log("Start and End dates are required for events.")
        return;
      }
      const startDate = new Date(eventStartDate);
      const endDate = new Date(eventEndDate);

      // Check if dates are within the defined MIN_DATE and MAX_DATE range
      if (startDate < new Date(MIN_DATE) || startDate > new Date(MAX_DATE) || endDate < new Date(MIN_DATE) || endDate > new Date(MAX_DATE)) {
        setShowDateRangeError(true);
        setShowDateOrderError(false);
        return;
      }
      setShowDateRangeError(false);

      // Check if end date is before start date
      if (endDate < startDate) {
        setShowDateOrderError(true);
        setShowDateRangeError(false);
        return;
      }
      setShowDateOrderError(false);
    }

    // Geocode address if coordinates are not already set (e.g., from autocomplete selection)
    if (location.lat == null || location.lng == null) {
      if (rawAddress.trim()) { // Proceed only if there's a raw address input
        try {
          // Construct query parameters for Nominatim API
          const params = new URLSearchParams({
            q: rawAddress,
            format: 'json',
            limit: '1', // Request only the top result
            viewbox: '-123.5,49.5,-122.4,49.0', // Prioritize local results
            bounded: '1' // Restrict search to within the viewbox
          });
          // Fetch geocoding data from OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?${params}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          if (data && data[0]) { // If geocoding is successful
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            resolvedLocation = { address: rawAddress, lat, lng };
          } else {
            // If no results, set location to 'Not Specified'
            resolvedLocation = { address: 'Not Specified', lat: null, lng: null };
          }
        } catch (err) {
          console.error('geocode lookup failed', err);
          // If geocoding API call fails, set location to 'Not Specified'
          resolvedLocation = { address: 'Not Specified', lat: null, lng: null };
        }
      } else {
        // If no raw address and no coordinates, set location to 'Not Specified'
        resolvedLocation = { address: 'Not Specified', lat: null, lng: null };
      }

      setLocation(resolvedLocation);
      setCoords(resolvedLocation.lat != null ? [resolvedLocation.lat, resolvedLocation.lng] : null);
    }

    // Construct the final form data object
    const formData = {
      title: trimmedTitle,
      postType,
      rawAddress,
      location: resolvedLocation,
      tags: selectedTags,
      // Conditionally include price for 'deal' type, otherwise just description
      ...(postType === 'deal'
        ? { price: parseFloat(price) || 0, description } // Parse price, default 0
        : { description })
    };

    // Add event-specific date fields if post type is 'event'
    if (postType === 'event') {
      formData.start_date = eventStartDate;
      formData.end_date = eventEndDate;
    }

    console.log(formData);
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  /**
   * @function handleCancel
   * @description Handles the cancel action. If no form input has been made, it calls
   *   onClose directly. Otherwise, it shows the cancel confirmation modal.
   */
  const handleCancel = () => {
    // Directly call onClose if no input, otherwise show confirmation modal
    if (!title && !description && selectedTags.length === 0 && !price && !eventStartDate && !eventEndDate && !rawAddress) {
      if (onClose) {
        onClose();
      }
    } else {
      setShowCancelConfirmModal(true);
    }
  };

  /**
   * @function confirmCancel
   * @description Confirms the cancellation, hides the modal, and calls the onClose prop.
   */
  const confirmCancel = () => {
    setShowCancelConfirmModal(false);
    if (onClose) {
      onClose();
    }
  };

  /**
   * @function cancelAndKeepEditing
   * @description Hides the cancel confirmation modal, allowing the user to continue editing.
   */
  const cancelAndKeepEditing = () => {
    setShowCancelConfirmModal(false);
  };

  /**
   * @function handleTagChange
   * @description Adds or removes a tag from the selectedTags list. It enforces a
   *   limit of 5 tags and updates error states accordingly.
   * @param {string} tagValue - The tag to be added or removed.
   */
  const handleTagChange = (tagValue) => {
    setSelectedTags(prevSelectedTags => {
      if (prevSelectedTags.includes(tagValue)) {
        // If tag is already selected, remove it
        setShowTagLimitError(false);
        return prevSelectedTags.filter(t => t !== tagValue);
      } else {
        // If tag is not selected, add it if under the 5 tag limit
        if (prevSelectedTags.length < 5) {
          setShowTagLimitError(false);
          return [...prevSelectedTags, tagValue];
        } else {
          // If tag limit is reached, show error and don't add the tag
          setShowTagLimitError(true);
          return prevSelectedTags;
        }
      }
    });
  };

  return (
    // Main form container with styling for padding, background, shadow, and spacing
    <form onSubmit={handleSubmit} className="p-4 bg-[#FDFAF5] shadow-md rounded-lg space-y-6 mb-6 ">
      {/* Header section displaying the form title and a clear form button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#8B4C24]">
          {/* Dynamically set form title based on the selected post type */}
          {postType === 'hack' ? 'Add a New Hack' : (postType === 'deal') ? 'Add a New Deal' : 'Add a New Event'}
        </h2>
        <div className="flex flex-col items-end">
          {/* Button to clear all form inputs */}
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none px-2 py-1 rounded hover:bg-gray-100 transition-colors duration-150 ease-in-out"
          >
            Clear Form
          </button>
        </div>
      </div>
      {/* Indication for required fields */}
      <p className="text-xs text-gray-600 -mt-4 mb-2">* Indicates a required field</p>

      {/* Post type selection buttons (Hack, Deal, Event) */}
      <div>
        <label className="block text-sm font-medium text-[#6A401F] mb-2">
          Post Type
        </label>
        <div className="flex space-x-3 mt-1">
          {/* Button to select 'Hack' post type */}
          <button
            type="button"
            onClick={() => setPostType('hack')}
            className={`py-2 px-6 rounded-full text-sm font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${postType === 'hack'
              ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
              : 'bg-white text-[#8B4C24] hover:bg-gray-100 border border-[#D1905A]'}
            `}
          >
            Hack
          </button>
          {/* Button to select 'Deal' post type */}
          <button
            type="button"
            onClick={() => setPostType('deal')}
            className={`py-2 px-6 rounded-full text-sm font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${postType === 'deal'
              ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
              : 'bg-white text-[#8B4C24] hover:bg-gray-100 border border-[#D1905A]'}
            `}
          >
            Deal
          </button>
          {/* Button to select 'Event' post type */}
          <button
            type="button"
            onClick={() => setPostType('event')}
            className={`py-2 px-6 rounded-full text-sm font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${postType === 'event'
              ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
              : 'bg-white text-[#8B4C24] hover:bg-gray-100 border border-[#D1905A]'}
            `}
          >
            Event
          </button>
        </div>
      </div>

      {/* Input field for the post title */}
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
          // Dynamic placeholder based on post type
          placeholder={postType === 'hack' ? "e.g., Free BCIT Gym Access" : "e.g., Half-price Pizza at Campus Pub"}
        />
      </div>

      {/* Textarea for post description (visible for 'hack' and 'deal' types) */}
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
            // Dynamic placeholder based on post type
            placeholder={postType === 'hack' ? "Share the details of your hack..." : "Share the details of your deal..."}
          />
        </div>
      )}

      {/* Location input using LocationAutoComplete (visible for 'hack' type) */}
      {postType === 'hack' && (
        <div>
          <label className="block text-sm font-medium text-[#6A401F] mb-1">
            Location
          </label>
          <LocationAutoComplete
            key={locationKey} // Key to force re-render for clearing
            placeholder="(Optional)"
            initialValue={location.address}
            onChange={addr => {
              setRawAddress(addr);
            }}
            onSelect={({ address, lat, lng }) => {
              setLocation({ address, lat, lng });
              setCoords([lat, lng]);
              setRawAddress(address);
            }}
          />
        </div>
      )}

      {/* Location and Price inputs (visible for 'deal' type) */}
      {postType === 'deal' && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#6A401F] mb-1">
              Location*
            </label>
            <LocationAutoComplete
              key={locationKey} // Key to force re-render for clearing
              placeholder="e.g., The Pub"
              initialValue={location.address}
              onChange={addr => {
                setRawAddress(addr);
              }}
              onSelect={({ address, lat, lng }) => {
                setLocation({ address, lat, lng });
                setCoords([lat, lng]);
                setRawAddress(address);
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
              required={postType === 'deal'} // Required only for deals
              className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
              placeholder="e.g., 5.99"
            />
          </div>
        </>
      )}

      {/* Event specific inputs (description, location, start/end dates) */}
      {postType === 'event' && (
        <>
          {/* Textarea for event description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#6A401F] mb-1">
              Description*
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={postType === 'event'} // Required only for events
              rows="4"
              className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
              placeholder="Share the details of your event..."
            />
          </div>
          {/* Location input for events */}
          <div>
            <label className="block text-sm font-medium text-[#6A401F] mb-1">
              Location*
            </label>
            <LocationAutoComplete
              key={locationKey} // Key to force re-render for clearing
              required={postType === 'event'} // Required only for events
              initialValue={location.address}
              onChange={addr => {
                setRawAddress(addr);
              }}
              onSelect={({ address, lat, lng }) => {
                setLocation({ address, lat, lng });
                setCoords([lat, lng]);
                setRawAddress(address);
              }}
            />
          </div>
          {/* Event start and end date inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  setShowDateOrderError(false); // Reset date errors on change
                  setShowDateRangeError(false);
                }}
                required={postType === 'event'} // Required only for events
                min={MIN_DATE} // Minimum allowed date
                max={MAX_DATE} // Maximum allowed date
                className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white text-gray-900"
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
                  setShowDateOrderError(false); // Reset date errors on change
                  setShowDateRangeError(false);
                }}
                required={postType === 'event'} // Required only for events
                min={MIN_DATE} // Minimum allowed date
                max={MAX_DATE} // Maximum allowed date
                className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white text-gray-900"
              />
            </div>
          </div>
          {/* Display error message if end date is before start date */}
          {showDateOrderError && (
            <p className="text-xs text-red-500 mt-1">End date cannot be before the start date.</p>
          )}
          {/* Display error message if dates are outside the allowed range */}
          {showDateRangeError && (
            <p className="text-xs text-red-500 mt-1">{`Please select a date between ${MIN_DATE} and ${MAX_DATE}.`}</p>
          )}
        </>
      )}

      {/* Tag selection section with available tags */}
      <div>
        <label className="block text-sm font-medium text-[#6A401F] mb-2">
          Tags*
        </label>
        <div className="mt-1 flex flex-wrap gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white">
          {/* Map through available tags and render selection buttons */}
          {tags && tags.map(tag => (
            <button
              type="button"
              key={tag}
              onClick={() => handleTagChange(tag)}
              // Dynamic styling based on whether the tag is selected
              className={`py-2 px-4 rounded-full text-xs font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${selectedTags.includes(tag)
                ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
                : 'bg-white text-[#8B4C24] hover:bg-gray-100 ring-1 ring-inset ring-[#D1905A]'}
              `}
            >
              {tag}
            </button>
          ))}
        </div>
        {/* Display error message if no tags are selected */}
        {showTagError && (
          <p className="text-xs text-red-500 mt-1">Please select at least one tag.</p>
        )}
        {/* Display error message if tag limit (5) is exceeded */}
        {showTagLimitError && (
          <p className="text-xs text-red-500 mt-1">You can select a maximum of 5 tags.</p>
        )}
      </div>

      {/* Form action buttons (Submit and Cancel) */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
        {/* Submit button with dynamic text based on post type */}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#77A06B] hover:bg-[#668d5b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#77A06B] transition duration-150 ease-in-out"
        >
          {postType === 'hack' ? 'Add Hack' : (postType === 'deal') ? 'Add Deal' : 'Add Event'}
        </button>
        {/* Cancel button */}
        <button
          type="button"
          onClick={handleCancel}
          className="w-full flex justify-center py-3 px-4 border border-[#D1905A] rounded-lg shadow-sm text-sm font-medium text-[#8B4C24] bg-transparent hover:bg-[#F5E3C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4C24] transition duration-150 ease-in-out"
        >
          Cancel
        </button>
      </div>

      {/* Modal for confirming cancellation if form has input */}
      <ConfirmCancelModal
        isOpen={showCancelConfirmModal}
        onConfirm={confirmCancel}
        onCancel={cancelAndKeepEditing}
      />
    </form>
  );
} 