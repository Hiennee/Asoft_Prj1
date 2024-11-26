import { View } from "react-native";
import { Text } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeNavigator(props)
{
    const { navigate } = props.navigation;
    return (
        <SafeAreaView style = {{ flex: 1, backgroundColor: "#29C1C0" }}>
            <Text style = {{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>Ứng dụng quản lý cửa hàng</Text>
            <View style = {{ marginVertical: 20 }} />
            <View style = {{ flexDirection: "row", backgroundColor: "white", justifyContent: "space-evenly",
                             borderRadius: 25, paddingBottom: 100, 
                             marginHorizontal: 20, paddingHorizontal: 50, paddingVertical: 50 }}>
                <TouchableOpacity onPress = {() => {
                    navigate("Customer");
                }}>
                    <View style = {{ flexDirection: "column", justifyContent: "center" }}>
                        <MaterialCommunityIcons name="human-queue" size={30} color="black" />
                        <Text>Khách hàng</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigate("Product");
                }}>
                    <View style = {{ flexDirection: "column", justifyContent: "center" }}>
                        <FontAwesome6 name="boxes-stacked" size={30} color="black" />
                        <Text>Sản phẩm</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigate("Invoice");
                }}>
                    <View style = {{ flexDirection: "column", justifyContent: "center" }}>
                        <FontAwesome5 name="file-invoice" size={30} color="black" />
                        <Text>Hóa đơn</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}