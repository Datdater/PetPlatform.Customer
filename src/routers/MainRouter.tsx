import Home from "@/pages/home/Home";
import ProductDetail from "@/pages/product/ProductDetail";
import ProfileCustomer from "@/pages/profile/profile-customer";
import AddressCustomer from "@/pages/profile/address-customer";
import { BrowserRouter, Route, Routes } from "react-router";
import UserProvider from "@/store/contexts/UserContext";
import CartPage from "@/pages/cart/Cart";
import Checkout from "@/pages/checkout/Checkout";
import OrderCustomerPage from "@/pages/profile/order-customer";
import Search from "@/pages/search/Search";
import StorePage from "@/pages/store/StorePage";
const MainRouter = () => {
    return (
        <BrowserRouter>
            <UserProvider>
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
                                <ProfileCustomer />
                        } />
                        <Route path="/user/address" element={
                                <AddressCustomer />
                        } />
                        <Route path="/cart" element={
                            <CartPage />
                        } />
                        <Route path="/checkout" element={
                            <Checkout />
                        } />
                        <Route path="/user/orders" element={
                                <OrderCustomerPage />
                        } />
                        <Route path="/search" element={
                            <Search />
                        } />
                        <Route path="/store/:id" element={
                            <StorePage />
                        } />
                    </Routes>
            </UserProvider>
        </BrowserRouter>
    )
}

export default MainRouter;