import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAnimateSignForm(navigateTo: string) {
    const navigate = useNavigate();
    const [animationClass, setAnimationClass] = useState('slide-in-left');
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        setAnimationClass('slide-out-right');
    };

    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const handleAnimationEnd = () => {
            if (animationClass === 'slide-out-right') {
                navigate(navigateTo);
            }
        };

        overlay.addEventListener('animationend', handleAnimationEnd);
        return () => {
            overlay.removeEventListener('animationend', handleAnimationEnd);
        };
    }, [animationClass, navigate, navigateTo]);

    return { overlayRef, animationClass, handleClose };
}
