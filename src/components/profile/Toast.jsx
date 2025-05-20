// components/profile/Toast.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ visible, message, type = "success", onClose }) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] flex flex-col items-center">
          <motion.img
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: -60, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            src="/images/loafs/toast-happy.png"
            alt="Toast"
            className="w-14 h-auto -mb-6 z-10"
          />
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
