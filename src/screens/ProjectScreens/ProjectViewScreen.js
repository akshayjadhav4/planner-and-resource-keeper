import React, { useState, useEffect } from "react";
import { View, Text, Alert, FlatList, TouchableOpacity } from "react-native";
import styles from "./styles";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { firebase } from "../../firebase/config";
import FAB from "react-native-fab";

export default function ProjectViewScreen({ route, navigation }) {
  const { projectDetail } = route.params;

  const [modules, setModules] = useState([]);

  const userID = projectDetail.authorId;
  const projectID = projectDetail.id;

  const projectRef = firebase
    .firestore()
    .collection("projectsCollection")
    .doc(userID)
    .collection("projects");

  const moduleRef = firebase
    .firestore()
    .collection("projectsCollection")
    .doc(userID)
    .collection("projects")
    .doc(projectID)
    .collection("modules");

  const onAddButtonPress = () => {
    navigation.navigate("AddModule", { projectDetail: projectDetail });
  };

  const onPressDelete = () => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            projectRef.doc(projectDetail.id).delete();
            navigation.navigate("Home");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onPressDone = () => {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    projectRef.doc(projectDetail.id).update({
      projectStatus: "Complete",
      Completed: timestamp,
    });
    navigation.navigate("Home");
  };

  useEffect(() => {
    moduleRef.orderBy("createdAt", "desc").onSnapshot((snapshot) => {
      const fetchedModules = [];
      snapshot.forEach((document) => {
        const fetchedModule = {
          id: document.id,
          ...document.data(),
        };
        fetchedModules.push(fetchedModule);
      });
      setModules(fetchedModules);
    });
  }, []);

  return (
    <View style={styles.containerView}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{projectDetail.projectName}</Text>
        <Text style={styles.cardDescription}>
          {projectDetail.projectDescription}
        </Text>
        <View style={styles.cardDivider}></View>
        {projectDetail.Completed ? (
          <Text style={styles.cardDate}>
            Completed: {moment(projectDetail.Completed.toDate()).calendar()}
          </Text>
        ) : (
          <Text style={styles.cardDate}>
            Created: {moment(projectDetail.createdAt.toDate()).calendar()}
          </Text>
        )}

        <Text style={styles.cardStatus}>
          Project Status: {projectDetail.projectStatus}
        </Text>
        <View style={styles.cardDivider}></View>

        <View style={styles.cardActions}>
          {projectDetail.projectStatus !== "Complete" && (
            <MaterialIcons
              name="done"
              size={24}
              color="green"
              onPress={onPressDone}
            />
          )}
          <MaterialIcons
            name="delete"
            size={24}
            color="#E71C23"
            onPress={onPressDelete}
          />
        </View>
      </View>

      <FlatList
        data={modules}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ModuleView", { moduletDetail: item });
            }}
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.moduleName}</Text>
              <Text style={styles.cardDate}>
                Created: {moment(item.createdAt?.toDate()).calendar()}
              </Text>
              <Text style={styles.cardStatus}>
                Module Status: {item.moduleStatus}
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
