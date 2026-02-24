import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ImageCarousel({ images, altPrefix = "Image" }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedIndex === null) return;
            if (e.key === 'ArrowRight') handleNext(e);
            if (e.key === 'ArrowLeft') handlePrev(e);
            if (e.key === 'Escape') setSelectedIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, images]);

    if (!images || images.length === 0) return null;

    const handleNext = (e) => {
        if (e) e.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

    const renderLightbox = () => (
        <AnimatePresence>
            {selectedImage && (
                <motion.div
                    className="lightbox-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedIndex(null)}
                >
                    <button className="lightbox-close" onClick={() => setSelectedIndex(null)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    {images.length > 1 && (
                        <>
                            <button className="lightbox-nav lightbox-prev" onClick={handlePrev}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <button className="lightbox-nav lightbox-next" onClick={handleNext}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </>
                    )}

                    <motion.img
                        key={selectedImage} // forces re-animation on change
                        src={selectedImage}
                        alt="Preview"
                        className="lightbox-image"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Grid Layout Logic
    const renderGrid = () => {
        const count = images.length;

        if (count === 1) {
            return (
                <div className="twitter-grid twitter-grid-1">
                    <div className="grid-item" onClick={() => setSelectedIndex(0)}>
                        <img src={images[0]} alt={`${altPrefix}`} className="grid-img-blur" />
                        <img src={images[0]} alt={`${altPrefix}`} className="grid-img-main" />
                    </div>
                </div>
            );
        }

        if (count === 2) {
            return (
                <div className="twitter-grid twitter-grid-2">
                    {images.map((img, idx) => (
                        <div key={idx} className="grid-item" onClick={() => setSelectedIndex(idx)}>
                            <img src={img} alt={`${altPrefix} ${idx + 1}`} />
                        </div>
                    ))}
                </div>
            );
        }

        if (count === 3) {
            return (
                <div className="twitter-grid twitter-grid-3">
                    {images.map((img, idx) => (
                        <div key={idx} className="grid-item" onClick={() => setSelectedIndex(idx)}>
                            <img src={img} alt={`${altPrefix} ${idx + 1}`} />
                        </div>
                    ))}
                </div>
            );
        }

        // 4 or more images
        const displayImages = images.slice(0, 4);
        const extraCount = images.length - 4;

        return (
            <div className="twitter-grid twitter-grid-4">
                {displayImages.map((img, idx) => (
                    <div key={idx} className="grid-item" onClick={() => setSelectedIndex(idx)}>
                        <img src={img} alt={`${altPrefix} ${idx + 1}`} />
                        {idx === 3 && extraCount > 0 && (
                            <div className="grid-more-overlay">+{extraCount}</div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="twitter-grid-container">
                {renderGrid()}
            </div>
            {renderLightbox()}
        </>
    );
}
