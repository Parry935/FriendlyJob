import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem("@user");
    return user != null ? JSON.parse(user) : null;
  } catch (e) {}
};

export const logout = async (setUser) => {
  try {
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@user");
  } catch (e) {}
  setUser(null);
};

export const login = async (email, password, setUser) => {
  return await axios
    .post("account/login", {
      email: email,
      password: password,
    })
    .then((response) => {
      if (response.data) {
        setTokenInStorage(response.data);
        return axios.get("account/currentUser", {
          headers: { Authorization: `Bearer ${response.data}` },
        });
      }
    })
    .then((response) => {
      if (response.data) {
        setUser(response.data);
        setUserInStorage(JSON.stringify(response.data));
      }
    });
};

const setUserInStorage = async (user) => {
  try {
    await AsyncStorage.setItem("@user", user);
  } catch (e) {}
};

const setTokenInStorage = async (token) => {
  try {
    await AsyncStorage.setItem("@token", token);
  } catch (e) {}
};
