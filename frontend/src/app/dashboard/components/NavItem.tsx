import {Button} from "@mui/material";
import {useRouter, usePathname} from "next/navigation";

export default function NavItem({label, href, strict}: {label: string, href: string, strict?: boolean}) {
    const pathname = usePathname();
    const isActive = strict
        ? pathname === href
        : pathname.startsWith(href);
    const {push} = useRouter();

    const onClick = () => push(href);

    return (
        <Button onClick={onClick} variant={isActive ? "contained" : "text"}>
            {label}
        </Button>
    );
}