import {Button, MenuItem} from "@mui/material";
import useNavigate from "@/features/dashboard/components/UserNavigation/hooks/useNavigate";

export interface NavigationProps {
    label: string;
    href: string;
    strict?: boolean;
}

export default function NavigationItem({label, href, strict}: NavigationProps) {
    const {isActive, onClick} = useNavigate(href, strict);

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

export const MenuNavigation = ({label, href, strict}: NavigationProps) => {
    const {isActive, onClick} = useNavigate(href, strict);

    return (
        <MenuItem onClick={onClick} selected={isActive}>
            {label}
        </MenuItem>
    );
}