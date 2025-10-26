import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome to Cafe world</Text>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          style={styles.image}
          source={require("../../assets/images/Image.png")}
        />
        <Image
          style={styles.image}
          source={require("../../assets/images/Image (1).png")}
        />
        <Image
          style={styles.image}
          source={require("../../assets/images/Image (2).png")}
        />
      </View>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("shop")}
        >
          GET STARTED
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 40,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  button: {
    padding: 10,
    backgroundColor: "blue",
    textAlign: "center",
    color: "white",
    margin: 20,
    borderRadius: 10,
  },
  image: {
    margin: 20,
    width: 200,
    height: 100,
  },
});
