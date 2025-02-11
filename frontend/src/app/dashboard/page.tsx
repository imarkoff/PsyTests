"use client";

import { useUser } from "./context/UserContext";
import {useEffect} from "react";

export default function Dashboard() {
    const {checkPath} = useUser();

    useEffect(() => {
        checkPath();
    }, [checkPath]);
}