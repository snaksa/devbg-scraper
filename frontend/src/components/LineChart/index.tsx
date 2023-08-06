"use client";

import { Box, useTheme } from "@mui/material";
import { useMemo } from "react";
import {
  LineChart as RechartLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface LineChartItem {
  label: string;
  value: number;
}

type LineChartProps = {
  label: string;
  data: LineChartItem[];
  color: string;
};

export default async function LineChart(props: LineChartProps) {
  const { data, label, color } = props;
  const theme = useTheme();

  const [min, max] = useMemo(() => {
    const values = data.map((d) => d.value);
    return [Math.min(...values) - 1, Math.max(...values) + 1];
  }, [data]);

  const tickFormatter = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString();
  };

  return (
    <Box width={"100%"} height={300}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartLineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            padding={{ left: 50, right: 50 }}
            tickFormatter={tickFormatter}
          />
          <YAxis domain={[min, max]} />
          <Tooltip />
          <Legend />
          <Line
            name={label}
            dataKey="value"
            type="monotone"
            stroke={color}
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </RechartLineChart>
      </ResponsiveContainer>
    </Box>
  );
}
