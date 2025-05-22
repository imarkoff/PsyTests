"use client";

import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useState} from "react";
import {useRouter} from "next/navigation";
import { removePatient } from "@/lib/controllers/doctorPatientController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

export default function DeletePatientButton({ patientId }: { patientId: string | undefined }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onDelete = async () => {
        if (!patientId) return;
        await withSafeErrorHandling(removePatient)(patientId);
        router.push("/dashboard/doctor/patients");
    }

    return (
        <>
            <Button
                variant={"outlined"}
                color={"error"}
                onClick={handleOpen}
                disabled={!patientId}
            >
                Видалити пацієнта
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Видалення пацієнта
                </DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ви впевнені, що хочете видалити пацієнта?
                        Після цього ви більше не зможете переглядати його дані та присвоювати тести.
                        Також всі присвоєні вами тести будуть більше недоступні для пацієнта.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>
                        Залишити
                    </Button>
                    <Button onClick={onDelete} color={"error"}>
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}