'use client'

import { useState, useEffect } from 'react';
import { clientDB } from '@/supabaseClient.js';
import FeedLayout from '@/components/FeedLayout'
import DealCard from '@/components/cards/DealCard'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import AIbutton from '@/components/buttons/AIbutton';
import { tags } from '@/lib/tags';

/**
 * DealsPage.jsx
 * Loaf Life - Deals Page
 *
 * This page lists the deals that have been posted.
 * It fetches data from the Supabase 'deals' table.
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author Nate O
 * @author https://gemini.google.com/app
 * 
 */

export default function DealsPage() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [allDeals, setAllDeals] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const supabase = clientDB;

  useEffect(() => {
    const fetchUserAndInterests = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await clientDB.auth.getUser();
      
      if (userError) {
        console.error('Error fetching user:', userError.message);
      }
      if (user) {
        setCurrentUserId(user.id);
        const { data, error } = await clientDB
          .from('user_profiles')
          .select('interests')
          .eq('id', user.id)
          .single();
    
        if (error) {
          console.error('Failed to fetch interests:', error.message);
        } else if (data?.interests) {
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


  useEffect(() => {
    const fetchDeals = async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*') // Fetches all columns
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deals:', error);
        setAllDeals([]);
      } else {
        setAllDeals(data || []);
      }
    };

    fetchDeals();
  }, [supabase]);

  const handleTagToggle = (tag) => {
    if (tag === "ALL") {
      setSelectedTags([]);
    } else {
      setSelectedTags(prevSelectedTags =>
        prevSelectedTags.includes(tag)
          ? prevSelectedTags.filter(t => t !== tag)
          : [...prevSelectedTags, tag]
      );
    }
  };

  const dealsToDisplay = selectedTags.length === 0
    ? allDeals
    : allDeals.filter(deal => 
        deal.tags && selectedTags.some(selTag => deal.tags.includes(selTag.toLowerCase()))
      );

  return (
    <div className="bg-[#F5E3C6] pb-6">
      <FeedLayout
        title="Deals"
        tagOptions={tags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      >
        {dealsToDisplay.length > 0 ? (
          dealsToDisplay.map(deal => {
            let displayLocation = deal.location; 
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
          <p className="text-center text-gray-500 px-4">No deals found, try adding one!</p>
        )}

        <div className="px-4 py-2 max-w-md mx-auto w-full">
          <AIbutton interests={interests} />
        </div>
        <Footer />
      </FeedLayout>
      <BottomNav />
    </div>
  )
}