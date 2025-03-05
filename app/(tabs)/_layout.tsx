import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import '@/polyfills';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="index"
                options={{
                title: 'Predicción Electoral',
                    tabBarIcon: ({ color }) => <Ionicons name='chatbubble' size={20} color={color} />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color }) => <Ionicons name='chatbubble' size={20} color={color} />,
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'About',
                    tabBarIcon: ({ color }) => <Ionicons name='person-circle-outline' size={20} color={color} />,
                }}
            />
        </Tabs>
    );
}
