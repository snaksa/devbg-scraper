import { Box, CssBaseline, Toolbar } from '@mui/material';
import { drawerWidth } from '@/utils/constants';
import AppBar from '@/components/AppBar';

// revalidate data cache every 60 seconds
export const revalidate = 60;

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html>
      <body>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar />
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
