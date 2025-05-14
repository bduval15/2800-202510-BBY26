/**
* EventPopup.jsx

* Loaf Life – Holds all the functionality 
* for even popup modal when clicking on a pin.
* 
* @author Brady Duval
* 
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

  return (
    <Popup
      className="custom-popup"
      closeButton
      closeOnClick={false}
      minWidth={180}
      maxWidth={200}
    >
      <div className="p-2 w-44">
        {/* — Header — */}
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={evt.userAvatar}
            alt={evt.username}
            className="w-8 h-8 rounded-full border-2 border-[#C27A49]"
          />
          <h4 className="flex-1 text-sm font-semibold text-[#8B4C24] truncate">
            {evt.title}
          </h4>
        </div>

        {/* — Description — */}
        <p className="text-xs text-gray-700 mb-2 line-clamp-3">
          {evt.description}
        </p>

        {/* — Details Grid — */}
        <div className="grid grid-cols-2 gap-1 text-gray-600 text-xs mb-3">
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{evt.date || '—'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>{evt.time || '—'}</span>
          </div>
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
          className="block w-full text-center bg-[#639751] hover:bg-[#4f7a43]
                     text-white text-sm font-medium py-1 rounded"
        >
          Go to Post
        </button>
      </div>
    </Popup>
  );
}
