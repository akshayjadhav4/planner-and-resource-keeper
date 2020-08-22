import React from "react";
import { View, Text, Alert, Clipboard, ToastAndroid } from "react-native";
import styles from "./styles";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { firebase } from "../../firebase/config";

export default function ViewResourceScreen({ route, navigation }) {
  const { resourceDetail } = route.params;

  const userID = resourceDetail.authorId;
  const projectID = resourceDetail.projectId;
  const moduleID = resourceDetail.moduleId;
  const resourceID = resourceDetail.id;

  const resourceRef = firebase
    .firestore()
    .collection("projectsCollection")
    .doc(userID)
    .collection("projects")
    .doc(projectID)
    .collection("modules")
    .doc(moduleID)
    .collection("resources")
    .doc(resourceID);

  const copyToClipboard = () => {
    Clipboard.setString(resourceDetail.resourceContent);
    showToastWithGravity();
  };

  const showToastWithGravity = () => {
    ToastAndroid.showWithGravityAndOffset(
      "Content Copied to Clipboard",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50
    );
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
            resourceRef.delete();
            navigation.navigate("ModuleView");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.containerView}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resource Name:</Text>
        <Text style={styles.cardDescription}>
          {resourceDetail.resourceName}
        </Text>
        <Text style={styles.cardTitle}>Resource Content:</Text>
        <Text style={styles.cardDescription}>
          {resourceDetail.resourceContent}
        </Text>
        <View style={styles.cardDivider}></View>

        <Text style={styles.cardDate}>
          Created: {moment(resourceDetail.createdAt.toDate()).calendar()}
        </Text>

        <View style={styles.cardActions}>
          <Ionicons
            name="md-clipboard"
            size={24}
            color="black"
            onPress={() => copyToClipboard()}
          />

          <MaterialIcons
            name="delete"
            size={24}
            color="#E71C23"
            onPress={onPressDelete}
          />
        </View>
      </View>
    </View>
  );
}
