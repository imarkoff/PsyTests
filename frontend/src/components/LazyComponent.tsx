"use client";

import {IntersectionOptions, useInView} from "react-intersection-observer";
import React, {ReactNode} from "react";
import {Property} from "csstype";

interface LazyComponentProps {
    height: Property.Height;
    children: ReactNode;
    IntersectionOptions?: IntersectionOptions;
}

/**
 * Lazy loads the children when they are in view.
 * @param height - height of the placeholder
 * @param children - the children to render
 * @param IntersectionOptions - options for the IntersectionObserver
 * @constructor
 */
export default function LazyComponent({ height, children, IntersectionOptions }: LazyComponentProps) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
        ...IntersectionOptions,
    });

    return (
        <div ref={ref} style={{overflow: "visible"}}>
            {inView ? children : <div style={{height: height}}/>}
        </div>
    );
}