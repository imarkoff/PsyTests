import {Box, Chip, Typography} from "@mui/material";
import formatPhone from "@/utils/formatPhone";
import DoctorPatient from "@/schemas/DoctorPatient";
import {DateTime} from "luxon";
import formatYears from "@/utils/formatYears";
import {ReactNode} from "react";

export default function PatientHeader(
    {patient, actions}: {patient?: DoctorPatient, actions?: ReactNode}
) {
    const {surname, name, patronymic, phone, birth_date} = patient?.patient || {};

    return (
        <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: {xs: "flex-start", sm: "center"},
            flexDirection: {xs: "column", sm: "row"},
            columnGap: 2,
            rowGap: 1,
            borderBottom: 1,
            borderColor: "divider",
            pb: 6,
        }}>
            <Box>
                <Typography id="modal-title" variant="h4" component="h2" fontWeight={600}>
                    {surname} {name} {patronymic}

                    <Chip
                        color={patient?.is_active ? "success" : "default"}
                        label={patient && patient.is_active ? "На обліку" : "Виписаний (-а)"}
                        size={"small"}
                        sx={{ml: 1, fontWeight: 400}}
                    />
                </Typography>

                <Typography color={"textSecondary"}>
                    Номер телефону: {phone && formatPhone(phone)}
                </Typography>
                {birth_date && <PatientBirthDate birth_date={birth_date} />}
            </Box>

            {actions && (
                <Box sx={{display: "flex", gap: 1, flexWrap: "wrap", ml: {sm: "auto"}}}>
                    {actions}
                </Box>
            )}
        </Box>
    );
}

const PatientBirthDate = ({birth_date}: {birth_date: string}) => (
    <Typography color={"textSecondary"}>
        Дата народження: {DateTime.fromISO(birth_date).toFormat("dd.MM.yyyy")}
        <Typography component={"span"} sx={{pl: 0.75}}>- {formatYears(birth_date)}</Typography>
    </Typography>
)