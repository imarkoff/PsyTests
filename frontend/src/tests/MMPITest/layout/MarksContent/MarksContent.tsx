import MMPITest from "@/tests/MMPITest/schemas/MMPITest";
import MarksChart from "@/tests/MMPITest/layout/MarksContent/MarksChart";
import MarksTable from "@/tests/MMPITest/layout/MarksContent/MarksTable";
import MarksMultipliers from "@/tests/MMPITest/layout/MarksContent/MarksMultipliers";
import {Box} from "@mui/material";
import MarksConvertor from "@/tests/MMPITest/layout/MarksContent/MarksConvertor";

/**
 * Dialog content for MMPI mark system
 * @param test
 * @constructor
 */
export default function MarksContent({test}: {test: MMPITest}) {
    return (
        <>
            <div>
                <MarksChart scales={test.scales} />
            </div>
            <Box sx={{p: 2, display: "flex", flexDirection: "column", gap: 2}}>
                <MarksMultipliers scales={test.scales} />
                <MarksConvertor test={test} />
            </Box>
            <MarksTable test={test} />
        </>
    );
}