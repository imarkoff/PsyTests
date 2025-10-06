import {Role} from "@/types/enums/Role";
import {DELETE_USER_TEXT} from "../constants";
import {DeleteUserText} from "../types";

export default function getDialogText(role: Role | undefined): DeleteUserText {
    if (!role) {
        return DELETE_USER_TEXT._;
    }
    
    return DELETE_USER_TEXT[role] || DELETE_USER_TEXT._;
}