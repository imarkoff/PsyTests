import MMPIScale from "@/features/tests/MMPITest/schemas/MMPIScale";
import {Box, Divider, Stack, Typography} from "@mui/material";

/**
 * Shows scale multipliers
 * @param scales
 * @constructor
 */
export default function MarksMultipliers({scales}: {scales: MMPIScale[]}) {
    return (
        <Box sx={{display: "flex", columnGap: 2, alignItems: "baseline", flexWrap: "wrap"}}>
            <Typography fontWeight={500}>
                Множники шкал:
            </Typography>
            <Stack direction={"row"} spacing={2} divider={<Divider orientation={"vertical"} flexItem />}>
                {scales.map(scale => scale.multiply && (
                    <Typography key={scale.label}>
                        {scale.label} - {scale.multiply.multiplier}{scale.multiply.scale}
                    </Typography>
                ))}
            </Stack>
        </Box>
    );
}