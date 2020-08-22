import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, HomeScreen, RegistrationScreen } from "./src/screens";
import { decode, encode } from "base-64";
import { firebase } from "./src/firebase/config";
import {
  AddProject,
  ProjectViewScreen,
  AddModule,
  ModuleViewScreen,
  AddResource,
  ViewResourceScreen,
} from "./src/screens/ProjectScreens";
import { MaterialCommunityIcons } from "@expo/vector-icons";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            setUser(userData);
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
      })
      .catch((error) => alert(error.message));
  };

  if (loading) {
    return <></>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              options={{
                headerRight: () => (
                  <MaterialCommunityIcons
                    name="logout"
                    size={30}
                    color="black"
                    onPress={logout}
                  />
                ),
              }}
            >
              {(props) => <HomeScreen {...props} extraData={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="AddProject"
              options={{ headerTitle: "Add Project" }}
              component={AddProject}
            />
            <Stack.Screen
              name="ProjectView"
              options={({ route }) => ({
                title: `Project: ${route.params.projectDetail.projectName}`,
              })}
              component={ProjectViewScreen}
            />
            <Stack.Screen
              name="AddModule"
              options={{ headerTitle: "Add Module" }}
              component={AddModule}
            />
            <Stack.Screen
              name="ModuleView"
              options={({ route }) => ({
                title: `Module: ${route.params.moduletDetail.moduleName}`,
              })}
              component={ModuleViewScreen}
            />
            <Stack.Screen
              name="AddResource"
              options={{ headerTitle: "Add Resource" }}
              component={AddResource}
            />
            <Stack.Screen
              name="ResourceView"
              options={{ headerTitle: "Resource Content" }}
              component={ViewResourceScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
