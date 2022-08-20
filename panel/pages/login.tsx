import Icon from "@mdi/react";
import { logIn } from "../api";
import { mdiAccountOutline, mdiLockOutline } from "@mdi/js";
import { useState } from "react";
import { useAtom } from "jotai";
import { tokenExpireAtom, userAtom } from "stopwatch-states";

// type LoginAppProps = {
//     onLoggedIn?: () => void;
// };

export const Login = () => {
    const [user, setUser] = useAtom(userAtom);
    const [_, setTokenExpire] = useAtom(tokenExpireAtom);

    const [login, setLogin] = useState<string>(user || "");
    const [password, setPassword] = useState<string>("");

    const requestLogIn = () => {
        logIn({ login, password }).then(result => {
            setUser(login);
            setTokenExpire(Date.now() + (result.expireDate - result.issuedAt) * 1000);
        });
    };

    return (
        <div className="h-full w-full flex items-center bg-gradient-to-r from-red-500 to-orange-500">
            <div className="flex flex-col grow px-12">
                <div className="my-2 shadow-xl ">
                    <label className="text-xs text-white font-semibold">LOGIN</label>
                    <div className="bg-white rounded-xl flex items-center">
                        <Icon size={1} path={mdiAccountOutline} className="text-red-500 m-3" />
                        <input
                            className="focus:outline-none text-red-500 font-semibold py-1 w-full"
                            onChange={e => setLogin(e.target.value)}
                            value={login}
                        />
                    </div>
                </div>
                <div className="my-2 shadow-xl ">
                    <label className="text-xs text-white font-semibold">PASSWORD</label>
                    <div className="bg-white rounded-xl flex items-center">
                        <Icon size={1} path={mdiLockOutline} className="text-red-500 m-3" />
                        <input
                            type="password"
                            className="focus:outline-none text-red-500 font-semibold py-1 w-full"
                            onChange={e => setPassword(e.target.value)}
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

export default Login;