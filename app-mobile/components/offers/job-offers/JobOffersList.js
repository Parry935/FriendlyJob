import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { Spinner } from "native-base";
import { JobContext } from "../../../contexts/JobContext";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { getJobOffers } from "../../../services/OfferService";
import JobOfferItem from "./JobOfferItem";
import { pageSize } from "../../../helpers/AppConstValues";

export default function JobOffersList({ navigation }) {
  const { jobQuery } = useContext(JobContext);
  const [jobOffers, setJobOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const handleGetJobOffers = async () => {
    setIsLoading(true);
    await getJobOffers(page, jobQuery)
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          if (response.data.length > 0)
            setJobOffers([...jobOffers, ...response.data]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setTimeout(() => setIsLoading(false), 500);
  };

  useEffect(() => {
    handleGetJobOffers();
  }, [page]);

  useEffect(() => {
    return () => {
      setJobOffers([]);
    };
  }, []);

  const handleLoadMoreOffers = () => {
    if (jobOffers.length === page * pageSize) {
      setPage(page + 1);
    }
  };

  const handleSearch = () => {
    setJobOffers([]);
  };

  useEffect(() => {
    if (jobOffers.length === 0) {
      if (page === 1) handleGetJobOffers();
      else setPage(1);
    }
  }, [jobOffers]);

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
          data={jobOffers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Szczegóły oferty pracy", {
                  offer: item,
                })
              }
            >
              <JobOfferItem offer={item} />
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
