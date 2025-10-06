"use client";

import {Box, BoxProps, Typography, TypographyProps} from "@mui/material";
import {ReactNode} from "react";
import DialogCloseButton from "@/components/DialogCloseButton";
import useActionDialogContext from "../hooks/useActionDialogContext";

interface ActionDialogHeaderProps extends BoxProps {
    header: ReactNode;
    subheader?: ReactNode;
    hasCloseButton?: boolean;
    slotProps?: {
        titleBox: BoxProps,
        header: TypographyProps,
        subheader: TypographyProps
    }
}

export default function ActionDialogHeader(
    {header, subheader, hasCloseButton, slotProps, ...props}: ActionDialogHeaderProps
) {
    const { onClose } = useActionDialogContext();

    return (
        <Box
            component={"div"}
            {...props}
            sx={{
                ...props.sx,
                display: "flex",
                alignItems: "center",
                px: "24px",
                py: "16px",
                gap: 3
            }}
        >
            <Box {...slotProps?.titleBox}>
                <Typography
                    component={"h2"}
                    variant={"h6"}
                    {...slotProps?.header}
                >
                    {header}
                </Typography>
                {subheader && (
                    <Typography
                        variant="body2"
                        sx={{color: "text.secondary"}}
                        {...slotProps?.subheader}
                    >
                        {subheader}
                    </Typography>
                )}
            </Box>
            {hasCloseButton && (
                <DialogCloseButton onClose={onClose} />
            )}
        </Box>
    );
}