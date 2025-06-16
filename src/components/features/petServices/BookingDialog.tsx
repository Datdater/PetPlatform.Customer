import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, X, AlertCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPets } from "@/services/pet.service";
import { IPet } from "@/services/pet.service";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createBooking, ICreateBookingDto } from "@/services/booking.service";
import { getUser } from "@/services/user.service";
import { IPetServiceDetail } from "@/types/petServices/IPetServiceCard";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface BookingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    petServiceList?: IPetServiceDetail[];
    storeId?: string;
}

interface PetServiceSelection {
    petId: string;
    serviceDetailId: string;
}

const BookingDialog = ({ isOpen, onClose, petServiceList, storeId }: BookingDialogProps) => {
    const navigate = useNavigate();
    const [date, setDate] = useState<Date | null>(null);
    const [selectedPetServices, setSelectedPetServices] = useState<PetServiceSelection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pets, setPets] = useState<IPet[]>([]);
    const [isLoadingPets, setIsLoadingPets] = useState(true);
    const [userId, setUserId] = useState<string>("");
    const [selectedPetId, setSelectedPetId] = useState<string>("");
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [petsResponse, userResponse] = await Promise.all([
                    getPets(1, 100),
                    getUser()
                ]);
                setPets(petsResponse.items);
                if (userResponse) {
                    setUserId(userResponse.id);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoadingPets(false);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !userId) {
            return;
        }

        setIsLoading(true);
        try {
            const bookingData: ICreateBookingDto = {
                bookingTime: date.toISOString(),
                description: "Booking for pet service",
                userId: userId,
                bookingDetails: selectedPetServices.map(selection => ({
                    pet: { id: selection.petId },
                    services: [{ id: selection.serviceDetailId }],
                })),
                storeId: storeId!
            };

            await createBooking(bookingData);
            onClose();
        } catch (error) {
            console.error("Error submitting booking:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPet = () => {
        onClose();
        navigate("/profile/pets");
    };

    const handlePetSelect = (petId: string) => {
        setSelectedPetId(petId);
    };

    const handleServiceDetailSelect = (serviceDetailId: string) => {
        if (!selectedPetId) return;

        setSelectedPetServices(prev => {
            // Check if this pet already has this service
            const existingIndex = prev.findIndex(
                selection => selection.petId === selectedPetId && selection.serviceDetailId === serviceDetailId
            );

            if (existingIndex !== -1) {
                return prev.filter((_, index) => index !== existingIndex);
            }

            return [...prev, { petId: selectedPetId, serviceDetailId }];
        });
    };

    const removePetService = (petId: string, serviceDetailId: string) => {
        setSelectedPetServices(prev =>
            prev.filter(
                selection => !(selection.petId === petId && selection.serviceDetailId === serviceDetailId)
            )
        );
    };

    const getSelectedPetServices = () => {
        return selectedPetServices.map(selection => {
            const pet = pets.find(p => p.id === selection.petId);
            const serviceDetail = petServiceList?.find(s => s.id === selection.serviceDetailId);
            return { pet, serviceDetail };
        });
    };

    const getAvailableServiceDetails = (pet: IPet) => {
        console.log(petServiceList);
        return petServiceList!.filter(detail => 
            pet.weight >= detail.petWeightMin &&
            pet.weight <= detail.petWeightMax
        );
    };

    const calculateTotalPrice = () => {
        return selectedPetServices.reduce((total, selection) => {
            const serviceDetail = petServiceList?.find(s => s.id === selection.serviceDetailId);
            return total + (serviceDetail?.amount || 0);
        }, 0);
    };

    const CustomInput = React.forwardRef<HTMLInputElement, any>(({ value, onClick }, ref) => (
        <div className="relative w-full">
            <input
                ref={ref}
                value={value}
                readOnly
                className="w-full rounded-md border px-3 py-2"
                style={{ cursor: "pointer" }}
                tabIndex={0}
            />
            <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setIsDatePickerOpen((open) => !open)}
                tabIndex={-1}
            >
                <Calendar className="h-5 w-5 text-muted-foreground" />
            </button>
        </div>
    ));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Đặt lịch dịch vụ</DialogTitle>
                    <DialogDescription>
                        Vui lòng điền thông tin để đặt lịch dịch vụ
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="date" className="px-1">
                                Ngày & Giờ
                            </Label>
                            <ReactDatePicker
                                selected={date}
                                onChange={(dt) => setDate(dt as Date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="Pp"
                                placeholderText="Select date and time"
                                minDate={new Date()}
                                id="date"
                                open={isDatePickerOpen}
                                onClickOutside={() => setIsDatePickerOpen(false)}
                                customInput={<CustomInput />}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pet">Thú cưng</Label>
                        {isLoadingPets ? (
                            <div className="text-sm text-muted-foreground">Đang tải danh sách thú cưng...</div>
                        ) : pets.length > 0 ? (
                            <div className="space-y-3">
                                <Select value={selectedPetId} onValueChange={handlePetSelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn thú cưng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pets.map((pet) => (
                                            <SelectItem
                                                key={pet.id}
                                                value={pet.id}
                                            >
                                                {pet.name} ({pet.weight}kg)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedPetId && (
                                    <div className="space-y-2">
                                        <Label>Dịch vụ phù hợp</Label>
                                        <Select value="" onValueChange={handleServiceDetailSelect}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn dịch vụ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getAvailableServiceDetails(pets.find(p => p.id === selectedPetId)!).map((detail) => (
                                                    <SelectItem
                                                        key={detail.id}
                                                        value={detail.id}
                                                    >
                                                        {detail.name} - {detail.amount.toLocaleString('vi-VN')}đ
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {getSelectedPetServices().map(({ pet, serviceDetail }) => (
                                        <Badge
                                            key={`${pet?.id}-${serviceDetail?.id}`}
                                            variant="secondary"
                                            className="flex items-center gap-1 px-3 py-1"
                                        >
                                            {pet?.name} - {serviceDetail?.name}
                                            <button
                                                type="button"
                                                onClick={() => removePetService(pet!.id, serviceDetail!.id)}
                                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            >
                                                <X className="h-3 w-3" />
                                                <span className="sr-only">Remove {pet?.name} - {serviceDetail?.name}</span>
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="text-sm text-muted-foreground">
                                    Bạn chưa có thú cưng nào. Vui lòng thêm thú cưng để đặt lịch.
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleAddPet}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Thêm thú cưng
                                </Button>
                            </div>
                        )}
                    </div>

                    {selectedPetServices.length > 0 && (
                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Dự đoán thanh toán:</span>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Cân nặng của thú sẽ được đo lại tại cửa hàng</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <span className="font-semibold text-lg">
                                {calculateTotalPrice().toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !date || selectedPetServices.length === 0}
                        >
                            {isLoading ? "Đang xử lý..." : "Đặt lịch"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BookingDialog;