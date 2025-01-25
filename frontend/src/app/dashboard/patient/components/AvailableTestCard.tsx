import PatientTest from "@/schemas/PatientTest";
import {Button, Card, CardActions, CardContent, CardHeader, Typography} from "@mui/material";
import Marks from "@/components/Test/Marks";
import AssignedBy from "@/app/dashboard/patient/components/AssignedBy";
import {dateMed} from "@/utils/formatDate";
import TestValues from "@/components/Test/TestValues";
import {redirect} from "next/navigation";

export default function AvailableTestCard({test}: {test: PatientTest}) {
    const questionsCount = test.test.questions.length;

    const onStartTest = () => {
        redirect(`/dashboard/patient/tests/${test.id}`);
    }

    return (
        <Card variant={"outlined"}>
            <CardHeader title={test.test.name} />

            <CardContent sx={{paddingTop: 0, paddingBottom: 0}}>
                <Typography>{test.test.description}</Typography>
                <TestValues title={"Кількість запитань"}>{questionsCount}</TestValues>
                <AssignedBy assignedBy={test.assigned_by_id} />
                <TestValues title={"Дата назначення"}>{dateMed(test.assigned_at)}</TestValues>
            </CardContent>

            <CardActions sx={{justifyContent: "space-between"}}>
                <Marks marks={test.test.marks} />
                <Button variant="contained" color="primary" onClick={onStartTest}>
                    Почати тест
                </Button>
            </CardActions>
        </Card>
    );
}