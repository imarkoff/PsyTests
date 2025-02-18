import User from "@/schemas/User";
import {Card, CardActionArea, CardActions, CardHeader, Theme} from "@mui/material";
import formatPhone from "@/utils/formatPhone";
import DoctorPatient from "@/schemas/DoctorPatient";
import {ReactNode} from "react";

interface PatientCardProps {
    patient: DoctorPatient;
    footer?: ReactNode;
    onClick?: (patient: DoctorPatient) => void;
    selected?: boolean;
}

/**
 * Patient card component. Used in doctor's interface.
 * @param patient
 * @param onDetails - callback to handle details button click
 * @param footer - additional content to display in the card
 * @param selected - whether the patient is selected
 * @constructor
 */
export default function PatientCard({patient, footer, onClick, selected}: PatientCardProps) {
    const cardSelectedSx = (theme: Theme) => ({
        boxShadow: "0 0 0 2px " + theme.palette.primary.main,
    });

    return (
        <Card
            variant={"outlined"}
            sx={(theme) =>({
                ...(selected ? cardSelectedSx(theme) : {}),
            })}
        >
            {onClick
                ? (
                    <CardActionArea
                        onClick={() => onClick(patient)}
                    >
                        <PatientContent patient={patient.patient} />
                    </CardActionArea>
                )
                : <PatientContent patient={patient.patient} footer={footer} />
            }
        </Card>
    );
}

const PatientContent = (
    {patient, footer}: {patient: User, footer?: ReactNode}
) => (
    <>
        <CardHeader
            title={`${patient.surname || ""} ${patient.name} ${patient.patronymic || ""}`}
            subheader={formatPhone(patient.phone)}
            slotProps={{ title: { variant: "h6" } }}
        />

        {footer && (
            <CardActions sx={{pt: 0}}>
                {footer}
            </CardActions>
        )}
    </>
);