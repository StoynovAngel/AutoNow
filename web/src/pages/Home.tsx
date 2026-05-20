import Navigation from '../components/Navigation'

const Home = () => {
    return (
        <>
            <Navigation/>
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to AutoNow
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Your fresh Vite + React + TypeScript project is ready!
                    </p>
                    <div className="flex gap-4 justify-center">
                        <a
                            href="https://vitejs.dev/guide/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Vite Docs
                        </a>
                        <a
                            href="https://react.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                        >
                            React Docs
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
