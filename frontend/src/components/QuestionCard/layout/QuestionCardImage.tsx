import Image from "next/image";
import { CardMedia } from "@mui/material";
import React from "react";
import nextImageLoader from "@/utils/nextImageLoader";

interface QuestionCardImageProps {
    src: string;
    alt: string;
    /* default width of the image placeholder */
    width?: number;
    /* default height of the image placeholder */
    height?: number;
}

/**
 * Displays LazyImage stylized for QuestionCard
 * @see QuestionCardBase
 * @constructor
 */
export default function QuestionCardImage(
    {src, alt, width = 600, height = 250}: QuestionCardImageProps
) {
    return (
        <CardMedia>
            <Image
                loader={nextImageLoader}
                src={src}
                alt={alt}
                width={width}
                height={height}
                style={{pointerEvents: "none", height: "auto", width: "100%"}}
            />
        </CardMedia>
    );
}