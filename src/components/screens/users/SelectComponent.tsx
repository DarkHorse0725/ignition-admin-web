import { SelectChangeEvent, Select, useTheme } from "@mui/material";
import { useGridApiContext } from '@mui/x-data-grid';
import { GridRenderEditCellParams } from '@mui/x-data-grid-pro';
import { ADMIN_ROLE } from "@/types";

interface SelectComponentProps {
    props: GridRenderEditCellParams,
    setEditingRow: Function,
}

export const SelectComponent = ({ props, setEditingRow }: SelectComponentProps) => {
    const { id, row, value = ADMIN_ROLE.VIEWER, field } = props;
    const apiRef = useGridApiContext();
    const theme = useTheme();

    const handleChange = async (event: SelectChangeEvent) => {
        await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
        apiRef.current.stopCellEditMode({ id, field });
        setEditingRow({ ...row, [field]: event.target.value })
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            size="medium"
            sx={{
                width: "100%",
                [`& .MuiInputBase-input`]: {
                    color: theme.palette.grey[500],
                },
            }}
            native
        >
            <option value={ADMIN_ROLE.SUPER_ADMIN}>Super Admin</option>
            <option value={ADMIN_ROLE.EDITOR}>Admin</option>
            <option value={ADMIN_ROLE.VIEWER}>Viewer</option>
        </Select>
    );
};
