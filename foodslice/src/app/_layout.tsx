import { Slot } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-ui-lib';

export default function Layout() {
    return (
        <>
            <SafeAreaProvider>
                <Slot/>
            </SafeAreaProvider>
        </>
        
    );
  }
  