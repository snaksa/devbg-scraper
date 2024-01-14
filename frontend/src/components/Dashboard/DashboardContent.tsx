'use client';

import { Category } from '@/models';
import { fetchCategories } from '@/utils/client';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardContent() {
  const [categories, setCategories] = useState<Category[]>();

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res));
  }, []);

  if (!categories) {
    return <CircularProgress />;
  }

  return (
    <Stack direction="row" p={2} flexWrap="wrap">
      {categories?.map((category) => {
        return (
          <Box
            key={category.id}
            p={1}
            sx={{
              width: 'auto',
              '@media (max-width: 600px)': {
                width: '100%',
              },
            }}
          >
            <Link
              href={`/categories?id=${category.id}`}
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
  );
}
