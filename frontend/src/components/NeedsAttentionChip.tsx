import {Chip, ChipProps} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

type NeedsAttentionChipProps = Omit<ChipProps, 'label' | 'color' | 'icon'>;

export default function NeedsAttentionChip(props: NeedsAttentionChipProps) {
    return (
        <Chip
            label={"Потребує уваги"}
            size={"small"}
            color={"warning"}
            icon={<ErrorOutlineIcon/>}
            {...props}
        />
    );
}