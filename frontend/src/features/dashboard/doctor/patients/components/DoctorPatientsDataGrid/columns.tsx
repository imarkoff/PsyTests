import {GridColDef} from "@mui/x-data-grid";
import DoctorPatient from "@/types/models/DoctorPatient";
import formatPhone from "@/utils/formatPhone";
import dayjs from "dayjs";
import NeedsAttentionChip from "@/components/NeedsAttentionChip";

const columns: GridColDef<DoctorPatient>[] = [
    {
        field: "patient.surname",
        headerName: "Прізвище",
        renderCell: ({row}) => row.patient.surname,
        width: 200
    },
    {
        field: "patient.name",
        headerName: "Ім'я",
        renderCell: ({row}) => row.patient.name,
        width: 200
    },
    {
        field: "patient.patronymic",
        headerName: "По батькові",
        renderCell: ({row}) => row.patient.patronymic,
        width: 200
    },
    {
        field: "phone",
        headerName: "Номер телефону",
        renderCell: ({row}) => formatPhone(row.patient.phone),
        width: 250
    },
    {
        field: "assigned_at",
        headerName: "Дата ставлення на облік",
        type: "dateTime",
        width: 200,
        headerAlign: "center",
        align: "center",
        valueFormatter: ({value}) => dayjs(value).format("DD.MM.YYYY HH:mm"),
    },
    {
        field: "needs_attention",
        headerName: "Чи потребує уваги",
        description: "Показує, чи потребує пацієнт уваги лікаря (наприклад, після проходження пацієнтом тесту)",
        type: "boolean",
        width: 175,
        headerAlign: "center",
        align: "center",
        renderCell: ({row}) => (
            row.needs_attention ? <NeedsAttentionChip /> : null
        )
    }
];

export default columns;