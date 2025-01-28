import User from "@/schemas/User";
import {Button, Card, CardActionArea, CardContent, CardHeader} from "@mui/material";
import formatPhone from "@/utils/formatPhone";

interface PatientCardProps {
    patient: User;
    onDetails?: (patient: User) => void;
    onChoose?: (patient: User) => void;
    selected?: boolean;
}

/**
 * Patient card component. Used in doctor's interface.
 * @param patient
 * @param onDetails - callback to handle details button click
 * @param onChoose - callback to handle choose button click
 * @param selected - whether the patient is selected
 * @constructor
 */
export default function PatientCard({patient, onDetails, onChoose, selected}: PatientCardProps) {
    const cardSx = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };

    const cardSelectedSx = {
        borderWidth: 2,
        borderColor: "primary.main",
    }

    return (
        <Card
            variant={"outlined"}
            sx={{
                ...(onChoose ? {} : cardSx),
                ...(selected ? cardSelectedSx : {}),
            }}
        >
            {onChoose
                ? (
                    <CardActionArea
                        onClick={() => onChoose(patient)}
                        sx={cardSx}
                    >
                        <PatientContent patient={patient} />
                    </CardActionArea>
                )
                : <PatientContent patient={patient} onDetails={onDetails} />
            }
        </Card>
    );
}

const PatientContent = (
    {patient, onDetails}: {patient: User, onDetails?: (patient: User) => void}
) => (
    <>
        <CardHeader
            title={`${patient.name} ${patient.surname || ""}`}
            subheader={formatPhone(patient.phone)}
        />

        {onDetails && (
            <CardContent sx={{paddingY: "0 !important"}}>
                <Button size={"small"} onClick={() => onDetails(patient)}>
                    Детальніше
                </Button>
            </CardContent>
        )}
    </>
);