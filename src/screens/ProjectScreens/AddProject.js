import React, { useState } from "react";
import {
  FlatList,
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

const addProjectSchema = Yup.object({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

export default function AddProject({ route, navigation }) {
  const { user } = route.params;

  const [isLoading, setIsLoading] = useState(false);

  const userID = user.id;
  const projectRef = firebase
    .firestore()
    .collection("projectsCollection")
    .doc(userID)
    .collection("projects");

  const onCreatePress = (values, actions) => {
    setIsLoading(true);
    actions.resetForm();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      projectName: values.name,
      projectDescription: values.description,
      authorId: userID,
      createdAt: timestamp,
      projectStatus: "Ongoing",
    };
    projectRef
      .add(data)
      .then((doc) => {
        Keyboard.dismiss();
        setIsLoading(false);
        navigation.navigate("Home");
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
        <Formik
          initialValues={{
            name: "",
            description: "",
          }}
          validationSchema={addProjectSchema}
          onSubmit={onCreatePress}
        >
          {(formik) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Project Name"
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
                <Text style={styles.buttonTitle}>Add Project</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
}
