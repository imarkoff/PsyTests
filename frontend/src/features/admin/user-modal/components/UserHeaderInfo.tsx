import {Box, Skeleton, Typography} from "@mui/material";
import formatPhone from "@/utils/formatPhone";
import readableGender from "@/utils/getGenderFromEnum";
import {DateTime} from "luxon";
import formatYears from "@/utils/formatYears";
import User from "@/types/models/User";
import dayjs from "dayjs";

interface UserHeaderInfoProps {
    user: User | null;
}

export default function UserHeaderInfo({user}: UserHeaderInfoProps) {
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
                {user ? (
                    <Typography variant="h4" component="h2" fontWeight={600}>
                        {user.surname} {user.name} {user.patronymic}
                    </Typography>
                ) : (
                    <Skeleton variant={"text"} sx={{ fontSize: "2.5rem", maxWidth: "500px" }} width={"100%"} />
                )}
            </Box>

            {user ? (
                <Box>
                    <Typography color={"textSecondary"}>
                        Номер телефону: {formatPhone(user.phone)}
                    </Typography>
                    <Typography color={"textSecondary"}>
                        Стать: {readableGender[user.gender]}
                    </Typography>
                    <UserBirthDate birth_date={user.birth_date} />
                    <Typography color={"textSecondary"}>
                        Останній вхід: {user.last_login ? dayjs(user.last_login).format("DD.MM.YYYY hh:mm") : "Ніколи"}
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

const UserBirthDate = ({birth_date}: {birth_date: string}) => (
    <Typography color={"textSecondary"}>
        Дата народження: {DateTime.fromISO(birth_date).toFormat("dd.MM.yyyy")}
        <Typography component={"span"} sx={{pl: 0.75}}>- {formatYears(birth_date)}</Typography>
    </Typography>
);