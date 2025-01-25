import TestsLayout from "@/app/dashboard/patient/layout/TestsLayout";
import TestsHistoryLayout from "@/app/dashboard/patient/layout/TestsHistoryLayout";

export default function ClientPage() {
    return (
        <>
            <TestsLayout />
            <TestsHistoryLayout />
        </>
    );
}