import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart, User, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import logo from '@/assets/logo.png';
import { AuthButton } from '../features/auth';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { UserContext } from '@/store/contexts/UserContext';
import { logout } from '@/services/auth.service';

export default function Header() {
    const user = useContext(UserContext);
    const [notificationCount] = useState(3);
    const [mobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { itemCount, isLoading } = useSelector((state: RootState) => state.cart);

    const handleLogout = () => {
        logout();
        window.location.reload();
    };


    const navigate = useNavigate();
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
        navigate(`/search?searchTerm=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <header className="bg-white border-b">
            {/* Top banner */}
            <div className="bg-green-50 text-center text-sm">
                <div className="flex items-center gap-2 px-2 sm:px-6 py-2 text-center justify-center bg-gradient-to-r from-green-200 via-green-100 to-green-50 shadow text-green-900 font-semibold text-sm sm:text-base">
                    <span role="img" aria-label="pet" className="text-xl">🐾</span>
                    <span>Sen chọn gì - Pet thích đó</span>
                    <span role="img" aria-label="pet" className="text-xl">🐶</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2">
                {/* Main header row */}
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 py-2">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 mb-2 md:mb-0">
                        <img src={logo} alt="Pet Platform Logo" className="h-10 sm:h-16 md:h-32 w-auto" />
                    </Link>

                    {/* Search bar */}
                    <div className="flex-grow w-full md:w-auto mb-2 md:mb-0">
                        <form onSubmit={handleSearch} className="flex">
                            <div className="relative flex-grow">
                                <Input
                                    type="text"
                                    placeholder="Freeship đơn từ 45k"
                                    className="pr-10 h-10 rounded-r-none border-r-0"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="h-10 rounded-l-none">
                                <Search className="h-4 w-4 mr-2" />
                                <span>Tìm kiếm</span>
                            </Button>
                        </form>
                    </div>

                    {/* User area */}
                    <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto justify-center md:justify-end">

                        {/* Shopping Cart */}
                        <Link to="/cart">
                            <Button variant="ghost" size="icon" className="relative" data-cart-icon>
                                <ShoppingCart className="h-6 w-6" />
                                {!isLoading && itemCount > 0 && (
                                    <Badge
                                        className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs"
                                        variant="destructive"
                                    >
                                        {itemCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>
                        {/* Account */}
                        <div className="flex items-center">
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.profilePictureUrl || "/placeholder-avatar.jpg"} />
                                                <AvatarFallback>
                                                    <User className="h-5 w-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col items-start text-sm">
                                                <span className="text-muted-foreground">Tài khoản</span>
                                                <span className="font-medium">{`${user.name}`}</span>
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link to="/user/profile">Thông tin tài khoản</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to="/user/orders">Đơn hàng của tôi</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout}>
                                            Đăng xuất
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <AuthButton />
                            )}
                        </div>
                    </div>
                </div>

                {/* Perks bar */}
                {/* <div className="flex justify-center items-center gap-4 py-2 overflow-x-auto text-sm border-t">
                    {perks.map((perk, index) => (
                        <div key={index} className="flex items-center gap-1 flex-shrink-0">
                            <span>{perk.icon}</span>
                            <span>{perk.text}</span>
                        </div>
                    ))}
                </div> */}
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <nav className="md:hidden px-4 pb-3 border-t">
                    <div className="flex flex-col space-y-2 pt-3">
                        <div className="text-sm text-muted-foreground mb-2">Danh mục</div>
                    </div>
                </nav>
            )}
        </header>
    );
}