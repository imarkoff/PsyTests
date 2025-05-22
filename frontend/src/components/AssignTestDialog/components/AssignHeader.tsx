import Typography from "@mui/material/Typography";
import DialogCloseButton from "@/components/DialogCloseButton";
import DialogTitle from "@mui/material/DialogTitle";

export default function AssignHeader({onClose}: { onClose: () => void }) {
    return (
        <DialogTitle
            sx={{ display: "flex", alignItems: "center" }}
            id="dialog-title"
            title={"Назначити тест"}
        >
            <Typography component={"span"} variant={"h6"}>
                Назначити тест
            </Typography>
            <DialogCloseButton onClose={onClose} />
        </DialogTitle>
    );
}