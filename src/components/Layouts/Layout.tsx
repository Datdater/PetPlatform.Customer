import { useCartInit } from '@/hooks/useCartInit';
import Header from '@/components/Layouts/header';
import Footer from '@/components/Layouts/footer';
import { Toaster } from 'sonner';

const layout = ({ children }: { children: React.ReactNode }) => {
    useCartInit(); 
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <Toaster />
        </div>
    );
}

export default layout;
