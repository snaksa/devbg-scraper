'use client';

import {
  AppBar as MuiAppBar,
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ReorderIcon from '@mui/icons-material/Reorder';
import { drawerWidth } from '@/utils/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/models';
import { fetchCategories } from '@/utils/client';

export default function AppBar() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const router = useRouter();
  const theme = useTheme();

  const params = useSearchParams();
  const currentCategoryId = params.get('id') as string;

  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res));
  }, []);

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  const onCategoryClick = (categoryId: string) => {
    if (isMobile) {
      toggleDrawer();
    }

    router.push(`/categories?id=${categoryId}`);
  };

  const redirectToDashboard = () => {
    router.push('/');
  };

  return (
    <Box>
      <MuiAppBar
        position="fixed"
        sx={{ zIndex: isMobile && isOpen ? 0 : 99999999 }}
      >
        <Toolbar>
          <Stack direction="row" spacing={1} alignItems="center">
            <ReorderIcon
              sx={{
                [theme.breakpoints.up('sm')]: {
                  display: 'none',
                },
              }}
              onClick={toggleDrawer}
            />

            <Box onClick={redirectToDashboard} sx={{ cursor: 'pointer' }}>
              <Typography variant="h6" noWrap>
                DevBG Job Trends
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </MuiAppBar>
      <MuiDrawer
        open={isMobile ? isOpen : true}
        variant={isMobile ? 'temporary' : 'persistent'}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: drawerWidth,
            '@media (max-width: 600px)': {
              width: 'auto',
            },
          },
        }}
      >
        {isMobile && (
          <MuiAppBar
            position="relative"
            sx={{ zIndex: isMobile ? 0 : 99999999 }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                Categories
              </Typography>
            </Toolbar>
          </MuiAppBar>
        )}

        <Toolbar
          sx={{
            '@media (max-width: 600px)': {
              display: 'none',
            },
          }}
        />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {categories.map((d) => (
              <ListItem
                key={d.name}
                onClick={() => onCategoryClick(d.id)}
                disablePadding
              >
                <ListItemButton>
                  <ListItemText
                    primary={d.name}
                    primaryTypographyProps={{
                      style: {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',

                        color:
                          d.id === currentCategoryId
                            ? theme.palette.primary.light
                            : 'inherit',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </MuiDrawer>
    </Box>
  );
}
