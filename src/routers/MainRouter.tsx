import Layout from "@/components/Layouts/Layout";
import Home from "@/pages/home/Home";
import ProductDetail from "@/pages/ProductDetail";
import { BrowserRouter, Route, Routes } from "react-router";

const MainRouter = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Home />
                        </>
                    } />
                    <Route path="/product/:id" element={
                        <>
                            <ProductDetail />
                        </>
                    } />
                </Routes>
            </Layout>

        </BrowserRouter>
    )
}

export default MainRouter;