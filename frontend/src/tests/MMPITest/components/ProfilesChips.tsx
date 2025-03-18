import {ReactNode} from "react";
import {Box, Chip, Stack, Typography} from "@mui/material";

/**
 * Shows row of profiles chips with given title and results
 * @param title
 * @param results
 * @constructor
 */
export default function ProfilesChips(
    {title, results}: { title: ReactNode, results?: string[] }
) {
    return results && results.length > 0 ? (
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <Typography variant={"body1"} fontWeight={500}>
                {title}
            </Typography>
            <Stack flexDirection={"row"} gap={1}>
                {results.map((type, i) => (
                    <Chip key={i} label={type}/>
                ))}
            </Stack>
        </Box>
    ) : null;
}