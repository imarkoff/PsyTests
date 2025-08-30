import {Box, Chip, Skeleton, Typography} from "@mui/material";
import formatPhone from "@/utils/formatPhone";
import readableGender from "@/utils/getGenderFromEnum";
import DoctorPatient from "@/types/models/DoctorPatient";
import {DateTime} from "luxon";
import formatYears from "@/utils/formatYears";

export default function PatientHeaderInfo({doctorPatient}: {doctorPatient: DoctorPatient | undefined}) {
    const patient = doctorPatient?.patient;

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            textAlign: {xs: "center", sm: "left"},
            flexGrow: 1
        }}>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: {xs: "center", sm: "flex-start"},
                rowGap: 1,
                width: "100%"
            }}>
                {patient ? (
                    <Typography variant="h4" component="h2" fontWeight={600}>
                        {patient.surname} {patient.name} {patient.patronymic}
                    </Typography>
                ) : (
                    <Skeleton variant={"text"} sx={{ fontSize: "2.5rem", maxWidth: "500px" }} width={"100%"} />
                )}

                <Chip
                    color={doctorPatient?.is_active ? "success" : "default"}
                    label={doctorPatient && doctorPatient.is_active ? "На обліку" : "Виписаний (-а)"}
                    size={"small"}
                    sx={{ml: 1, fontWeight: 400}}
                />
            </Box>

            {patient ? (
                <Box>
                    <Typography color={"textSecondary"}>
                        Номер телефону: {formatPhone(patient.phone)}
                    </Typography>
                    <Typography color={"textSecondary"}>
                        Стать: {readableGender[patient.gender]}
                    </Typography>
                    <PatientBirthDate birth_date={patient.birth_date} />
                </Box>
            ) : (
                <Box sx={{ alignItems: { xs: "center", sm: "flex-start" }, display: "flex", flexDirection: "column"}}>
                    <Skeleton variant={"text"} width={250} />
                    <Skeleton variant={"text"} width={150} />
                    <Skeleton variant={"text"} width={300} />
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
);