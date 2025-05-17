"use client";

import useSWR from "swr";
import TestValues from "@/components/Test/TestValues";
import {getUser} from "@/lib/controllers/userController";
import SafeError from "@/lib/api-client/SafeError";

const fetchUser = async (userId: string) => {
    const {data, error} = await getUser(userId);
    if (error) throw SafeError.fromJSON(error.originalError);
    return data;
}

export default function AssignedBy({assignedBy}: {assignedBy: string}) {
    const {
        data: user
    } = useSWR("getUser/" + assignedBy, () => fetchUser(assignedBy));

    return user && (
        <TestValues title={"Назначив (-ла)"}>
            {user?.name} {user?.surname}
        </TestValues>
    );

}