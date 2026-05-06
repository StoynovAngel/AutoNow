import React from 'react';
import { View } from 'react-native';
import styles from './CompanyList.style';
import Body from '../../components/company/Body';

const CompanyList = () => {
    return (
        <View style={styles.container}>
            <Body />
        </View>
    );
};

export default CompanyList;
