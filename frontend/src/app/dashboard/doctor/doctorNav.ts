import {NavProps} from "@/features/dashboard/components/UserNavigation/components/NavItem";

const endpoint = "/dashboard/doctor";

const doctorNav: NavProps[] = [
    {
        href: `${endpoint}/patients`,
        label: "Пацієнти"
    },
    {
        href: `${endpoint}/tests`,
        label: "Тести"
    }
]

export default doctorNav;