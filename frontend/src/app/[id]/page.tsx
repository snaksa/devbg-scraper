import LineChart, { LineChartItem } from "@/components/LineChart";
import { fetchCategoryMeasurements } from "@/utils/client";
import { Stack, Typography, useTheme } from "@mui/material";
import { Metadata } from "next";
import { useMemo } from "react";

export const metadata: Metadata = {
  title: "Stats | DevBG Scraper",
};

type CategoryDashboardProps = {
  params: {
    id: string;
  };
};

export default async function CategoryDashboard(props: CategoryDashboardProps) {
  const { params } = props;
  const category = await fetchCategoryMeasurements(params.id);

  const allPositions: LineChartItem[] =
    category?.measurements?.map((item) => {
      return {
        label: item.date,
        value: item.positions,
      };
    }) ?? [];

  const remotePositions: LineChartItem[] =
    category?.measurements?.map((item) => {
      return {
        label: item.date,
        value: item.remote,
      };
    }) ?? [];

  return (
    <Stack spacing={2} p={2} pt={4} alignItems="center">
      <Typography variant="h4">{category.name}</Typography>
      <LineChart label="All" data={allPositions} color={"red"} />
      <LineChart label="Remote" data={remotePositions} color={"blue"} />
    </Stack>
  );
}
