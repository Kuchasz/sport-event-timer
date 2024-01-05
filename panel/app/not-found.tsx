import { Button } from "../components/button";
import "../globals.scss";

export default function Error({ error: _err }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html className="h-full w-full">
            <body className="flex h-full w-full items-center justify-center">
                <div className="flex items-center">
                    <div className="m-12 flex flex-col items-start">
                        <div className="rounded-lg bg-blue-300 px-3 py-1 text-sm font-medium">Error 404</div>
                        <h2 className="pt-2 text-5xl font-semibold">Page not found</h2>
                        <p className="py-6">Sorry, the page you are looking for cannot be found</p>
                        <div className="flex">
                            <Button outline>Go back</Button>
                            <Button className="ml-2">Take me home</Button>
                        </div>
                    </div>
                    <img className="h-64 -scale-x-100" src="/assets/sad_dino.png"></img>
                </div>
            </body>
        </html>
    );
}
