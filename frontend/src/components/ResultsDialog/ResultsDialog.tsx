import TestResult from "@/schemas/TestResult";
import {Box, Button, Dialog, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useState} from "react";
import TestValues from "@/components/TestValues";
import {dateMed} from "@/utils/formatDate";
import DialogCloseButton from "@/components/DialogCloseButton";
import ExportButton from "@/components/ResultsDialog/ExportButton";
import Link from "next/link";
import testsConfig from "@/features/tests/config";

/**
 * Dialog for displaying test results
 * @param test - test result
 * @constructor
 */
export default function ResultsDialog({test}: {test: TestResult}) {
    const [open, setOpen] = useState(false);

    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);

    const testResultComponents = testsConfig[test.test.type]?.results;
    const Content = testResultComponents?.content;
    const Footer = testResultComponents?.footer;

    return (
        <>
            <Button onClick={onOpen}>Показати результати</Button>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth={"md"}
                fullWidth
                slotProps={{ paper: { elevation: 3, sx: { m: 1, width: "100%" } } }}
                scroll={"paper"}
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
                    <Typography component={"span"} variant={"h6"} sx={{
                        "&:hover": {
                            textDecoration: "underline",
                            cursor: "pointer"
                        }
                    }}>
                        <Link
                            href={`/dashboard/doctor/tests/${test.test.id}`}
                            target={"_blank"}
                            style={{textDecoration: "inherit", color: "inherit"}}
                        >
                            {test.test.name}
                        </Link>
                    </Typography>
                    <DialogCloseButton onClose={onClose} />
                </DialogTitle>

                <DialogContent sx={{display: "grid", gap: 2}}>
                    {Content && <Content test={test} />}
                    <Box sx={{display: "flex", gap: 1, alignItems: "end", flexWrap: "wrap"}}>
                        <Box>
                            {Footer && <Footer test={test} />}
                            <TestValues title={"Дата проходження"}>{dateMed(test.passed_at)}</TestValues>
                        </Box>
                        <Box sx={{display: "flex", gap: 1, justifyContent: "end", flexGrow: 1}}>
                            <ExportButton test={test} />
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}