import React, { useState, useEffect } from "react";
import { View, Text, Alert, FlatList, TouchableOpacity } from "react-native";
import styles from "./styles";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { firebase } from "../../firebase/config";
import FAB from "react-native-fab";

export default function ModuleViewScreen({ route, navigation }) {
  const { moduletDetail } = route.params;

  const userID = moduletDetail.authorId;
  const moduleID = moduletDetail.id;
  const projectID = moduletDetail.projectId;

  const [resource, setResource] = useState([]);

  const moduleRef = firebase
    .firestore()
    .collection("projectsCollection")
    .doc(userID)
    .collection("projects")
    .doc(projectID)
    .collection("modules");

  const resourceRef = firebase
    .firestore()
    .collection("projectsCollection")
    .doc(userID)
    .collection("projects")
    .doc(projectID)
    .collection("modules")
    .doc(moduleID)
    .collection("resources");

  const onAddButtonPress = () => {
    navigation.navigate("AddResource", { moduletDetail: moduletDetail });
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
            moduleRef.doc(moduleID).delete();
            navigation.navigate("ProjectView");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onPressDone = () => {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    moduleRef.doc(moduleID).update({
      moduleStatus: "Complete",
      Completed: timestamp,
    });
    navigation.navigate("ProjectView");
  };

  useEffect(() => {
    resourceRef.orderBy("createdAt", "desc").onSnapshot((snapshot) => {
      const fetchedResources = [];
      snapshot.forEach((document) => {
        const fetchedResource = {
          id: document.id,
          ...document.data(),
        };
        fetchedResources.push(fetchedResource);
      });
      setResource(fetchedResources);
    });
  }, []);

  return (
    <View style={styles.containerView}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{moduletDetail.moduleName}</Text>
        <Text style={styles.cardDescription}>
          {moduletDetail.moduleDescription}
        </Text>
        <View style={styles.cardDivider}></View>
        {moduletDetail.Completed ? (
          <Text style={styles.cardDate}>
            Completed: {moment(moduletDetail.Completed.toDate()).calendar()}
          </Text>
        ) : (
          <Text style={styles.cardDate}>
            Created: {moment(moduletDetail.createdAt.toDate()).calendar()}
          </Text>
        )}

        <Text style={styles.cardStatus}>
          Module Status: {moduletDetail.moduleStatus}
        </Text>
        <View style={styles.cardDivider}></View>

        <View style={styles.cardActions}>
          {moduletDetail.moduleStatus !== "Complete" && (
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
        data={resource}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ResourceView", { resourceDetail: item });
            }}
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.resourceName}</Text>
              <Text style={styles.cardDate}>
                Created: {moment(item.createdAt?.toDate()).calendar()}
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
