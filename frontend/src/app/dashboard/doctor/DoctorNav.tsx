import NavItem from "@/app/dashboard/components/NavItem";

const endpoint = "/dashboard/doctor";

export default function DoctorNav() {
    return (
        <>
            <NavItem label={"Пацієнти"} href={endpoint} strict />
            <NavItem label={"Тести"} href={`${endpoint}/tests`} />
        </>
    );
}