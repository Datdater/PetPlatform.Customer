import React, { useEffect, useState } from 'react';
import UserSidebar from '@/components/layouts/navigation'; // Adjust path as needed
import { getUser, updateUser, updatePassword } from '../../services/user.service';
import { ICustomerProfile } from '../../types/Customers/ICustomer';

const initialProfile: ICustomerProfile = {
  id: '',
  userName: '',
  profilePictureUrl: '',
  wallet: '',
  email: '',
  phoneNumber: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  country: '',
  dateOfBirth: '',
};

const ProfileCustomer: React.FC = () => {
  const [profile, setProfile] = useState<ICustomerProfile>(initialProfile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUser();
        if (data) {
          setProfile(data);
          setAvatarPreview(data.profilePictureUrl || '/default-avatar.png');
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải thông tin');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      let payload: any = { ...profile };
      if (avatarFile) {
        const formData = new FormData();
        Object.entries(profile).forEach(([key, value]) => {
          formData.append(key, value ?? '');
        });
        formData.append('avatar', avatarFile);
        payload = formData;
      }
      await updateUser(payload);
      setSuccess('Cập nhật thông tin thành công');
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật thông tin');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password.newPassword !== password.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }
    try {
      await updatePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      setSuccess('Đổi mật khẩu thành công');
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.message || 'Lỗi khi đổi mật khẩu');
    }
  };

  // For sidebar user info
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-background">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex justify-center items-start py-10 px-2">
      <div className="flex-1 ml-8">
        <div className="min-h-screen bg-background py-10 px-2 flex justify-center items-start">
          <div className="w-full max-w-3xl bg-card rounded-2xl shadow-2xl p-8 flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-center gap-8 border-b pb-8">
              <div className="flex flex-col items-center md:items-start gap-3">
                <div className="relative">
                  <img
                    src={avatarPreview || '/default-avatar.png'}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                  />
                  <label htmlFor="avatar" className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-2 rounded-full border-2 border-background shadow cursor-pointer hover:bg-primary/90 transition-colors">
                    <i className="fa-regular fa-pen-to-square text-lg" />
                    <input type="file" id="avatar" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>
                <div className="text-xl font-bold text-foreground">{profile.firstName} {profile.lastName}</div>
                <div className="text-muted-foreground text-sm">{profile.email}</div>
              </div>
              <form onSubmit={handleProfileSubmit} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 md:mt-0">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Họ</label>
                  <input type="text" name="firstName" value={profile.firstName} onChange={handleProfileChange} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Tên</label>
                  <input type="text" name="lastName" value={profile.lastName} onChange={handleProfileChange} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Số điện thoại</label>
                  <input type="tel" name="phoneNumber" value={profile.phoneNumber || ''} onChange={handleProfileChange} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Địa chỉ</label>
                  <input type="text" name="address" value={profile.address || ''} onChange={handleProfileChange} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Thành phố</label>
                  <input type="text" name="city" value={profile.city || ''} onChange={handleProfileChange} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Tỉnh/Bang</label>
                  <input type="text" name="state" value={profile.state || ''} onChange={handleProfileChange} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Quốc gia</label>
                  <input type="text" name="country" value={profile.country || ''} onChange={handleProfileChange} className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow">Lưu thay đổi</button>
                </div>
              </form>
            </div>

            

            {(error || success) && (
              <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs">
                {error && <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded shadow mb-2 text-center">{error}</div>}
                {success && <div className="bg-primary/10 border border-primary text-primary px-4 py-3 rounded shadow text-center">{success}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCustomer;
