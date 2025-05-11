"use client";

import {CardHeader} from "@mui/material";
import React from "react";
import {useQuestionCardContext} from "@/components/QuestionCard/context/QuestionCardContext";

export default function QuestionCardHeader({title}: {title?: string}) {
    const {moduleName, index, error} = useQuestionCardContext();

    return (
        <CardHeader
            title={`${moduleName ?? ""} ${index+1}. ${title ?? ""}`}
            subheader={error ? "Оберіть відповідь" : undefined}
            slotProps={{
                subheader: {
                    sx: { color: "error", variant: "caption" }
                }
            }}
        />
    );
}