import {Box, Chip, Skeleton, Typography} from "@mui/material";
import formatPhone from "@/utils/formatPhone";
import readableGender from "@/utils/getGenderFromEnum";
import DoctorPatient from "@/types/models/DoctorPatient";
import {DateTime} from "luxon";
import formatYears from "@/utils/formatYears";
import dayjs from "dayjs";

export default function PatientHeaderInfo({doctorPatient}: {doctorPatient: DoctorPatient | undefined}) {
    const patient = doctorPatient?.patient;
    const isActive = doctorPatient?.unassigned_at === null;

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
                    color={isActive ? "success" : "default"}
                    label={isActive ? "На обліку" : "Виписаний (-а)"}
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
                    <Typography color={"textSecondary"}>
                        Останній вхід: {patient.last_login ? dayjs(patient.last_login).format("DD.MM.YYYY hh:mm") : "Ніколи"}
                    </Typography>
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