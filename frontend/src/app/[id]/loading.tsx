import { CircularProgress, Stack } from "@mui/material";

export default async function CategoryDashboardLoading() {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" pt={10}>
      <CircularProgress size={30} />
    </Stack>
  );
}
