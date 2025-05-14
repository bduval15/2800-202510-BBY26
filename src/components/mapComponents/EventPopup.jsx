/**
* EventPopup.jsx
*
* Loaf Life – Holds all the functionality 
* for even popup modal when clicking on a pin.
* 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Brady Duval
 * @author https://chatgpt.com/
 */

'use client';

import React from 'react';
import { Popup } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function EventPopup({ evt }) {
  const router = useRouter();
  const labelMap = { hacks: 'Hacks', deals: 'Deals', events: 'Free Events' };
  const threadLabel = labelMap[evt.table_id] || 'General';
  const avatarSrc = evt.userAvatar || '/images/logo.png';

  return (
    <Popup
      className="custom-popup"
      closeButton
      closeOnClick={false}
      minWidth={180}
      maxWidth={200}
    >
      <div className="p-1 w-50">
        {/* — Header: Avatar + Title on one line — */}
        <div className="flex items-center space-x-2 mb-1">
          <img
            src={avatarSrc}
            alt="avatar"
            className="w-12 h-12 rounded-full"
            onError={e => {
              e.currentTarget.src = '/images/logo.png';
            }}
          />
          <h4 className="flex-1 text-sm font-semibold text-[#8B4C24] leading-snug">
            {evt.title}
          </h4>
        </div>
        {/* — Thread Pill underneath — */}
        <div className="flex justify-start mb-2">
          <span className="bg-[#639751] text-white text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
            {threadLabel}
          </span>
        </div>
        {/* — Details Grid — */}
        <div className="grid grid-cols-2 gap-1 text-gray-600 text-xs mb-3">
          <div className="flex items-center space-x-1">
            <MapPinIcon className="h-4 w-4" />
            <span>{evt.distance}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CurrencyDollarIcon className="h-4 w-4 text-[#639751]" />
            <span className="text-[#639751]">{evt.price}</span>
          </div>
        </div>
        {/* — Call to action — */}
        <button
          onClick={() => router.push(`/posts/${evt.id}`)}
          className="block w-full bg-[#639751] hover:bg-[#4f7a43] text-white text-sm font-medium py-1 rounded"
        >
          Go to Post
        </button>
      </div>
    </Popup>
  );
}