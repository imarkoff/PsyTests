import styled from "@emotion/styled";
import {TableRow, Theme} from "@mui/material";

const MarksRow = styled(TableRow)((
    {theme}: {theme?: Theme}
) => ({
    "&:last-child td": {
        borderBottom: 0
    },
    "&:nth-of-type(odd)": {
        backgroundColor: theme?.palette.action.hover
    },
    "& td:first-of-type": {
        backgroundColor: theme?.palette.background.paper
    },
    "& td:not(:first-of-type):hover": {
        backgroundColor: theme?.palette.action.hover
    }
}));

export default MarksRow;