'use client';

import { Category } from '@/models';
import { fetchCategoryMeasurements } from '@/utils/client';
import { Box, Stack, Switch, ToggleButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import LineChart, { LineChartItem } from '../LineChart';

type CategoryDetailsProps = {
  id: string;
};

export default function CategoryDetails(props: CategoryDetailsProps) {
  const { id } = props;

  const [category, setCategory] = useState<Category>();
  const [showCombined, setShowCombined] = useState<boolean>(true);

  useEffect(() => {
    fetchCategoryMeasurements(id).then((res) => setCategory(res));
  }, [id]);

  const allPositions: LineChartItem[] = [];
  const remotePositions: LineChartItem[] = [];
  const combinedPositions: LineChartItem[] = [];

  category?.measurements?.forEach((item) => {
    allPositions.push({
      label: item.date,
      value: item.positions,
    });

    remotePositions.push({
      label: item.date,
      value: item.remote,
    });

    combinedPositions.push({
      label: item.date,
      value: item.positions,
      all: item.positions,
      remote: item.remote,
    });
  });

  if (!category) {
    return null;
  }

  return (
    <Stack spacing={2} p={2} pt={4} width="100%" alignItems="center">
      <Typography variant="h4">{category?.name}</Typography>
      <Box>
        <Switch
          checked={showCombined}
          onChange={() => setShowCombined(!showCombined)}
        />{' '}
        Show Combined
      </Box>
      {!showCombined ? (
        <>
          <LineChart label="All" data={allPositions} color={'red'} />
          <LineChart label="Remote" data={remotePositions} color={'blue'} />
        </>
      ) : (
        <LineChart
          label="Remote"
          data={combinedPositions}
          color={'blue'}
          isCombined={true}
        />
      )}
    </Stack>
  );
}
