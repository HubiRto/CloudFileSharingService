// src/pages/auth/RegisterPage.tsx - RegisterPage
import {useEffect, useState} from 'react';
import {FaFacebook, FaGithub} from 'react-icons/fa';
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {SubmitHandler, useForm as useReactHookForm} from 'react-hook-form';
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FcGoogle} from "react-icons/fc";
import {useAuth} from "@/providers/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog.tsx";
import emailIcon from '../../../public/assets/email-icon.png';
import {RegisterRequest} from "@/models/RegisterRequest.ts";
import toast from "react-hot-toast";
import {Spinner} from "@/components/Spinner.tsx";

const signUpSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
    firstName: z.string().min(2, {message: "First name must be at least 2 characters long"}),
    lastName: z.string().min(2, {message: "Last name must be at least 2 characters long"}),
    confirmPassword: z.string().min(6, {message: "Confirm password must be at least 6 characters long"}),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const RegisterPage = () => {
    const {onRegister, authState} = useAuth();
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isAfterRegistration, setIsAfterRegistration] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(authState?.token) {
            navigate("/");
        }
    }, [authState]);

    const {register, handleSubmit, setError: setFormError, formState: {errors}} = useReactHookForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });

    useEffect(() => {
        if (isAfterRegistration && !isModalOpen) {
            navigate('/login');
        }
    }, [isAfterRegistration, isModalOpen]);

    const handleSignUp: SubmitHandler<SignUpFormValues> = async (data) => {
        const {confirmPassword, ...registerData} = data;
        try {
            setEmail(data.email);
            setLoading(true);
            await onRegister?.(registerData as RegisterRequest);
            setIsModalOpen(true);
            setIsAfterRegistration(true);
            toast.success('Success registration')
        } catch (err: any) {
            if (err.message === 'User with this email already exist') {
                setFormError("email", {message: 'Email already exist'})
            } else {
                setError('Error signing up');
            }
            toast.error("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignUp = (provider: string) => {
        console.log(`Signing up with ${provider}`);
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md p-8">
                    <h1 className="text-2xl font-bold mb-2">Join Us!</h1>
                    <p className="text-gray-600 mb-6">Create your account</p>

                    <form onSubmit={handleSubmit(handleSignUp)}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="firstName">First Name</label>
                            <Input
                                id="firstName"
                                type="text"
                                className={`w-full ${errors.firstName ? 'border-red-500' : ''}`}
                                {...register('firstName')}
                            />
                            {errors.firstName &&
                                <p className="text-red-500 mt-2">{(errors.firstName.message as string) || ''}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="lastName">Last Name</label>
                            <Input
                                id="lastName"
                                type="text"
                                className={`w-full ${errors.lastName ? 'border-red-500' : ''}`}
                                {...register('lastName')}
                            />
                            {errors.lastName &&
                                <p className="text-red-500 mt-2">{(errors.lastName.message as string) || ''}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                                {...register('email')}
                            />
                            {errors.email &&
                                <p className="text-red-500 mt-2">{(errors.email.message as string) || ''}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                            <Input
                                id="password"
                                type="password"
                                className={`w-full ${errors.password ? 'border-red-500' : ''}`}
                                {...register('password')}
                            />
                            {errors.password &&
                                <p className="text-red-500">{(errors.password.message as string) || ''}</p>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm
                                Password</label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                className={`w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword &&
                                <p className="text-red-500 mt-2">{(errors.confirmPassword.message as string) || ''}</p>}
                        </div>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <Button disabled={loading} className="w-full mb-4" type="submit">
                            {!loading ? (<a>Sign Up</a>) : (<Spinner className="text-white"/>)}
                        </Button>
                    </form>

                    <div className="relative flex items-center justify-center my-4">
                        <span className="absolute bg-white px-2 text-gray-500">or</span>
                        <hr className="w-full border-gray-300"/>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Button className="w-full flex items-center justify-center" variant="outline"
                                onClick={() => handleSocialSignUp('Google')}>
                            <FcGoogle className="mr-2" style={{color: '#DB4437'}}/> Sign up with Google
                        </Button>
                        <Button className="w-full flex items-center justify-center" variant="outline"
                                onClick={() => handleSocialSignUp('Facebook')}>
                            <FaFacebook className="mr-2" style={{color: '#1877F2'}}/> Sign up with Facebook
                        </Button>
                        <Button className="w-full flex items-center justify-center" variant="outline"
                                onClick={() => handleSocialSignUp('GitHub')}>
                            <FaGithub className="mr-2" style={{color: '#000000'}}/> Sign up with GitHub
                        </Button>
                    </div>

                    <p className="mt-4 text-center text-gray-600">
                        Already have an account? <Link to="/login" className="text-blue-500">Sign in</Link>
                    </p>
                </Card>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent aria-describedby={undefined}>
                    <div className="text-center">
                        <img src={emailIcon} alt="Email Icon" className="mx-auto h-20 w-20"/>
                        <DialogTitle className="mt-4 text-xl font-bold text-gray-900">
                            Email Confirmation
                        </DialogTitle>
                        <p className="mt-2 text-gray-600">We have sent an email to <span
                            className="text-blue-500">{email}</span> to confirm the validity of our
                            email address. After receiving the email, follow the link provided to complete your
                            registration.</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RegisterPage;
