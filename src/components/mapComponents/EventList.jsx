'use client';

import React from 'react';

export default function EventList({ events }) {
  if (!events.length) {
    return (
      <div className="px-4 py-6 text-center text-gray-500">
        No events match your filters.
      </div>
    );
  }

return (
    <div className="space-y-4">
      {events.map(e => (
        <div
          key={e.id}
          className="relative w-full bg-[#FFF9F0] border border-[#D1905A]
                     rounded-lg shadow-sm p-4"
        >
          <button
            className="absolute top-3 right-3 p-1 rounded-full
                       bg-white border border-[#C27A49] text-[#C27A49]
                       hover:bg-[#C27A49] hover:text-white transition"
            aria-label="Save"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="h-8 w-8" fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5v14l7-7 7 7V5H5z" />
            </svg>
          </button>
          <div className="flex items-center mb-3">
            <img
              src={e.userAvatar}
              alt={e.username}
              className="w-10 h-10 rounded-full
                         border-2 border-[#C27A49]"
            />
            <span className="ml-3 font-semibold text-[#8B4C24]">
              {e.username}
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#8B4C24] mb-1">
            {e.title}
          </h3>
          <p className="text-gray-700 mb-4">
            {e.description}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div>
              <span className="font-medium text-[#8B4C24]">Date:</span>{' '}
              {e.date}
            </div>
            <div>
              <span className="font-medium text-[#8B4C24]">Time:</span>{' '}
              {e.time}
            </div>
            <div>
              <span className="font-medium text-[#8B4C24]">Price:</span>{' '}
              <span className="text-[#639751]">{e.price}</span>
            </div>
            <div>
              <span className="font-medium text-[#8B4C24]">Dist:</span>{' '}
              {e.distance}
            </div>
          </div>
          <button
            className="w-full bg-[#C27A49] hover:bg-[#639751]
                       text-white font-medium py-2 rounded-lg transition"
          >
            Get Directions
          </button>
        </div>
      ))}
    </div>
  );
}
