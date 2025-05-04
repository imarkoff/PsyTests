"use client";

import {
    Card, CardActions,
    CardContent,
} from "@mui/material";
import React, {ReactNode} from "react";
import LazyComponent from "@/components/LazyComponent";
import QuestionCardContextProvider from "@/components/QuestionCard/context/QuestionCardContextProvider";
import {useQuestionCardContext} from "@/components/QuestionCard/context/QuestionCardContext";

interface CardLayoutProps {
    header: ReactNode;
    image?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
}

interface QuestionCardProps extends CardLayoutProps {
    index: number;
    moduleName?: string;
}

/**
 * Renders a question card with a header, image, and footer.
 * Creates a context for the question card.
 * Has lazy loading functionality for the content.
 * @param header
 * @param index - index of the question in the test
 * @param moduleName - name of the module where the question belongs
 * @param image - image to be displayed in the card
 * @param children - content of the card
 * @param footer
 * @constructor
 */
export default function QuestionCardBase(
    {header, index, moduleName, image, children, footer}: QuestionCardProps
) {
    return (
        <QuestionCardContextProvider index={index} moduleName={moduleName}>
            <BaseContent header={header} image={image} footer={footer}>
                {children}
            </BaseContent>
        </QuestionCardContextProvider>
    );
}

const BaseContent = (
    {header, image, children, footer}: CardLayoutProps
) => {
    const { register, error } = useQuestionCardContext();

    return (
        <LazyComponent
            height={"400px"}
            visibleChildren={<input type="hidden" {...register?.()} />}
        >
            <Card variant={"outlined"} sx={{
                borderColor: error ? "error.main" : undefined,
                borderWidth: error ? "2px" : undefined,
                overflow: "visible",
                width: "100%"
            }}>
                {header}

                {image}

                <CardContent>{children}</CardContent>

                {footer && (
                    <CardActions>{footer}</CardActions>
                )}
            </Card>
        </LazyComponent>
    );
}