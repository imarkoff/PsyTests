"use client";

import AdminUsers from "./components/AdminUsers";
import patientsConfig from "./configs/patientsConfig";

export default function AdminPatients() {
    return (
        <AdminUsers config={patientsConfig} />
    );
}