'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import BookmarkButton from '@/components/buttons/Bookmark';
import VoteButtons from '@/components/buttons/VoteButtons';
import Tag from '@/components/Tag';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import CommentSection from '@/components/sections/CommentSection';
import ShowOnMapButton from '@/components/mapComponents/ShowOnMapButton';
import toTitleCase  from '@/utils/toTitleCase';
import { formatTimeAgo } from '@/utils/formatTimeAgo';

import { ArrowLeftIcon, PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { clientDB } from '@/supabaseClient.js';

/**
 * DealDetailPage.jsx
 * Loaf Life - Deal Detail Page
 *
 * Displays the details of a specific deal fetched from Supabase.
 * Users can view deal information, including title, tags, price, location,
 * and description. Authenticated authors can edit or delete their deals.
 *
 * Structure and styling adapted from 'Hack Detail Page'
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 *
 * @author: Nathan O
 * @author: https://gemini.google.com/app
 */

export default function DealDetailPage() {
  // -- State & Hooks --
  const params = useParams();
  const dealId = params.dealId;
  const supabase = clientDB;
  const router = useRouter();
  const optionsMenuRef = useRef(null);

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayLocation, setDisplayLocation] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);

  // -- Effects --
  // Fetch current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        return;
      }
      if (session && session.user) {
        setCurrentUserId(session.user.id);
      }
    };
    fetchCurrentUser();
  }, [supabase]);

  // Handle click outside options menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setIsOptionsMenuOpen(false);
      }
    };
    if (isOptionsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOptionsMenuOpen]);

  // Effect to fetch deal details
  useEffect(() => {
    if (dealId && supabase) {
      const fetchDealDetails = async () => {
        setLoading(true);
        setError(null);
        // Fetch deal details including user profile, tags, and description
        const { data, error: fetchError } = await supabase
          .from('deals')
          .select('*, user_profiles(name), tags, description')
          .eq('id', dealId)
          .single();

        if (fetchError) {
          console.error('Error fetching deal details:', fetchError);
          // Handle specific Supabase error for 'item not found'
          if (fetchError.code === 'PGRST116') {
            setError('Deal not found.');
          } else {
            setError('Failed to load deal. Please try again.');
          }
          setDeal(null);
        } else if (data) {
          setDeal(data);
          let loc = data.location; // Default location to the raw data
          let parsedLat = null;
          let parsedLng = null;

          // Process location data, which might be a stringified JSON or an object
          if (data.location) {
            let tempCoords = null;
            // Check if location is a string (potentially JSON)
            if (typeof data.location === 'string') {
              try {
                const parsedJson = JSON.parse(data.location);
                if (parsedJson) {
                  loc = parsedJson.address || loc; // Use parsed address if available
                  // Check for valid latitude and longitude
                  if (typeof parsedJson.lat === 'number' && typeof parsedJson.lng === 'number') {
                    tempCoords = { lat: parsedJson.lat, lng: parsedJson.lng };
                  }
                }
              } catch (e) {
                // Log a warning if JSON parsing fails
                console.warn("Failed to parse location JSON for deal detail:", data.location, e);
              }
            // Check if location is an object with an address property
            } else if (typeof data.location === 'object' && data.location.address) {
              loc = data.location.address;
              // Check for valid latitude and longitude
              if (typeof data.location.lat === 'number' && typeof data.location.lng === 'number') {
                tempCoords = { lat: data.location.lat, lng: data.location.lng };
              }
            }
            // If valid coordinates were extracted, update parsedLat and parsedLng
            if (tempCoords) {
              parsedLat = tempCoords.lat;
              parsedLng = tempCoords.lng;
            }
          }
          setDisplayLocation(loc); // Set the displayable location string

          // Set location coordinates if both latitude and longitude are valid
          if (parsedLat !== null && parsedLng !== null) {
            setLocationCoords({ lat: parsedLat, lng: parsedLng });
          } else {
            setLocationCoords(null);
          }
        } else {
          // Handle case where no data is returned (should be caught by fetchError PGRST116 ideally)
          setError('Deal not found.');
          setDeal(null);
        }
        setLoading(false);
      };
      fetchDealDetails();
    }
  }, [dealId, supabase]);

  // -- Handlers --
  const handleDelete = async () => {
    setIsOptionsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDeal = async () => {
    setIsDeleteModalOpen(false);
    if (!deal || !deal.id) {
      alert('Deal information is missing, cannot delete.');
      return;
    }
    try {
      const { error: deleteError } = await supabase
        .from('deals')
        .delete()
        .eq('id', deal.id);

      if (deleteError) {
        throw deleteError;
      }

      alert('Deal deleted successfully!');
      router.push('/deals-page'); // Redirect to deals listing page
    } catch (err) {
      console.error('Error deleting deal:', err);
      alert(`Error deleting deal: ${err.message}`);
    }
  };

  // -- Conditional Renders --

  // Display loading state while fetching deal details
  if (loading) {
    return (
      <div className="bg-[#F5E3C6] min-h-screen flex items-center justify-center">
        <StickyNavbar />
        <p className="text-[#8B4C24]">Loading deal details...</p>
        <BottomNav />
      </div>
    );
  }

  // Display error message if fetching fails
  if (error) {
    return (
      <div className="bg-[#F5E3C6] min-h-screen flex flex-col items-center justify-center">
        <StickyNavbar />
        <div className="max-w-md mx-auto px-4 py-6 text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Link href="/deals-page" className="text-[#B87333] hover:text-[#8B4C24]">
            Go back to Deals
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Display message if deal data is not available (e.g., deal not found)
  if (!deal) {
    return (
      <div className="bg-[#F5E3C6] min-h-screen flex items-center justify-center">
        <StickyNavbar />
        <p className="text-[#8B4C24]">Deal information is not available.</p>
        <BottomNav />
      </div>
    );
  }

  return (
    // Main container for the deal detail page
    <div className="bg-[#F5E3C6] min-h-screen pb-6">
      <StickyNavbar />
      {/* Main content area */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 pt-20">

        {/* Deal details card */}
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30">
          {/* Card header: Back button and options menu */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.back()}
              className="bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] px-3 py-1.5 rounded-lg shadow-md flex items-center"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>

            {/* Options menu for deal author */}
            {deal && currentUserId && deal.user_id === currentUserId && (
              <div className="relative" ref={optionsMenuRef}>
                <button
                  onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                  className="bg-[#F5EFE6] hover:bg-[#EADDCA] text-[#A0522D] border-2 border-[#A0522D] p-2 rounded-lg shadow-md"
                  aria-label="Options"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
                {/* Dropdown for edit/delete */}
                {isOptionsMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => { router.push(`/deals-page/${dealId}/edit`); setIsOptionsMenuOpen(false); }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <PencilIcon className="h-5 w-5 mr-2" /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Deal title */}
          <h1 className="text-3xl font-bold mb-2 text-[#8B4C24]">{toTitleCase(deal.title)}</h1>

          {/* Deal tags section */}
          {deal.tags && deal.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {deal.tags.map((tag, index) => (
                <Tag key={index} label={toTitleCase(tag)} />
              ))}
            </div>
          )}

          {/* Deal price section */}
          {deal.price !== null && deal.price !== undefined && (
            <div className="mb-4 text-base text-[#8B4C24]">
              <p><span className="font-bold">💲 Price:</span> ${typeof deal.price === 'number' ? deal.price.toFixed(2) : deal.price}</p>
            </div>
          )}

          {/* Deal location section */}
          {displayLocation && (
            <div className="mb-4 text-base text-[#8B4C24]">
              <p><span className="font-bold">📍 Location:</span> {displayLocation}
                {deal.location?.lat && deal.location?.lng && (
                  <Link href={`/map-page?lat=${deal.location.lat}&lng=${deal.location.lng}&label=${encodeURIComponent(displayLocation)}`} passHref className="text-sm text-[#B87333] hover:text-[#8B4C24] ml-2">
                    (View on Map)
                  </Link>
                )}
              </p>
            </div>
          )}

          {/* Deal description section */}
          {deal.description && (
            <div className="mb-6">
              <p className="text-[#8B4C24] whitespace-pre-wrap">{deal.description || "No description provided"}</p>
            </div>
          )}

          {/* Deal author and timestamp */}
          <p className="text-sm text-[#8B4C24]/80 mb-8">
            By {deal.user_profiles && deal.user_profiles.name ? deal.user_profiles.name : (deal.user_id ? `User ${deal.user_id.substring(0, 8)}...` : 'Unknown')} - {formatTimeAgo(deal.created_at)}
          </p>

          {/* Action buttons section (Vote, Map, Bookmark) */}
          <div className="flex items-center mb-6">
            <VoteButtons
              itemId={deal.id}
              itemType="deals"
              upvotes={deal.upvotes || 0}
              downvotes={deal.downvotes || 0}
              userId={currentUserId}
            />
            {locationCoords && (
              <ShowOnMapButton
                id={deal.id}
                children="Show on Map"
              />
            )}
            <BookmarkButton dealId={deal.id} />

          </div>
        </div>

        {/* Comment section component */}
        <CommentSection entityId={deal.id} entityType="deal" />
        <Footer />
      </div>
      <BottomNav />
      {/* Modal for confirming deal deletion */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteDeal}
        itemName="deal"
      />
    </div>
  );
} 