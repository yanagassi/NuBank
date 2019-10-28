import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import Colors from '../constants/Colors';
import Home from '../pages/Home';  
const HomeStack = createStackNavigator({
  Home  
});

 
HomeStack.navigationOptions = {
  tabBarVisible: false
  // tabBarLabel: 'ínicio',
  // tabBarOptions: { 
    
  //   activeTintColor: '#000',
  //   inactiveTintColor: 'grey',
  // },
  // tabBarIcon: ({ focused }) => (
  //   <TabBarIcon
  //     focused={focused}
  //     name={
  //       Platform.OS === 'ios'
  //         ? `ios-home`
  //         : 'md-home'
  //     }
  //   />
  // ),
};
 

 

export default createBottomTabNavigator({
    HomeStack,
  
  }, 
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: 'black',
      inactiveTintColor: 'grey',
    tabBarVisible: false,
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: Colors.primary,
      },
    }
});
