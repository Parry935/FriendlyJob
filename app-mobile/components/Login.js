import React, { useContext, useState } from "react";
import { Button } from "react-native-elements";
import { StyleSheet, View, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import { login } from "../services/UserService";
import { UserContext } from "../contexts/UserContext";
import { errorHandling } from "../helpers/ErrorHandler";

export default function Login() {
  const { setUser } = useContext(UserContext);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (name) => {
    return (text) => {
      setLoginData({ ...loginData, [name]: text });
      setError("");
    };
  };

  const handleLogin = () => {
    if (
      loginData.email.length > 0 &&
      loginData.email.trim() &&
      loginData.password.length > 0
    ) {
      login(loginData.email, loginData.password, setUser)
        .then(() => {
          Alert.alert("Pomyślnie zostałeś zalogowany");
        })
        .catch((err) => {
          setError(errorHandling(err));
        });
    } else setError("Email i hasło nie mogą być puste");
  };

  return (
    <View style={styles.container}>
      <Input
        containerStyle={styles.wrapItem}
        leftIcon={<Icon name="user" size={20} color="black" />}
        placeholder="Email"
        value={loginData.email}
        onChangeText={handleChange("email")}
      />

      <Input
        containerStyle={styles.wrapItem}
        leftIcon={<Icon name="lock" size={20} color="black" />}
        placeholder="Hasło"
        secureTextEntry={true}
        value={loginData.password}
        onChangeText={handleChange("password")}
        errorMessage={error}
      />

      <Button
        containerStyle={styles.button}
        color="#0d092c"
        title="Zaloguj"
        onPress={handleLogin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: "10%",
  },
  button: {
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
  wrapItem: {
    marginBottom: 10,
  },
});
