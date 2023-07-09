"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
    const searchParams = useSearchParams();

    return (
        <>
            <section className="bg-gradient-to-r from-[#c2e59c] to-[#64b3f4]">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <img className="mb-4" src="/assets/logo_ravelo.png" />
                    <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Create account or login
                            </h1>
                            <div className="space-y-4 md:space-y-6">
                                <div>
                                    <button
                                        onClick={() =>
                                            signIn("auth0", {
                                                callbackUrl: `${
                                                    searchParams?.get("callbackUrl")
                                                        ? searchParams?.get("callbackUrl")
                                                        : window.location.origin
                                                }`,
                                            })
                                        }
                                        className="flex items-center justify-center bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 w-full p-2.5"
                                    >
                                        Sign in with Auth0{" "}
                                        <img className="ml-2" width={20} height={20} src="/auth-providers/auth0.svg"></img>
                                    </button>
                                </div>

                                <div className="flex items-start">
                                    {/* <div className="flex items-center h-5">
                            <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" required></input>
                          </div> */}
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-light text-gray-500 ">
                                            By registration you are agree to the{" "}
                                            <a className="font-medium text-blue-600 hover:underline " href="#">
                                                Terms and Conditions
                                            </a>
                                        </label>
                                    </div>
                                </div>
                                {/* <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center   ">Create an account</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
