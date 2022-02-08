import React from "react";
import { StyleSheet, View } from "react-native";
import { Heading } from "native-base";
import { Card, Text } from "react-native-elements";

export default function Home() {
  return (
    <View style={styles.container}>
      <Heading style={styles.heading} fontStyle="italic">
        Friendly Job
      </Heading>
      <View style={styles.wrap}>
        <Card containerStyle={styles.card}>
          <Card.Image
            source={require("../images/home-img-1.jpg")}
            containerStyle={styles.image}
          />
          <Card.Divider />
          <Text style={styles.wrapText}>
            Wyszukaj najlepiej pasującego do firmy programistę i wyślij mu
            wiadomość z ofertą.
          </Text>
        </Card>
        <Card containerStyle={styles.card}>
          <Card.Image
            source={require("../images/home-img-2.jpg")}
            containerStyle={styles.image}
          />
          <Card.Divider />
          <Text style={styles.wrapText}>
            Znajdź idealną dla siebie ofertę pracy dla programisty i wyślij
            swoją aplikację.
          </Text>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "85%",
    height: "45%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  image: {
    width: "90%",
    height: "75%",
  },
  wrapText: {
    textAlign: "center",
  },
  heading: {
    marginTop: 10,
    letterSpacing: 5,
    textAlign: "center",
  },
});
