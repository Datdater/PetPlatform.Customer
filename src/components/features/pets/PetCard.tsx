import { IPet } from '@/services/pet.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface PetCardProps extends IPet {
    onEdit?: (pet: IPet) => void;
    onDelete?: (id: string) => void;
}

const PetCard = ({ id, name, dob, petType, weight, image, color, specialRequirement, onEdit, onDelete }: PetCardProps) => {
    return (
        <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col h-full">
                {/* Pet Image */}
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                    <img
                        src={image || "https://placehold.co/400x300?text=No+Image"}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Pet Info */}
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">{name}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Loại:</span> {petType ? "Chó" : "Mèo"}</p>
                        <p><span className="font-medium">Cân nặng:</span> {weight} kg</p>
                        {dob && (
                            <p><span className="font-medium">Ngày sinh:</span> {new Date(dob).toLocaleDateString()}</p>
                        )}
                        {specialRequirement && (
                            <p><span className="font-medium">Yêu cầu đặc biệt:</span> {specialRequirement}</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onEdit?.({ id, name, dob, petType, weight, image, color, specialRequirement, appUserId: '' })}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => onDelete?.(id)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default PetCard; 