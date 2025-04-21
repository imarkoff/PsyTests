import {UserGender} from "@/schemas/User";

const readableGender: Record<UserGender, string> = {
    "male": "Чоловік",
    "female": "Жінка",
}

export default readableGender;