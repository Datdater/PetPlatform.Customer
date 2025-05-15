import Footer from "./footer";
import Header from "./header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Header />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </div>
    )
}
