/**
 * EventDetails.jsx
 * Loaf Life - Event Details Page
 *
 * This page displays the details of a specific event.
 * Fetches data from Supabase based on event ID.
 * It includes the event title, description, hack details, author, timestamp, and location.
 * It also includes a button to save the event.
 *
 * Converted from HackPage with table changes for 'events'
 * @author: Nathan O
 * @author: Conner P
 * @author: ChatGPT used to simplify conversion 
 */

'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import BookmarkButton from '@/components/buttons/Bookmark';
import VoteButtons from '@/components/buttons/VoteButtons';
import { ArrowLeftIcon, PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import Tag from '@/components/Tag';
import BottomNav from '@/components/BottomNav';
import CommentSection from '@/components/sections/CommentSection';
import StickyNavbar from '@/components/StickyNavbar';
import { clientDB } from '@/supabaseClient';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export default function EventDetailPage({ params }) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.eventId;
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const optionsMenuRef = useRef(null);

  // Fetch current user session
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        return;
      }
      if (session?.user) setCurrentUserId(session.user.id);
    };
    fetchCurrentUser();
  }, []);

  // Fetch event details
  useEffect(() => {
    if (!eventId) {
      setIsLoading(false);
      setError("Event ID is missing.");
      return;
    }

    const fetchEventDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: eventData, error: fetchError } = await clientDB
          .from('events')  
          .select(
            'id, title, description, location, created_at, user_id, tags, upvotes, downvotes, user_profiles(name), start_date, end_date'
          )
          .eq('id', eventId)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError("Event not found.");
            setEvent(null);
          } else {
            throw fetchError;
          }
        } else if (!eventData) {
          setError("Event not found.");
        } else {
          setEvent(eventData);
        }
      } catch (err) {
        setError(err.message);
        console.error(`Error fetching event ${eventId}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  // Close options menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) {
        setIsOptionsMenuOpen(false);
      }
    };
    if (isOptionsMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOptionsMenuOpen]);

  if (isLoading) {
    return <div className="max-w-md mx-auto px-4 py-6 text-center">Loading event details...</div>;
  }

  if (error) {
    return <div className="max-w-md mx-auto px-4 py-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!event) {
    return <div className="max-w-md mx-auto px-4 py-6 text-center">Event not found.</div>;
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} minutes ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString(undefined, options);
  };

  const handleDelete = () => {
    setIsOptionsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEvent = async () => {
    setIsDeleteModalOpen(false);
    try {
      const { error: deleteError } = await clientDB
        .from('events')
        .delete()
        .eq('id', eventId);

      if (deleteError) throw deleteError;

      alert('Event deleted successfully!');
      router.push('/events-page');
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(`Error deleting event: ${err.message}`);
    }
  };

  return (
    <div className="pb-6">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <StickyNavbar />

        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <Link href="/events-page">
              <button className="bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] p-2 rounded-lg">
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
            </Link>

            {event.user_id === currentUserId && (
              <div className="relative" ref={optionsMenuRef}>
                <button
                  onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                  className="bg-[#F5EFE6] hover:bg-[#EADDCA] text-[#A0522D] border-2 border-[#A0522D] p-2 rounded-lg shadow-md"
                  aria-label="Options"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
                {isOptionsMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                    <button
                      onClick={() => {
                        router.push(`/events-page/${eventId}/edit`);
                        setIsOptionsMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <PencilIcon className="h-5 w-5 mr-2" /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2 text-[#8B4C24]">{event.title}</h1>

          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            {event.tags?.map((tag, i) => (
              <Tag key={i} label={tag} />
            ))}
          </div>

          {/* Dates */}
          <div className="mb-4 text-sm font-medium text-[#8B4C24]">
            <p>Start Date: {formatDate(event.start_date)}</p>
            <p>End Date: {formatDate(event.end_date)}</p>
          </div>

          {/* Location */}
          <p className="text-sm font-medium mb-4 text-[#8B4C24]">
            Location: {
              (() => {
                try {
                  const parsedLocation = JSON.parse(event.location);
                  return parsedLocation.address || "Address not available";
                } catch (e) {
                  console.error("Error parsing event location:", e);
                  return "Invalid location data";
                }
              })()
            }
          </p>

          

          {/* Description */}
          <p className="mb-6 text-[#8B4C24]">{event.description}</p>

          {/* Author & Timestamp */}
          <p className="text-sm text-[#8B4C24]/80 mb-6">
            By {event.user_profiles?.name || 'Unknown'} – {formatTimeAgo(event.created_at)}
          </p>

          {/* Votes & Bookmark */}
          <div className="flex items-center mb-6">
            <VoteButtons eventId={event.id} itemType="events" userId={currentUserId} upvotes={event.upvotes} downvotes={event.downvotes} />
            <BookmarkButton eventId={event.id} />
          </div>
        </div>

        <CommentSection hackId={event.id} />
        <Footer />
      </div>

      <BottomNav />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteEvent}
        itemName="event"
      />
    </div>
  );
}
