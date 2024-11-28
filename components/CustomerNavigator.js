import { Alert, View, FlatList, Dimensions } from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { IP } from "../shared/IP";
import { ScrollView } from "react-native-virtualized-view";
import { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

export default function CustomerNavigator(props)
{
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName = "CustomerList"
        screenOptions = {{
            headerShown: false,
        }}>
            <Stack.Screen name="CustomerList" component={CustomerList} />
            <Stack.Screen name="CustomerDetail" component={CustomerDetail} />
            <Stack.Screen name="AddCustomer" component={AddCustomer} />
            <Stack.Screen name="EditCustomer" component={EditCustomer} />
            <Stack.Screen name="DeleteCustomer" component={DeleteCustomer} />
        </Stack.Navigator>
    )
}

function CustomerList(props)
{
    var { navigate } = props.navigation;
    var [ CustomerList, setCustomerList ] = useState([]);

    useEffect(() => {
        getAllCustomers();
    }, [])
    function getAllCustomers()
    {
        fetch(IP + "customers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                setCustomerList(await respond.json());
            }
        })
    }
    return (
        <ScrollView>
            <SafeAreaView>
                <Button title = "Thêm" onPress = {() => {
                    navigate("AddCustomer", {
                        navigation: props.navigation,
                        getAllCustomers,
                    })
                }} />
                <Text style = {{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Danh sách khách hàng</Text>
                <FlatList data = {CustomerList}
                renderItem={({ item, index }) => <Customer cInfo = {item} navigation = {props.navigation} 
                                                          getAllCustomers = {getAllCustomers}/>}/>
            </SafeAreaView>
        </ScrollView>
    )
}

function Customer(props)
{
    var { cInfo, navigation, getAllCustomers } = props;
    var { navigate } = navigation;

    var [ toDelete, setToDelete ] = useState("");

    function alertDelete()
    {
        //console.log(1);
        Alert.alert("THÔNG BÁO", `Bạn có chắc muốn xóa khách hàng ${toDelete}?`, [
            {
                text: "HỦY",
                onPress: () => {}
            },
            {
                text: "OK",
                onPress: () => {
                    fetch(IP + `customers/${toDelete}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }).then((respond) => {
                        if (respond.status == 200)
                        {
                            Alert.alert("THÔNG BÁO", `Xóa khách hàng ID ${toDelete} thành công`);
                            getAllCustomers();
                        }
                        else if (respond.status == 301)
                        {
                            Alert.alert("THÔNG BÁO", "Khách hàng tồn tại trong hóa đơn, không thể xóa!");
                        }
                    }) 
                }
            }
        ], { cancelable: false })
    }
    //Dimensions
    //console.log(cInfo);
    return (
        <SafeAreaView style={{ flexDirection: "column", justifyContent: "space-evenly", }}>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Mã KH:</Text>
                <Text style = {{ fontSize: 20 }}>{cInfo.CustomerID}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Tên:</Text>
                <Text style = {{ fontSize: 20 }}>{cInfo.CustomerName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20, borderWidth: 1,
                    borderColor: "white"
                 }}>SĐT:</Text>
                <Text style = {{ fontSize: 20, borderWidth: 1,  borderColor: "white" }}>{cInfo.Phone}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Button title="Sửa" color="primary" onPress = {() => {
                    navigate("EditCustomer", { cInfo, navigation, getAllCustomers })
                }}/>
                <Button title="Xóa" color="warning" onPress = {() => {
                    setToDelete(cInfo.CustomerID);
                    alertDelete();
                }}/>
                <Button title = "Xem" onPress={() => {
                    navigate("CustomerDetail", { cInfo });
                }} />
            </View>
            
            <Text style = {{ textAlign: "center" }}>----------------------</Text>
        </SafeAreaView>
    )
}

function CustomerDetail(props)
{
    var { cInfo } = props.route.params;
    //console.log(props);
    return (
        <SafeAreaView style = {{ marginVertical: 30 }}>
            <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>Chi tiết khách hàng {cInfo.CustomerID}</Text>
            <View style={{ marginBottom: 20 }}/>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tên khách hàng: {cInfo.CustomerName}</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>SĐT: {cInfo.Phone}</Text>
            <Text style={{ textAlign: "center" }}>------------------------------</Text>
        </SafeAreaView>
    )
}

function AddCustomer(props)
{
    var { navigation, getAllCustomers } = props.route.params;
    var { navigate } = navigation;
    var [ customerId, setcId ] = useState("");
    var [ customerName, setcName ] = useState("");
    var [ customerPhone, setcPhone ] = useState("");

    function addCustomer()
    {
        if (customerId == "" || customerName == "" || customerPhone == "")
        {
            Alert.alert("ID, Tên, SĐT không được để trống");
            return;
        }
        customerId = customerId.trim();
        customerName = customerName.trim();
        customerPhone = Number(customerPhone.toString().trim());

        fetch(IP + `customers/${customerId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerName,
                customerPhone,
            }),
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                Alert.alert("THÔNG BÁO", "Thêm khách hàng thành công");
                //navigation.goBack();
                //getAllCustomers();
            }
            else if (respond.status == 301)
            {
                Alert.alert("THÔNG BÁO", `Mã khách hàng ${customerId} đã tồn tại`)
                //navigation.goBack();
            }
            else
            {
                Alert.alert("THÔNG BÁO", (await respond.json()).msg)
                //navigation.goBack();
            }
        })
    }

    return (
        <SafeAreaView>
            <Text style={{ fontWeight: "bold", fontSize: 20,
                           textAlign: "center"
             }}>Thêm khách hàng</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>Mã khách hàng</Text>
            <Input value={ customerId }
            onChangeText={(txt) => { setcId(txt.toUpperCase().trim()) }}></Input>
            <Text>Tên khách hàng</Text>
            <Input value={ customerName }
            onChangeText={(txt) => { setcName(txt) }} />
            <Text>Số điện thoại</Text>
            <Input value={ customerPhone } keyboardType="numeric"
            onChangeText={ (txt) => {
                if(!isNaN(txt))
                {
                    setcPhone(txt)
                }
            }} />
            <Button title="Thêm" onPress = {() => {
                addCustomer();
                navigation.goBack();
                getAllCustomers();
            }}/>
            <Button title="Hủy" onPress = {() => {
                navigation.goBack();
            }}/>
            <Button title="Thêm tiếp" onPress = {() => {
                addCustomer();
                setcId("");
                setcName("");
                setcPhone("");
            }} />
        </SafeAreaView>
    )
}
function EditCustomer(props)
{
    var { cInfo, navigation, getAllCustomers } = props.route.params;
    var { navigate } = navigation;
    var [ customerName, setcName ] = useState(cInfo?.CustomerName || "");
    var [ customerPhone, setcPhone ] = useState(cInfo?.Phone || 0);

    function updateCustomer()
    {
        fetch(IP + `customers/${cInfo.CustomerID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerName,
                customerPhone
            }),
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                getAllCustomers();
                navigation.goBack();
            }
            else
            {
                console.log("??");
                navigation.goBack();
            }
        })
    }

    return (
        <SafeAreaView>
            <Text style={{ fontWeight: "bold", fontSize: 20,
                           textAlign: "center"
             }}>Chỉnh sửa khách hàng</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>Mã khách hàng</Text>
            <Input disabled value={cInfo.CustomerID}></Input>
            <Text>Tên khách hàng</Text>
            <Input value={ customerName }
            onChangeText={(txt) => { setcName(txt) }} />
            <Text>Số điện thoại</Text>
            <Input value={ customerPhone } keyboardType="numeric"
            onChangeText={ (txt) => {
                setcPhone(Number(txt))
            }} />
            <Button title="Đổi" onPress = {() => {
                updateCustomer();
            }}/>
            <Button title="Hủy" onPress = {() => {
                navigation.goBack();
            }}/>
        </SafeAreaView>
    )
}

function DeleteCustomer(props)
{
    return (
        <View>

        </View>
    )
}