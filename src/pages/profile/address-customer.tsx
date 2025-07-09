import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addressService, type Address, type CreateAddressDto } from "@/services/address.service";
import { UserContext } from "@/store/contexts/UserContext";
import axios from "axios";

const AddressCustomer = () => {
  const user = useContext(UserContext);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<CreateAddressDto>({
    street: "",
    city: "",
    ward: "",
    district: "",
    phoneNumber: "",
    name: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  useEffect(() => {
    if (user) fetchAddresses();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (openDialog) {
      axios.get("https://open.oapi.vn/location/provinces?size=1000").then((res: any) => {
        setCities(res.data.data as any[]);
      });
    }
  }, [openDialog]);

  useEffect(() => {
    if (formData.city) {
      axios
        .get(`https://open.oapi.vn/location/districts/${formData.city}?size=1000`)
        .then((res: any) => {
          setDistricts(res.data.data as any[]);
        });
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [formData.city]);

  useEffect(() => {
    if (formData.district) {
      axios
        .get(`https://open.oapi.vn/location/wards/${formData.district}?size=1000`)
        .then((res: any) => {
          setWards(res.data.data as any[]);
        });
    } else {
      setWards([]);
    }
  }, [formData.district]);

  const fetchAddresses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await addressService.getAll();
      setAddresses(data);
    } catch (error) {
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        street: address.street,
        city: address.city,
        ward: address.ward,
        district: address.district,
        phoneNumber: address.phoneNumber,
        name: address.name,
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        street: "",
        city: "",
        ward: "",
        district: "",
        phoneNumber: "",
        name: "",
        isDefault: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAddress(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "city" ? { district: "", ward: "" } : {}),
      ...(name === "district" ? { ward: "" } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Find names by id
    const cityObj = cities.find((c) => c.id === formData.city);
    const districtObj = districts.find((d) => d.id === formData.district);
    const wardObj = wards.find((w) => w.id === formData.ward);

    // Prepare data with names
    const submitData = {
      ...formData,
      city: cityObj ? cityObj.name : "",
      district: districtObj ? districtObj.name : "",
      ward: wardObj ? wardObj.name : "",
    };

    try {
      if (editingAddress) {
        await addressService.update(editingAddress.id, submitData);
        toast.success("Address updated successfully");
      } else {
        await addressService.create(submitData);
        toast.success("Address created successfully");
      }
      handleCloseDialog();
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await addressService.delete(id);
        toast.success("Address deleted successfully");
        fetchAddresses();
      } catch (error) {
        toast.error("Failed to delete address");
      }
    }
  };

  if (!user) return <div>Loading...</div>;
  if (loading) return <div>Loading addresses...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Địa chỉ của tôi</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm địa chỉ mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Đường</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Thành phố</Label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleSelectChange}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Chọn thành phố</option>
                  {cities.map((city: any) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Quận/Huyện</Label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleSelectChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  disabled={!formData.city}
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((district: any) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Phường/Xã</Label>
                <select
                  id="ward"
                  name="ward"
                  value={formData.ward}
                  onChange={handleSelectChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  disabled={!formData.district}
                >
                  <option value="">Chọn phường/xã</option>
                  {wards.map((ward: any) => (
                    <option key={ward.id} value={ward.id}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked: boolean) =>
                    setFormData((prev) => ({ ...prev, isDefault: checked }))
                  }
                />
                <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingAddress ? "Cập nhật" : "Thêm mới"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{address.name}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenDialog(address)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{address.street}</p>
              <p className="text-sm text-muted-foreground">
                {address.ward}, {address.district}, {address.city}
              </p>
              <p className="text-sm text-muted-foreground">
                Phone: {address.phoneNumber}
              </p>
              {address.isDefault && (
                <span className="text-xs text-primary">Địa chỉ mặc định</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddressCustomer;
