import { useAuth } from "@/contexts/auth";
import Notifications from "@/shared/notificationPage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-ui-lib";

const notifications = () => {
  

  return (
    <Notifications />
  );
};

export default notifications;
