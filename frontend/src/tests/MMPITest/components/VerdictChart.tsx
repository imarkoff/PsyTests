import {BarChart} from "@mui/x-charts";
import {MMPIVerdict} from "@/tests/MMPITest/schemas/MMPIResult";

export default function VerdictChart(
    {converted = {}}: { converted: MMPIVerdict["converted"] | undefined }
) {
    const keys = Object.keys(converted);
    const values = keys.map(key => Math.floor(converted[key]));


    return (
        <BarChart
            margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
            series={[{ data: values, type: 'bar' }]}
            yAxis={[{ max: 120 }]}
            xAxis={[{ data: keys, scaleType: 'band' }]}
            grid={{ horizontal: true }}
            height={300}
            barLabel={"value"}
        />
    );
}