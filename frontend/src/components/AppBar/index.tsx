"use client";

import {
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import ReorderIcon from "@mui/icons-material/Reorder";
import { drawerWidth } from "@/utils/constants";
import { usePathname, useRouter } from "next/navigation";

export default function AppBar(props: {
  categories: { id: string; name: string }[];
}) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const { categories } = props;

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isMobile) {
      toggleDrawer();
    }
  }, [isMobile]);

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  const onCategoryClick = (categoryId: string) => {
    if (isMobile) {
      toggleDrawer();
    }

    router.push(`/${categoryId}`);
  };

  const redirectToDashboard = () => {
    router.push("/");
  };

  return (
    <Box>
      <MuiAppBar
        position="fixed"
        sx={{ zIndex: isMobile && isOpen ? 0 : 99999999 }}
      >
        <Toolbar>
          <Stack direction="row" spacing={1} alignItems="center">
            {isMobile && <ReorderIcon onClick={toggleDrawer} />}
            <Box onClick={redirectToDashboard} sx={{ cursor: "pointer" }}>
              <Typography variant="h6" noWrap>
                DevBG
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </MuiAppBar>
      <MuiDrawer
        open={isMobile ? isOpen : true}
        variant={isMobile ? "temporary" : "persistent"}
        onClose={toggleDrawer}
        PaperProps={{
          sx: { width: drawerWidth },
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

        {!isMobile && <Toolbar />}
        <Box sx={{ overflow: "auto" }}>
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
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        color:
                          pathname === `/${d.id}`
                            ? theme.palette.primary.light
                            : "inherit",
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
