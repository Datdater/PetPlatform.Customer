import { useCartInit } from '@/hooks/useCartInit';
import Header from '@/components/layouts/header';
import Footer from '@/components/layouts/footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
    useCartInit(); 
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
