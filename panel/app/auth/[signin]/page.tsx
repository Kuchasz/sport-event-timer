"use client";


export default function SignIn() {
    // const searchParams = useSearchParams();

    return (
        <>
            <section className="bg-gradient-to-r from-[#c2e59c] to-[#64b3f4]">
                <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
                    <img className="mb-4" src="/assets/logo_ravelo.png" />
                    <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
                        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Create account or login
                            </h1>
                            <div className="space-y-4 md:space-y-6">
                                <div>
                                    <button
                                        onClick={() => {
                                            // signIn("auth0", {
                                            //     callbackUrl: `${
                                            //         searchParams?.get("callbackUrl")
                                            //             ? searchParams?.get("callbackUrl")
                                            //             : window.location.origin
                                            //     }`,
                                            // })
                                        }}
                                        className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
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
