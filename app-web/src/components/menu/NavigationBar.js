import React, { useState } from "react";
import "./NavigationBar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Role } from "../../helpers/Enumerations/Role";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import LaptopIcon from "@mui/icons-material/Laptop";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuIcon from "@mui/icons-material/Menu";

function NavigationBar() {
  const [menu, setMenu] = useState(false);

  const toggleDrawer = (state) => () => {
    setMenu(state);
  };

  const { user } = useContext(UserContext);

  const navigationMenu = [
    {
      text: "Strona główna",
      link: "/",
      roles: [Role.Admin, Role.Company, Role.Programmer],
      icon: <HomeIcon />,
    },
    {
      text: "Oferty pracy",
      link: "/joboffers",
      roles: [Role.Admin, Role.Company, Role.Programmer],
      icon: <LibraryBooksIcon />,
    },

    {
      text: "Oferty programistów",
      link: "/programmeroffers",
      roles: [Role.Admin, Role.Company, Role.Programmer],
      icon: <LibraryBooksIcon />,
    },
    {
      text: "Dodaj oferte pracy",
      link: "/jobadd",
      roles: [Role.Company],
      icon: <PostAddIcon />,
    },
    {
      text: "Dodaj oferte programisty",
      link: "/programmeradd",
      roles: [Role.Programmer],
      icon: <PostAddIcon />,
    },
    {
      text: "Używane technologie",
      link: "/technologies",
      roles: [Role.Admin, Role.Company, Role.Programmer],
      icon: <LaptopIcon />,
    },
  ];

  return (
    <>
      <MenuIcon onClick={toggleDrawer(true)} sx={{ fontSize: 35 }} />
      <Drawer
        disableScrollLock={true}
        PaperProps={{
          sx: {
            backgroundColor: "#18171A",
          },
        }}
        anchor={"left"}
        open={menu}
        onClose={toggleDrawer(false)}
      >
        <Box onClick={toggleDrawer(false)}>
          <List>
            {navigationMenu.map((item) =>
              item.roles.includes(user.role) ? (
                <Link to={item.link} key={item.text}>
                  <ListItem>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                </Link>
              ) : (
                ""
              )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default NavigationBar;
