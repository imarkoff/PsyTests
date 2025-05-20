"use client";

import {usePathname, useRouter} from "next/navigation";

export default function useNavigate(href: string, strict?: boolean) {
    const pathname = usePathname();
    const isActive = strict
        ? pathname === href
        : pathname.startsWith(href);
    const router = useRouter();

    const onClick = () => router.push(href);

    return {isActive, onClick};
}