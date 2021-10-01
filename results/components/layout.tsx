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
            <div className="min-h-screen">
                <main className="min-h-screen">{children}</main>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default Layout;
