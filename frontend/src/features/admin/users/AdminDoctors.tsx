"use client";

import AdminUsers from "./components/AdminUsers";
import doctorsConfig from "./configs/doctorsConfig";

export default function AdminDoctors() {
    return (
        <AdminUsers config={doctorsConfig} />
    );
}