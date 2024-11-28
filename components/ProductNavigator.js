import { Alert, View, FlatList } from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { IP } from "../shared/IP";
import { ScrollView } from "react-native-virtualized-view";
import { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

export default function ProductNavigator(props)
{
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName = "ProductList"
        screenOptions = {{
            headerShown: false,
        }}>
            <Stack.Screen name="ProductList" component={ProductList} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name="AddProduct" component={AddProduct} />
            <Stack.Screen name="EditProduct" component={EditProduct} />
            <Stack.Screen name="DeleteProduct" component={DeleteProduct} />
        </Stack.Navigator>
    )
}

function ProductList(props)
{
    var { navigate } = props.navigation;
    var [ productList, setProductList ] = useState([]);

    useEffect(() => {
        getAllProducts();
    }, [])
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
                
                <Text style = {{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Danh sách sản phẩm</Text>
                <View style = {{ flexDirection: "row", justifyContent: "space-around" }}>
                    <View />
                    <Button title = "Thêm" onPress = {() => {
                        navigate("AddProduct", {
                            navigation: props.navigation,
                            getAllProducts,
                        })
                    }} />
                </View>
                <ScrollView>
                    <FlatList data = {productList}
                    renderItem={({ item, index }) => <Product pInfo = {item} navigation = {props.navigation} 
                                                            getAllProducts = {getAllProducts}/>}/>
                </ScrollView>
                
            </SafeAreaView>
    )
}

function Product(props)
{
    var { pInfo, navigation, getAllProducts } = props;
    var { navigate } = navigation;

    var [ toDelete, setToDelete ] = useState("");

    function alertDelete()
    {
        Alert.alert("THÔNG BÁO", `Bạn có chắc muốn xóa sản phẩm ${toDelete}?`, [
            {
                text: "HỦY",
                onPress: () => {}
            },
            {
                text: "OK",
                onPress: () => {
                    fetch(IP + `products/${toDelete}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }).then((respond) => {
                        if (respond.status == 200)
                        {
                            Alert.alert("THÔNG BÁO", `Xóa sản phẩm ID ${toDelete} thành công`);
                            getAllProducts();
                        }
                        else if (respond.status == 301)
                        {
                            Alert.alert("THÔNG BÁO", "Sản phẩm tồn tại trong hóa đơn, không thể xóa!");
                        }
                    }) 
                }
            }
        ], { cancelable: false })
    }
    //console.log(pInfo);
    return (
        <SafeAreaView style={{ flexDirection: "column", justifyContent: "space-evenly" }}>
            <View style = {{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>ID:</Text>
                <Text style = {{ fontSize: 20 }}>{pInfo.ProductID}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Tên SP:</Text>
                <Text style = {{ fontSize: 20 }}>{pInfo.ProductName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Giá:</Text>
                <Text style = {{ ontSize: 20 }}>{pInfo.Price} $</Text>
            </View>
             
            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <Button title="Sửa" color="primary" onPress = {() => {
                    navigate("EditProduct", { pInfo, navigation, getAllProducts })
                }}/>
                <Button title="Xóa" color="warning" onPress = {() => {
                    setToDelete(pInfo.ProductID);
                    alertDelete();
                }}/>
                <Button title="Xem" onPress={() => {
                    navigate("ProductDetail", { pInfo });
                }} />
            </View>
            
            <Text style = {{ textAlign: "center" }}>----------------------</Text>
        </SafeAreaView>
    )
}

function ProductDetail(props)
{
    var { pInfo } = props.route.params;
    //console.log(props);
    return (
        <SafeAreaView style = {{ marginVertical: 30 }}>
            <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>Chi tiết sản phẩm {pInfo.ProductID}</Text>
            <View style={{ marginBottom: 20 }}/>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tên sản phẩm: {pInfo.ProductName}</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Giá: {pInfo.Price}</Text>
            <Text style={{ textAlign: "center" }}>------------------------------</Text>
        </SafeAreaView>
    )
}

function AddProduct(props)
{
    var { navigation, getAllProducts } = props.route.params;
    var { navigate } = navigation;
    var [ productId, setpId ] = useState("");
    var [ productName, setpName ] = useState("");
    var [ productPrice, setpPrice ] = useState(0);

    function addProduct()
    {
        fetch(IP + `products/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productName,
                productPrice,
            }),
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                Alert.alert("THÔNG BÁO", "Thêm sản phẩm thành công");
                //getAllProducts();
                //navigation.goBack();
            }
            else if (respond.status == 301)
            {
                Alert.alert(`Mã sản phẩm ${productId} đã tồn tại`)
                //navigation.goBack();
            }
            else
            {
                Alert.alert("THÔNG BÁO", (await respond.json()).msg)
            }
        })
    }

    return (
        <SafeAreaView>
            <Text style={{ fontWeight: "bold", fontSize: 20,
                           textAlign: "center"
             }}>Thêm sản phẩm</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text style={{ fontWeight: "bold", fontSize: 20,
            }}>Mã sản phẩm</Text>
            <Input value={ productId }
            onChangeText={(txt) => { setpId(txt.toUpperCase().trim()) }}></Input>
            <Text style={{ fontWeight: "bold", fontSize: 20,
            }}>Tên sản phẩm</Text>
            <Input value={ productName }
            onChangeText={(txt) => { setpName(txt) }} />
            <Text style={{ fontWeight: "bold", fontSize: 20,
            }}>Giá</Text>
            <Input value={ productPrice } keyboardType="numeric"
            onChangeText={ (txt) => {
                if(!isNaN(txt))
                {
                    setpPrice(Number(txt))
                }
            }} />
            <View style = {{ flexDirection: "column"  }}>
                <Button title="Thêm" onPress = {() => {
                    addProduct();
                    getAllProducts();
                    navigation.goBack();
                }}/>
                <View style={{ marginVertical: 10 }} />
                <Button title="Hủy" onPress = {() => {
                    navigation.goBack();
                }}/>
                <View style={{ marginVertical: 10 }} />
                <Button title="Thêm tiếp" onPress = {() => {
                    addProduct();
                    setpId("");
                    setpName("");
                    setpPrice(0);
                }} />
            </View>
        </SafeAreaView>
    )
}
function EditProduct(props)
{
    var { pInfo, navigation, getAllProducts } = props.route.params;
    //console.log(pInfo)
    var { navigate } = navigation;
    var [ productName, setpName ] = useState(pInfo?.ProductName || "");
    var [ price, setpPrice ] = useState(pInfo?.Price || 0);

    function updateProduct()
    {
        fetch(IP + `products/${pInfo.ProductID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productName,
                price
            }),
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                getAllProducts();
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
             }}>Chỉnh sửa sản phẩm</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>Mã sản phẩm</Text>
            <Input disabled value={pInfo.ProductID}></Input>
            <Text>Tên sản phẩm</Text>
            <Input value={ productName }
            onChangeText={(txt) => { setpName(txt) }} />
            <Text>Giá</Text>
            <Input value={ price.toString() } keyboardType="numeric"
            onChangeText={ (txt) => {
                if(!isNaN(txt))
                {
                    setpPrice(Number(txt))
                }
            }} />
            <Button title="Đổi" onPress = {() => {
                updateProduct();
            }}/>
            <Button title="Hủy" onPress = {() => {
                navigation.goBack();
            }}/>
        </SafeAreaView>
    )
}

function DeleteProduct(props)
{
    return (
        <View>

        </View>
    )
}