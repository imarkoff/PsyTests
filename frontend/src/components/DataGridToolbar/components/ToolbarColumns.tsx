import {ColumnsPanelTrigger, ToolbarButton} from "@mui/x-data-grid";
import {ViewColumn as ViewColumnIcon} from "@mui/icons-material";
import {Tooltip} from "@mui/material";

export default function ToolbarColumns() {
    return (
        <Tooltip title="Стовпці">
            <ColumnsPanelTrigger render={<ToolbarButton/>}>
                <ViewColumnIcon fontSize="small"/>
            </ColumnsPanelTrigger>
        </Tooltip>
    );
}