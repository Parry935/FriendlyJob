import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Switch,
  Text,
  TextInput,
} from "react-native";
import { Heading, List } from "native-base";
import { JobContext } from "../../../contexts/JobContext";
import { Select } from "native-base";
import { languageDegree } from "../../../helpers/Enumerations/OfferEnumerations";
import { Slider, Icon } from "react-native-elements";
import Suggestions from "../../helpers/Suggestions";

export default function JobOffersFilter() {
  const { jobQuery, setJobQuery } = useContext(JobContext);

  const [filterSwitch, setFilterSwitch] = useState({
    checkedLevelJ: jobQuery.levelJ,
    checkedLevelM: jobQuery.levelM,
    checkedLevelS: jobQuery.levelS,
    checkedJobTimeFull: jobQuery.jobTimeFull,
    checkedJobTime34: jobQuery.jobTime34,
    checkedJobTime12: jobQuery.jobTime12,
    checkedJobTimeNotSpecified: jobQuery.jobTimeNS,
    checkedContractP: jobQuery.contractP,
    checkedContractB: jobQuery.contractB,
    checkedContractZ: jobQuery.contractM,
    checkedContractNotSpecified: jobQuery.contractNS,
    checkedSalary: jobQuery.salary,
    checkedRemote: jobQuery.remote,
  });

  const handleChangeSwitch = (event, name) => {
    setFilterSwitch({
      ...filterSwitch,
      [name]: event,
    });
  };

  const [experienceFrom, setExperienceFrom] = useState(jobQuery.expFrom);
  const [experienceTo, setExperienceTo] = useState(jobQuery.expTo);
  const [language, setLanguage] = useState(jobQuery.language);
  const [salaryFrom, setSalaryFrom] = useState(jobQuery.salaryFrom);
  const [salaryTo, setSalaryTo] = useState(jobQuery.salaryTo);

  const [localizationRef, setLocalizationRef] = useState("");
  const [localization, setLocalization] = useState(jobQuery.localization);

  const addLocalization = () => {
    if (localizationRef !== "" && localizationRef.trim()) {
      setLocalization((localization) => [...localization, localizationRef]);
      setLocalizationRef("");
    }
  };

  const removeLocalization = (index) => {
    localization.splice(index, 1);
    setLocalization((localization) => [...localization]);
  };

  const [phraseRef, setPhraseRef] = useState("");
  const [phrase, setPhrase] = useState(jobQuery.phrase);

  const addPhrase = () => {
    if (phraseRef !== "" && phraseRef.trim()) {
      setPhrase((phrase) => [...phrase, phraseRef]);
      setPhraseRef("");
    }
  };

  const removePhrase = (index) => {
    phrase.splice(index, 1);
    setPhrase((phrase) => [...phrase]);
  };

  const [technologyMainRef, setTechnologyMainRef] = useState("");
  const [sugestionsTechnologyMain, setSugestionsTechnologyMain] =
    useState(false);
  const [technologyMain, setTechnologyMain] = useState(jobQuery.technologyMain);

  const technologyMainRefChange = (value) => {
    setTechnologyMainRef(value);
    setSugestionsTechnologyMain(true);
  };

  const addTechnologyMain = () => {
    if (technologyMainRef !== "" && technologyMainRef.trim()) {
      setTechnologyMain((technologyMain) => [
        ...technologyMain,
        technologyMainRef,
      ]);
      setTechnologyMainRef("");
    }
  };

  const removeTechnologyMain = (index) => {
    technologyMain.splice(index, 1);
    setTechnologyMain((technologyMain) => [...technologyMain]);
  };

  const [technologyNiceToHaveRef, setTechnologyNiceToHaveRef] = useState("");
  const [sugestionsTechnologyNiceToHave, setSugestionsTechnologyNiceToHave] =
    useState(false);
  const [technologyNiceToHave, setTechnologyNiceToHave] = useState(
    jobQuery.technologyNiceToHave
  );

  const technologyNiceToHaveRefChange = (value) => {
    setTechnologyNiceToHaveRef(value);
    setSugestionsTechnologyNiceToHave(true);
  };

  const addTechnologyNiceToHave = () => {
    if (technologyNiceToHaveRef !== "" && technologyNiceToHaveRef.trim()) {
      setTechnologyNiceToHave((technologyNiceToHave) => [
        ...technologyNiceToHave,
        technologyNiceToHaveRef,
      ]);
      setTechnologyNiceToHaveRef("");
    }
  };

  const removeTechnologyNiceToHave = (index) => {
    technologyNiceToHave.splice(index, 1);
    setTechnologyNiceToHave((technologyNiceToHave) => [
      ...technologyNiceToHave,
    ]);
  };

  const handleFilter = () => {
    setJobQuery({
      levelJ: filterSwitch.checkedLevelJ,
      levelM: filterSwitch.checkedLevelM,
      levelS: filterSwitch.checkedLevelS,
      jobTimeFull: filterSwitch.checkedJobTimeFull,
      jobTime34: filterSwitch.checkedJobTime34,
      jobTime12: filterSwitch.checkedJobTime12,
      jobTimeNS: filterSwitch.checkedJobTimeNotSpecified,
      contractP: filterSwitch.checkedContractP,
      contractB: filterSwitch.checkedContractB,
      contractM: filterSwitch.checkedContractZ,
      contractNS: filterSwitch.checkedContractNotSpecified,
      salary: filterSwitch.checkedSalary,
      remote: filterSwitch.checkedRemote,
      expFrom: experienceFrom,
      expTo: experienceTo,
      language: language,
      salaryFrom: salaryFrom,
      salaryTo: salaryTo,
      localization: localization,
      technologyMain: technologyMain,
      technologyNiceToHave: technologyNiceToHave,
      phrase: phrase,
    });
  };

  useEffect(() => {
    handleFilter();
  }, [
    filterSwitch,
    localization,
    technologyMain,
    technologyNiceToHave,
    salaryFrom,
    salaryTo,
    phrase,
    experienceFrom,
    experienceTo,
    language,
  ]);

  return (
    <ScrollView>
      <View style={styles.card}>
        <Heading size="md" style={styles.head}>
          Poziom
        </Heading>
        <View style={styles.rowWrap}>
          <View style={styles.itemCenter}>
            <Text>Junior</Text>
            <Switch
              onValueChange={(event) =>
                handleChangeSwitch(event, "checkedLevelJ")
              }
              value={filterSwitch.checkedLevelJ}
            />
          </View>
          <View style={styles.itemCenter}>
            <Text>Mid</Text>
            <View>
              <Switch
                onValueChange={(event) =>
                  handleChangeSwitch(event, "checkedLevelM")
                }
                value={filterSwitch.checkedLevelM}
              />
            </View>
          </View>
          <View style={styles.itemCenter}>
            <Text>Senior</Text>
            <Switch
              onValueChange={(event) =>
                handleChangeSwitch(event, "checkedLevelS")
              }
              value={filterSwitch.checkedLevelS}
            />
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <Heading size="md" style={styles.head}>
          Etat
        </Heading>
        <View style={styles.rowWrap}>
          <View style={styles.itemCenter}>
            <Text>Pełny etat</Text>
            <Switch
              onValueChange={(event) =>
                handleChangeSwitch(event, "checkedJobTimeFull")
              }
              value={filterSwitch.checkedJobTimeFull}
            />
          </View>
          <View style={styles.itemCenter}>
            <Text>1/2</Text>
            <View>
              <Switch
                onValueChange={(event) =>
                  handleChangeSwitch(event, "checkedJobTime12")
                }
                value={filterSwitch.checkedJobTime12}
              />
            </View>
          </View>
          <View style={styles.itemCenter}>
            <Text>3/4</Text>
            <Switch
              onValueChange={(event) =>
                handleChangeSwitch(event, "checkedJobTime34")
              }
              value={filterSwitch.checkedJobTime34}
            />
          </View>
          <View style={styles.itemCenter}>
            <Text>Nie określono</Text>
            <Switch
              onValueChange={(event) =>
                handleChangeSwitch(event, "checkedJobTimeNotSpecified")
              }
              value={filterSwitch.checkedJobTimeNotSpecified}
            />
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <Heading size="md" style={styles.head}>
          Umowa
        </Heading>
        <View style={styles.rowWrap}>
          <View style={styles.itemCenter}>
            <Text>O pracę</Text>
            <Switch
              onValueChange={(event) =>
                handleChangeSwitch(event, "checkedContractP")
              }
              value={filterSwitch.checkedContractP}
            />
          </View>
          <View style={styles.itemCenter}>
            <Text>Zlecenie</Text>
            <View>
              <Switch
                onValueChange={(event) =>
                  handleChangeSwitch(event, "checkedContractZ")
                }
                value={filterSwitch.checkedContractZ}
              />
            </View>
          </View>
          <View style={styles.itemCenter}>
            <Text>B2B</Text>
            <Switch
              onValueChange={(event) =>
                handleChangeSwitch(event, "checkedContractB")
              }
              value={filterSwitch.checkedContractB}
            />
          </View>
          <View style={styles.itemCenter}>
            <Text>Nie określono</Text>
            <Switch
              onValueChange={(event) =>
                handleChangeSwitch(event, "checkedContractNotSpecified")
              }
              value={filterSwitch.checkedContractNotSpecified}
            />
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <Heading size="md" style={styles.head}>
          Inne
        </Heading>
        <View style={styles.rowWrap}>
          <View style={styles.itemCenter}>
            <Text>Praca zdalna</Text>
            <Switch
              onValueChange={(event) =>
                handleChangeSwitch(event, "checkedRemote")
              }
              value={filterSwitch.checkedRemote}
            />
          </View>
          <View style={styles.itemCenter}>
            <Text>Oferty tylko z zarobkami</Text>
            <View>
              <Switch
                onValueChange={(event) =>
                  handleChangeSwitch(event, "checkedSalary")
                }
                value={filterSwitch.checkedSalary}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Heading size="md" style={styles.head}>
          Język angielski
        </Heading>
        <View style={styles.rowWrap}>
          <Select
            selectedValue={language}
            minWidth="200"
            onValueChange={(value) => setLanguage(value)}
          >
            {languageDegree.map((item) =>
              item.length === 0 ? (
                <Select.Item key={item} label={"Nie określono"} value={item} />
              ) : (
                <Select.Item key={item} label={item} value={item} />
              )
            )}
          </Select>
        </View>
      </View>
      <View style={styles.card}>
        <Heading size="md" style={styles.head}>
          Doświadczenie
        </Heading>
        <Slider
          thumbStyle={{ height: 20, width: 20, backgroundColor: "#3268b8" }}
          maximumValue={15}
          minimumValue={0}
          step={0.5}
          value={parseInt(experienceFrom)}
          onValueChange={(value) => setExperienceFrom(value)}
        />
        <Text>Doświadczenie od (w latach): {experienceFrom}</Text>
        <Slider
          thumbStyle={{ height: 20, width: 20, backgroundColor: "#3268b8" }}
          maximumValue={15}
          minimumValue={0}
          step={0.5}
          value={parseInt(experienceTo)}
          onValueChange={(value) => setExperienceTo(value)}
        />
        <Text>Doświadczenei do (w latach): {experienceTo}</Text>
      </View>
      <View style={styles.card}>
        <Heading size="md" style={styles.head}>
          Zarobki
        </Heading>
        <View style={styles.rowWrap}>
          <TextInput
            placeholder="Zarobki od"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(value) => setSalaryFrom(value)}
            value={salaryFrom}
          />
          <TextInput
            placeholder="Zarobki do"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(value) => setSalaryTo(value)}
            value={salaryTo}
          />
        </View>
      </View>
      <View style={styles.card}>
        <Heading size="md" style={styles.head}>
          Technologie główne
        </Heading>
        <View style={styles.rowWrapAdd}>
          <TextInput
            placeholder="Dodaj technologie"
            style={styles.inputAdd}
            onChangeText={(value) => technologyMainRefChange(value)}
            value={technologyMainRef}
          />
          <Icon name="add" color="#09861D" onPress={addTechnologyMain} />
        </View>
        {sugestionsTechnologyMain ? (
          <Suggestions
            setDisplaySuggestions={setSugestionsTechnologyMain}
            value={technologyMainRef}
            setValue={setTechnologyMainRef}
          />
        ) : (
          <></>
        )}
        {technologyMain.length > 0 ? (
          <List spacing={2} my={2} style={styles.wrapList}>
            {technologyMain.map((item, index) => (
              <List.Item key={index}>
                <Icon
                  name="delete"
                  color="#952505"
                  onPress={() => removeTechnologyMain(index)}
                />
                {"  "}
                {item}
              </List.Item>
            ))}
          </List>
        ) : (
          <></>
        )}
      </View>
      <View style={styles.card}>
        <Heading size="md" style={styles.head}>
          Technologie poboczne
        </Heading>
        <View style={styles.rowWrapAdd}>
          <TextInput
            placeholder="Dodaj technologie"
            style={styles.inputAdd}
            onChangeText={(value) => technologyNiceToHaveRefChange(value)}
            value={technologyNiceToHaveRef}
          />
          <Icon name="add" color="#09861D" onPress={addTechnologyNiceToHave} />
        </View>
        {sugestionsTechnologyNiceToHave ? (
          <Suggestions
            setDisplaySuggestions={setSugestionsTechnologyNiceToHave}
            value={technologyNiceToHaveRef}
            setValue={setTechnologyNiceToHaveRef}
          />
        ) : (
          <></>
        )}
        {technologyNiceToHave.length > 0 ? (
          <List spacing={2} my={2} style={styles.wrapList}>
            {technologyNiceToHave.map((item, index) => (
              <List.Item key={index}>
                <Icon
                  name="delete"
                  color="#952505"
                  onPress={() => removeTechnologyNiceToHave(index)}
                />
                {"  "}
                {item}
              </List.Item>
            ))}
          </List>
        ) : (
          <></>
        )}
      </View>
      <View style={styles.card}>
        <Heading size="md" style={styles.head}>
          Lokalizacja
        </Heading>
        <View style={styles.rowWrapAdd}>
          <TextInput
            placeholder="Dodaj lokalizaje"
            style={styles.inputAdd}
            onChangeText={(value) => setLocalizationRef(value)}
            value={localizationRef}
          />
          <Icon name="add" color="#09861D" onPress={addLocalization} />
        </View>
        {localization.length > 0 ? (
          <List spacing={2} my={2} style={styles.wrapList}>
            {localization.map((item, index) => (
              <List.Item key={index}>
                <Icon
                  name="delete"
                  color="#952505"
                  onPress={() => removeLocalization(index)}
                />
                {"  "}
                {item}
              </List.Item>
            ))}
          </List>
        ) : (
          <></>
        )}
      </View>
      <View style={styles.card}>
        <Heading size="md" style={styles.head}>
          Fraza
        </Heading>
        <View style={styles.rowWrapAdd}>
          <TextInput
            placeholder="Dodaj fraze"
            style={styles.inputAdd}
            onChangeText={(value) => setPhraseRef(value)}
            value={phraseRef}
          />
          <Icon name="add" color="#09861D" onPress={addPhrase} />
        </View>
        {phrase.length > 0 ? (
          <List spacing={2} my={2} style={styles.wrapList}>
            {phrase.map((item, index) => (
              <List.Item key={index}>
                <Icon
                  name="delete"
                  color="#952505"
                  onPress={() => removePhrase(index)}
                />
                {"  "}
                {item}
              </List.Item>
            ))}
          </List>
        ) : (
          <></>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rowWrap: {
    flexWrap: "wrap",
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  rowWrapAdd: {
    flex: 1,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  wrapList: {
    marginTop: 15,
  },
  itemCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#FFF",
    borderColor: "#3268b8",
    borderWidth: 1,
    paddingLeft: 35,
    paddingRight: 35,
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  inputAdd: {
    flex: 1,
    backgroundColor: "#FFF",
    borderColor: "#3268b8",
    borderWidth: 1,
    paddingLeft: 35,
    paddingRight: 35,
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
    marginRight: 20,
  },
  head: {
    textAlign: "center",
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
});
