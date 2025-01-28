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
            sx={selected ? {
                borderColor: "primary.main",
                borderWidth: "2px",
                overflow: "visible"
            } : undefined}
        >
            <CardActionArea>
                <CardHeader
                    title={test.name}
                    subheader={test.description}
                    subheaderTypographyProps={{ textOverflow: "ellipsis" }}
                />
            </CardActionArea>
        </Card>
    );
}