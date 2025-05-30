import PatientCardSkeleton from "@/components/PatientCard/PatientCardSkeleton";
import {Box, Typography} from "@mui/material";

interface PatientEntitiesSkeletonProps {
    isLoading: boolean;
    hasPatients: boolean;
    error: string | undefined;
}

/**
 * Skeleton for patient entities. Used in doctor's interface.
 * Shows states when there are when loading, no patients or error.
 */
export default function PatientEntitiesSkeleton({isLoading, hasPatients, error}: PatientEntitiesSkeletonProps) {
    return !hasPatients && (
        <Box sx={{
            gridColumn: "1 / -1",
            position: "relative"
        }}>
            <Box sx={{
                display: "grid",
                gap: 1,
                gridTemplateColumns: {xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr"},
                opacity: isLoading ? 1 : 0.5
            }}>
                {Array.from({length: 9}).map((_, index) => (
                    <PatientCardSkeleton key={index} isLoading={isLoading} />
                ))}
            </Box>

            <Box sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}>
                {!error && !isLoading && (
                    <Typography variant={"h6"}>
                        У вас немає пацієнтів, що на вашому обліку
                    </Typography>
                )}
                {error && (
                    <>
                        <Typography variant={"h6"} color={"error"}>
                            {error}
                        </Typography>
                        <Typography variant={"body2"} color={"textSecondary"}>
                            Спробуйте перезавантажити сторінку
                        </Typography>
                    </>
                )}
            </Box>
        </Box>
    );
}