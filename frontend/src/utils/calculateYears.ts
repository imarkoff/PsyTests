import {DateTime} from "luxon";

export default function calculateYears(date: string | DateTime): number {
    const birthDate = typeof date === "string" ? DateTime.fromISO(date) : date;

    const years = DateTime.now().diff(birthDate, "years").years;

    return Number((years - (years % 0.1)).toFixed(1));
}