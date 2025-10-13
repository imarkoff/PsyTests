import {ComponentType} from "react";
import {Roles} from "@/types/enums/Role";
import useUserContext from "../hooks/useUserContext";
import {UserModalContentProps} from "./types";
import DoctorContent from "./DoctorContent";

export default function UserModalContent() {
    const { user } = useUserContext();

    if (!user) return;

    const contentByRole: Partial<
        Record<Roles, ComponentType<UserModalContentProps>>
    > = {
        [Roles.doctor]: DoctorContent,
    };

    const ContentComponent = contentByRole[user.role];

    return ContentComponent ? <ContentComponent user={user} /> : null;
}