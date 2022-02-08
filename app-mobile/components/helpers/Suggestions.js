import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { errorHandling } from "../../helpers/ErrorHandler";
import { getTechnologies } from "../../services/TechnologyService";

export default function Suggestions(props) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (props.value.length > 0) {
      getTechnologies(5, true, props.value)
        .then((response) => {
          if (response !== undefined && response.status === 200) {
            let suggestionsFormServer = response.data.map((item) => item.name);
            setSuggestions(suggestionsFormServer);
          }
        })
        .catch((err) => {
          Alert.alert(errorHandling(err));
        });
    } else {
      setSuggestions([]);
    }
  }, [props.value]);

  const onClick = (value) => {
    props.setDisplaySuggestions(false);
    props.setValue(value);
  };

  return (
    <View style={styles.wrapSuggestions}>
      {suggestions.map((item, index) => (
        <Text
          style={styles.suggestion}
          key={index}
          onPress={(e) => onClick(e._dispatchInstances.memoizedProps.children)}
        >
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapSuggestions: {
    position: "relative",
  },
  suggestion: {
    backgroundColor: "#FFF",
    borderColor: "#3268b8",
    borderWidth: 0.5,
    paddingLeft: 35,
    paddingRight: 35,
    padding: 2,
    marginRight: 50,
    marginLeft: 5,
  },
});
