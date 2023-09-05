'use client';

import { Category } from '@/models';
import { fetchCategories } from '@/utils/client';
import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>();
  useEffect(() => {
    fetchCategories().then((res) => setCategories(res));
  }, []);

  return (
    <Box>
      <Typography variant="h4">Choose category</Typography>
      <Stack direction="row" p={2} flexWrap="wrap">
        {categories?.map((category) => {
          return (
            <Box key={category.id} p={1}>
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
    </Box>
  );
}
