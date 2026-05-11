interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({children}: AuthLayoutProps) => {
    return (
        <div className="bg-gradient-to-r from-indigo-300 to-violet-200 min-h-screen">
            <div className="flex justify-center items-center min-h-screen">
                <div className="shadow-lg w-full max-w-md rounded-xl py-8 bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
