import TestBase from "@/types/models/TestBase";
import {DialogTitle, Typography} from "@mui/material";
import Link from "next/link";
import DialogCloseButton from "@/components/DialogCloseButton";

export default function ResultsTitle({ test, onClose }: { test: TestBase, onClose: () => void }) {
    return (
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
            <Typography component={"span"} variant={"h6"} sx={{
                "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer"
                }
            }}>
                <Link
                    href={`/dashboard/doctor/tests/${test.id}`}
                    target={"_blank"}
                    style={{textDecoration: "inherit", color: "inherit"}}
                >
                    {test.name}
                </Link>
            </Typography>
            <DialogCloseButton onClose={onClose} />
        </DialogTitle>
    );
}