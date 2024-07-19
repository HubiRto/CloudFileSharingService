import {useEffect, useState} from 'react';
import {Card} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FaFacebook, FaGithub} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {SubmitHandler, useForm as useReactHookForm} from 'react-hook-form';
import {useAuth} from "@/providers/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {Spinner} from "@/components/Spinner.tsx";
import {LoginRequest} from "@/models/LoginRequest.ts";

const signInSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const LoginPage = () => {
    const navigate = useNavigate();
    const {onLogin, authState} = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(authState?.token) {
            navigate("/");
        }
    }, [authState]);

    const {register, handleSubmit, setError: setFormError, formState: {errors}} = useReactHookForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
    });

    const handleSignIn: SubmitHandler<SignInFormValues> = async (data) => {
        try {
            setLoading(true);
            await onLogin?.(data as LoginRequest);
            navigate("/");
            toast.success('Success login')
        } catch (err: any) {
            if (err.message === 'Invalid email or password') {
                setFormError("email", {message: ''})
                setFormError("password", {message: ''})
            } else if (err.message === "User with this email don't exist") {
                setFormError("email", {message: ''})
            }
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignIn = (provider: string) => {
        console.log(`Logging in with ${provider}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md p-8">
                <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
                <p className="text-gray-600 mb-6">Sign in to your account</p>

                <form onSubmit={handleSubmit(handleSignIn)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <Input
                            id="email"
                            type="email"
                            className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                            {...register('email')}
                        />
                        {errors.email && <p className="text-red-500">{(errors.email.message as string)}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <Input
                            id="password"
                            type="password"
                            className={`w-full ${errors.password ? 'border-red-500' : ''}`}
                            {...register('password')}
                        />
                        {errors.password && <p className="text-red-500">{(errors.password.message as string)}</p>}
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <Button className="w-full mb-4" type="submit">
                        {!loading ? (<a>Sign Up</a>) : (<Spinner className="text-white"/>)}
                    </Button>
                </form>

                <div className="relative flex items-center justify-center my-4">
                    <span className="absolute bg-white px-2 text-gray-500">or</span>
                    <hr className="w-full border-gray-300"/>
                </div>

                <div className="flex flex-col space-y-2">
                    <Button className="w-full flex items-center justify-center" variant="outline"
                            onClick={() => handleSocialSignIn('Google')}>
                        <FcGoogle className="mr-2" style={{color: '#DB4437'}}/> Sign in with Google
                    </Button>
                    <Button className="w-full flex items-center justify-center" variant="outline"
                            onClick={() => handleSocialSignIn('Facebook')}>
                        <FaFacebook className="mr-2" style={{color: '#1877F2'}}/> Sign in with Facebook
                    </Button>
                    <Button className="w-full flex items-center justify-center" variant="outline"
                            onClick={() => handleSocialSignIn('GitHub')}>
                        <FaGithub className="mr-2" style={{color: '#000000'}}/> Sign in with GitHub
                    </Button>
                </div>

                <p className="mt-4 text-center text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-500">Sign up</Link>
                </p>
            </Card>
        </div>
    );
};

export default LoginPage;
