import type {CompanyType} from "@/types/api";

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type HomeStackParamList = {
    SelectService: undefined;
    ServiceOptions: {serviceType: CompanyType};
    BrowseCompanies: {serviceType: CompanyType};
};

export type MainTabParamList = {
    HomeStack: undefined;
};
