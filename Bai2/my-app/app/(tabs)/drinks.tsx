import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

// Interface để theo dõi số lượng item trong UI
interface CartItem {
  drink_id: number;
  quantity: number;
}
interface Drink {
  id: number;
  name: string;
  image: string;
  price: number;
}

const API_URL = "https://68fced9196f6ff19b9f6badd.mockapi.io/drinks";

export default function DrinksScreen() {
  const db = useSQLiteContext();
  const [data, setData] = useState<Drink[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // State: Giỏ hàng hiện tại
  const navigation = useNavigation();

  // --- HÀM 1: Lấy số lượng giỏ hàng hiện tại từ DB ---
  const fetchCartItems = async () => {
    try {
      // Lấy tất cả các mục trong giỏ hàng
      const result = await db.getAllAsync<CartItem>(
        "SELECT drink_id, quantity FROM cart_items;"
      );
      setCartItems(result);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  // --- HÀM 2: Cập nhật giỏ hàng (Tăng, Giảm, Xóa) ---
  const updateCartQuantity = async (drink: Drink, change: 1 | -1) => {
    const currentItem = cartItems.find((item) => item.drink_id === drink.id);
    const currentQuantity = currentItem ? currentItem.quantity : 0;
    const newQuantity = currentQuantity + change;

    try {
      if (newQuantity <= 0) {
        // XÓA KHỎI GIỎ HÀNG
        await db.runAsync(
          "DELETE FROM cart_items WHERE drink_id = ?;",
          drink.id
        );
      } else if (currentQuantity === 0) {
        // TẠO MỚI (CHỈ XẢY RA KHI BẤM NÚT +)
        await db.runAsync(
          "INSERT INTO cart_items (drink_id, name, price, image, quantity) VALUES (?, ?, ?, ?, ?);",
          drink.id,
          drink.name,
          drink.price,
          drink.image,
          newQuantity
        );
      } else {
        // CẬP NHẬT SỐ LƯỢNG
        await db.runAsync(
          "UPDATE cart_items SET quantity = ? WHERE drink_id = ?;",
          newQuantity,
          drink.id
        );
      }

      // Sau khi DB thay đổi, cập nhật lại State UI
      fetchCartItems();
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  // --- LOGIC LÀM MỚI (THEO YÊU CẦU) ---
  // Sử dụng useFocusEffect để chạy fetchCartItems mỗi khi màn hình DrinksScreen được lấy nét (quay về)
  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
      // Không cần cleanup function
    }, [])
  );
  // --- END LOGIC LÀM MỚI ---

  useEffect(() => {
    async function fetchData() {
      const resp = await fetch(API_URL);
      const data = await resp.json();
      setData(data[0]?.drinks || []);

      // Sau đó, fetch cart items sẽ tự động chạy thông qua useFocusEffect
    }
    fetchData();
  }, []);

  // --- Hàm tìm số lượng hiện tại cho UI ---
  const getQuantity = (id: number): number => {
    return cartItems.find((item) => item.drink_id === id)?.quantity || 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="search-outline" size={24} color={"green"} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
            <View style={styles.itemControls}>
              {/* SỐ LƯỢNG HIỆN TẠI (Được cập nhật từ state cartItems) */}
              <Text style={styles.itemQuantityText}>
                {getQuantity(item.id)}
              </Text>

              {/* NÚT TĂNG (+) */}
              <TouchableOpacity
                style={styles.controlButtonGreen}
                onPress={() => updateCartQuantity(item, 1)}
              >
                <Text style={styles.controlButtonText}>+</Text>
              </TouchableOpacity>

              {/* NÚT GIẢM (-) */}
              {getQuantity(item.id) > 0 && (
                <TouchableOpacity
                  style={styles.controlButtonRed}
                  onPress={() => updateCartQuantity(item, -1)}
                >
                  <Text style={styles.controlButtonText}>-</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("order")}
        >
          <Text style={styles.cartButtonText}>GO TO CART</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    margin: 10,
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  itemCard: {
    padding: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    justifyContent: "space-between",
    padding: 10,
    flex: 1,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 14,
    color: "gray",
  },
  itemControls: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-end", // Căn chỉnh sang phải
    alignItems: "center",
    minWidth: 120,
  },
  itemQuantityText: {
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 10,
  },
  controlButtonGreen: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 16,
    marginRight: 5,
    minWidth: 32,
    alignItems: "center",
  },
  controlButtonRed: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 16,
    minWidth: 32,
    alignItems: "center",
  },
  controlButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cartButton: {
    backgroundColor: "orange",
    padding: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
  },
  cartButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
