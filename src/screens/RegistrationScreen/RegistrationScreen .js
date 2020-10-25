import React, { useState } from "react";
import {
  Alert,
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

const registrationSchema = Yup.object({
  fullName: Yup.string().required("Name Required"),
  email: Yup.string().email("Inavalid email format").required("Email Required"),
  password: Yup.string()
    .min(6, "Min 6 character required")
    .required("Password Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Password must match")
    .min(6, "Min 6 character required")
    .required("Confirm Password Required"),
});

export default function RegistrationScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const onFooterLinkPress = () => {
    navigation.navigate("Login");
  };

  const onRegisterPress = (values, actions) => {
    setIsLoading(true);
    actions.resetForm();
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((response) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          email: values.email,
          fullName: values.fullName,
        };
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            setIsLoading(false);
            navigation.navigate("Home", { user: data });
          })
          .catch((error) => {
            setIsLoading(false);
            alert(error.message);
          });
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
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={registrationSchema}
          onSubmit={onRegisterPress}
        >
          {(formik) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                onChangeText={formik.handleChange("fullName")}
                value={formik.values.fullName}
                onBlur={formik.handleBlur("fullName")}
              />
              <Text style={styles.errorText}>
                {formik.touched.fullName && formik.errors.fullName}
              </Text>

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

              <TextInput
                style={styles.input}
                placeholderTextColor="#aaaaaa"
                secureTextEntry
                placeholder="Confirm Password"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                onChangeText={formik.handleChange("confirmPassword")}
                value={formik.values.confirmPassword}
                onBlur={formik.handleBlur("confirmPassword")}
              />
              <Text style={styles.errorText}>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword}
              </Text>
              {isLoading && <ActivityIndicator color="#788eec" />}
              <TouchableOpacity
                style={styles.button}
                onPress={formik.handleSubmit}
              >
                <Text style={styles.buttonTitle}>Create account</Text>
              </TouchableOpacity>
              <View style={styles.footerView}>
                <Text style={styles.footerText}>
                  Already got an account?{" "}
                  <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                    Log in
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
