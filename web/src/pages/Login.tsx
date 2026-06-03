import {useState, type FormEvent, type ChangeEvent} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import {authService} from "../services/auth/authService";
import {decodeJWT} from "../utils/jwt";
import {getErrorMessage} from "../utils/errors";
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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const {token} = await authService.login(formData);

            const decodedToken = decodeJWT(token);
            if (!decodedToken) {
                setErrorMessage("Authentication failed: invalid token received");
                return;
            }

            login(
                {
                    id: decodedToken.sub,
                    email: formData.email,
                    authorities: decodedToken.authorities,
                },
                token
            );
            navigate("/companies");
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Invalid email or password"));
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
