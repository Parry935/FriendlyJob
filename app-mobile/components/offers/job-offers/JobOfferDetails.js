import React, { useState, useContext } from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { Image, Heading, TextArea, List } from "native-base";
import { Button, Icon } from "react-native-elements";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { baseURLImageUser } from "../../../helpers/AppConstValues";
import { createJobApplication } from "../../../services/JobApplicationService";
import {
  convertDate,
  convertExperience,
} from "../../../helpers/DisplayConverter";
import {
  convertEditorStateToString,
  convertStringToEditorState,
} from "../../../helpers/EditorConverter";
import { UserContext } from "../../../contexts/UserContext";
import { Role } from "../../../helpers/Enumerations/Role";
import { errorHandling } from "../../../helpers/ErrorHandler";

export default function JobOfferDetails(props) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const { offer } = props.route.params;
  const { user } = useContext(UserContext);

  const handleCreateJobApplication = () => {
    if (message && message.length > 0 && message.trim()) {
      if (file) {
        if (file._parts[0][1].name.match(/.(pdf)$/i)) {
          const content = convertStringToEditorState(message);
          createJobApplication(content, file, offer.id, user.id)
            .then(() => {
              Alert.alert("Pomyślnie wysłano aplikację");
              setFile(null);
              setMessage("");
            })
            .catch((err) => {
              Alert.alert("Błąd", errorHandling(err));
            });
        } else Alert.alert("Błąd", "CV musi być w formacie pdf");
      } else Alert.alert("Błąd", "Nie wybrano CV");
    } else Alert.alert("Błąd", "Wpisz treść do wiadomości");
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: false,
        multiple: false,
      });

      let uri = FileSystem.documentDirectory + result.name;

      await FileSystem.copyAsync({
        from: result.uri,
        to: uri,
      });

      const formData = new FormData();
      formData.append("file", {
        uri: result.uri,
        name: result.name,
        type: "application/pdf",
      });

      setFile(formData);
    } catch (e) {}
  };

  return (
    <ScrollView>
      <View style={styles.card}>
        <Heading style={styles.head}> {offer.title}</Heading>
        <View style={styles.rowWrap}>
          <Image
            borderRadius={30}
            style={styles.image}
            source={{
              uri: offer.company.user.imageSrc
                ? `${baseURLImageUser}${offer.company.user.imageSrc}`
                : defaultImageUser,
            }}
            alt="Zdjęcie firmy"
            size="lg"
          />
          <View>
            <Text style={styles.textWrap}>
              <Icon
                name="business"
                color="#3268b8"
                iconStyle={{ position: "relative", top: 2, right: 1 }}
              />
              {offer.company.name}
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
                name="north"
                color="#3268b8"
                containerStyle={{ marginRight: 10 }}
              />
              Poziom - {offer.level}
            </List.Item>
            <List.Item _text={{ fontWeight: "600" }}>
              <Icon
                name="money"
                color="#3268b8"
                containerStyle={{ marginRight: 10 }}
              />
              Zarobki - {offer.salary ? offer.salary : "Nie określono"}
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
          Opis oferty
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
      {user.role === Role.Programmer ? (
        <View style={styles.card}>
          <Heading style={styles.head} size="md">
            Aplikuj
          </Heading>
          <View>
            <TextArea
              value={message}
              placeholder="Dodaj opis"
              style={styles.textArea}
              onChangeText={(e) => setMessage(e)}
            />
          </View>
          <Button
            icon={{
              name: "file-upload",
              size: 15,
              color: "white",
            }}
            onPress={pickDocument}
            title={file ? file._parts[0][1].name : "Wybierz CV"}
          />
          <Button
            title="Wyślij aplikację"
            containerStyle={styles.button}
            onPress={handleCreateJobApplication}
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  button: {
    marginTop: 20,
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
