import {useState, type FormEvent, type ChangeEvent} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import apiClient from "../services/apiClient";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

interface FormData {
    email: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        setErrorMessage("");
    };

    const decodeJWT = (token: string) => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const {data} = await apiClient.post("/auth/login", formData);
            const token = data.token;

            const decodedToken = decodeJWT(token);
            if (!decodedToken || !decodedToken.sub || !decodedToken.authorities) {
                setErrorMessage("Authentication failed: invalid token received");
                return;
            }

            const userInfo = {
                id: decodedToken.sub,
                email: formData.email,
                authorities: decodedToken.authorities
            };

            login(userInfo, token);
            navigate("/home");
        } catch (error: any) {
            console.error("Login error", error);
            setErrorMessage(error.response?.data?.message || "Invalid email or password");
        }
    };

    return (
        <AuthLayout>
            <LoginForm
                formData={formData}
                errorMessage={errorMessage}
                onSubmit={handleSubmit}
                onChange={handleChange}
            />
        </AuthLayout>
    );
}

export default Login;