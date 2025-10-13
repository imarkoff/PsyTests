import BDIResult from "@/features/shared/psy-test-definitions/BDITest/types/BDIResult";
import { Typography } from "@mui/material";

export default function BDIResultsContent({test}: { test: BDIResult }) {
    const {total_score, verdict} = test.verdict || {};

    return (
        <>
            {total_score && (
                <Typography>
                    <strong>Загальна кількість балів:</strong> {total_score}
                </Typography>
            )}
            {verdict && (
                <Typography>
                    <strong>Висновок:</strong> {verdict}
                </Typography>
            )}
        </>
    );
}