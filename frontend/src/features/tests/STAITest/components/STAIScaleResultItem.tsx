import STAIScaleScore from "@/features/tests/STAITest/types/STAIResult/STAIScaleScore";
import STAIScaleVerdict from "@/features/tests/STAITest/types/STAIResult/STAIScaleVerdict";
import scaleLabels from "@/features/tests/STAITest/utils/scaleLabels";
import {Box, List, ListItem, Typography} from "@mui/material";

export default function STAIScaleResultItem(
    {score, scaleVerdict}: { score: STAIScaleScore, scaleVerdict: STAIScaleVerdict | undefined }
) {
    const label = scaleLabels[score.scale_label] || score.scale_label;
    const mark = scaleVerdict?.mark || "Невідомо";
    const recommendation = scaleVerdict?.verdict;

    return (
        <Box key={score.scale_label}>
            <Typography variant="h6" fontWeight="bold">
                {label} ({score.scale_label})
            </Typography>

            <List sx={{listStyleType: "disc", pl: 2}} dense>
                <ListItem sx={{display: "list-item"}}>
                    <Typography><b>Від&#39;ємні бали:</b> {score.negative}</Typography>
                </ListItem>
                <ListItem sx={{display: "list-item"}}>
                    <Typography><b>Додатні бали:</b> {score.positive}</Typography>
                </ListItem>
                <ListItem sx={{display: "list-item"}}>
                    <Typography><b>Перетворений бал:</b> {score.converted_score}</Typography>
                </ListItem>
                <ListItem sx={{display: "list-item"}}>
                    <Typography><b>Оцінка:</b> {mark}</Typography>
                </ListItem>
            </List>

            {recommendation && (
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Рекомендація:
                    </Typography>
                    <Typography>{recommendation}</Typography>
                </Box>
            )}
        </Box>
    );
}