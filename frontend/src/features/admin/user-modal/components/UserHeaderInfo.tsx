"use client";

import {Box, Skeleton, Typography, Tooltip, Stack, Divider} from "@mui/material";
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import HistoryIcon from '@mui/icons-material/History';
import formatPhone from "@/utils/formatPhone";
import {DateTime} from "luxon";
import formatYears from "@/utils/formatYears";
import dayjs from "dayjs";
import useUserContext from "../hooks/useUserContext";
import UserGenderIcon from "@/components/UserGenderIcon";

export default function UserHeaderInfo() {
    const { user } = useUserContext();

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
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "flex-start",
                textAlign: "start",
                columnGap: 1.5,
                width: "100%"
            }}>
                {user ? (
                    <>
                        <Typography variant="h4" component="h2" fontWeight={600}>
                            {user.surname} {user.name} {user.patronymic}
                        </Typography>
                        <UserGenderIcon gender={user.gender} />
                    </>
                ) : (
                    <Skeleton variant={"text"} sx={{ fontSize: "2.5rem", maxWidth: "500px" }} width={"100%"} />
                )}
            </Box>

            {user ? (
                <Stack
                    direction={"row"}
                    flexWrap={"wrap"}
                    columnGap={1.5}
                    rowGap={0.5}
                    divider={<Divider orientation="vertical" flexItem />}
                >
                    <Tooltip title={"Номер телефону"}>
                        <Typography color={"textSecondary"} sx={{display: "inline-flex", gap: 1}}>
                            <PhoneIcon fontSize={"small"} />
                            {formatPhone(user.phone)}
                        </Typography>
                    </Tooltip>
                    <UserBirthDate birth_date={user.birth_date} />
                    <Tooltip title={"Останній вхід"}>
                        <Typography color={"textSecondary"} sx={{display: "inline-flex", gap: 1}}>
                            <HistoryIcon fontSize={"small"} />
                            {user.last_login
                                ? dayjs(user.last_login).format("DD.MM.YYYY hh:mm")
                                : "Ніколи"
                            }
                        </Typography>
                    </Tooltip>
                </Stack>
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
    <Tooltip title={"Дата народження"}>
        <Typography color={"textSecondary"} sx={{display: "inline-flex", gap: 1}}>
            <CakeIcon fontSize={"small"} />
            {DateTime.fromISO(birth_date).toFormat("dd.MM.yyyy")} – {formatYears(birth_date)}
        </Typography>
    </Tooltip>
);