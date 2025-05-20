"use client";

import styled from "@emotion/styled";
import {TableCell, Theme} from "@mui/material";

const DarkenCell = styled(TableCell)(({theme}: {theme?: Theme}) => ({
    backgroundColor: theme!.palette.background.paper
}));

export default DarkenCell;