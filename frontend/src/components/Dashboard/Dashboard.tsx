'use client';

import { Category } from '@/models';
import { fetchCategories } from '@/utils/client';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const isMobile = useMediaQuery('(max-width:600px)', { noSsr: true });

  const [categories, setCategories] = useState<Category[]>();

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res));
  }, []);

  if (!categories) {
    return null;
  }

  return (
    <Stack width="100%" alignItems="center">
      <Typography variant="h4">Choose category</Typography>
      <Stack direction="row" p={2} flexWrap="wrap">
        {categories?.map((category) => {
          return (
            <Box key={category.id} p={1} width={isMobile ? '100%' : 'auto'}>
              <Link
                href={`?id=${category.id}`}
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <Box
                  p={2}
                  border="1px solid #ccc"
                  sx={{
                    cursor: 'pointer',
                  }}
                >
                  {category.name}
                </Box>
              </Link>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
