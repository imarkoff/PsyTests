import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import {SvgIconProps, Tooltip} from '@mui/material';
import {UserGender} from "@/types/models/User";
import {blue, pink} from "@mui/material/colors";

interface UserGenderIconProps extends SvgIconProps {
    gender: UserGender;
}

export default function UserGenderIcon(
    {gender, ...iconProps}: UserGenderIconProps
) {
    const metadataByGender = {
        male: {
            name: "Чоловік",
            color: blue[500],
            Icon: MaleIcon,
        },
        female: {
            name: "Жінка",
            color: pink[500],
            Icon: FemaleIcon,
        }
    };

    const currentMetadata = metadataByGender[gender];
    const GenderIcon = currentMetadata.Icon;

    return (
        <Tooltip title={`${currentMetadata.name} (стать)`}>
            <GenderIcon
                {...iconProps}
                sx={{
                    color: currentMetadata.color,
                    ...iconProps?.sx
                }}
            />
        </Tooltip>
    );
}