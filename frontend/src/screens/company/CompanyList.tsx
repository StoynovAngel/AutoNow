import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './CompanyList.style';
import Body from '../../components/company/Body';

const CompanyList = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Body />
        </SafeAreaView>
    );
};

export default CompanyList;
