import { View, Text, StyleSheet, Image, Linking } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image as ExpoImage } from "expo-image";
export default function Tab() {
  return (
    <View className="flex-1">
      <View className="flex flex-col items-center justify-center mt-8">
        <ExpoImage
          source={require("../../assets/images/videocorto.gif")} // ✅ Usa `require()`
          style={{ width: 200, height: 200, marginRight: 10 }}
        />

        <Text className="text-2xl font-bold mt-4">@Joel-Taco</Text>
      </View>

      <View className="flex flex-col items-center mt-8">
        <Text className="text-xl font-bold">Sobre mi</Text>
        <Text className="text-justify mt-4">
          Soy un desarrollador de software con experiencia en el desarrollo de
          aplicaciones web y móviles.
        </Text>
      </View>

      <View className="p-4">
        <Text className="text-xl font-bold mt-8">Habilidades</Text>
        <View className="flex flex-row flex-wrap mt-4 gap-4">
          <Text className="bg-blue-500 text-white px-4 py-2 rounded-full mr-2">
            React
          </Text>
          <Text className="bg-blue-500 text-white px-4 py-2 rounded-full mr-2">
            React Native
          </Text>
          <Text className="bg-blue-500 text-white px-4 py-2 rounded-full mr-2">
            Node.js
          </Text>
        </View>
      </View>

      <View className="p-4 flex flex-col items-start">
        <Text className="text-xl font-bold mt-2">Contacto</Text>
        <View className="flex flex-row items-center gap-4 mt-8">
          <Ionicons name="logo-github" size={24} color="black" />
          <Text
            className="text-xl font-bold text-blue-500 underline"
            onPress={() => Linking.openURL("https://github.com/Joel-Taco")}
          >
            GitHub
          </Text>
        </View>

        <View className="flex flex-row items-center gap-4 mt-8">
          <Ionicons name="logo-twitch" size={24} color="blue" />
          <Text
            className="text-xl font-bold text-blue-500 underline"
            onPress={() =>
              Linking.openURL(
                "https://www.twitch.tv/"
              )
            }
          >
            Twitch
          </Text>
        </View>
      </View>
    </View>
  );
}
