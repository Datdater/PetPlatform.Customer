import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "@/store/contexts/UserContext";

const navItems = [
  { label: "Thông Báo", icon: <i className="fa-regular fa-bell text-primary" />, to: "/user/notifications" },
  { label: "Hồ Sơ", icon: <i className="fa-solid fa-id-card text-primary" />, to: "/user/profile" },
  { label: "Địa Chỉ", icon: <i className="fa-solid fa-location-dot text-primary" />, to: "/user/address" },
  { label: "Thú cưng", icon: <i className="fa-solid fa-location-dot text-primary" />, to: "/user/pets" },
  { label: "Đơn Mua", icon: <i className="fa-regular fa-clipboard text-primary" />, to: "/user/orders" },
  { label: "Dịch vụ", icon: <i className="fa-regular fa-clipboard text-primary" />, to: "/user/services" },
  { label: "Ví", icon: <i className="fa-regular fa-clipboard text-primary" />, to: "/user/wallet" },
];

const UserSidebar = () => {
  const user = useContext(UserContext);
  if (!user) {
    return (
      <aside className="w-72 bg-gradient-to-b from-orange-50 to-white p-6 rounded-2xl shadow-xl flex flex-col items-center border border-orange-100">
        <div className="flex flex-col items-center mb-6 w-full animate-pulse">
          <div className="w-20 h-20 rounded-full bg-gray-200 mb-3" />
          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-16 bg-gray-100 rounded" />
        </div>
        <hr className="w-full border-t border-orange-100 mb-4" />
        <nav className="w-full flex flex-col gap-1">
          {navItems.map((item) => (
            <div key={item.label} className="h-10 bg-gray-100 rounded mb-2" />
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-gradient-to-b  p-6 rounded-2xl  flex flex-col items-center border ">
      <div className="flex flex-col items-center mb-6 w-full">
        <div className="relative">
          <img
            src={user.profilePictureUrl || "/default-avatar.png"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
          />
          <NavLink
            to="/user/profile"
            className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full border-2 border-white hover:bg-orange-600 transition-colors"
            title="Sửa Hồ Sơ"
          >
            <i className="fa-regular fa-pen-to-square text-xs" />
          </NavLink>
        </div>
        <div className="mt-3 text-lg font-bold text-gray-800">{user.userName || `${user.firstName} ${user.lastName}`}</div>
        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
          <i className="fa-solid fa-pen text-gray-300" /> Sửa Hồ Sơ
        </div>
      </div>
      <hr className="w-full border-t border-orange-100 mb-4" />
      <nav className="w-full flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-colors text-base font-medium gap-3
              ${isActive ? "bg-orange-100 text-orange-600 font-semibold shadow" : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"}`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default UserSidebar;
