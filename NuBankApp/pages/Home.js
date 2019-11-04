import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler'; 
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import Menu from '../components/Menu'; 
import {
  Container,
  Content,
  Card, CardHeader, CardContent, CardFooter, Title, Description, Annotation, SafeAreaView,
} from './Styles';


let offset = 0;
const translateY = new Animated.Value(0);
const animatedEvent = Animated.event(
  [
    {
      nativeEvent: {
        translationY: translateY,
      },
    },
  ],
  { useNativeDriver: true },
);

export default class Home extends React.Component  {
  
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = { 
    }
    this.store = this.props.screenProps.s;
}

  onHandlerStateChanged = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let opened = false;
      const { translationY } = event.nativeEvent;

      offset += translationY;

      if (translationY >= 100) {
        opened = true;
      } else {
        translateY.setValue(offset);
        translateY.setOffset(0);
        offset = 0;
      }

      Animated.timing(translateY, {
        toValue: opened ? 380 : 0,
        duration: 200,
        useNativeDriver: true,
      })
      .start(() => {
        offset = opened ? 380 : 0;
        translateY.setOffset(offset);
        translateY.setValue(0);
      })

    }
  }

  componentDidMount = () => {
    this.setState({
      load:true
    }) 
  }
  
  render(){
    if(this.state.load)
    return (
      <SafeAreaView>
        <Container>
          <Header user={this.store.get_offline('usuario') }  />
          <Content>
            <Menu translateY={translateY} />
  
            <PanGestureHandler
              onGestureEvent={animatedEvent}
              onHandlerStateChange={this.onHandlerStateChanged}
            >
              <Card style={{
                transform: [{
                  translateY: translateY.interpolate({
                    inputRange: [-350, 0, 380],
                    outputRange: [-50, 0, 430],
                    extrapolate: 'clamp',
                  }),
                }],
              }}
              >
                <CardHeader>
                  <Icon name="attach-money" size={28} color="#666" />
                  <Icon name="visibility-off" size={28} color="#666" />
                </CardHeader>
                <CardContent>
                  <Title>Saldo disponível</Title>
                  <Description>R$ 197.611,65</Description>
                </CardContent>
                <CardFooter>
                  <Annotation>
                  Transferência de R$ 20,00 recebida de Diego Schell Fernandes hoje às 06:00h
                  </Annotation>
                </CardFooter>
              </Card>
            </PanGestureHandler>
  
          </Content>
  
          <Tabs translateY={translateY} />
        </Container>
      </SafeAreaView>
    );
    else
    return(
      <SafeAreaView>
      </SafeAreaView>
    )
  }
   
} 