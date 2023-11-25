import app from "@/configs/firebaseConfig";
import axios from "axios";
import { router, useRootNavigation, useSegments } from "expo-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect } from "react";

const AuthContext = React.createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.

export function Provider(props: any) {
  const [user, setAuth] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);
  const [authInitialized, setAuthInitialized] = React.useState<boolean>(false);

  function useProtectedRoute(user) {
    const segments = useSegments();

    const [isNavigationReady, setNavigationReady] = React.useState(false);
    const rootNavigation = useRootNavigation();

    useEffect(() => {
      const unsubscribe = rootNavigation?.addListener("state", (event) => {
        setNavigationReady(true);
      });
      return function cleanup() {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [rootNavigation]);

    React.useEffect(() => {
      const inAuthGroup = segments[0] === "(auth)";
      const inCustomerGroup = segments[0] === "customer";
      const inRestaurantGroup = segments[0] === "restaurant";
      const inRootFolder = segments.length === 0;
      const inRegisterFile = segments[0] === 'restaurantRegistration'

      if (!isNavigationReady) {
        return;
      }

      if (!authInitialized) return;

      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !user &&
        !inAuthGroup
      ) {
        // Redirect to the sign-in page.
        router.replace("/login");
      } else if (user) {
        const auth = getAuth(app);

        axios
          .get(process.env.EXPO_PUBLIC_API_URL + "/users/getUser", {
            params: {
              uid: user.uid,
            },
          })
          .then((res) => {
            // if (inAuthGroup || inRootFolder) {
            //   if (res.data.admin) {
            //     if (res.data.isRegistered) router.replace("/restaurant/home");
            //     else router.replace("/restaurant/restaurantRegistration");
            //   } else {
            //     router.replace("/customer/home");
            //   }
            // } else if (inCustomerGroup && res.data.admin) {
            //   router.replace("/restaurant/home");
            // } else if (inRestaurantGroup && !res.data.admin) {
            //   router.replace("/customer/home");
            // }
            if (res.data.admin) {
              if (res.data.isRegistered) {
                if (inAuthGroup || inRootFolder || inCustomerGroup || inRegisterFile) {
                  router.replace("/restaurant/home");
                }
              } else {
                router.replace("/restaurantRegistration");
              }
            } else {
              if (inAuthGroup || inRootFolder || inRestaurantGroup || inRegisterFile) {
                router.replace("/customer/home");
              }
            }
          });

        // Redirect away from the sign-in page.
      }
    }, [user, segments, authInitialized, isNavigationReady]);
  }

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties

        setAuth(user);
        // ...
      } else {
        // User is signed out
        setAuth(null);
      }
      setAuthInitialized(true);
    });
  }, []);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        userInfo,
        authInitialized,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
