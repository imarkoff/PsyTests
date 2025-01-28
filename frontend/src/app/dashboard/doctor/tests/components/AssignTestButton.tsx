import {Button} from "@mui/material";

export default function AssignTestButton({testId}: {testId: string}) {
    return (
        <Button variant={"contained"}>
            Назначити тест
        </Button>
    );

}