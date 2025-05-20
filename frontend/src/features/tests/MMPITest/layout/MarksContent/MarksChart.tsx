import MMPIScale from "@/features/tests/MMPITest/schemas/MMPIScale";
import {BarChart} from "@mui/x-charts";

/**
 * Chart for displaying min and max marks for each scale
 * @param scales
 * @constructor
 */
export default function MarksChart({scales}: { scales: MMPIScale[] }) {
    return (
        <BarChart
            margin={{ top: 20, right: 40, bottom: 50, left: 40 }}
            dataset={scales.map(s => ({ label: s.label, min: s.min, max: s.max }))}
            series={[
                { dataKey: "min", type: 'bar', stack: "range", color: "#ffffff00", label: "Мінімальний бал" },
                { dataKey: "max", type: 'bar', stack: "range", label: "Максимальний бал" }
            ]}
            xAxis={[{
                scaleType: 'band',
                dataKey: "label",
                label: "Шкала",
                valueFormatter: (value, context) =>
                    context.location === "tick"
                        ? value
                        : `${scales.find(s => s.label === value)?.name} (${value})`
            }]}
            grid={{ horizontal: true }}
            slotProps={{legend: { hidden: true } }}
            height={250}
            barLabel={item => (item.value && item.value > 40) ? item.value.toString() : null}
        />
    );
}