import {FilterPanelTrigger, ToolbarButton} from "@mui/x-data-grid";
import {Badge, Tooltip} from "@mui/material";
import {FilterList as FilterListIcon} from "@mui/icons-material";

export default function ToolbarFilters() {
    return (
        <Tooltip title="Фільтри">
            <FilterPanelTrigger
                render={(props, state) => (
                    <ToolbarButton {...props} color="default">
                        <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                            <FilterListIcon fontSize="small"/>
                        </Badge>
                    </ToolbarButton>
                )}
            />
        </Tooltip>
    );
}