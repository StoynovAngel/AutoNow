export interface Company {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    logoUrl?: string;
    description?: string;
    companyType: string;
    createdAt: string;
    updatedAt: string;
}

interface CompanyInfoProps {
    company: Company | null;
}

const CompanyInfo = ({company}: CompanyInfoProps) => {
    if (!company) {
        return (
            <div className="flex-1 bg-white rounded-xl shadow-md p-4 border border-gray-100">
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold">Select a company to view details</p>
                    <p className="text-gray-400 text-xs mt-1">Choose from the list on the left</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800">Company Information</h2>
                <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold">
                    {company.companyType}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Company Name</label>
                    <p className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {company.name}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {company.email}
                    </p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {company.phone}
                    </p>
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Address</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {company.address}
                    </p>
                </div>
                {company.description && (
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            {company.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyInfo;
