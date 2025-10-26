import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

// --- INTERFACES CẦN THIẾT ---
interface CartItem {
  drink_id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}
// --- END INTERFACES ---

export default function OrderScene() {
  const db = useSQLiteContext();
  const navigation = useNavigation();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // --- 1. HÀM FETCH DỮ LIỆU TỪ DATABASE ---
  const fetchCartItems = async () => {
    try {
      const result = await db.getAllAsync<CartItem>(
        "SELECT * FROM cart_items;"
      );
      setCartItems(result);

      // Tính tổng tiền
      const total = result.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  // --- 2. HÀM CẬP NHẬT SỐ LƯỢNG (Giống như ở DrinksScreen) ---
  const updateQuantity = async (item: CartItem, change: 1 | -1) => {
    const newQuantity = item.quantity + change;

    try {
      if (newQuantity <= 0) {
        // XÓA KHỎI GIỎ HÀNG
        await db.runAsync(
          "DELETE FROM cart_items WHERE drink_id = ?;",
          item.drink_id
        );
      } else {
        // CẬP NHẬT SỐ LƯỢNG
        await db.runAsync(
          "UPDATE cart_items SET quantity = ? WHERE drink_id = ?;",
          newQuantity,
          item.drink_id
        );
      }

      // Cập nhật lại UI sau khi DB thay đổi
      fetchCartItems();
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  useEffect(() => {
    // Tải dữ liệu giỏ hàng khi màn hình được load
    fetchCartItems();
  }, []);

  // --- COMPONENT PHỤ TRỢ CHO TỪNG ITEM ---
  const renderItem = ({ item }: { item: CartItem }) => {
    const subTotal = (item.price * item.quantity).toFixed(2);

    return (
      <View style={styles.itemCard}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />

        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>

        <View style={styles.itemQuantityControl}>
          <TouchableOpacity
            onPress={() => updateQuantity(item, -1)}
            style={styles.controlButtonRed}
          >
            <Ionicons name="remove-outline" size={20} color="white" />
          </TouchableOpacity>

          <Text style={styles.itemQuantity}>{item.quantity}</Text>

          <TouchableOpacity
            onPress={() => updateQuantity(item, 1)}
            style={styles.controlButtonGreen}
          >
            <Ionicons name="add-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Ionicons name="search" size={24} color="green" />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.drink_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* CAFE DELIVERY HEADER */}
            <View
              style={[
                styles.orderHeaderCard,
                { backgroundColor: "rgb(0, 189, 214)" },
              ]}
            >
              <View>
                <Text style={styles.headerText}>CAFE DELIVERY</Text>
                <Text style={styles.headerText}>Order #18</Text>
              </View>
              <Text style={styles.headerText}>$5</Text>
            </View>

            {/* CAFE MAIN HEADER */}
            <View
              style={[
                styles.orderHeaderCard,
                { backgroundColor: "rgb(131, 83, 226)" },
              ]}
            >
              <View>
                <Text style={styles.headerText}>CAFE</Text>
                <Text style={styles.headerText}>Order #18</Text>
              </View>
              <Text style={styles.headerText}>${totalPrice.toFixed(2)}</Text>
            </View>
          </>
        }
      />

      {/* PAY NOW BUTTON (Footer) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>PAY NOW</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 10,
  },
  orderHeaderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  itemQuantityControl: {
    flexDirection: "row",
    alignItems: "center",
    width: 120, // Chiều rộng cố định cho vùng điều khiển
    justifyContent: "space-between",
  },
  itemQuantity: {
    fontSize: 18,
    fontWeight: "bold",
    minWidth: 25,
    textAlign: "center",
  },
  controlButtonRed: {
    backgroundColor: "#dc3545", // Red
    padding: 4,
    borderRadius: 12,
  },
  controlButtonGreen: {
    backgroundColor: "#28a745", // Green
    padding: 4,
    borderRadius: 12,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
  },
  payButton: {
    backgroundColor: "#ffc107", // Orange/Amber
    padding: 15,
    borderRadius: 10,
  },
  payButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});
