"use client";

import useSWR from "swr";
import TestValues from "@/components/Test/TestValues";
import {getUser} from "@/lib/controllers/userController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

export default function AssignedBy({assignedBy}: {assignedBy: string}) {
    const {
        data: user
    } = useSWR("getUser/" + assignedBy, withSafeErrorHandling(() => getUser(assignedBy)));

    return user && (
        <TestValues title={"Назначив (-ла)"}>
            {user?.name} {user?.surname}
        </TestValues>
    );

}