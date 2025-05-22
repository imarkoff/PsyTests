"use client";

import useSWR from "swr";
import TestValues from "@/components/TestValues";
import {getUser} from "@/lib/controllers/userController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import { Skeleton } from "@mui/material";

export default function AssignedBy({assignedBy}: {assignedBy: string}) {
    const { data: user } = useSWR(
        ["getUser", assignedBy],
        ([, id]) => withSafeErrorHandling(getUser)(id)
    );

    return user ? (
        <TestValues title={"Назначив (-ла)"}>
            {user?.name} {user?.surname}
        </TestValues>
    ) : (
        <Skeleton variant={"text"} width={"70%"} />
    );
}