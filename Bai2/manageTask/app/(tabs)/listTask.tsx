import {View,Text,FlatList,StyleSheet,TouchableOpacity,Image,TextInput} from "react-native"
import {useRouter, useLocalSearchParams,Link} from "expo-router"
import {Ionicons} from "@expo/vector-icons"
import {useState, useEffect} from "react"

type jobItem = {
    id: number,
    title : string
}

const INITIAL_JOBS: jobItem[] = [];

export default function ListTaskScreen () {
    const [jobs, setJobs] = useState<jobItem[]>(INITIAL_JOBS)
    const [filterJob, setFilterJob] = useState<jobItem[]>(INITIAL_JOBS) 
    const router = useRouter();
    const { name, newJobs } = useLocalSearchParams(); 
    const goBack = () => {
        if(router.canGoBack()) {
            router.back();
        }
    }
    useEffect(()=>{
        if(typeof newJobs === 'string' && newJobs.trim() !== '') {
            try {
                const newJobsArray: jobItem[] = JSON.parse(newJobs);
                setJobs(prevJobs => [...newJobsArray]); 
                router.setParams({ newJobs: undefined }); 
            } catch (e) {
                router.setParams({ newJobs: undefined }); 
            }
        }
    },[newJobs, router]);

    useEffect(()=> {
        setFilterJob(jobs)
    },[jobs])

    const handleSearch = (key: string) => {
        if(key.trim() === "") {
            setFilterJob(jobs)
            return
        }
        const lowerKey = key.toLowerCase();
        const newFilterJobs = jobs.filter(item => item.title.toLowerCase().includes(lowerKey))
        setFilterJob(newFilterJobs)
    }

    const jobsString = JSON.stringify(jobs);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={{marginRight: "auto"}} onPress={goBack}>
                    <Ionicons name="chevron-back" size={24} color="black"/>
                </TouchableOpacity>
                <Image style={styles.avatar} source={require("../../assets/images/Frame.png")}/>
                <View>
                    <Text style={styles.greetingText}>Hi {name}</Text>
                    <Text>Have a great day ahead</Text>
                </View>
            </View>
            
            <TextInput style={styles.input} placeholder="Search" onChangeText={handleSearch}/>
            
            {/* SỬA LỖI CUỘN: View bao quanh FlatList có flex: 1 */}
            <View style={styles.flatListWrapper}> 
                <FlatList 
                    data={filterJob} 
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.item}>
                                <Ionicons name="checkmark-circle" size={20} color={"green"}/>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                            </View>
                        )
                    }}
                    ListEmptyComponent={() => (
                         <Text style={styles.emptyText}>Chưa có công việc nào.</Text>
                    )}
                />
            </View>
            
            <Link 
                href={{
                    pathname: "/addTask", 
                    params:{ 
                        name: name,
                        jobs: jobsString 
                    }
                }} 
                asChild
            >
                <TouchableOpacity style={styles.buttonAdd}>
                    <Text style={styles.buttonAddText}>+</Text>
                </TouchableOpacity>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingTop: 50, // Padding cho Status Bar
        paddingHorizontal: 20, 
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        width: '100%',
        marginBottom: 10,
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
    input: {
        marginVertical: 10,
        padding: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        width: "100%",
    },
    flatListWrapper: {
        flex: 1, // FIX: Đảm bảo FlatList chiếm hết không gian còn lại
        width: '100%',
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        marginVertical: 5,
        width: '100%',
    },
    itemTitle: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: "600",
        flex: 1, 
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#888',
    },
    // SỬA LỖI STYLE
    buttonAdd: {
        position: 'absolute', 
        bottom: 30,
        right: 20,
        justifyContent: "center",
        alignItems: "center",
        width: 60,
        height: 60,
        backgroundColor: "rgb(0, 189, 214)",
        borderRadius: 30, // Dùng số thay vì "50%"
        elevation: 5, 
    },
    buttonAddText: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        lineHeight: 30,
    }
})