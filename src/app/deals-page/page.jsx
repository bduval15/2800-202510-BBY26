'use client'

import { useState, useEffect } from 'react';
import {clientDB} from '@/supabaseClient.js';
import FeedLayout from '@/components/FeedLayout'
import DealCard from '@/components/cards/DealCard' 
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'

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
  const supabase = clientDB; 

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
              />
            );
          })
        ) : (
          <p className="text-center text-gray-500 px-4">No deals found. Try adding one!</p>
        )}
        <Footer />
      </FeedLayout>
      <BottomNav />
    </div>
  )
} 