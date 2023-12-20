import app from "@/configs/firebaseConfig";
import axios from "axios";
import { router, useRootNavigation, useSegments } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
  return useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.

export function Provider(props: any) {
  const [user, setAuth] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  function useProtectedRoute(user) {
    const segments = useSegments();

    const [isNavigationReady, setNavigationReady] = useState(false);
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

    useEffect(() => {
      const inAuthGroup = segments[0] === "(auth)";
      const inCustomerGroup = segments[0] === "customer";
      const inRestaurantGroup = segments[0] === "restaurant";
      const inRootFolder = segments.length === 0;
      const inRegisterFile = segments[0] === "restaurantRegistration";

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

        setLoading(false);
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
            if (res.data?.admin) {
              if (res.data?.isRegistered) {
                if (
                  inAuthGroup ||
                  inRootFolder ||
                  inCustomerGroup ||
                  inRegisterFile
                ) {
                  router.replace("/restaurant/home");
                }
              } else {
                router.replace("/restaurantRegistration");
              }
            } else {
              if (
                inAuthGroup ||
                inRootFolder ||
                inRestaurantGroup ||
                inRegisterFile
              ) {
                router.replace("/customer/home");
              }
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [user, segments, authInitialized, isNavigationReady]);
  }

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuth(user);
      } else {
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
        authInitialized,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
