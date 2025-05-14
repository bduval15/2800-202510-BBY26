'use client';

import React from 'react';

/**
 * ConfirmDeleteModal.jsx
 * Loaf Life - Confirm Delete Modal
 * 
 * This component allows users to confirm the deletion of a hack or deal.
 * 
 * Modified with assistance from Google Gemini 2.5 Flash
 * 
 * @author: Nathan O
 * @author https://gemini.google.com/app
 */

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete this {itemName || 'item'}? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 