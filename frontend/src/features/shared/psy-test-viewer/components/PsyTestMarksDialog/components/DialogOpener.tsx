"use client";

import {Button, Skeleton} from "@mui/material";
import StarHalfIcon from '@mui/icons-material/StarHalf';
import usePsyTestContext from "@/features/shared/psy-test-viewer/hooks/usePsyTestContext";

interface DialogOpenerProps {
    onClick: () => void;
}

export default function DialogOpener(
    {onClick}: DialogOpenerProps
) {
    const {test, isLoading, hasMarksSystem} = usePsyTestContext();

    return (
        <>
            {test && hasMarksSystem && (
                <Button
                    startIcon={<StarHalfIcon/>}
                    onClick={onClick}
                >
                    Система оцінювання
                </Button>
            )}
            {isLoading && (
                <Skeleton width={150} variant={"text"}/>
            )}
        </>
    );
}