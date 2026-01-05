import React from "react";
import Head from "next/head";
import { Lock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const LoginPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Expert Login - Dashboard</title>
            </Head>

            <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white">

                    {/* Left Side: Image / Visual Section */}
                    <div className="relative hidden lg:block h-[500px]">
                        <div className="absolute inset-0 bg-yellow-600 bg-opacity-70 flex flex-col items-center justify-center text-white p-8 z-10">
                            <Image
                                src="/images/logo1.webp"
                                alt="Logo"
                                width={100}
                                height={100}
                                className="absolute top-4 left-4 bg-gray-50 rounded-xl p-2"
                            />

                            {/* <img
                                src="/images/logo1.webp"
                                alt="Logo"
                                className="bg-gray-50 rounded-4xl p-2 mb-4 w-3xs absolute left-0 "
                            /> */}
                            <div className=" text-left">
                                <h1 className="text-4xl font-semibold font-sans mb-4">Welcome Back, Expert!</h1>
                                <p className="text-xl text-left">
                                    Access your personalized dashboard, manage your appointments, and grow your practice.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Login Form */}
                    <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Expert Login</h2>
                            <p className="mt-2 text-gray-500">
                                Please enter your details to sign in.
                            </p>
                        </div>

                        <form className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email Address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                                        placeholder="********"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-900"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-yellow-600 hover:text-yellow-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                                >
                                    <Link href="/dashboard">Sign in</Link>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;




