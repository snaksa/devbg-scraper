import { Box, CssBaseline, Toolbar } from "@mui/material";
import AppBar from "@/components/AppBar";
import { drawerWidth } from "@/utils/constants";
import { fetchCategories } from "@/utils/client";

// revalidate data cache every 60 seconds
export const revalidate = 60;

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
