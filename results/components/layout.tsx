import Meta from "./meta";
// import Footer from "./footer";

type Props = {
    preview?: boolean;
    children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
    return (
        <>
            <Meta />
            <div className="h-full">
                <main className="h-full">{children}</main>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default Layout;
