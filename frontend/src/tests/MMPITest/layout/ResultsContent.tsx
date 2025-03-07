import VerdictChart from "@/tests/MMPITest/components/VerdictChart";
import {Box, Typography} from "@mui/material";
import VerdictRaw from "@/tests/MMPITest/components/VerdictRaw";
import MMPIResult from "@/tests/MMPITest/schemas/MMPIResult";

export default function ResultsContent({test}: {test: MMPIResult}) {
    return (
        <>
            <Box>
                <Typography variant={"body1"} fontWeight={500}>
                    Конвертовані результати
                </Typography>
                <VerdictChart converted={test.verdict?.converted} />
            </Box>
            <VerdictRaw raw={test.verdict?.raw} />
        </>
    );
}