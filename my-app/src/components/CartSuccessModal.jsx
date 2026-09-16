import React from "react";
import { createPortal } from "react-dom";
import { FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function CartSuccessModal({ isOpen, onClose, message ,type="success"}) {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }


  const handleViewCart = () => {
    onClose();
    navigate("/cart");
  };

  const isWarning=type==="warning";
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md rounded-xl bg-white px-6 py-8 text-center shadow-2xl sm:px-10">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded border border-orange-500 text-xl text-orange-500 transition hover:bg-orange-500 hover:text-white"
        >
          ×
        </button>

        {/* Success Icon */}
        <div className="mb-5 flex justify-center">
          {isWarning?(
           < div className="flex h-16 w-16 items-center justify-center  rounded-full bg-orange-100 text-4xl font-bold text-orange-500">
           !
           </div>
          ):(

          <FiCheck size={65} strokeWidth={3} className="text-slate-800" />
          )}
        </div>

        {/* Message */}
        <h2 className="text-lg font-medium text-gray-700">{message}</h2>

        {/* View Cart Button */}
        <button
          type="button"
          onClick={handleViewCart}
          className="mt-8 w-full rounded-sm bg-orange-500 px-6 py-3 text-base font-bold text-white transition hover:bg-orange-600"
        >
          VIEW CART
        </button>
      </div>
    </div>,
    document.body
  );

}

export default CartSuccessModal;
