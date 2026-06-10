import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './Home.style';
import Header from "../../components/navigation/Header";
import Body from "../../components/home/Body";
import Chatbot from "../../components/chatbot/Chatbot";

const Home = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Header/>
            <Body/>
            <Chatbot/>
        </SafeAreaView>
    );
};

export default Home;