import {Chip, Skeleton} from "@mui/material";
import {UserRenderMode} from "./types";
import useGetUserByIdApi from "./hooks/lib/useGetUserByIdApi";
import formatUser from "./utils/formatUser";

interface UserCredentialsChipProps {
    userId: string;
    format?: UserRenderMode;
}

export default function UserCredentialsChip(
    {userId, format="full"}: UserCredentialsChipProps
) {
    const {
        user,
        isLoading,
        error
    } = useGetUserByIdApi(userId);

    if (user) return (
        <Chip label={formatUser(user, format)} variant={"outlined"} />
    );

    if (isLoading) return (
        <Chip label={<Skeleton width={150} />} variant={"outlined"} />
    );

    if (error) return (
        <Chip label={"Виникла помилка"} color={"error"} variant={"outlined"} />
    );
}