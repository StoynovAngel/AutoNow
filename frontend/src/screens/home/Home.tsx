import React from 'react';
import {View} from 'react-native';
import styles from './Home.style';
import Header from "../../components/navigation/Header";
import Body from "../../components/home/Body";
import Chatbot from "../../components/chatbot/Chatbot";

const Home = () => {
    return (
        <View style={styles.container}>
            <Header/>
            <Body/>
            <Chatbot/>
        </View>
    );
};

export default Home;