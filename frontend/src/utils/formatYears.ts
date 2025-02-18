import {DateTime} from "luxon";
import calculateYears from "@/utils/calculateYears";

export default function formatYears(date: string | DateTime): string {
    const calculatedYears = calculateYears(date);
    let ending;

    switch (calculatedYears % 10) {
        case 1:
            ending = "рік";
            break;
        case 2: case 3: case 4:
            ending = "роки";
            break;
        default:
            ending = "років";
    }

    return `${calculatedYears} ${ending}`;
}