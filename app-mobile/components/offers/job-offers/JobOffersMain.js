import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import JobOffersList from "./JobOffersList";
import JobOffersFilter from "./JobOffersFilter";

const Tab = createBottomTabNavigator();

export default function JobOffersMain(props) {
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
        {() => <JobOffersList navigation={props.navigation} />}
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
        {() => <JobOffersFilter navigation={props.navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
