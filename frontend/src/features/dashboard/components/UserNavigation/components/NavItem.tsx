import {Button, MenuItem} from "@mui/material";
import useNav from "@/features/dashboard/components/UserNavigation/hooks/useNav";

export interface NavProps {
    label: string;
    href: string;
    strict?: boolean;
}

export default function NavItem({label, href, strict}: NavProps) {
    const {isActive, onClick} = useNav(href, strict);

    return (
        <Button onClick={onClick} sx={{
            borderRadius: 0,
            paddingX: 2,
            fontSize: "1rem",
            height: "100%",
            boxSizing: "border-box",
            color: isActive ? "main.primary" : "text.primary",
            borderBottom: 2,
            borderColor: isActive ? "main.primary" : "transparent",
        }}>
            {label}
        </Button>
    );
}

export const MenuNav = ({label, href, strict}: NavProps) => {
    const {isActive, onClick} = useNav(href, strict);

    return (
        <MenuItem onClick={onClick} selected={isActive}>
            {label}
        </MenuItem>
    );
}