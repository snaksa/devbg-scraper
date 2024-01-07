'use client';

import { Box } from '@mui/material';
import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface LineChartItem {
  label: string;
  value: number;
  all?: number;
  remote?: number;
}

type LineChartProps = {
  label: string;
  data: LineChartItem[];
  color: string;
  isCombined?: boolean;
};

export default function LineChart(props: LineChartProps) {
  const { data, label, color, isCombined } = props;

  const [min, max] = useMemo(() => {
    if (!isCombined) {
      const values = data.map((d) => d.value);
      return [Math.min(...values) - 5, Math.max(...values) + 5];
    }

    const allValues = data.map((d) => d.all ?? 0);
    const remoteValues = data.map((d) => d.remote ?? 0);

    const minAll = Math.min(...allValues);
    const maxAll = Math.max(...allValues);

    const minRemote = Math.min(...remoteValues);
    const maxRemote = Math.max(...remoteValues);

    return [Math.min(minAll, minRemote) - 5, Math.max(maxAll, maxRemote) + 5];
  }, [data, isCombined]);

  const tickFormatter = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString();
  };

  return (
    <Box width={'100%'} height={isCombined ? 600 : 300}>
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
          {isCombined ? (
            <>
              <Line
                name={'All'}
                dataKey="all"
                type="monotone"
                stroke={'red'}
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                name={'Remote'}
                dataKey="remote"
                type="monotone"
                stroke={'blue'}
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </>
          ) : (
            <Line
              name={label}
              dataKey="value"
              type="monotone"
              stroke={color}
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          )}
        </RechartLineChart>
      </ResponsiveContainer>
    </Box>
  );
}
