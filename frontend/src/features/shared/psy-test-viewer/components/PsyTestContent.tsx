"use client";

import {PsyTestComponentProps} from "@/features/shared/psy-test-viewer/types";
import usePsyTestContext from "@/features/shared/psy-test-viewer/hooks/usePsyTestContext";
import QuestionCardSkeleton from "@/components/QuestionCard/QuestionCardSkeleton";

export default function PsyTestContent(
    {disabled} : PsyTestComponentProps
) {
    const {
        test, userRole,
        layouts: { content: Content }
    } = usePsyTestContext();

    return (!!test && !!Content) ? (
        <Content test={test} role={userRole} disabled={disabled} />
    ) : (
        Array.from({ length: 3 }).map((_, index) => (
            <QuestionCardSkeleton key={index} />
        ))
    );
}