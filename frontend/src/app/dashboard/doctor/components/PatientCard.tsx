import User from "@/schemas/User";
import {Button, Card, CardContent, CardHeader} from "@mui/material";
import formatPhone from "@/utils/formatPhone";

export default function PatientCard({patient}: {patient: User}) {
    return (
        <Card variant={"outlined"} sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <CardHeader
                title={`${patient.name} ${patient.surname || ""}`}
                subheader={formatPhone(patient.phone)}
            />
            <CardContent sx={{paddingY: "0 !important"}}>
                <Button size={"small"}>Детальніше</Button>
            </CardContent>
        </Card>
    );
}