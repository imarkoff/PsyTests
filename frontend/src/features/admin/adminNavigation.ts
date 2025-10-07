import {NavigationProps} from "@/features/dashboard/components/UserNavigation/components/NavigationItem";

const endpoint = "/dashboard/admin";

const adminNavigation: NavigationProps[] = [
    {
        href: `${endpoint}/doctors`,
        label: "Лікарі"
    },
    {
        href: `${endpoint}/patients`,
        label: "Пацієнти"
    },
    {
        href: `${endpoint}/tests`,
        label: "Тести"
    }
]

export default adminNavigation;