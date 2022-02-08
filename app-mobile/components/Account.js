import React, { useContext } from "react";
import { ScrollView, StyleSheet, View, Alert } from "react-native";
import { Button } from "react-native-elements";
import { UserContext } from "../contexts/UserContext";
import { logout } from "../services/UserService";
import { Heading, Image, FormControl, Input, TextArea } from "native-base";
import { baseURLImageUser, defaultImageUser } from "../helpers/AppConstValues";

export default function Account() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    logout(setUser).then(() => {
      Alert.alert("Zosałeś wylogowany");
    });
  };

  return (
    <ScrollView>
      <View style={styles.topWrap}>
        <Button
          color="#0d092c"
          title="Wyloguj"
          onPress={handleLogout}
          containerStyle={styles.button}
        />
      </View>
      <View style={styles.contentWrap}>
        <Heading>Dane osobowe:</Heading>
        <View style={styles.rowWrap}>
          <View>
            <FormControl.Label>Rola:</FormControl.Label>
            <Input value={user.role} style={styles.input} editable={false} />
            {user.company ? (
              <>
                <FormControl.Label>Nazwa firmy:</FormControl.Label>
                <Input
                  value={user.company.name}
                  style={styles.input}
                  editable={false}
                />
                <FormControl.Label>NIP:</FormControl.Label>
                <Input
                  value={user.company.nip}
                  style={styles.input}
                  editable={false}
                />
              </>
            ) : (
              <></>
            )}
            <FormControl.Label>Którki opis:</FormControl.Label>
            <TextArea
              value={user.description}
              placeholder="Brak opisu"
              style={styles.textArea}
              editable={false}
            />
          </View>
          <View>
            <View style={styles.imageWrap}>
              <Image
                size={150}
                resizeMode={"contain"}
                borderRadius={300}
                source={{
                  uri: user.imageSrc
                    ? `${baseURLImageUser}${user.imageSrc}`
                    : defaultImageUser,
                }}
                alt="User photo"
              />
            </View>

            <FormControl.Label>Imię:</FormControl.Label>
            <Input
              value={user.firstName}
              style={styles.input}
              editable={false}
            />
            <FormControl.Label>Nazwisko:</FormControl.Label>
            <Input
              value={user.lastName}
              style={styles.input}
              editable={false}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrap: {
    justifyContent: "center",
    margin: "5%",
  },
  button: {
    marginTop: 5,
    width: "95%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  imageWrap: {
    marginBottom: 5,
    borderRadius: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  rowWrap: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    fontWeight: "600",
    backgroundColor: "#FFF",
    borderColor: "#3268b8",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  textArea: {
    fontWeight: "600",
    textAlignVertical: "top",
    backgroundColor: "#FFF",
    borderColor: "#3268b8",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
