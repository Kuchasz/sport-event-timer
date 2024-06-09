import { PoorButton } from "src/components/poor-button";

type ErrorProps = {
    code: string;
    title: string;
    description: string;
    goBack: string;
    goHome: string;
};

export const SiteError = ({ code, title, description, goBack, goHome }: ErrorProps) => {
    return (
        <div className="flex items-center">
            <div className="m-12 flex flex-col items-start">
                <div className="rounded-lg bg-blue-300 px-3 py-1 text-sm font-medium">{code}</div>
                <h2 className="pt-2 text-5xl font-semibold">{title}</h2>
                <p className="py-6">{description}</p>
                <div className="flex">
                    <PoorButton outline>{goBack}</PoorButton>
                    <PoorButton className="ml-2">{goHome}</PoorButton>
                </div>
            </div>
            <img className="h-64 -scale-x-100" src="/assets/sad_dino.png"></img>
        </div>
    );
};
