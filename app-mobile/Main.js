import React, { useContext } from "react";
import ProgrammerOffersMain from "./components/offers/programmer-offers/ProgrammerOffersMain";
import JobOffersMain from "./components/offers/job-offers/JobOffersMain";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./components/Login";
import Home from "./components/Home";
import { UserContext } from "./contexts/UserContext";
import Account from "./components/Account";
import axios from "axios";
import { baseURLServer } from "./helpers/AppConstValues";
import JobOfferDetails from "./components/offers/job-offers/JobOfferDetails";
import ProgrammerOfferDetails from "./components/offers/programmer-offers/ProgrammerOfferDetails";
import { Icon } from "react-native-elements";

axios.defaults.baseURL = baseURLServer;
axios.defaults.headers.post["Content-Type"] = "application/json";

const Drawer = createDrawerNavigator();

const AppTheme = {
  colors: {
    primary: "rgb(50, 120, 255)",
    background: "rgb(235, 247, 252)",
    card: "rgb(255, 255, 255)",
    text: "rgb(30, 30, 30)",
    border: "rgb(200, 200, 200)",
    notification: "rgb(255, 55, 55)",
  },
};

export default function Main() {
  const { user } = useContext(UserContext);

  return (
    <NavigationContainer theme={AppTheme}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        {user ? (
          <>
            <Drawer.Screen name="Moje konto" component={Account} />
            <Drawer.Screen
              name="Oferty programistów"
              component={ProgrammerOffersMain}
            />
            <Drawer.Screen name="Oferty pracy" component={JobOffersMain} />
            <Drawer.Screen
              name="Szczegóły oferty pracy"
              component={JobOfferDetails}
              options={({ navigation }) => ({
                drawerItemStyle: { height: 0 },
                headerRight: () => (
                  <Icon
                    name="reply"
                    onPress={() => navigation.navigate("Oferty pracy")}
                    color="#3268b8"
                    size={30}
                    containerStyle={{ marginRight: 20 }}
                  />
                ),
              })}
            />
            <Drawer.Screen
              name="Szczegóły oferty programisty"
              component={ProgrammerOfferDetails}
              options={({ navigation }) => ({
                drawerItemStyle: { height: 0 },
                headerRight: () => (
                  <Icon
                    name="reply"
                    onPress={() => navigation.navigate("Oferty programistów")}
                    color="#3268b8"
                    size={30}
                    containerStyle={{ marginRight: 20 }}
                  />
                ),
              })}
            />
          </>
        ) : (
          <>
            <Drawer.Screen name="Logowanie" component={Login} />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
