import {Card, CardActionArea, CardHeader} from "@mui/material";
import TestBase from "@/types/models/TestBase";

interface TestPreviewProps {
    test: TestBase;
    onClick: () => void;
    selected: boolean;
}

export default function TestPreview({test, onClick, selected}: TestPreviewProps) {
    return (
        <Card
            onClick={onClick}
            variant={"outlined"}
            sx={(theme) => ({
                boxSizing: "border-box",
                width: "100%",
                overflow: "visible",
                ...(selected && {
                    boxShadow: "inset 0 0 0 2px " + theme.palette.primary.main,
                }),
            })}
        >
            <CardActionArea>
                <CardHeader
                    title={test.name}
                    subheader={test.description}
                    slotProps={{ subheader: {textOverflow: "ellipsis"} }}
                />
            </CardActionArea>
        </Card>
    );
}