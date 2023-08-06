import { fetchCategories } from "@/utils/client";
import { Box, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home | DevBG Scraper",
};

export default async function Dashboard() {
  const categories = await fetchCategories();

  return (
    <Stack p={2} pt={4} spacing={2} alignItems="center">
      <Typography variant="h4">Choose category</Typography>
      <Stack direction="row" p={2} flexWrap="wrap">
        {categories?.map((category) => {
          return (
            <Box key={category.id} p={1}>
              <Link
                href={`/${category.id}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <Box
                  p={2}
                  border="1px solid #ccc"
                  sx={{
                    cursor: "pointer",
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
