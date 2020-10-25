import React, { useState } from "react";
import {
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

const LoginSchema = Yup.object({
  email: Yup.string().email("Inavalid email format").required("Email Required"),
  password: Yup.string()
    .min(6, "Min 6 character required")
    .required("Password Required"),
});

export default function LoginScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const onFooterLinkPress = () => {
    navigation.navigate("Registration");
  };

  const onLoginPress = (values, actions) => {
    setIsLoading(true);
    actions.resetForm();
    firebase
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then((response) => {
        const uid = response.user.uid;
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .get()
          .then((firestoreDocument) => {
            if (!firestoreDocument.exists) {
              alert("User does not exist anymore.");
              return;
            }
            const user = firestoreDocument.data();
            setIsLoading(false);
            navigation.navigate("Home", { user });
          })
          .catch((error) => {
            setIsLoading(false);
            alert(error);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        alert(error);
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
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={onLoginPress}
        >
          {(formik) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                onChangeText={formik.handleChange("email")}
                value={formik.values.email}
                onBlur={formik.handleBlur("email")}
              />
              <Text style={styles.errorText}>
                {formik.touched.email && formik.errors.email}
              </Text>

              <TextInput
                style={styles.input}
                placeholderTextColor="#aaaaaa"
                secureTextEntry
                placeholder="Password"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                onChangeText={formik.handleChange("password")}
                value={formik.values.password}
                onBlur={formik.handleBlur("password")}
              />
              <Text style={styles.errorText}>
                {formik.touched.password && formik.errors.password}
              </Text>
              {isLoading && <ActivityIndicator color="#788eec" />}

              <TouchableOpacity
                style={styles.button}
                onPress={formik.handleSubmit}
              >
                <Text style={styles.buttonTitle}>Log in</Text>
              </TouchableOpacity>
              <View style={styles.footerView}>
                <Text style={styles.footerText}>
                  Don't have an account?{" "}
                  <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                    Sign up
                  </Text>
                </Text>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
}
