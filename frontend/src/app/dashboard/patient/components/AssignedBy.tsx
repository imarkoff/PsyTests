"use client";

import {getUser} from "@/services/usersService";
import useSWR from "swr";
import TestValues from "@/components/Test/TestValues";

export default function AssignedBy({assignedBy}: {assignedBy: string}) {
    const {
        data: user
    } = useSWR("getUser/" + assignedBy, () => getUser(assignedBy));

    return user && (
        <TestValues title={"Назначив (-ла)"}>
            {user?.name} {user?.surname}
        </TestValues>
    );

}