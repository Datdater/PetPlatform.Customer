import { useEffect, useState } from 'react';

interface FlyingImageProps {
    imageUrl: string;
    onAnimationComplete: () => void;
}

export default function FlyingImage({ imageUrl, onAnimationComplete }: FlyingImageProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        // Get cart icon position (assuming it's in the header)
        const cartIcon = document.querySelector('[data-cart-icon]');
        if (!cartIcon) return;

        const cartRect = cartIcon.getBoundingClientRect();
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;

        setPosition({ x: startX, y: startY });

        // Animate to cart
        const animation = requestAnimationFrame(() => {
            setPosition({
                x: cartRect.left + cartRect.width / 2,
                y: cartRect.top + cartRect.height / 2
            });
        });

        // Clean up animation
        return () => cancelAnimationFrame(animation);
    }, []);

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
                onAnimationComplete();
            }, 1000); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [isAnimating, onAnimationComplete]);

    if (!isAnimating) return null;

    return (
        <div
            className="fixed z-50 pointer-events-none"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <img
                src={imageUrl}
                alt="Flying product"
                className="w-16 h-16 rounded-full object-cover shadow-lg"
            />
        </div>
    );
} 