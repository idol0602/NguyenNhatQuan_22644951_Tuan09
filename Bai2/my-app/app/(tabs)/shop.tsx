import { View, StyleSheet, FlatList, Text } from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const cafes = [
  {
    id: 1,
    name: "Kitanda Espresso & Acai-U District",
    address: "1121 NE 45 St",
    status: "Accepting Orders",
    time: "5-10 minutes",
    image: require("../../assets/images/Image.png"),
  },
  {
    id: 2,
    name: "Jewel Box Cafe",
    address: "1145 GE 54 St",
    status: "Temporary Unavailable",
    time: "10-15 minutes",
    image: require("../../assets/images/Image (1).png"),
  },
  {
    id: 3,
    name: "Javasti Cafe",
    address: "1167 GE 54 St",
    status: "Temporary Unavailable",
    time: "15-20 minutes",
    image: require("../../assets/images/Image (2).png"), // FIX: Sửa lỗi chính tả 'mage' thành 'image'
  },
  // Thêm nhiều item hơn để đảm bảo khả năng cuộn
  {
    id: 4,
    name: "The Blue Mug",
    address: "404 1st Ave",
    status: "Accepting Orders",
    time: "5-10 minutes",
    image: require("../../assets/images/Image.png"),
  },
  {
    id: 5,
    name: "City Grind",
    address: "505 2nd St",
    status: "Accepting Orders",
    time: "10-15 minutes",
    image: require("../../assets/images/Image (1).png"),
  },
  {
    id: 6,
    name: "Morning Buzz",
    address: "606 3rd Blvd",
    status: "Temporary Unavailable",
    time: "15-20 minutes",
    image: require("../../assets/images/Image (2).png"),
  },
];

export default function ShopScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="search-outline" size={24} color={"green"} />
      </View>
      <FlatList
        data={cafes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isUnavailable = item.status === "Temporary Unavailable";
          const statusColor = isUnavailable ? "red" : "green";

          return (
            <Card
              style={styles.cardItem}
              onPress={() => navigation.navigate("drinks")}
              disabled={isUnavailable}
            >
              <Card.Cover
                source={item.image}
                style={styles.cardCover}
                resizeMode="cover"
              />
              <Card.Content style={styles.cardContent}>
                <View style={styles.statusRow}>
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {item.status}
                  </Text>
                  <Text style={styles.timeText}>• {item.time}</Text>
                </View>
                <Text style={styles.cafeName}>{item.name}</Text>
                <Text style={styles.cafeAddress}>{item.address}</Text>
              </Card.Content>
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    alignItems: "flex-end",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  cardItem: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3, // Thêm đổ bóng nhẹ
    width: "100%",
  },
  cardCover: {
    height: 140,
  },
  cardContent: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 5,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  timeText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#666",
  },
  cafeName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  cafeAddress: {
    fontSize: 14,
    color: "#666",
  },
});
