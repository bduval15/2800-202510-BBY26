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

export default function EventPopup({ evt }) {
  const router = useRouter();

  return (
    <Popup
      className="custom-popup"
      closeButton={true}
      closeOnClick={false}
      minWidth={140}
      maxWidth={160}
      offset={[0, -1]}
    >
      {/* Header */}
      <div className="relative flex items-center mb-1">
        <img
          src={evt.userAvatar}
          alt={evt.username}
          className="w-8 h-8 rounded-full border-2 border-[#C27A49] mr-1"
        />
        <h4 className="text-sm font-semibold text-[#8B4C24] flex-1">
          {evt.title}
        </h4>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-700 mb-0.5 leading-snug line-clamp-2">
        {evt.description}
      </p>

      {/* Date */}
      <p className="text-xs text-gray-600 mb-0.5 leading-tight">
        <strong>Date:</strong> {evt.date}
      </p>

      {/* Time */}
      <p className="text-xs text-gray-600 mb-1 leading-tight">
        <strong>Time:</strong> {evt.time}
      </p>

      {/* Distance & Price */}
      <div className="flex text-xs text-gray-600 mb-1 leading-tight">
        <span className="w-1/2"><strong>Dist:</strong> {evt.distance}</span>
        <span className="w-1/2">
          <strong>Price:</strong>{' '}
          <span className="text-[#639751]">{evt.price}</span>
        </span>
      </div>

      {/* Go to Post Button */}
      <button
        onClick={() => router.push(`/posts/${evt.id}`)}
        className="w-full bg-[#639751] hover:bg-[#639751]
                   text-white text-xs py-0.5 rounded-sm transition"
      >
        Go to Post
      </button>
    </Popup>
  );
}
