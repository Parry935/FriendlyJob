import React, { useState, useContext } from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { Image, Heading, TextArea, List } from "native-base";
import { Button, Icon } from "react-native-elements";
import { baseURLImageUser } from "../../../helpers/AppConstValues";
import { createMessage } from "../../../services/MessageService";
import {
  convertDate,
  convertExperience,
} from "../../../helpers/DisplayConverter";
import { errorHandling } from "../../../helpers/ErrorHandler";
import { Role } from "../../../helpers/Enumerations/Role";
import {
  convertEditorStateToString,
  convertStringToEditorState,
} from "../../../helpers/EditorConverter";
import { UserContext } from "../../../contexts/UserContext";

export default function ProgrammerOfferDetails(props) {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const { offer } = props.route.params;

  const handleCreateMessage = () => {
    if (message && message.length > 0 && message.trim()) {
      const content = convertStringToEditorState(message);
      createMessage(content, offer.user.id, user.id)
        .then((response) => {
          if (response !== undefined && response.status === 200) {
            setMessage("");
            Alert.alert("Pomyślnie wysałno wiadomość");
          }
        })
        .catch((err) => {
          Alert.alert("Błąd", errorHandling(err));
        });
    } else Alert.alert("Błąd", "Wpisz treść do wiadomości");
  };

  return (
    <ScrollView>
      <View style={styles.card}>
        <Heading style={styles.head}> {offer.title}</Heading>
        <View style={styles.rowWrap}>
          <Image
            borderRadius={30}
            source={{
              uri: offer.user.imageSrc
                ? `${baseURLImageUser}${offer.user.imageSrc}`
                : defaultImageUser,
            }}
            alt="Zdjęcie firmy"
            size="lg"
          />
          <View>
            <Text style={styles.textWrap}>
              <Icon
                name="person"
                color="#3268b8"
                iconStyle={{ position: "relative", top: 2, right: 1 }}
              />
              {offer.user.firstName} {offer.user.lastName}
            </Text>
            <Text style={styles.textWrap}>
              {" "}
              <Icon
                name="event"
                color="#3268b8"
                iconStyle={{ position: "relative", top: 2, right: 2 }}
              />
              {convertDate(offer.date)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <Heading style={styles.head} size="md">
          Szczegóły oferty
        </Heading>
        <View>
          <List spacing={4} my={2} style={styles.wrapList}>
            <List.Item _text={{ fontWeight: "600" }}>
              <Icon
                name="room"
                color="#3268b8"
                containerStyle={{ marginRight: 10 }}
              />
              Lokalizacja - {offer.localization}
            </List.Item>
            <List.Item _text={{ fontWeight: "600" }}>
              <Icon
                name="school"
                color="#3268b8"
                containerStyle={{ marginRight: 10 }}
              />
              Edykacja - {offer.education ? offer.education : "Nie określono"}
            </List.Item>
            <List.Item _text={{ fontWeight: "600" }}>
              <Icon
                name="work"
                color="#3268b8"
                containerStyle={{ marginRight: 10 }}
              />
              Doświadczenie - {convertExperience(offer.experience)}
            </List.Item>
            <List.Item _text={{ fontWeight: "600" }}>
              <Icon
                name="article"
                color="#3268b8"
                containerStyle={{ marginRight: 10 }}
              />
              Umowa - {offer.contracts ? offer.contracts : "Nie określono"}
            </List.Item>
            <List.Item _text={{ fontWeight: "600" }}>
              <Icon
                name="schedule"
                color="#3268b8"
                containerStyle={{ marginRight: 10 }}
              />
              Etat - {offer.time ? offer.time : "Nie określono"}
            </List.Item>
            <List.Item _text={{ fontWeight: "600" }}>
              <Icon
                name="house"
                color="#3268b8"
                containerStyle={{ marginRight: 10 }}
              />
              Praca zdalna - {offer.remote ? "Tak" : "Nie"}
            </List.Item>
            <List.Item _text={{ fontWeight: "600" }}>
              <Icon
                name="language"
                color="#3268b8"
                containerStyle={{ marginRight: 10 }}
              />
              Język angielski -{" "}
              {offer.language ? offer.language : "Nie określono"}
            </List.Item>
          </List>
        </View>
      </View>
      {offer.technologyMain && offer.technologyMain.length > 0 ? (
        <View style={styles.card}>
          <Heading style={styles.head} size="md">
            Technologie główne
          </Heading>
          <View>
            <List spacing={2} my={2} style={styles.wrapList}>
              {offer.technologyMain.map((item, index) => (
                <List.Item _text={{ fontWeight: "600" }} key={index}>
                  <Icon
                    name="laptop"
                    color="#3268b8"
                    containerStyle={{ marginRight: 10 }}
                  />
                  {item}
                </List.Item>
              ))}
            </List>
          </View>
        </View>
      ) : (
        <></>
      )}
      {offer.technologyNiceToHave && offer.technologyNiceToHave.length > 0 ? (
        <View style={styles.card}>
          <Heading style={styles.head} size="md">
            Technologie poboczne
          </Heading>
          <View>
            <List spacing={2} my={2} style={styles.wrapList}>
              {offer.technologyNiceToHave.map((item, index) => (
                <List.Item _text={{ fontWeight: "600" }} key={index}>
                  <Icon
                    name="laptop"
                    color="#3268b8"
                    containerStyle={{ marginRight: 10 }}
                  />
                  {item}
                </List.Item>
              ))}
            </List>
          </View>
        </View>
      ) : (
        <></>
      )}
      <View style={styles.card}>
        <Heading style={styles.head} size="md">
          Opis programisty
        </Heading>
        <View>
          <TextArea
            value={convertEditorStateToString(offer.description)}
            placeholder="Brak opisu"
            style={styles.textArea}
            editable={false}
          />
        </View>
      </View>
      {user.role === Role.Company ? (
        <View style={styles.card}>
          <Heading style={styles.head} size="md">
            Wiadomość
          </Heading>
          <View>
            <TextArea
              value={message}
              placeholder="Napisz wiadomość"
              style={styles.textArea}
              onChangeText={(e) => setMessage(e)}
            />
          </View>
          <Button
            title="Wyślij wiadomość"
            containerStyle={styles.button}
            onPress={handleCreateMessage}
          />
        </View>
      ) : (
        <></>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapList: {
    marginTop: 15,
  },
  textArea: {
    fontWeight: "700",
    textAlignVertical: "top",
    marginTop: 10,
  },
  head: {
    textAlign: "center",
  },
  textWrap: {
    textAlignVertical: "top",
    fontWeight: "600",
    margin: 10,
    padding: 11,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3268b8",
  },
  rowWrap: {
    flexWrap: "wrap",
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
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
  },
  button: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
