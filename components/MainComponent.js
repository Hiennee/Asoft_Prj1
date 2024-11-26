import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProductNavigator from "./ProductNavigator";
import CustomerNavigator from "./CustomerNavigator";
import InvoiceNavigator from "./InvoiceNavigator";
import HomeNavigator from "./HomeNavigator";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon } from "@rneui/themed";

const Stack = createStackNavigator();

function MainNavigator()
{
    return (
        <Stack.Navigator
        initialRouteName="Home"
        screenOptions = {{
            headerShown: false,
        }} 
        >
            <Stack.Screen name="Home" component={HomeNavigator}/>
            <Stack.Screen name="Product" component={ProductNavigator}/>
            <Stack.Screen name="Customer" component={CustomerNavigator}/>
            <Stack.Screen name="Invoice" component={InvoiceNavigator}/>
        </Stack.Navigator>
    )
}

export default function MainComponent(props)
{
    return (
        <NavigationContainer>
            <MainNavigator />
        </NavigationContainer>
    )
}