import {Card, CardActions, CardContent, CardHeader, Skeleton} from "@mui/material";

export default function TestHistoryCardSkeleton({isLoading=true}: {isLoading: boolean}) {
    const animation = isLoading ? "wave" : false;

    return (
        <Card variant={"outlined"} sx={{
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "column",
            opacity: isLoading ? 1 : 0.5
        }}>
            <CardHeader title={<Skeleton variant={"text"} sx={{ fontSize: "2rem" }} animation={animation} />}/>

            <CardContent sx={{paddingTop: 0, paddingBottom: 0}}>
                <Skeleton variant={"text"} animation={animation} />
                <Skeleton variant={"text"} animation={animation} width={"60%"} />
                <Skeleton variant={"text"} animation={animation} width={"75%"} />
            </CardContent>

            <CardActions>
                <Skeleton variant={"text"} animation={animation} width={150} sx={{m: 1}} />
            </CardActions>
        </Card>
    );
}