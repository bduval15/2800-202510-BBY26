
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
    <div className="px-4 space-y-4">
      {events.map(e => (
        <div key={e.id}
             className="bg-white p-4 rounded shadow border border-[#D1905A]">
          <h3 className="text-lg font-semibold text-[#8B4C24]">{e.title}</h3>
          <p className="mt-1 text-gray-700">{e.description}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div><strong>Date:</strong> {e.date}</div>
            <div><strong>Time:</strong> {e.time}</div>
            <div><strong>Price:</strong> {e.price}</div>
            <div><strong>Dist:</strong> {e.distance}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
