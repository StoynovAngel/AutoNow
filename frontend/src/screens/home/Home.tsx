import React from 'react';
import {View} from 'react-native';
import styles from './Home.style';
import Header from "../../components/header/Header";

const Home = () => {
    return (
        <View style={styles.container}>
            <Header/>
        </View>
    );
};

export default Home;