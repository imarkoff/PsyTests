import LazyImage from "@/components/LazyImage";
import { CardMedia } from "@mui/material";
import React from "react";

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
            <LazyImage
                src={src}
                alt={alt}
                width={width}
                height={height}
                style={{pointerEvents: "none", height: "auto", width: "100%"}}
            />
        </CardMedia>
    );
}