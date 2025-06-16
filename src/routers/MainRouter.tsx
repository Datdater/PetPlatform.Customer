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
import Layout from "@/components/Layouts/Layout";
import UserLayout from "@/components/Layouts/UserLayout";
import PetServiceDetail from "@/pages/petService/PetServiceDetail";
import Payment from "@/pages/payment/Payment";
import PetsCustomer from "@/pages/profile/pets-customer";
import BookingsCustomer from "@/pages/profile/bookings-customer";
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
                        <Route path="/payment" element={
                            <Payment />
                        } />
                        <Route path="/user/orders" element={
                            <UserLayout>
                                <OrderCustomerPage />
                            </UserLayout>
                        } />
                        <Route path="/user/pets" element={
                            <UserLayout>
                                <PetsCustomer />
                            </UserLayout>
                        } />
                        <Route path="/user/services" element={
                            <UserLayout>
                                <BookingsCustomer />
                            </UserLayout>
                        } />
                        <Route path="/search" element={
                            <Search />
                        } />
                        <Route path="/store/:id" element={
                            <StorePage />
                        } />
                        <Route path="/service/:id" element={
                            <PetServiceDetail />
                        } />
                    </Routes>
                </Layout>
            </UserProvider>
        </BrowserRouter>
    )
}

export default MainRouter;