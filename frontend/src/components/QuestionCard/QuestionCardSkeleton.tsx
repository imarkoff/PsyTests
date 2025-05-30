import {Box, Card, CardContent, CardHeader, Skeleton} from "@mui/material";

export default function QuestionCardSkeleton({isLoading}: { isLoading?: boolean }) {
    const animation = isLoading || isLoading === undefined ? "wave" : false;

    return (
        <Card sx={{ overflow: "visible" }} variant={"outlined"}>
            <CardHeader title={
                <Skeleton variant={"text"} sx={{ fontSize: "2rem" }} animation={animation} />
            } sx={{ py: 1 }} />

            <Skeleton height={240} variant={"rectangular"} animation={animation} />

            <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 2 }}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} variant={"text"} sx={{ fontSize: "1.5rem" }} animation={animation} />
                    ))}
                </Box>
            </CardContent>
        </Card>
    )
}