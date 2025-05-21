/**
 * page.jsx (DealsPage)
 * Loaf Life – Displays a list of deals and allows filtering.
 *
 * Loaf Life
 *   Displays a list of deals and allows filtering by tags.
 *   Fetches deals from Supabase and personalizes content based on user interests.
 *   Utilizes Next.js for routing and React for UI components.
 *   Integrates with Supabase for data fetching and user authentication.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app (Assisted with code)
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

/**
 * @function DealsPage
 * @description This page component displays a list of deals. It fetches all deals
 *   from Supabase and allows users to filter them by tags. It also fetches the
 *   current user's interests to potentially personalize content (e.g., via an AI button).
 * @returns {JSX.Element} The JSX for the deals listing page.
 */
export default function DealsPage() {
  // -- State & Hooks --
  // State for the currently selected filter tags.
  const [selectedTags, setSelectedTags] = useState([]);
  // State to store all deals fetched from the database.
  const [allDeals, setAllDeals] = useState([]);
  // State for the current user's interests (tags).
  const [interests, setInterests] = useState([]);
  // State to indicate if initial data (user interests) is loading.
  const [loading, setLoading] = useState(true);
  // State for the ID of the currently authenticated user.
  const [currentUserId, setCurrentUserId] = useState(null);
  // Supabase client instance for database interactions.
  const supabase = clientDB;

  // -- Effects --
  /**
   * useEffect: Fetch User and Interests
   * @description Fetches the current authenticated user and their interests from their profile.
   *   The user's ID is stored for potential use in components like DealCard.
   *   Interests are used for features like the AI recommendation button.
   *   Sets loading state during fetch.
   * @async
   */
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

  /**
   * useEffect: Fetch All Deals
   * @description Fetches all deals from the 'deals' table in Supabase.
   *   Orders deals by creation date (newest first). Populates `allDeals` state.
   *   Handles potential errors during fetching.
   * @async
   */
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
  /**
   * @function handleTagToggle
   * @description Handles the selection or deselection of a filter tag.
   *   If "ALL" is selected, it clears all other selected tags.
   *   Otherwise, it toggles the specified tag in the `selectedTags` array.
   * @param {string} tag - The tag string that was clicked/toggled.
   */
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
  
  // Filter deals based on selected tags. If no tags are selected, all deals are shown.
  const dealsToDisplay = selectedTags.length === 0
    ? allDeals // If no tags selected, show all deals
    : allDeals.filter(deal => 
        // Check if the deal's tags array contains any of the selected tags (case-insensitive)
        deal.tags && selectedTags.some(selTag => deal.tags.includes(selTag.toLowerCase()))
      );

  // Main page structure for displaying the list of deals
  return (
    // Main Page Container
    <div className="bg-[#F5E3C6] pb-6">
      {/* Feed Layout Section - provides structure for title, filters, and content */}
      <FeedLayout
        title="Deals"
        tagOptions={tags} // All available tags for filtering
        selectedTags={selectedTags} // Currently active filter tags
        onTagToggle={handleTagToggle} // Callback for when a tag is toggled
      >
        {/* Deals Display Section - renders DealCard components */}
        {dealsToDisplay.length > 0 ? (
          dealsToDisplay.map(deal => {
            let displayLocation = deal.location; 
            // Logic to parse and display location (address part)
            if (deal.location && typeof deal.location === 'string') {
              try {
                const parsedLocation = JSON.parse(deal.location);
                if (parsedLocation && parsedLocation.address) {
                  displayLocation = parsedLocation.address;
                }
              } catch (e) {
                // Warn if location string is not valid JSON or lacks address
                console.warn("Failed to parse location JSON:", deal.location, e);        
              }
            } else if (deal.location && typeof deal.location === 'object' && deal.location.address) {
              // If location is already an object with an address, use it directly
              displayLocation = deal.location.address;
            }

            // Render a DealCard for each deal in the filtered list
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
          // No Deals Found Message - shown if `dealsToDisplay` is empty
          <p className="text-center text-gray-500 px-4">No deals found, try adding one!</p>
        )}

        {/* AI Button Section - for AI-powered recommendations or actions */}
        <div className="px-4 py-2 max-w-md mx-auto w-full">
          {/* AI button, potentially using user interests */}
          <AIbutton interests={interests} />
        </div>
        {/* Footer Component (within FeedLayout) */}
        <Footer />
      </FeedLayout>
      {/* Bottom Navigation for mobile */}
      <BottomNav />
    </div>
  )
}