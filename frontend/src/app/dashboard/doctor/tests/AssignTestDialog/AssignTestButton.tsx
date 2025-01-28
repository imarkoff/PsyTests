import {Button} from "@mui/material";
import {useState} from "react";
import AssignTestDialog from "@/app/dashboard/doctor/tests/AssignTestDialog/AssignTestDialog";

export default function AssignTestButton({testId}: {testId: string}) {
    const [open, setOpen] = useState(false);
    const onOpen = () => setOpen(true);

    return (
        <>
            <Button variant={"contained"} onClick={onOpen}>
                Назначити тест
            </Button>
            <AssignTestDialog testId={testId} open={open} setOpenAction={setOpen} />
        </>
    );

}