import {GridColDef} from "@mui/x-data-grid";
import DoctorPatient from "@/types/models/DoctorPatient";
import formatPhone from "@/utils/formatPhone";
import dayjs from "dayjs";
import NeedsAttentionChip from "@/components/NeedsAttentionChip";

const columns: GridColDef<DoctorPatient>[] = [
    {
        field: "patient",
        headerName: "Пацієнт",
        renderCell: ({row}) => (
            `${row.patient.surname} ${row.patient.name} ${row.patient.patronymic ?? ''}`.trim()
        ),
        width: 300
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