'use client'

import { useState, useEffect } from 'react';
import { clientDB } from '@/supabaseClient.js';
import FeedLayout from '@/components/FeedLayout'
import DealCard from '@/components/cards/DealCard'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import AIbutton from '@/components/buttons/AIbutton';

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
  const [allDeals, setAllDeals] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = clientDB;

  useEffect(() => {
    const fetchInterests = async () => {
      const { data: { user } } = await clientDB.auth.getUser();
      if (!user) return;
  
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
  
      setLoading(false);
    };
  
    fetchInterests();
  }, []);


  useEffect(() => {
    const fetchDeals = async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*'); // Fetches all columns

      if (error) {
        console.error('Error fetching deals:', error);
      } else {
        setAllDeals(data);
      }
    };

    fetchDeals();
  }, [supabase]);

  const dealsToDisplay = allDeals;



  return (
    <div className="bg-[#F5E3C6] pb-6">
      <FeedLayout
      >
        <div className="text-left text-2xl font-bold text-[#8B4C24] pl-4 mb-4 mt-4">
          Deals
        </div>
        {dealsToDisplay.length > 0 ? (
          dealsToDisplay.map(deal => {
            let displayLocation = deal.location; // Default to the original location
            if (deal.location && typeof deal.location === 'string') {
              try {
                const parsedLocation = JSON.parse(deal.location);
                if (parsedLocation && parsedLocation.address) {
                  displayLocation = parsedLocation.address;
                }
              } catch (e) {
                console.warn("Failed to parse location JSON:", deal.location, e);
                // displayLocation remains deal.location if parsing fails or address is not found
              }
            } else if (deal.location && typeof deal.location === 'object' && deal.location.address) {
              displayLocation = deal.location.address;
            }

            return (
              <DealCard
                key={deal.id}
                id={deal.id}
                title={deal.title}
                location={displayLocation} // Pass the extracted address
                price={deal.price}
              />
            );
          })
        ) : (
          <p className="text-center text-gray-500 px-4">No deals found. Try adding one!</p>
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