import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type EyeIconProps = {
  show: boolean;
  changeShow: () => void;
};

export const EyeIcon = ({ show, changeShow }: EyeIconProps): JSX.Element => {
  return (
    <IconButton onClick={changeShow}>
      {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
    </IconButton>
  );
};
