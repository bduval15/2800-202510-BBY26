/**
 * File: ConfirmDeleteModal.jsx
 *
 * Loaf Life
 *   Modal for confirming the deletion of an item. This component presents a modal
 *   dialog to the user, asking for confirmation before proceeding with a delete
 *   operation. It is designed to prevent accidental deletions by requiring an
 *   explicit confirmation. The modal displays the name of the item to be deleted
 *   if provided.
 *   Utilizes React for UI components.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app
 *
 * Main Component:
 *   @function ConfirmDeleteModal
 *   @description Displays a modal dialog to confirm item deletion. It shows a
 *                confirmation message and, optionally, the item's name.
 *                Provides "Cancel" and "Delete" actions. Visibility is
 *                controlled by the `isOpen` prop.
 *   @param {object} props - The component's props.
 *   @param {boolean} props.isOpen - Controls the visibility of the modal.
 *   @param {function} props.onClose - Function to call when the modal is closed (Cancel).
 *   @param {function} props.onConfirm - Function to call when deletion is confirmed.
 *   @param {string} [props.itemName] - The name of the item to be deleted.
 *   @returns {JSX.Element | null} The modal component or null if not open.
 */

'use client';

import React from 'react';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
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
