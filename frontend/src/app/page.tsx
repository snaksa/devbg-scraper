import { Stack } from '@mui/material';
import { Metadata } from 'next';
import MainWrapper from '@/components/MainWrapper/MainWrapper';

export const metadata: Metadata = {
  title: 'Home | DevBG Scraper',
};

export default async function Home() {
  return (
    <Stack p={2} pt={4} spacing={2} alignItems="center">
      <MainWrapper />
    </Stack>
  );
}
