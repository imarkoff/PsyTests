import {Card, CardActionArea, CardHeader} from "@mui/material";
import Test from "@/schemas/Test";

interface TestPreviewProps {
    test: Test;
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
                ...(selected && {
                    boxShadow: "inset 0 0 0 2px " + theme.palette.primary.main,
                    overflow: "visible"
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