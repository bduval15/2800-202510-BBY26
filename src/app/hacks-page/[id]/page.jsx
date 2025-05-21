/**
 * page.jsx (HackDetailPage)
 * Loaf Life – Displays details for a specific hack.
 *
 * This page fetches and displays comprehensive information about a
 * particular hack from the Supabase database, identified by its ID.
 * It presents the hack's title, description, associated tags,
 * location, author details, and creation timestamp.
 * Authenticated users who are authors of the hack can edit or
 * delete their posts. All users can engage by voting on or
 * bookmarking hacks.
 *
 * Features:
 * - Displays hack title, description, tags, location, author.
 * - Allows authors to edit or delete their hacks.
 * - Enables users to vote on hacks.
 * - Enables users to bookmark hacks.
 * - Integrates a comment section for user discussions.
 *
 * Portions of styling and logic assisted by Google Gemini 2.5 Flash.
 *
 * Modified with assistance from Google Gemini 2.5 Flash.
 *
 * @author Nathan Oloresisimo
 * @author https://gemini.google.com/app
 */

'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import BookmarkButton from '@/components/buttons/Bookmark';
import VoteButtons from '@/components/buttons/VoteButtons';
import { ArrowLeftIcon, PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import Tag from '@/components/Tag';
import BottomNav from '@/components/BottomNav';
import CommentSection from '@/components/sections/CommentSection';
import StickyNavbar from '@/components/StickyNavbar';
import { clientDB } from '@/supabaseClient';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import  toTitleCase from '@/utils/toTitleCase';
import ShowOnMapButton from '@/components/mapComponents/ShowOnMapButton';
import { formatTimeAgo } from '@/utils/formatTimeAgo';

export default function HackDetailPage({ params }) {
  // -- State & Hooks --
  const resolvedParams = use(params); 
  const hackId = resolvedParams.id;
  const [hack, setHack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);
  const router = useRouter();
  const optionsMenuRef = useRef(null);

  // -- Effects --
  // Fetch current user's ID on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        return;
      }
      if (session && session.user) {
        setCurrentUserId(session.user.id);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch hack details when hackId changes
  useEffect(() => {
    if (!hackId) {
      setIsLoading(false);
      setError("Hack ID is missing.");
      return;
    }

    const fetchHackDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: hackData, error: fetchError } = await clientDB
          .from('hacks')
          .select('id, title, description, created_at, user_id, tags, upvotes, downvotes, location, user_profiles(name)')
          .eq('id', hackId)
          .single();

        if (fetchError) {
          // Handle specific Supabase error for 'item not found' (PostgREST error code)
          if (fetchError.code === 'PGRST116') {
            setError("Hack not found.");
            setHack(null);
          } else {
            throw fetchError; // Re-throw other errors
          }
        } else if (!hackData) {
          setError("Hack not found.");
        } else {
          setHack(hackData);
          // Initialize latitude and longitude
          let parsedLat = null;
          let parsedLng = null;

          // Process location data if available
          if (hackData.location) {
            let tempCoords = null;
            // Case 1: Location is a JSON string
            if (typeof hackData.location === 'string') {
              try {
                const parsedJson = JSON.parse(hackData.location);
                if (parsedJson && typeof parsedJson.lat === 'number' && typeof parsedJson.lng === 'number') {
                  tempCoords = { lat: parsedJson.lat, lng: parsedJson.lng };
                }
              } catch (e) {
                // Log warning if JSON parsing fails
                console.warn("Failed to parse location JSON for hack detail:", hackData.location, e);
              }
            // Case 2: Location is an object (already parsed or structured differently)
            } else if (typeof hackData.location === 'object' && hackData.location.address) {
              if (typeof hackData.location.lat === 'number' && typeof hackData.location.lng === 'number') {
                tempCoords = { lat: hackData.location.lat, lng: hackData.location.lng };
              }
            }
            // Assign coordinates if successfully parsed
            if (tempCoords) {
              parsedLat = tempCoords.lat;
              parsedLng = tempCoords.lng;
            }
          }

          // Set location coordinates state if both lat and lng are valid
          if (parsedLat !== null && parsedLng !== null) {
            setLocationCoords({ lat: parsedLat, lng: parsedLng });
          } else {
            setLocationCoords(null); // Reset if coordinates are not valid
          }
        }
      } catch (err) {
        setError(err.message);
        console.error(`Error fetching hack ${hackId}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackDetails();
  }, [hackId]);

  // Effect to handle clicks outside the options menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside the options menu, close it
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setIsOptionsMenuOpen(false);
      }
    };
    if (isOptionsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    // Cleanup event listener on component unmount or when menu closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOptionsMenuOpen]);

  // -- Conditional Renders --
  if (isLoading) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center">Loading hack details...</div>;
  }

  if (error) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!hack) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center">Hack not found.</div>;
  }

  // -- Handlers --
  const handleDelete = async () => {
    setIsOptionsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteHack = async () => {
    setIsDeleteModalOpen(false);
    try {
      const { error: deleteError } = await clientDB
        .from('hacks')
        .delete()
        .eq('id', hackId);

      if (deleteError) {
        throw deleteError;
      }

      alert('Hack deleted successfully!');
      router.push('/hacks-page');
    } catch (err) {
      console.error('Error deleting hack:', err);
      alert(`Error deleting hack: ${err.message}`);
    }
  };

  return (
    <div className="pb-6">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <StickyNavbar />
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16">
          {/* Header: Back Button and Options Menu Button */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.back()}
              className="bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] px-3 py-1.5 rounded-lg shadow-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>

            {/* Options Menu Button and Dropdown - visible only to the author */}
            {hack && currentUserId && hack.user_id === currentUserId && (
              <div className="relative" ref={optionsMenuRef}>
                <button
                  onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                  className="bg-[#F5EFE6] hover:bg-[#EADDCA] text-[#A0522D] border-2 border-[#A0522D] p-2 rounded-lg shadow-md"
                  aria-label="Options"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
                {isOptionsMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => { router.push(`/hacks-page/${hackId}/edit`); setIsOptionsMenuOpen(false); }}
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

          {/* Hack Title */}
          <h1 className="text-3xl font-bold mb-2 text-[#8B4C24]">{toTitleCase(hack.title)}</h1>

          {/* Tags Display */}
          {hack.tags && hack.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {hack.tags.map((tag, index) => (
                <Tag key={index} label={toTitleCase(tag)} />
              ))}
            </div>
          )}

          {/* Location Display */}
          {hack.location &&
            (() => {
              let displayLocation;
              try {
                const parsedLocation = JSON.parse(hack.location);
                displayLocation = parsedLocation.address;
              } catch (e) {
                // If parsing fails or address is not found, location won't be displayed
                return null;
              }
              // Only render the location div if displayLocation is truthy
              if (displayLocation) {
                return (
                  <div className="mb-6 text-base text-[#8B4C24]">
                    <p><span className="font-bold">📍 Location:</span> {displayLocation}</p>
                  </div>
                );
              }
              return null;
            })()
          }

          {/* Description Section */}
          <div className="mb-6">
            <p className="text-[#8B4C24]">{hack.description}</p>
          </div>

          {/* Author/Timestamp */}
          <p className="text-sm text-[#8B4C24]/80 mb-8">
            By {hack.user_profiles && hack.user_profiles.name ? hack.user_profiles.name : 'Unknown'} - {formatTimeAgo(hack.created_at)}
          </p>

          {/* Vote and Bookmark Buttons Row */}
          <div className="flex items-center mb-6">
            <VoteButtons
              itemId={hack.id}
              itemType="hacks"
              upvotes={hack.upvotes || 0}
              downvotes={hack.downvotes || 0}
              userId={currentUserId} />
            {locationCoords && (
                          <ShowOnMapButton
                            id={hack.id}
                            children="Show on Map"
                          />
                        )}
            <BookmarkButton hackId={hack.id} />
          </div>
        </div>
        <CommentSection entityId={hack.id} entityType="hack" />
        <Footer />
      </div>
      <BottomNav />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteHack}
        itemName="hack"
      />
    </div>
  );
}
