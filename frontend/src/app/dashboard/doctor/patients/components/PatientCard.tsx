import User from "@/schemas/User";
import {Button, Card, CardContent, CardHeader} from "@mui/material";
import formatPhone from "@/utils/formatPhone";
import {useRouter} from "next/navigation";

export default function PatientCard({patient}: {patient: User}) {
    const router = useRouter();
    const onClick = () =>
        router.push(`${window.location.pathname}/${patient.id}`);

    return (
        <Card variant={"outlined"} sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <CardHeader
                title={`${patient.name} ${patient.surname || ""}`}
                subheader={formatPhone(patient.phone)}
            />
            <CardContent sx={{paddingY: "0 !important"}}>
                <Button size={"small"} onClick={onClick}>Детальніше</Button>
            </CardContent>
        </Card>
    );
}