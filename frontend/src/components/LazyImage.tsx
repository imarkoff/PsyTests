import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type LazyImageProps = {
    src: string;
    alt: string;
    height: number;
    width: number;
    style?: React.CSSProperties;
};

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, height, width, style }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const currentImg = imgRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (currentImg) {
                observer.unobserve(currentImg);
            }
        };
    }, []);

    return isVisible
        ? (
            <Image
                loader={({src, width, quality}) => `${src}&w=${width}&q=${quality || 75}`}
                src={src}
                alt={alt}
                width={width}
                height={height}
                style={style}
            />
        )
        : <div ref={imgRef} style={{ height }} />;
};

export default LazyImage;