"use client";

import {PCL5VerdictCounts} from "@/features/shared/psy-test-definitions/PCL5Test/types/PCL5Result";
import {BarChart} from "@mui/x-charts";

export default function PCL5ResultsChart({counts}: {counts: PCL5VerdictCounts}) {
    const keys = Object.keys(counts);
    const values = Object.values(counts);

    return (
        <BarChart
            margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
            series={[{ data: values, type: 'bar' }]}
            xAxis={[{ data: keys, scaleType: 'band' }]}
            grid={{ horizontal: true }}
            height={300}
            barLabel={"value"}
        />
    );
}