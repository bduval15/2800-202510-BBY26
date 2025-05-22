/**
 * page.jsx (HacksPage)
 *
 * Loaf Life
 *   Displays a list of hacks from Supabase. Users can filter hacks by tags.
 *   Each hack is presented in a card format. Features an AI button for personalized
 *   hack discovery based on user interests.
 *   Utilizes Next.js for routing and React for UI. Interacts with Supabase for data.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app (for portions of logic and structure)
 */

'use client';

import { useState, useEffect } from 'react';
import FeedLayout from '@/components/FeedLayout'
import HackCard from '@/components/cards/HackCard'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import { clientDB } from '@/supabaseClient';
import AIbutton from '@/components/buttons/AIbutton';
import { tags } from '@/lib/tags';

/**
 * @function HacksPage
 * @description Main component for displaying a list of all hacks. It fetches hacks
 *   from Supabase, allows filtering by tags, and renders each hack as a card.
 *   Includes an AI button for discovering hacks based on user interests.
 * @returns {JSX.Element} The UI for the hacks list page.
 */
export default function HacksPage() {
  // -- State --
  // State for the currently selected filter tags.
  const [selectedTags, setSelectedTags] = useState([]);
  // State for storing all hacks fetched from the database.
  const [allHacks, setAllHacks] = useState([]);
  // State to indicate if data is currently being loaded.
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error messages during data fetching.
  const [error, setError] = useState(null);
  // State for storing the interests of the current user.
  const [interests, setInterests] = useState([]);
  // State for the ID of the currently logged-in user.
  const [currentUserId, setCurrentUserId] = useState(null);

  // -- Effects --
  /**
   * useEffect: Fetch User and Interests
   * @description Fetches the current user's ID and their stored interests from Supabase
   *   on component mount. This is used for the AI recommendation feature.
   * @async
   */
  useEffect(() => {
    const fetchUserAndInterests = async () => {
      const { data: { user } } = await clientDB.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);

        const { data: interestsData, error: interestsError } = await clientDB
          .from('user_profiles')
          .select('interests')
          .eq('id', user.id)
          .single();

        if (interestsError) {
          console.error('Failed to fetch interests:', interestsError.message);
        } else if (interestsData?.interests) {
          // Ensure interests are stored as an array, handling both array and CSV string formats from DB
          setInterests(Array.isArray(interestsData.interests)
            ? interestsData.interests
            : interestsData.interests.split(','));
        }
      } else {
        setCurrentUserId(null);
      }
    };

    fetchUserAndInterests();
  }, []);

  /**
   * useEffect: Fetch All Hacks
   * @description Fetches all hacks from the Supabase 'hacks' table on component mount.
   *   Orders the hacks by creation date in descending order.
   * @async
   */
  useEffect(() => {
    const fetchHacks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await clientDB
          .from('hacks')
          .select('id, title, description, created_at, user_id, tags, upvotes, downvotes, location')
          .order('created_at', { ascending: false });

        console.log("[HacksPage] Fetched data:", data);
        console.log("[HacksPage] Fetch error:", fetchError);

        if (fetchError) {
          throw fetchError;
        }
        // Set the fetched hacks to state, or an empty array if data is null
        setAllHacks(data || []);
        console.log("[HacksPage] allHacks state set with:", data || []);
      } catch (err) {
        // If an error occurs during the try block, set the error state
        setError(err.message);
        console.error("[HacksPage] Error fetching hacks catch block:", err);
      } finally {
        // Regardless of success or failure, set loading state to false
        setIsLoading(false);
      }
    };

    fetchHacks();
  }, []);

  console.log("[HacksPage] Current allHacks state:", allHacks);

  // -- Handlers --
  /**
   * @function handleTagToggle
   * @description Handles the selection or deselection of a filter tag.
   *   If "ALL" is selected, clears all filters. Otherwise, toggles the specified tag
   *   in the `selectedTags` state.
   * @param {string} tag - The tag to toggle.
   */
  const handleTagToggle = (tag) => {
    if (tag === "ALL") {
      setSelectedTags([]);
    } else {
      setSelectedTags(prevSelectedTags =>
        // Toggle tag selection: if tag is already selected, remove it; otherwise, add it.
        prevSelectedTags.includes(tag)
          ? prevSelectedTags.filter(t => t !== tag)
          : [...prevSelectedTags, tag]
      );
    }
  };

  
  // Filter hacks: if no tags are selected, all hacks are shown.
  // Otherwise, hacks are filtered to include only those that contain at least one of the selected tags.
  const filteredHacks = selectedTags.length === 0
    ? allHacks
    : allHacks.filter(hack => 
        // Check if the hack has tags and if any of the selected tags (case-insensitive) are present in the hack's tags.
        hack.tags && selectedTags.some(selTag => hack.tags.includes(selTag.toLowerCase()))
      );
  console.log("[HacksPage] Current filteredHacks:", filteredHacks);

  return (
    <div className="bg-[#F5E3C6] pb-6">
      {/* Main Feed Layout: Provides structure for title, tag filters, and content list */}
      <FeedLayout
        title="Hacks"
        tagOptions={tags} // Available tags for filtering
        selectedTags={selectedTags} // Currently selected filter tags
        onTagToggle={handleTagToggle} // Callback for tag selection changes
      >
        {/* Conditional Hack Display: Shows loading, error, or list of hack cards */}
        {isLoading && <p className="text-center text-gray-500 px-4">Loading hacks...</p>}
        {error && <p className="text-center text-red-500 px-4">Error: {error}</p>}
        {!isLoading && !error && filteredHacks.length > 0 ? (
          // Render each filtered hack as a HackCard
          filteredHacks.map(hack => (
            <HackCard
              key={hack.id}
              id={hack.id}
              href={`/hacks-page/${hack.id}`} // Link to the hack detail page
              title={hack.title}
              upvotes={hack.upvotes}
              downvotes={hack.downvotes}
              tags={hack.tags}
              description={hack.description}
              location={hack.location}
              createdAt={hack.created_at}
              userId={currentUserId} // Pass current user ID for interactions
            />
          ))
        ) : (
          // Message displayed if no hacks are found after loading and no error
          !isLoading && !error && <p className="text-center text-gray-500 px-4">No hacks found, try adding one!</p>
        )}

        {/* AI Button Section: Button for AI-powered hack recommendations */}
        <div className="px-4 py-2 max-w-md mx-auto w-full">
          <AIbutton interests={interests} />
        </div>
        {/* Page Footer */}
        <Footer />
      </FeedLayout>
      {/* Bottom Navigation Bar for mobile */}
      <BottomNav />
    </div>
  )
}
