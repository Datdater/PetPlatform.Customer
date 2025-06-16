import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IPet, createPet, updatePet } from '@/services/pet.service';

interface PetFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    pet?: IPet;
    onSuccess: () => void;
    userId: string;
}

const PetFormDialog = ({ isOpen, onClose, pet, onSuccess, userId }: PetFormDialogProps) => {
    const [formData, setFormData] = useState<Partial<IPet>>({
        name: '',
        dob: '',
        petType: true,
        weight: 0,
        color: '',
        specialRequirement: '',
        userId: '',
        image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhdHxlbnwwfHwwfHx8MA%3D%3D%3D'
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (pet) {
            // Convert UTC date to local date for display
            const localDate = pet.dob ? new Date(pet.dob).toISOString().split('T')[0] : '';
            // Convert petType to boolean
            const petType = typeof pet.petType === 'string' 
                ? pet.petType === 'True'
                : Boolean(pet.petType);
            
            setFormData({
                ...pet,
                dob: localDate,
                petType: petType
            });
        } else {
            setFormData({
                name: '',
                dob: '',
                petType: true,
                weight: 0,
                color: '',
                specialRequirement: '',
                userId: userId,
                image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhdHxlbnwwfHwwfHx8MA%3D%3D%3D'
            });
        }
    }, [pet, userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Convert local date to UTC and ensure petType is boolean
            const dataToSubmit = {
                ...formData,
                dob: formData.dob ? new Date(formData.dob + 'T00:00:00Z').toISOString() : '',
                petType: typeof formData.petType === 'string' 
                    ? formData.petType === 'true'
                    : Boolean(formData.petType)
            };

            if (pet?.id) {
                await updatePet(pet.id, dataToSubmit as IPet);
            } else {
                await createPet(dataToSubmit as IPet);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving pet:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{pet ? 'Sửa thú cưng' : 'Thêm thú cưng'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob">Ngày sinh</Label>
                        <Input
                            id="dob"
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="petType">Loại</Label>
                        <select
                            id="petType"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            value={formData.petType ? 'true' : 'false'}
                            onChange={(e) => setFormData({ ...formData, petType: e.target.value === 'true' })}
                            required
                        >
                            <option value="true">Mèo</option>
                            <option value="false">Chó</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="weight">Cân nặng</Label>
                        <Input
                            id="weight"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="color">Màu sắc</Label>
                        <Input
                            id="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="specialRequirement">Yêu cầu đặc biệt</Label>
                        <Input
                            id="specialRequirement"
                            value={formData.specialRequirement}
                            onChange={(e) => setFormData({ ...formData, specialRequirement: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Đang lưu...' : pet ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PetFormDialog; 