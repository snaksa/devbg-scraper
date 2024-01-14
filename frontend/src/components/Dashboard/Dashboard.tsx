import { Stack, Typography } from '@mui/material';
import DashboardContent from '@/components/Dashboard/DashboardContent';

export default function Dashboard() {
  return (
    <Stack width="100%" alignItems="center">
      <Typography variant="h4">Choose category</Typography>
      <DashboardContent />
    </Stack>
  );
}
