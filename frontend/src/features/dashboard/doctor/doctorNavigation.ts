import {NavigationProps} from "@/features/dashboard/components/UserNavigation/components/NavigationItem";

const endpoint = "/dashboard/doctor";

const doctorNavigation: NavigationProps[] = [
    {
        href: `${endpoint}/patients`,
        label: "Пацієнти"
    },
    {
        href: `${endpoint}/tests`,
        label: "Тести"
    }
]

export default doctorNavigation;