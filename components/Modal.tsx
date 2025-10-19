import React, { useEffect } from 'react';
import { useModal } from '../contexts/ModalContext';
import { XIcon } from './icons';

const Modal: React.FC = () => {
  const { isOpen, content, closeModal } = useModal();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={closeModal}
    >
      <div
        className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-sm m-4 p-6 transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          aria-label="Close modal"
        >
          <XIcon className="w-6 h-6" />
        </button>
        {content}
      </div>
    </div>
  );
};

export default Modal;
