import VerdictChart from "@/features/tests/MMPITest/components/VerdictChart";
import {Box, Typography} from "@mui/material";
import VerdictRaw from "@/features/tests/MMPITest/components/VerdictRaw";
import MMPIResult from "@/features/tests/MMPITest/schemas/MMPIResult";
import ProfilesChips from "@/features/tests/MMPITest/components/ProfilesChips";
import ScaleVerdicts from "@/features/tests/MMPITest/components/ScaleVerdicts";

export default function ResultsContent({test}: {test: MMPIResult}) {
    const {
        scale_verdicts: scaleVerdicts,
        profile_types: profileTypes,
        profile_inclinations: profileInclinations
    } = test.verdict || {};

    return (
        <>
            <Box>
                <Typography variant={"body1"} fontWeight={500}>
                    Конвертовані результати
                </Typography>
                <VerdictChart converted={test.verdict?.converted} />
            </Box>
            <VerdictRaw raw={test.verdict?.raw} />
            <Box sx={{display: "grid", gap: 1}}>
                <ProfilesChips title={"Типи профілів:"} results={profileTypes} />
                <ProfilesChips title={"Нахил профілю:"} results={profileInclinations} />
            </Box>
            <ScaleVerdicts verdicts={scaleVerdicts} />
        </>
    );
}