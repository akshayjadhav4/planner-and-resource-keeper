import React, { useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import styles from "./styles";
import { Formik } from "formik";
import * as Yup from "yup";
import { firebase } from "../../firebase/config";

const addModuleSchema = Yup.object({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

export default function AddModule({ route, navigation }) {
  const { projectDetail } = route.params;

  const [isLoading, setIsLoading] = useState(false);

  const userID = projectDetail.authorId;
  const projectID = projectDetail.id;
  const moduleRef = firebase
    .firestore()
    .collection("projectsCollection")
    .doc(userID)
    .collection("projects")
    .doc(projectID)
    .collection("modules");

  const onCreatePress = (values, actions) => {
    setIsLoading(true);
    actions.resetForm();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      moduleName: values.name,
      moduleDescription: values.description,
      authorId: projectDetail.authorId,
      projectId: projectDetail.id,
      createdAt: timestamp,
      moduleStatus: "Ongoing",
    };
    moduleRef
      .add(data)
      .then((doc) => {
        Keyboard.dismiss();
        setIsLoading(false);
        navigation.navigate("ProjectView");
      })
      .catch((error) => {
        setIsLoading(false);
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Text style={styles.nameText}>
          Add Module to {projectDetail.projectName}
        </Text>
        <Formik
          initialValues={{
            name: "",
            description: "",
          }}
          validationSchema={addModuleSchema}
          onSubmit={onCreatePress}
        >
          {(formik) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Module Name"
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
                placeholder="Description"
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                multiline
                onChangeText={formik.handleChange("description")}
                value={formik.values.description}
                onBlur={formik.handleBlur("description")}
              />
              <Text style={styles.errorText}>
                {formik.touched.description && formik.errors.description}
              </Text>
              {isLoading && <ActivityIndicator color="#788eec" />}
              <TouchableOpacity
                style={styles.button}
                onPress={formik.handleSubmit}
              >
                <Text style={styles.buttonTitle}>Add Module</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
}
