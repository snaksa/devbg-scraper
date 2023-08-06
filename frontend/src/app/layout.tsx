import { Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import type { Metadata } from "next";
import AppBar from "@/components/AppBar";
import { drawerWidth } from "@/utils/constants";
import { fetchCategories } from "@/utils/client";

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  const categories = await fetchCategories();

  return (
    <html>
      <body>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar categories={categories} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar />
            {children}
          </Box>
        </Box>
      </body>
    </html>
  );
}
