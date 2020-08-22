import React, { useState, useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import FAB from "react-native-fab";
import { firebase } from "../../firebase/config";
import moment from "moment";
export default function HomeScreen({ navigation, extraData }) {
  const [projects, setProjects] = useState([]);

  const userID = extraData.id;
  const projectRef = firebase
    .firestore()
    .collection("projectsCollection")
    .doc(userID)
    .collection("projects");

  const onAddButtonPress = () => {
    navigation.navigate("AddProject", { user: extraData });
  };

  useEffect(() => {
    projectRef.orderBy("createdAt", "desc").onSnapshot((snapshot) => {
      const fetchedProjects = [];
      snapshot.forEach((document) => {
        const fetchedProject = {
          id: document.id,
          ...document.data(),
        };
        fetchedProjects.push(fetchedProject);
      });
      setProjects(fetchedProjects);
    });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ProjectView", { projectDetail: item });
            }}
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.projectName}</Text>
              {item.Completed ? (
                <Text style={styles.cardDate}>
                  Completed: {moment(item.Completed?.toDate()).calendar()}
                </Text>
              ) : (
                <Text style={styles.cardDate}>
                  Created: {moment(item.createdAt?.toDate()).calendar()}
                </Text>
              )}

              <Text style={styles.cardProjectStatus}>
                Project Status: {item.projectStatus}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <FAB
        buttonColor="#788eec"
        iconTextColor="#FFFFFF"
        onClickAction={onAddButtonPress}
        visible={true}
        iconTextComponent={<Ionicons name="md-add" size={24} color="black" />}
      />
    </View>
  );
}
