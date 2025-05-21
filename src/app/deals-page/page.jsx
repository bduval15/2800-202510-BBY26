/**
 * page.jsx (DealsPage)
 * Loaf Life – Displays a list of deals and allows filtering.
 *
 * This page fetches and displays a list of deals from the Supabase 'deals'
 * table. Users can browse all available deals, filter them by selecting
 * tags, and navigate to a detailed view for each deal. It integrates with
 * Supabase for data retrieval and user authentication to personalize content.
 *
 * Features:
 * - Fetches and displays deals from Supabase.
 * - Filters deals based on user-selected tags.
 * - Shows personalized content based on user interests.
 * - Allows navigation to individual deal detail pages.
 *
 * Portions of styling and logic assisted by Google Gemini 2.5 Flash.
 *
 * Modified with assistance from Google Gemini 2.5 Flash.
 *
 * @author Nathan Oloresisimo
 * @author https://gemini.google.com/app
 */

'use client';

import { useState, useEffect } from 'react';
import { clientDB } from '@/supabaseClient.js';
import FeedLayout from '@/components/FeedLayout'
import DealCard from '@/components/cards/DealCard'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import AIbutton from '@/components/buttons/AIbutton';
import { tags } from '@/lib/tags';


export default function DealsPage() {
  // -- State & Hooks --
  const [selectedTags, setSelectedTags] = useState([]);
  const [allDeals, setAllDeals] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const supabase = clientDB;

  // -- Effects --
  // Fetch current user ID and interests
  useEffect(() => {
    const fetchUserAndInterests = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await clientDB.auth.getUser();
      
      if (userError) {
        console.error('Error fetching user:', userError.message);
      }
      if (user) {
        setCurrentUserId(user.id);
        // Fetch user interests from their profile
        const { data, error } = await clientDB
          .from('user_profiles')
          .select('interests')
          .eq('id', user.id)
          .single();
    
        if (error) {
          console.error('Failed to fetch interests:', error.message);
        } else if (data?.interests) {
          // Ensure interests are stored as an array, converting from string if necessary
          setInterests(Array.isArray(data.interests)
            ? data.interests
            : data.interests.split(','));
        }
      } else {
        setCurrentUserId(null);
      }
      setLoading(false);
    };
  
    fetchUserAndInterests();
  }, []);


  // Effect to fetch all deals
  useEffect(() => {
    const fetchDeals = async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*') // Fetches all columns
        .order('created_at', { ascending: false }); // Order by newest first

      if (error) {
        console.error('Error fetching deals:', error);
        setAllDeals([]);
      } else {
        setAllDeals(data || []);
      }
    };

    fetchDeals();
  }, [supabase]);

  // -- Handlers --
  const handleTagToggle = (tag) => {
    if (tag === "ALL") {
      // If "ALL" tag is selected, clear all selected tags
      setSelectedTags([]);
    } else {
      // Toggle individual tag selection
      setSelectedTags(prevSelectedTags =>
        prevSelectedTags.includes(tag)
          ? prevSelectedTags.filter(t => t !== tag) // Remove tag if already selected
          : [...prevSelectedTags, tag] // Add tag if not selected
      );
    }
  };
  
  // Filter deals based on selected tags
  const dealsToDisplay = selectedTags.length === 0
    ? allDeals // If no tags selected, show all deals
    : allDeals.filter(deal => 
        // Check if the deal's tags array contains any of the selected tags (case-insensitive)
        deal.tags && selectedTags.some(selTag => deal.tags.includes(selTag.toLowerCase()))
      );

  return (
    // Main Page Container
    <div className="bg-[#F5E3C6] pb-6">
      {/* Feed Layout Section */}
      <FeedLayout
        title="Deals"
        tagOptions={tags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      >
        {/* Deals Display Section */}
        {dealsToDisplay.length > 0 ? (
          dealsToDisplay.map(deal => {
            let displayLocation = deal.location; 
            // Logic to parse and display location
            if (deal.location && typeof deal.location === 'string') {
              try {
                const parsedLocation = JSON.parse(deal.location);
                if (parsedLocation && parsedLocation.address) {
                  displayLocation = parsedLocation.address;
                }
              } catch (e) {
                console.warn("Failed to parse location JSON:", deal.location, e);        
              }
            } else if (deal.location && typeof deal.location === 'object' && deal.location.address) {
              displayLocation = deal.location.address;
            }

            return (
              <DealCard
                key={deal.id}
                id={deal.id}
                title={deal.title}
                location={displayLocation} 
                price={deal.price}
                tags={deal.tags}
                upvotes={deal.upvotes}
                downvotes={deal.downvotes}
                createdAt={deal.created_at}
                userId={currentUserId}
              />
            );
          })
        ) : (
          // No Deals Found Message
          <p className="text-center text-gray-500 px-4">No deals found, try adding one!</p>
        )}

        {/* AI Button Section */}
        <div className="px-4 py-2 max-w-md mx-auto w-full">
          <AIbutton interests={interests} />
        </div>
        {/* Footer Component (within FeedLayout) */}
        <Footer />
      </FeedLayout>
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}