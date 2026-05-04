import React from 'react';
import {View} from 'react-native';
import styles from './Home.style';
import Header from "../../components/navigation/Header";
import Body from "../../components/home/Body";

const Home = () => {
    return (
        <View style={styles.container}>
            <Header/>
            <Body/>
        </View>
    );
};

export default Home;