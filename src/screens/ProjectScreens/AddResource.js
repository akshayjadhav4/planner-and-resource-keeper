import React from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import styles from "./styles";
import { Formik } from "formik";
import * as Yup from "yup";
import { firebase } from "../../firebase/config";

const addResourceSchema = Yup.object({
  name: Yup.string().required("Required"),
  content: Yup.string().required("Required"),
});

export default function AddResource({ route, navigation }) {
  const { moduletDetail } = route.params;

  const userID = moduletDetail.authorId;
  const projectID = moduletDetail.projectId;
  const moduleID = moduletDetail.id;

  const resourceRef = firebase
    .firestore()
    .collection("projectsCollection")
    .doc(userID)
    .collection("projects")
    .doc(projectID)
    .collection("modules")
    .doc(moduleID)
    .collection("resources");

  const onCreatePress = (values, actions) => {
    actions.resetForm();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      resourceName: values.name,
      resourceContent: values.content,
      moduleId: moduleID,
      authorId: userID,
      projectId: projectID,
      createdAt: timestamp,
    };
    resourceRef
      .add(data)
      .then((doc) => {
        Keyboard.dismiss();
        navigation.navigate("ModuleView");
      })
      .catch((error) => alert(error.message));
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Text style={styles.nameText}>
          Add Resource to {moduletDetail.moduleName}
        </Text>
        <Formik
          initialValues={{
            name: "",
            content: "",
          }}
          validationSchema={addResourceSchema}
          onSubmit={onCreatePress}
        >
          {(formik) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Resource Name"
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="words"
                onChangeText={formik.handleChange("name")}
                value={formik.values.name}
                onBlur={formik.handleBlur("name")}
              />
              <Text style={styles.errorText}>
                {formik.touched.name && formik.errors.name}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Resource link , blog link ,etc."
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                multiline
                onChangeText={formik.handleChange("content")}
                value={formik.values.content}
                onBlur={formik.handleBlur("content")}
              />
              <Text style={styles.errorText}>
                {formik.touched.content && formik.errors.content}
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={formik.handleSubmit}
              >
                <Text style={styles.buttonTitle}>Add Resource</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
}
