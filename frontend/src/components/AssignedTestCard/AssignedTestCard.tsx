import PatientTest from "@/types/models/PatientTest";
import {Card, CardContent, CardHeader, Typography} from "@mui/material";
import AssignedBy from "@/features/dashboard/patient/components/AssignedBy";
import {dateMed} from "@/utils/formatDate";
import TestValues from "@/components/TestValues";
import AssignedTestCardActions from "@/components/AssignedTestCard/AssignedTestCardActions";

interface AvailableTestCardProps {
    test: PatientTest;
    onStart?: () => void;
    onDelete?: (testId: string) => void;
}

/**
 * Card for assigned test. Used on doctor and patient dashboards.
 * @param test
 * @param onStart - function to start test
 * @param onDelete - function to delete test
 * @constructor
 */
export default function AssignedTestCard({test, onStart, onDelete}: AvailableTestCardProps) {
    return (
        <Card variant={"outlined"} sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
        }}>
            <CardHeader title={test.test.name} />

            <CardContent sx={{paddingTop: 0, paddingBottom: 0}}>
                <Typography>{test.test.description}</Typography>
                <AssignedBy assignedBy={test.assigned_by_id} />
                <TestValues title={"Дата назначення"}>{dateMed(test.assigned_at)}</TestValues>
            </CardContent>

            <AssignedTestCardActions
                onDelete={onDelete ? () => onDelete(test.id) : undefined}
                onStart={onStart}
            />
        </Card>
    );
}
