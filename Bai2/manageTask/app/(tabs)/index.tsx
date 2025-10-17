import { StyleSheet,View,Text,Image, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function HomeScreen() {
    const [name, setName] = useState("")
    const handleChange = (text:any) => {
      setName(text)
    }
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../../assets/images/Image 95.png')}></Image>
        <Text style={styles.title}>
          MANAGE YOUR TASK
        </Text>
        <TextInput style={styles.input} placeholder='Enter your name' value={name} onChangeText={handleChange}></TextInput>
        <Link href={{pathname: "/listTask", params:{
          name: name
        }}} asChild>
          <TouchableOpacity style={styles.button}>GET STARTED
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </Link>
      </View>
    )
}

const styles = StyleSheet.create({
  button: {
    fontSize: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(0, 189, 214)",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    margin: 10,
    color: "white"
  },
  input: {
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
    width: "100%",
  },
  image: {
    width: 150,
    height: 150,
  },
  title: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: "purple"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
