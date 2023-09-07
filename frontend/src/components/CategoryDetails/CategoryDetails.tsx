'use client';

import { Category } from '@/models';
import { fetchCategoryMeasurements } from '@/utils/client';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import LineChart, { LineChartItem } from '../LineChart';

type CategoryDetailsProps = {
  id: string;
};

export default function CategoryDetails(props: CategoryDetailsProps) {
  const { id } = props;

  const [category, setCategory] = useState<Category>();
  useEffect(() => {
    fetchCategoryMeasurements(id).then((res) => setCategory(res));
  }, [id]);

  const allPositions: LineChartItem[] = [];
  const remotePositions: LineChartItem[] = [];

  category?.measurements?.forEach((item) => {
    allPositions.push({
      label: item.date,
      value: item.positions,
    });

    remotePositions.push({
      label: item.date,
      value: item.remote,
    });
  });

  if (!category) {
    return null;
  }

  return (
    <Stack spacing={2} p={2} pt={4} width='100%' alignItems="center">
      <Typography variant="h4">{category?.name}</Typography>
      <LineChart label="All" data={allPositions} color={'red'} />
      <LineChart label="Remote" data={remotePositions} color={'blue'} />
    </Stack>
  );
}
