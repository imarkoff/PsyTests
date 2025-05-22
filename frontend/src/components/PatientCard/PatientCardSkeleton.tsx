import {Card, CardHeader, Skeleton, SkeletonOwnProps} from "@mui/material";

export default function PatientCardSkeleton(
    {animation}: {animation?: SkeletonOwnProps["animation"]}
) {
    return (
        <Card
            variant={"outlined"}
            sx={{ overflow: "visible" }}
        >
            <CardHeader
                title={<Skeleton variant={"text"} sx={{ fontSize: "1.75rem" }} animation={animation} />}
                subheader={<Skeleton variant={"text"} sx={{ fontSize: "1rem" }} width={"40%"} animation={animation} />}
                slotProps={{ title: { sx: { lineHeight: 1 } } }}
            />
        </Card>
    );
}