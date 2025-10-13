import {Components, Theme} from "@mui/material";

const muiDialogStyles: Pick<Components<Theme>, 'MuiDialog'> = {
    MuiDialog: {
        styleOverrides: {
            paper: ({theme}) => ({
                border: '2px solid',
                borderColor: theme.palette.divider,
                borderRadius: 16,
            })
        },
        defaultProps: {
            slotProps: {
                paper: {
                    elevation: 1
                }
            }
        }
    }
}

export default muiDialogStyles;