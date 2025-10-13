import VerdictChart from "@/features/shared/psy-test-definitions/MMPITest/components/VerdictChart";
import {Box, Typography} from "@mui/material";
import VerdictRaw from "@/features/shared/psy-test-definitions/MMPITest/components/VerdictRaw";
import MMPIResult from "@/features/shared/psy-test-definitions/MMPITest/schemas/MMPIResult";
import ProfilesChips from "@/features/shared/psy-test-definitions/MMPITest/components/ProfilesChips";
import ScaleVerdicts from "@/features/shared/psy-test-definitions/MMPITest/components/ScaleVerdicts";

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