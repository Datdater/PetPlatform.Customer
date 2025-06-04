import Layout from "@/components/layouts/Layout";
import Home from "@/pages/home/Home";
import ProductDetail from "@/pages/product/ProductDetail";
import ProfileCustomer from "@/pages/profile/profile-customer";
import AddressCustomer from "@/pages/profile/address-customer";
import { BrowserRouter, Route, Routes } from "react-router";
import UserProvider from "@/store/contexts/UserContext";
import UserLayout from "@/components/layouts/UserLayout";
import CartPage from "@/pages/cart/Cart";
import Checkout from "@/pages/checkout/Checkout";
import OrderCustomerPage from "@/pages/profile/order-customer";
import Search from "@/pages/search/Search";
import StorePage from "@/pages/store/StorePage";
const MainRouter = () => {
    return (
        <BrowserRouter>
            <UserProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={
                            <>
                                <Home />
                            </>
                        } />
                        <Route path="/product/:id" element={
                            <ProductDetail />
                        } />
                        <Route path="/user/profile" element={
                            <UserLayout>
                                <ProfileCustomer />
                            </UserLayout>
                        } />
                        <Route path="/user/address" element={
                            <UserLayout>
                                <AddressCustomer />
                            </UserLayout>
                        } />
                        <Route path="/cart" element={
                            <CartPage />
                        } />
                        <Route path="/checkout" element={
                            <Checkout />
                        } />
                        <Route path="/user/orders" element={
                            <UserLayout>
                                <OrderCustomerPage />
                            </UserLayout>
                        } />
                        <Route path="/search" element={
                            <Search />
                        } />
                        <Route path="/store/:id" element={
                            <StorePage />
                        } />
                    </Routes>
                </Layout>
            </UserProvider>
        </BrowserRouter>
    )
}

export default MainRouter;