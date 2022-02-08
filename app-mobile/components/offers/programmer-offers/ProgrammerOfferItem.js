import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image, Heading } from "native-base";
import { baseURLImageUser } from "../../../helpers/AppConstValues";
import { Icon } from "react-native-elements";
import { convertDate } from "../../../helpers/DisplayConverter";

export default function ProgrammerOfferItem(props) {
  return (
    <View style={styles.card}>
      <Heading style={styles.head} size="sm">
        {" "}
        {props.offer.title}
      </Heading>
      <View style={styles.rowWrap}>
        <Image
          marginRight={5}
          borderRadius={30}
          source={{
            uri: props.offer.user.imageSrc
              ? `${baseURLImageUser}${props.offer.user.imageSrc}`
              : defaultImageUser,
          }}
          alt="Zdjęcie firmy"
          size="md"
        />
        <View>
          <View style={styles.offerWrap}>
            <Text style={styles.textWrap}>
              {" "}
              <Icon
                name="person"
                color="#3268b8"
                iconStyle={{ position: "relative", top: 2, right: 1 }}
              />{" "}
              {props.offer.user.firstName} {props.offer.user.lastName}
            </Text>
          </View>
          <View style={styles.rowOfferWrap}>
            <Text style={styles.textWrap}>
              {" "}
              <Icon
                name="event"
                color="#3268b8"
                iconStyle={{ position: "relative", top: 2, right: 1 }}
              />{" "}
              {convertDate(props.offer.date)}
              {"   "}
            </Text>
            <Text style={styles.textWrap}>
              {" "}
              <Icon
                name="room"
                color="#3268b8"
                iconStyle={{ position: "relative", top: 3, right: 1 }}
              />{" "}
              {props.offer.localization}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3268b8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  head: {
    textAlign: "center",
  },
  rowWrap: {
    flexWrap: "wrap",
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  rowOfferWrap: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  textWrap: {
    marginBottom: 10,
  },
});
