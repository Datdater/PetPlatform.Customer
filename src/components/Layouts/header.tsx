import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ShoppingCart, User, Menu, X, MapPin, Search } from 'lucide-react';
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
    const [notificationCount, setNotificationCount] = useState(3);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { itemCount, isLoading } = useSelector((state: RootState) => state.cart);

    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    const perks = [
        { icon: "🔒", text: "100% hàng thật" },
        { icon: "🚚", text: "Freeship mọi đơn" },
        { icon: "💰", text: "Hoàn 200% nếu hàng giả" },
        { icon: "📅", text: "30 ngày đổi trả" },
        { icon: "⚡", text: "Giao nhanh 2h" },
        { icon: "🏷️", text: "Giá siêu rẻ" }
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    return (
        <header className="bg-white border-b">
            {/* Top banner */}
            <div className="bg-green-50 text-center py-1 text-sm">
                <span>Sen chọn gì- Pet thích đó</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-2">
                {/* Main header row */}
                <div className="flex items-center gap-4 py-2">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <img src={logo} alt="Pet Platform Logo" className="h-18 w-auto" />
                    </Link>

                    {/* Search bar */}
                    <div className="flex-grow">
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
                    <div className="flex items-center gap-6 flex-shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-6 w-6" />
                                    {notificationCount > 0 && (
                                        <Badge
                                            className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs"
                                            variant="destructive"
                                        >
                                            {notificationCount}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Khuyến mãi 20% thức ăn chó</DropdownMenuItem>
                                <DropdownMenuItem>Đơn hàng #12345 đã giao</DropdownMenuItem>
                                <DropdownMenuItem>Chào mừng đến PetPlatform!</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

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
                                                <span className="font-medium">{`${user.firstName} ${user.lastName}`}</span>
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
                <div className="flex justify-center items-center gap-4 py-2 overflow-x-auto text-sm border-t">
                    {perks.map((perk, index) => (
                        <div key={index} className="flex items-center gap-1 flex-shrink-0">
                            <span>{perk.icon}</span>
                            <span>{perk.text}</span>
                        </div>
                    ))}
                </div>
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