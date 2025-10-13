import User from "@/types/models/User";
import {Card, CardActionArea, CardHeader, Theme} from "@mui/material";
import formatPhone from "@/utils/formatPhone";
import {ReactNode} from "react";
import NeedsAttentionChip from "@/components/NeedsAttentionChip";

export interface PatientCardProps {
    patient: User;
    footer?: ReactNode;
    needsAttention?: boolean;
    onClick?: (patient: User) => void;
    selected?: boolean;
}

/**
 * Patient card component. Used in doctor's interface.
 * @param patient
 * @param needsAttention - whether the patient needs attention
 * @param onClick - callback to handle card click
 * @param footer - additional content to display in the card
 * @param selected - whether the patient is selected
 */
export default function PatientCard(
    {patient, footer, needsAttention, onClick, selected}: PatientCardProps
) {
    const cardSelectedSx = (theme: Theme) => ({
        boxShadow: "0 0 0 2px " + theme.palette.primary.main,
    });

    return (
        <Card
            variant={"outlined"}
            data-testid="patient-card"
            aria-selected={selected}
            sx={(theme) =>({
                ...(selected ? cardSelectedSx(theme) : {}),
                position: "relative",
                overflow: "visible"
            })}
        >
            {onClick
                ? (
                    <CardActionArea
                        onClick={() => onClick(patient)}
                    >
                        <PatientContent patient={patient} footer={footer} />
                    </CardActionArea>
                )
                : <PatientContent patient={patient} footer={footer} />
            }
            {needsAttention && (
                <NeedsAttentionChip
                    sx={{position: "absolute", top: 0, right: 12, transform: "translateY(-50%)"}}
                />
            )}
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
            slotProps={{ title: { variant: "h6", sx: { lineHeight: 1.25 } } }}
        />
        {footer}
    </>
);