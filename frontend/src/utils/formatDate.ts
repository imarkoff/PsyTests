import {DateTime} from "luxon";

// 23 січ. 2025 р., 22:13
export const dateMed = (date: string) =>
    DateTime.fromISO(date).setLocale("uk").toLocaleString(DateTime.DATETIME_MED)