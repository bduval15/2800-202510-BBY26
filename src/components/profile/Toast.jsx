/**
 * Toast.jsx
 *
 * Loaf Life – Toast popup animation component used to provide playful feedback.
 *
 * Displays a happy toast loaf rising from a toaster, triggered during profile updates.
 * Built with Framer Motion for smooth enter/exit animations.
 *
 * Props:
 * - visible (boolean): controls visibility of the toast popup
 * - message (string): optional message text (currently unused visually)
 * - type (string): visual type indicator ("success", "error", etc.) – reserved for future styling
 * - onClose (function): optional callback when toast is dismissed (not used yet)
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/
 *
 * @function Toast
 * @description Renders an animated toast loaf rising from a toaster using Framer Motion.
 */

import { motion, AnimatePresence } from "framer-motion";

/**
 * Toast
 * @param {Object} props
 * @param {boolean} props.visible - Controls if the toast animation is shown
 * @param {string} props.message - Optional message (unused visually for now)
 * @param {string} props.type - Optional type of toast (e.g., success/error)
 * @param {Function} props.onClose - Optional onClose handler
 */
export default function Toast({ visible, message, type = "success", onClose }) {
  return (
    <AnimatePresence>
      {visible && (
        // Fixed-position container centered at the bottom
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] flex flex-col items-center">

          {/* Animated toast loaf rising up */}
          <motion.img
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: -60, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            src="/images/loafs/toast-happy.png"
            alt="Toast"
            className="w-14 h-auto -mb-6 z-10"
          />

          {/* Static toaster image */}
          <img
            src="/images/toaster.png"
            alt="Toaster"
            className="w-24 h-auto z-20 -mt-12"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
