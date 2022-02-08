import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { Spinner } from "native-base";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { getProgrammerOffers } from "../../../services/OfferService";
import { ProgrammerContext } from "../../../contexts/ProgrammerContext";
import ProgrammerOfferItem from "./ProgrammerOfferItem";
import { pageSize } from "../../../helpers/AppConstValues";

export default function ProgrammerOfferList({ navigation }) {
  const { programmerQuery } = useContext(ProgrammerContext);
  const [programmerOffers, setProgrammerOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const handleGetProgrammerOffers = async () => {
    setIsLoading(true);
    await getProgrammerOffers(page, programmerQuery)
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          if (response.data.length > 0)
            setProgrammerOffers([...programmerOffers, ...response.data]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setTimeout(() => setIsLoading(false), 500);
  };

  useEffect(() => {
    handleGetProgrammerOffers();
  }, [page]);

  useEffect(() => {
    return () => {
      setProgrammerOffers([]);
    };
  }, []);

  const handleLoadMoreOffers = () => {
    if (programmerOffers.length === page * pageSize) {
      setPage(page + 1);
    }
  };

  const handleSearch = () => {
    setProgrammerOffers([]);
  };

  useEffect(() => {
    if (programmerOffers.length === 0) {
      if (page === 1) handleGetProgrammerOffers();
      else setPage(1);
    }
  }, [programmerOffers]);
  return (
    <>
      <View style={styles.topWrap}>
        <Button
          icon={
            <Icon
              name="search"
              size={15}
              color="white"
              margin={5}
              style={styles.iconSearch}
            />
          }
          color="#0d092c"
          title="Szukaj ofert"
          onPress={handleSearch}
          containerStyle={styles.button}
        />
      </View>
      {isLoading && page === 1 ? (
        <Spinner color="cyan.1000" />
      ) : (
        <FlatList
          data={programmerOffers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Szczegóły oferty programisty", {
                  offer: item,
                })
              }
            >
              <ProgrammerOfferItem offer={item} />
            </TouchableOpacity>
          )}
          onEndReached={handleLoadMoreOffers}
          onEndReachedThreshold={0.2}
        />
      )}

      {isLoading && page !== 1 ? <Spinner color="cyan.1000" /> : <></>}
    </>
  );
}

const styles = StyleSheet.create({
  topWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 5,
    marginBottom: 5,
    width: "95%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  iconSearch: {
    marginRight: 10,
  },
});
