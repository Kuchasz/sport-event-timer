import Icon from "@mdi/react";
import { logIn } from "./api";
import { mdiAccountOutline, mdiLockOutline } from "@mdi/js";
import { setLogIn } from "./security";
import { UserCredentials } from "@set/shared";
import { useState } from "react";

export const LoginApp = () => {
    const [loginState, setLoginState] = useState<UserCredentials>({ login: "", password: "" });
    const requestLogIn = () => {
        logIn(loginState).then((result) => {
            setLogIn(Date.now() + (result.expireDate - result.issuedAt) * 1000);
        });
    };

    return (
        <div className="h-full w-full flex items-center bg-gradient-to-r from-red-500 to-orange-500">
            <div className="flex flex-col grow px-12">
                <div className="my-2 shadow-xl ">
                    <label className="text-xs text-white font-semibold">LOGIN</label>
                    <div className="bg-white rounded-xl flex">
                        <Icon size={1} path={mdiAccountOutline} className="text-red-500 m-3" />
                        <input
                            className="focus:outline-none text-red-500 font-semibold"
                            onChange={(e) => setLoginState({ ...loginState, login: e.target.value })}
                        />
                    </div>
                </div>
                <div className="my-2 shadow-xl ">
                    <label className="text-xs text-white font-semibold">PASSWORD</label>
                    <div className="bg-white rounded-xl flex">
                        <Icon size={1} path={mdiLockOutline} className="text-red-500 m-3" />
                        <input
                            type="password"
                            className="focus:outline-none text-red-500 font-semibold"
                            onChange={(e) => setLoginState({ ...loginState, password: e.target.value })}
                        />
                    </div>
                </div>
                <button
                    onClick={requestLogIn}
                    className="py-3 px-12 mt-10 text-xs rounded-full my-2 bg-orange-500 text-white font-semibold uppercase self-start shadow-xl"
                >
                    Login
                </button>
            </div>
        </div>
    );
};
