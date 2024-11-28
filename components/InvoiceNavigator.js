import { Alert, View, FlatList } from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { IP } from "../shared/IP";
import { ScrollView } from "react-native-virtualized-view";
import { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { AppContext } from "./AppContext";

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
            <Stack.Screen name="InvoiceDetail" component={InvoiceDetail} />
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
        <SafeAreaView>
            <Text style = {{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Danh sách hóa đơn</Text>
            <View style = {{ flexDirection: "row", justifyContent: "space-around" }}>
                <View />
                <Button title = "Thêm" onPress = {() => {
                    navigate("AddProduct", {
                        navigation: props.navigation,
                        getAllInvoices,
                    })
                }} />
            </View>
            <ScrollView>
                <FlatList data = {invoiceList}
                renderItem={({ item, index }) => <Invoice iInfo = {item} navigation = {props.navigation} 
                                                        getAllInvoices = {getAllInvoices}/>}/>
            </ScrollView>
        </SafeAreaView>
    )
}

function Invoice(props)
{
    //console.log("From invoice:", props)
    var { iInfo, navigation, getAllInvoices } = props;
    console.log("From invoice", iInfo)
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
            <SafeAreaView style={{ flexDirection: "column", justifyContent: "space-evenly" }}>
                <View style = {{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Mã HĐ:</Text>
                    <Text style = {{ fontSize: 20 }}>{iInfo.InvoiceID}</Text>
                </View>
                <View style = {{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Mã KH:</Text>
                    <Text style = {{ fontSize: 20 }}>{iInfo.CustomerID}</Text>
                </View>
                <View style = {{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Giá trị:</Text>
                    <Text style = {{ fontSize: 20 }}>{iInfo.TotalPrice}</Text>
                </View>
                <View style = {{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
                    <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Ngày:</Text>
                    <Text style = {{ fontSize: 20 }}>{a.toLocaleString()}</Text>
                </View>
                
                <Text style = {{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>-----------------------------</Text>
            </SafeAreaView>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Button title="Sửa" color="primary" onPress = {() => {
                    navigate("EditInvoice", { iInfo, navigation, getAllInvoices })
                }}/>
                <Button title="Xóa" color="warning" onPress = {() => {
                    setToDelete(iInfo.InvoiceID);
                    alertDelete();
                }}/>
                <Button title="Xem" onPress={() => {
                    navigate("InvoiceDetail", { iInfo });
                }} />
                <Button title="Chi tiết" color="success" onPress = {() => {
                    navigate("DetailInvoice", { invoiceId: iInfo.InvoiceID, navigation, getAllInvoices })
                }}/>
            </View>
        </View>
    )
}

function InvoiceDetail(props)
{
    var { iInfo } = props.route.params;
    var [ iDetail, setIDetail ] = useState({
        InvoiceID: 0,
        CustomerID: "",
        CustomerName: "",
        InvoiceDate: new Date(),
        TotalPrice: 0,
    })

    useEffect(() => {
        getInvoiceDetail();
    }, [])

    function getInvoiceDetail()
    {
        fetch(IP + `invoices/${iInfo.InvoiceID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                setIDetail(await respond.json());
            }
        })
    }
    return (
        <SafeAreaView style = {{ marginVertical: 30 }}>
            <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>Chi tiết hóa đơn {iInfo.InvoiceID}</Text>
            <View style={{ marginBottom: 20 }}/>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Mã khách hàng: {iDetail.CustomerID}</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tên khách hàng: {iDetail.CustomerName}</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Giá trị: {iDetail.TotalPrice} $</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Ngày lập: {new Date(iDetail.InvoiceDate).toDateString()}</Text>
            <Text style={{ textAlign: "center" }}>------------------------------</Text>
        </SafeAreaView>
    )
}

function AddInvoice(props)
{
    var { navigation, getAllInvoices } = props.route.params;
    var { navigate } = navigation;
    var [ invoiceId, setInvoiceId ] = useState(0);
    var [ customerId, setCustomerId ] = useState("");
    var [ dateIssued, setDateIssued ] = useState(new Date());
    var [ customerList, setCustomerList ] = useState([]);
    var [ isChose, setIsChose ] = useState(false);

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
            <Picker onValueChange={ (val, idx) => { 
                setIsChose(true);
                setCustomerId(val) 
            }}>
                {customerList.map((item, index) => 
                <Picker.Item value = {item.CustomerID} label={item.CustomerName}
                style = {{ width: 200, height: 100 }} />)}
            </Picker>
            <Text>Ngày</Text>
            <Input disabled value = { dateIssued.toDateString() } />
            <Button title="Chọn ngày" onPress={() => { DateTimePickerAndroid.open({
                value: dateIssued,
                mode: "datetime",
                onChange: (e, date) => {
                    setDateIssued(date);
                }
            }) }}/>
            
            <Button disabled = { !isChose } title="Thêm" onPress = {() => {
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
    var { tempDetailInvoiceList, tempDetailInvoice, setTempDetailInvoiceList } = useContext(AppContext);
    //console.log("detail invoice temp detail invoice:", tempDetailInvoice);

    useEffect(() => {
        getInvoiceDetail();
        //console.log("?");
    }, [ tempDetailInvoice ])

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
                { tempDetailInvoiceList.filter(item => item.invoiceId == invoiceId).length > 1 ?
                <Button title="LƯU" onPress={() =>
                {
                    tempDetailInvoiceList.forEach((item, index) =>
                    {
                        if (index == 0) return;
                        console.log(item, index);
                        fetch(IP + `invdel/${item.invoiceId}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                productId: item.productId,
                                quantity: item.quantity,
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
                                //getInvoiceDetail();
                                //navigation.goBack();
                            }
                            else
                            {
                                Alert.alert("Thông báo", "Lỗi không xác định: ", (await respond.json()).message);
                            }
                        })
                    });
                    setTempDetailInvoiceList([]);
                }}/> : <View />}
                <Text style = {{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>Hóa đơn số {invoiceId}</Text>
                <View style = {{ marginVertical: 20 }} />
                <FlatList data = {invoiceDetail}
                renderItem={({ item, index }) => <ProductInvoiceDetail item = {item} navigate = {navigate}
                                                                       navigation={navigation} getInvoiceDetail={getInvoiceDetail}/>}/>
                <FlatList data = { tempDetailInvoiceList }
                renderItem={({ item, index }) => {
                    if (index == 0) return;
                    return <ProductDetailPendingAdd item = {item} navigate = {navigate} viewingInvoiceId = {invoiceId}
                    navigation={navigation} getInvoiceDetail={getInvoiceDetail}/>
                }}/>
            </SafeAreaView>
        </ScrollView>
    )
}
function ProductDetailPendingAdd(props)
{
    //console.log(props);
    var { invoiceId, productName, productId, price, quantity } = props.item;
    var { viewingInvoiceId } = props;
    var { tempDetailInvoiceList, setTempDetailInvoiceList } = useContext(AppContext);

    function removeProductById(array, productId) {
        return array.filter(item => item.productid !== productId);
    }

    return (
        <View>
            {invoiceId == viewingInvoiceId ? 
            <View style={{ flexDirection: "column", justifyContent: "space-evenly" }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>Đang thêm...</Text>
                <Text style = {{ textAlign: "center" }}>------------------------------</Text>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Mã SP: {productId}</Text>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Tên SP: {productName}</Text>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Số lượng: {quantity}</Text>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Thành tiền: {quantity * price}</Text>
                <View style = {{ flexDirection: "row" }}>
                    <Button title="Xóa" onPress={() => {
                        setTempDetailInvoiceList(removeProductById(tempDetailInvoiceList, productId));
                    }}/>
                </View>
            </View>: <View />}
        </View>
    )
}
function ProductInvoiceDetail(props)
{
    var { InvoiceDetailID, InvoiceID, ProductID, ProductName, Quantity, TotalPrice } = props.item;
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
        <View style={{ flexDirection: "column", justifyContent: "space-evenly" }}>
            <Text style = {{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>ID {InvoiceDetailID}</Text>
            <Text style = {{ textAlign: "center" }}>------------------------------</Text>
            <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Mã SP: {ProductID}</Text>
            <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Tên SP: {ProductName}</Text>
            <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Số lượng: {Quantity}</Text>
            <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Thành tiền: {TotalPrice}</Text>
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
    //console.log("type of set func, ", typeof setTempInvToList)
    //console.log("adddetailinvoice:", props.route.params);
    var { navigate } = navigation;
    var [ productList, setProductList ] = useState([])
    var [ productId, setProductId ] = useState("");
    var [ productName, setProductName ] = useState("");
    var [ quantity, setQuantity ] = useState(0);
    var [ price, setPrice ] = useState(0);
    //var [ totalPrice, setTotalPrice ] = useState(0);
    var [ isChose, setIsChose ] = useState(false);

    const { 
        tempDetailInvoice, 
        setTempDetailInvoice, 
        tempDetailInvoiceList, 
        setTempDetailInvoiceList 
    } = useContext(AppContext);

    useEffect(() => {
        getAllProducts();
    }, [])
    
    function checkIsAlreadyExistInTempList()
    {
        return tempDetailInvoiceList.some(item => item.productId == productId && item.invoiceId == invoiceId);
    }

    async function checkInvoiceProductAvailable()
    {
        //console.log(invoiceId, productId);
        var respond = await fetch(IP + `invdel/${invoiceId}/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (respond.status == 200)
        {
            //console.log("status 200 mà ?")
            //console.log(await respond.json());
            //console.log("price from adi", price)
            //setPrice((await respond.json()).price)
            return true;
        }
        return false;
    }

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
    function removeDuplicatesByProductId(array) {
        const seen = new Set();
        return array.filter(item => {
            if (seen.has(item.productid)) {
                return false; // Skip duplicate
            }
            seen.add(item.productid);
            return true; // Keep unique
        });
    }
    return (
        <SafeAreaView>
            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>Thêm mới sản phẩm vào hóa đơn</Text>
            <Text style={{ textAlign: "center" }}>----------------------------</Text>
            <View style={{ marginVertical: 20 }}/>
            <Text>Mã hóa đơn</Text>
            <Input disabled value = { invoiceId?.toString() } />
            <Text>Mã sản phẩm</Text>
            <Picker onValueChange={ (val, idx) => { 
                
                setIsChose(true);
                setProductId(val);
                setProductName(productList[idx].ProductName);
                setPrice(productList[idx].Price);
                //setTotalPrice(quantity * price);
                console.log(productId, productName, price);
                //console.log(productName);
            }}>
                {productList.map((item, index) => 
                {
                    //console.log(item);
                    return <Picker.Item value = {item.ProductID} label={item.ProductName}
                    style = {{ width: 200, height: 100 }} />
                })}
            </Picker>
            <Text>Số lượng</Text>
            <Input keyboardType="numeric" value = { quantity } onChangeText={(txt) => {
                if (!isNaN(txt))
                {
                    setQuantity(txt);
                }
            }}/>
            <Button title="Thêm" disabled={!isChose} onPress={() => {
                //addProductToInvoice();
                //console.log(tempDetailInvoice);
                if (checkInvoiceProductAvailable() && !checkIsAlreadyExistInTempList())
                {
                    console.log("quantity n price", quantity, price)
                    setTempDetailInvoice({
                        invoiceId,
                        productName,
                        productId,
                        price,
                        quantity,
                        //totalPrice,
                    });
                    setTempDetailInvoiceList((prevList) => ([...prevList, tempDetailInvoice]));
                    navigation.goBack();
                    //setTempDetailInvoiceList((prevList) => (prevList));
                    //setTempInvToList();
                    //console.log(tempDetailInvoice);
                    //navigate("DetailInvoice", { tempDetailInvoice, fromADI: true })
                    return;
                }
                console.log("no no");
                Alert.alert("Sản phẩm đã tồn tại trong hóa đơn", "Thông báo");
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
                    //console.log(InvoiceID);
                }
            }}/>
            <Button title="Lưu" onPress={() => {
                EditProductInvoiceDetail();
            }}/>
        </SafeAreaView>
    )
}