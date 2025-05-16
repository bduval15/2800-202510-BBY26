//  /**
//  * EventList.jsx
//  * Loaf Life – Populates even cards 
//  * underneath the map.
//  *  
//  * Modified with assistance from ChatGPT o4-mini-high.
//  * 
//  * @author Brady Duval
//  * @author https://chatgpt.com/
//  * 
//  * CURRENTLY NOT IN USE.
//  */
// 'use client';

// import React from 'react';
// import BookmarkButton from '@/components/buttons/Bookmark';

// export default function EventList({ events }) {
//   if (!events.length) {
//     return (
//       <div className="px-2 py-3 text-center text-gray-500 text-sm">
//         No events match your filters.
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-2">
//       {events.map(e => (
//         <div
//           key={e.id}
//           className="relative w-full bg-[#FFF9F0] border border-[#D1905A]
//                      rounded-md shadow-sm p-2"
//         >
//           {/* Save button */}
//           <button
//             className="absolute top-1 right-1 p-1 rounded-full"
//             aria-label="Save"
//           >
//             <BookmarkButton/>
//           </button>

//           {/* Header: avatar + username */}
//           <div className="flex items-center mb-2">
//             <img
//               src={e.userAvatar}
//               alt={e.username}
//               className="w-8 h-8 rounded-full
//                          border-2 border-[#C27A49]"
//             />
//             <span className="ml-2 text-sm font-semibold text-[#8B4C24]">
//               {e.username}
//             </span>
//           </div>

//           {/* Title */}
//           <h3 className="text-lg font-bold text-[#8B4C24] mb-1">
//             {e.title}
//           </h3>

//           {/* Description */}
//           <p className="text-gray-700 text-sm mb-2">
//             {e.description}
//           </p>

//           {/* Details grid */}
//           <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 mb-2">
//             <div>
//               <span className="font-medium text-[#8B4C24]">Date:</span>{' '}
//               {e.date}
//             </div>
//             <div>
//               <span className="font-medium text-[#8B4C24]">Time:</span>{' '}
//               {e.time}
//             </div>
//             <div>
//               <span className="font-medium text-[#8B4C24]">Price:</span>{' '}
//               <span className="text-[#639751]">{e.price}</span>
//             </div>
//             <div>
//               <span className="font-medium text-[#8B4C24]">Dist:</span>{' '}
//               {e.distance}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
