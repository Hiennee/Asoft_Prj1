import { Alert, View, FlatList } from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { IP } from "../shared/IP";
import { ScrollView } from "react-native-virtualized-view";
import { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";

export default function InvoiceNavigator(props)
{
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName = "InvoiceList"
        screenOptions = {{
            headerShown: false,
        }}>
            <Stack.Screen name="InvoiceList" component={InvoiceList} />
            <Stack.Screen name="AddInvoice" component={AddInvoice} />
            <Stack.Screen name="EditInvoice" component={EditInvoice} />
            <Stack.Screen name="DetailInvoice" component={DetailInvoice} />
            <Stack.Screen name="AddDetailInvoice" component={AddDetailInvoice} />
            <Stack.Screen name="EditDetailInvoice" component={EditDetailInvoice} />
        </Stack.Navigator>
    )
}

function InvoiceList(props)
{
    var { navigate } = props.navigation;
    var [ invoiceList, setInvoiceList ] = useState([]);

    useEffect(() => {
        getAllInvoices();
    }, [])
    function getAllInvoices()
    {
        fetch(IP + "invoices", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (respond) => {
            //console.log(respond)
            if (respond.status == 200)
            {
                setInvoiceList(await respond.json());
            }
        })
    }
    return (
        <ScrollView>
            <SafeAreaView>
                <Button title = "Thêm" onPress = {() => {
                    navigate("AddInvoice", {
                        navigation: props.navigation,
                        getAllInvoices,
                    })
                }} />
                <Text style = {{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Danh sách hóa đơn</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Mã HĐ</Text>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Mã KH</Text>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Ngày</Text>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Thao tác</Text>
                </View>
                <FlatList data = {invoiceList}
                renderItem={({ item, index }) => <Invoice iInfo = {item} navigation = {props.navigation} 
                                                          getAllInvoices = {getAllInvoices}/>}/>
            </SafeAreaView>
        </ScrollView>
    )
}

function Invoice(props)
{
    //console.log("From invoice:", props)
    var { iInfo, navigation, getAllInvoices } = props;
    var { navigate } = navigation;

    var [ toDelete, setToDelete ] = useState("");

    function alertDelete()
    {
        Alert.alert("THÔNG BÁO", `Bạn có chắc muốn xóa hóa đơn ${toDelete}?\n
                                  Điều này sẽ xóa tất cả chi tiết của hóa đơn đó`, [
            {
                text: "HỦY",
                onPress: () => {}
            },
            {
                text: "OK",
                onPress: () => {
                    fetch(IP + `invoices/${toDelete}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }).then((respond) => {
                        if (respond.status == 200)
                        {
                            Alert.alert("THÔNG BÁO", `Xóa hóa đơn ID ${toDelete} thành công`);
                            getAllInvoices();
                        }
                    }) 
                }
            }
        ], { cancelable: false })
    }
    var a = new Date(iInfo.InvoiceDate)
    //console.log(iInfo);
    return (
        <View>
            <SafeAreaView style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>{iInfo.InvoiceID}</Text>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>{iInfo.CustomerID}</Text>
                <Text style = {{ fontWeight: "100", fontSize: 20 }}>{a.toDateString()}</Text>
            </SafeAreaView>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Button title="Sửa" color="primary" onPress = {() => {
                    navigate("EditInvoice", { iInfo, navigation, getAllInvoices })
                }}/>
                <Button title="Xóa" color="warning" onPress = {() => {
                    setToDelete(iInfo.InvoiceID);
                    alertDelete();
                }}/>
                <Button title="Chi tiết" color="success" onPress = {() => {
                    navigate("DetailInvoice", { invoiceId: iInfo.InvoiceID, navigation, getAllInvoices })
                }}/>
            </View>
        </View>
    )
}

function AddInvoice(props)
{
    var { navigation, getAllInvoices } = props.route.params;
    var { navigate } = navigation;
    var [ invoiceId, setInvoiceId ] = useState(0);
    var [ customerId, setCustomerId ] = useState("");
    var [ dateIssued, setDateIssued ] = useState(new Date());

    function addInvoice()
    {
        if (invoiceId == 0 || customerId == "")
        {
            Alert.alert("Thông báo", "Vui lòng nhập đủ trường dữ liệu");
            return;
        }
        fetch(IP + `invoices/${invoiceId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerId,
                dateIssued,
            }),
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                Alert.alert("THÔNG BÁO", "Thêm hóa đơn thành công");
                getAllInvoices();
                navigation.goBack();
            }
            else if (respond.status == 301)
            {
                Alert.alert("THÔNG BÁO", `Mã hóa đơn ${invoiceId} đã tồn tại`);
            }
            else
            {
                Alert.alert("THÔNG BÁO", (await respond.json()).msg);
            }
        })
    }

    return (
        <SafeAreaView>
            <Text style={{ fontWeight: "bold", fontSize: 20,
                           textAlign: "center"
             }}>Thêm hóa đơn</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>Mã hóa đơn</Text>
            <Input value={ invoiceId } keyboardType="numeric"
            onChangeText={(txt) => {
                if (!isNaN(txt))
                    setInvoiceId(txt) 
            }}></Input>
            <Text>Mã khách hàng</Text>
            <Input value={ customerId }
            onChangeText={(txt) => { setCustomerId(txt) }} />
            <Text>Ngày</Text>
            <Input disabled value = { dateIssued.toDateString() } />
            <Button title="Chọn ngày" onPress={() => { DateTimePickerAndroid.open({
                value: dateIssued,
                mode: "datetime",
                onChange: (e, date) => {
                    setDateIssued(date);
                }
            }) }}/>
            
            <Button title="Thêm" onPress = {() => {
                addInvoice();
            }}/>
            <Button title="Hủy" onPress = {() => {
                navigation.goBack();
            }}/>
        </SafeAreaView>
    )
}

function EditInvoice(props)
{
    var { iInfo, navigation, getAllInvoices } = props.route.params;
    var { navigate } = navigation;
    var [ dateIssued, setDateIssued ] = useState(new Date(iInfo?.InvoiceDate) || new Date());

    function updateInvoice()
    {
        fetch(IP + `invoices/${iInfo.InvoiceID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dateIssued
            }),
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                getAllInvoices();
                //navigation.goBack();
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
             }}>Chỉnh sửa hóa đơn</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>ID</Text>
            <Input disabled value={iInfo.InvoiceID.toString()}></Input>
            <Text>Mã KH</Text>
            <Input disabled value={iInfo.CustomerID}/>
            <Text>Ngày</Text>
            <Input disabled value={ new Date(dateIssued).toDateString() }/>
            <Button title="Chọn ngày" onPress={() => { DateTimePickerAndroid.open({
                value: dateIssued,
                mode: "datetime",
                onChange: (e, date) => {
                    setDateIssued(date);
                }
            }) }}/>
            <Button title="Đổi" onPress = {() => {
                updateInvoice();
                navigation.goBack();
            }}/>
            <Button title="Hủy" onPress = {() => {
                navigation.goBack();
            }}/>
        </SafeAreaView>
    )
}

function DetailInvoice(props)
{
    //console.log("detail invoice:", props)
    var { navigation } = props;
    var { navigate } = navigation;
    var { invoiceId, getAllInvoices } = props.route.params;
    var [ invoiceDetail, setInvoiceDetail ] = useState([]);

    useEffect(() => {
        getInvoiceDetail();
    }, [])

    function getInvoiceDetail()
    {
        fetch(IP + `invdel/${invoiceId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(async (respond) => {
            setInvoiceDetail(await respond.json());
        })
    }
    return (
        <ScrollView>
            <SafeAreaView>
                <Button title = "Thêm" onPress = {() => {
                        navigate("AddDetailInvoice", {
                            navigation,
                            invoiceId,
                            getInvoiceDetail,
                        })
                    }} />
                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>ID</Text>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Mã hóa đơn</Text>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Mã sản phẩm</Text>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Số lượng</Text>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Thành tiền</Text>
                </View>
                <FlatList data = {invoiceDetail}
                renderItem={({ item, index }) => <ProductInvoiceDetail item = {item} navigate = {navigate}
                                                                       navigation={navigation} getInvoiceDetail={getInvoiceDetail}/>}/>
            </SafeAreaView>
        </ScrollView>
    )
}

function ProductInvoiceDetail(props)
{
    var { InvoiceDetailID, InvoiceID, ProductID, Quantity, TotalPrice } = props.item;
    var { navigate, navigation, getInvoiceDetail } = props;

    function deleteInvoiceDetail()
    {
        fetch(IP + `invdel/${InvoiceID}/${ProductID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((respond) => {
            if (respond.status == 200)
            {
                //Alert.alert("Xóa sản phẩm khỏi hóa đơn thành công");
                getInvoiceDetail();
                //navigation.goBack();
            }
            else
            {
                Alert.alert("Lỗi không xác định");
            }
        })
    }

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <Text style = {{ fontWeight: "bold", fontSize: 20 }}>{InvoiceDetailID}</Text>
            <Text style = {{ fontWeight: "bold", fontSize: 20 }}>{InvoiceID}</Text>
            <Text style = {{ fontWeight: "bold", fontSize: 20 }}>{ProductID}</Text>
            <Text style = {{ fontWeight: "bold", fontSize: 20 }}>{Quantity}</Text>
            <Text style = {{ fontWeight: "bold", fontSize: 20 }}>{TotalPrice}</Text>
            <View style = {{ flexDirection: "row" }}>
                <Button title="Sửa" onPress={() => {
                    navigate("EditDetailInvoice", {
                        InvoiceID,
                        ProductID,
                        Quantity,
                        navigation,
                        getInvoiceDetail,
                    })
                }}/>
                <Button title="Xóa" onPress={() => {
                    deleteInvoiceDetail();
                }}/>
            </View>
        </View>
    )
}

function AddDetailInvoice(props)
{
    var { navigation, invoiceId, getInvoiceDetail } = props.route.params;
    var [ productList, setProductList ] = useState([])
    var [ productId, setProductId ] = useState("");
    var [ quantity, setQuantity ] = useState(0);
    var [ isChose, setIsChose ] = useState(false);

    useEffect(() => {
        getAllProducts();
    }, [])
    function addProductToInvoice()
    {
        if (productId == "" || quantity == 0 || quantity == "")
        {
            Alert.alert("Thông báo", "Vui lòng nhập đủ trường dữ liệu");
            return;
        }
        fetch(IP + `invdel/${invoiceId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId,
                quantity,
            })
        }).then(async (respond) => {
            if (respond.status == 300)
            {
                Alert.alert("Thông báo", "Mã hóa đơn không tồn tại");
            }
            else if (respond.status == 301)
            {
                Alert.alert("Thông báo", "Mã sản phẩm không tồn tại");
            }
            else if (respond.status == 302)
            {
                Alert.alert("Thông báo", "Sản phẩm đã tồn tại trong hóa đơn đó");
            }
            else if (respond.status == 200)
            {
                Alert.alert("Thông báo", "Thêm sản phẩm vào hóa đơn thành công");
                getInvoiceDetail();
                navigation.goBack();
            }
            else
            {
                Alert.alert("Thông báo", "Lỗi không xác định: ", (await respond.json()).message);
            }
        })
    }
    function getAllProducts()
    {
        fetch(IP + "products", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                setProductList(await respond.json());
            }
        })
    }
    return (
        <SafeAreaView>
            <Text>Mã hóa đơn</Text>
            <Input disabled value = { invoiceId.toString() } />
            <Text>Mã sản phẩm</Text>
            <Picker onValueChange={ (val, idx) => { 
                setIsChose(true);
                setProductId(val) }}>
                {productList.map((item, index) => 
                <Picker.Item value = {item.ProductID} label={item.ProductName}
                style = {{ width: 200, height: 100 }} />)}
            </Picker>
            <Text>Số lượng</Text>
            <Input keyboardType="numeric" value = { quantity } onChangeText={(txt) => {
                if (!isNaN(txt))
                {
                    setQuantity(txt);
                }
            }}/>
            <Button title="Thêm" disabled={!isChose} onPress={() => {
                addProductToInvoice();
            }}/>
        </SafeAreaView>
    )
}

function EditDetailInvoice(props)
{
    var { navigation, getInvoiceDetail, InvoiceID, ProductID, Quantity } = props.route.params;
    //console.log(Quantity);
    var [ quantity, setQuantity ] = useState(Quantity);

    function EditProductInvoiceDetail()
    {
        fetch(IP + `invdel/${InvoiceID}/${ProductID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                quantity,
        })
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                Alert.alert("Thông báo", "Chỉnh sửa số lượng thành công");
                getInvoiceDetail();
                navigation.goBack();
            }
            else
            {
                Alert.alert("Thông báo", "Lỗi không xác định: ", (await respond.json()).message);
            }
        })
    }

    return (
        <SafeAreaView>
            <Text>Mã HĐ {InvoiceID}</Text>
            <Input disabled value = { InvoiceID.toString() } />
            <Text>Mã SP</Text>
            <Input disabled value = { ProductID } />
            <Text>Số lượng</Text>
            <Input value = { quantity.toString() } keyboardType="numeric" onChangeText={(txt) => {
                if (!isNaN(txt))
                {
                    setQuantity(txt);
                    console.log(InvoiceID);
                }
            }}/>
            <Button title="Lưu" onPress={() => {
                EditProductInvoiceDetail();
            }}/>
        </SafeAreaView>
    )
}