import { Stack } from '@mui/material';
import { Metadata } from 'next';
import Dashboard from '@/components/Dashboard/Dashboard';

export const metadata: Metadata = {
  title: 'Home | DevBG Job Trends',
};

export default async function Home() {
  return (
    <Stack p={2} pt={4} spacing={2} alignItems="center">
      <Dashboard />
    </Stack>
  );
}
