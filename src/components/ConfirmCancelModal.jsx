/**
 * ConfirmCancelModal.jsx
 * Loaf Life – Modal for confirming cancellation of an action.
 *
 * This component displays a modal dialog that prompts the user to confirm if
 * they want to discard unsaved changes or cancel an ongoing action, such as
 * editing a form. It provides options to confirm the cancellation or to
 * continue with the current task.
 *
 * Features:
 * - Displays a confirmation message for discarding changes.
 * - Provides "Keep Editing" and "Discard" action buttons.
 * - Controlled by an `isOpen` prop to show/hide the modal.
 *
 * Modified with assistance from Google Gemini 2.5 Pro.
 *
 * @author Nathan Oloresisimo
 * @author https://gemini.google.com/app
 */
'use client'

export default function ConfirmCancelModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) {
    return null;
  }

  return (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold text-[#6A401F] mb-4">Discard Changes?</h3>
        <p className="text-sm text-gray-700 mb-6">
          Are you sure you want to cancel? Any unsaved changes will be lost.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#8B4C24] bg-transparent hover:bg-gray-100 border border-[#D1905A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4C24] transition duration-150 ease-in-out"
          >
            Keep Editing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
} 