"use client";

import {Menu, MenuItem, Tooltip} from "@mui/material";
import {ExportCsv, ExportPrint, ToolbarButton} from "@mui/x-data-grid";
import {FileDownload as FileDownloadIcon} from "@mui/icons-material";
import {useRef, useState} from "react";

export default function ToolbarExport() {
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const exportMenuTriggerRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            <Tooltip title="Експорт">
                <ToolbarButton
                    ref={exportMenuTriggerRef}
                    id="export-menu-trigger"
                    aria-controls="export-menu"
                    aria-haspopup="true"
                    aria-expanded={exportMenuOpen ? 'true' : undefined}
                    onClick={() => setExportMenuOpen(true)}
                >
                    <FileDownloadIcon fontSize="small"/>
                </ToolbarButton>
            </Tooltip>

            <Menu
                id="export-menu"
                anchorEl={exportMenuTriggerRef.current}
                open={exportMenuOpen}
                onClose={() => setExportMenuOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                slotProps={{
                    list: {
                        'aria-labelledby': 'export-menu-trigger',
                    },
                }}
            >
                <ExportPrint render={<MenuItem/>} onClick={() => setExportMenuOpen(false)}>
                    Роздрукувати
                </ExportPrint>
                <ExportCsv render={<MenuItem/>} onClick={() => setExportMenuOpen(false)}>
                    Зберегти як CSV
                </ExportCsv>
            </Menu>
        </>
    );
}