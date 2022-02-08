import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProgrammerOfferList from "./ProgrammerOfferList";
import ProgrammerOffersFilter from "./ProgrammerOffersFilter";

const Tab = createBottomTabNavigator();

export default function ProgrammerOffersMain(props) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Oferty"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="text-box-multiple"
              color={color}
              size={size}
            />
          ),
        }}
      >
        {() => <ProgrammerOfferList navigation={props.navigation} />}
      </Tab.Screen>
      <Tab.Screen
        name="Filter"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="filter" color={color} size={size} />
          ),
        }}
      >
        {() => <ProgrammerOffersFilter navigation={props.navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
