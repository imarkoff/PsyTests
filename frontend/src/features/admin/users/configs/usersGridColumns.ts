import {GridColDef} from "@mui/x-data-grid";
import User from "@/types/models/User";
import dayjs from "dayjs";

const columns: GridColDef<User>[] = [
    {
        field: "surname",
        headerName: "Прізвище",
        width: 150,
    },
    {
        field: "name",
        headerName: "Ім'я",
        width: 150,
    },
    {
        field: "patronymic",
        headerName: "По батькові",
        width: 150,
    },
    {
        field: "phone",
        headerName: "Номер телефону",
        width: 150,
    },
    {
        field: "last_login",
        headerName: "Останній вхід",
        width: 200,
        type: "dateTime",
        headerAlign: "center",
        align: "center",
        valueFormatter: (_, row) => row.last_login
            ? dayjs(row.last_login).format("DD.MM.YYYY HH:mm")
            : null,
    }
];

export default columns;