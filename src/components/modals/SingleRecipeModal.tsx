'use client'
import React, { useEffect } from 'react'
import MarkdownDisplay from "./MarkdownDisplay"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeIngredients?: any;
  recipeTitle: string;
}

const SingleRecipeModal = ({ isOpen, onClose, recipeIngredients, recipeTitle }: ModalProps) => {

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
      <div className='relative bg-white rounded-md shadow-lg h-[70%] overflow-y-auto w-[70%] max-w-3xl p-6'>

        <button
          onClick={onClose}
          className='absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-xl font-semibold'
          aria-label='Close modal'
        >
         Close
        </button>

        <h3 className="font-semibold mb-4 text-lg" style={{ color: "#333" }}>
          {recipeTitle}
        </h3>

        <MarkdownDisplay recipeIngredients={recipeIngredients} />

      </div>
    </div>
  )
}

export default SingleRecipeModal
