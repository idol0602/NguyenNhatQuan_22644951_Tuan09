import {View,Text,StyleSheet,TouchableOpacity,Image,TextInput, Alert} from "react-native"
import {useRouter, useLocalSearchParams} from "expo-router"
import {Ionicons} from "@expo/vector-icons"
import {useState} from "react"

type jobItem = {
    id: number,
    title : string
}

export default function AddTaskScreen () {
    const [newTask, setNewTask] = useState("");
    const router = useRouter();
    const { name, jobs } = useLocalSearchParams(); 
    
    const goBack = () => {
        router.back();
    }

    const handleFinish = () => {
        if(newTask.trim().length > 0) {
            
            let jobsArray: jobItem[] = [];
            if (typeof jobs === 'string') {
                try {
                    jobsArray = JSON.parse(jobs);
                } catch (e) {
                    Alert.alert("Lỗi", "Không thể tải dữ liệu công việc cũ.");
                    router.back();
                    return;
                }
            }

            const newJobItem: jobItem = {
                id: Date.now(),
                title: newTask.trim()
            };
            const updatedJobsArray = [...jobsArray, newJobItem];

            const updatedJobsString = JSON.stringify(updatedJobsArray);

            router.replace({
                pathname: "/listTask",
                params: {
                    name: name, // Giữ lại name
                    newJobs: updatedJobsString // Gửi MẢNG jobs MỚI
                }
            });
        } else {
            Alert.alert("Lỗi", "Vui lòng nhập tên công việc!");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Ionicons name="chevron-back" size={24} color="black"/>
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <Image style={styles.avatar} source={require("../../assets/images/Frame.png")}/>
                    <View>
                        <Text style={styles.greetingText}>Hi {name}</Text>
                        <Text>Have a great day ahead</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.addTaskTitle}>ADD YOUR JOB</Text>
                
                <TextInput 
                    style={styles.input} 
                    placeholder="input your job"
                    value={newTask}
                    onChangeText={setNewTask}
                />
                
                <TouchableOpacity style={styles.button} onPress={handleFinish}>
                    <Text style={styles.buttonText}>FINISH</Text> 
                    <Ionicons name="chevron-forward" size={24} color="white" style={{marginLeft: 8}}/>
                </TouchableOpacity>
            </View>

            <Image style={styles.image} source={require('../../assets/images/Image 95.png')}></Image>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    container: { 
        flex: 1, 
        paddingTop: 50, 
        paddingHorizontal: 20, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        width: '100%',
        marginBottom: 30,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 'auto',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    greetingText: {
        fontWeight: "bold", 
        fontSize: 16
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    addTaskTitle: {
        fontWeight: "bold", 
        fontSize: 24,
        marginBottom: 20,
        color: '#333'
    },
    input: {
        marginVertical: 10,
        padding: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        width: "100%",
        fontSize: 16,
    },
    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(0, 189, 214)",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
        margin: 10,
        elevation: 3,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "white"
    }
})