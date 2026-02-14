
import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AvatarProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src?: string | null;
    alt?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fallback?: string;
    className?: string; // Additional custom classes
}

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
};

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = 'Avatar',
    size = 'md',
    fallback = '/images/dummy-astrologer.jpg', // Default fallback
    className,
    ...props
}) => {
    const [imgSrc, setImgSrc] = React.useState<string>(src || fallback);

    React.useEffect(() => {
        setImgSrc(src || fallback);
    }, [src, fallback]);

    const handleError = () => {
        if (imgSrc !== fallback) {
            setImgSrc(fallback);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            onError={handleError}
            className={twMerge(
                clsx(
                    'rounded-full object-cover border border-gray-200 shadow-sm bg-gray-50',
                    sizeClasses[size],
                    className
                )
            )}
            {...props}
        />
    );
};
