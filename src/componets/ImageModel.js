import React from 'react';

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative bg-white">
                <button onClick={onClose} className="absolute top-2 right-2 text-white px-3 py-1 text-sm bg-black">Close</button>
                <img src={imageUrl} alt="Large view" style={{ width: '100%%', height: "800px", borderRadius: '10px' }} className="flex justify-center items-center"/>
            </div>
        </div>
    );
};

export default ImageModal;
