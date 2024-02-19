import { Stack } from '@mui/material';
import CategoryDetails from '@/components/CategoryDetails/CategoryDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Category | DevBG Job Trends',
};

export default async function CategoryPage() {
  return (
    <Stack p={2} pt={4} spacing={2} alignItems="center">
      <CategoryDetails />
    </Stack>
  );
}
