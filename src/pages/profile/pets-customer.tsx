import { useContext, useEffect, useState } from 'react';
import { getPets, IPet, deletePet } from '@/services/pet.service';
import PetCard from '@/components/features/pets/PetCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { UserContext } from "@/store/contexts/UserContext";
import PetFormDialog from '@/components/features/pets/PetFormDialog';
import DeleteConfirmationDialog from '@/components/features/pets/DeleteConfirmationDialog';
import { useNavigate } from 'react-router-dom';

const PetsCustomer: React.FC = () => {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [pets, setPets] = useState<IPet[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<IPet | undefined>();
    const [isDeleting, setIsDeleting] = useState(false);
    const pageSize = 6; // Number of items per page

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchPets(currentPage);
    }, [currentPage, user, navigate]);

    const fetchPets = async (page: number) => {
        try {
            setIsLoading(true);
            
            const params: any = {
                pageNumber: page,
                pageSize: pageSize,
            };
            const res = await getPets(params);
            setPets(res.items);
            setTotalPages(res.totalPagesCount);
        } catch (error) {
            console.error('Error fetching pets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleAddClick = () => {
        setSelectedPet(undefined);
        setIsFormDialogOpen(true);
    };

    const handleEdit = (pet: IPet) => {
        setSelectedPet(pet);
        setIsFormDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setSelectedPet(pets.find(pet => pet.id === id));
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedPet) return;

        try {
            setIsDeleting(true);
            await deletePet(selectedPet.id);
            await fetchPets(currentPage);
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error deleting pet:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!user) {
        return null; // This will trigger the redirect in useEffect
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Thú cưng của tôi</h1>
                <Button onClick={handleAddClick}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm thú cưng
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            ) : pets.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Không có thú cưng nào. Thêm thú cưng của bạn!</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet) => (
                            <PetCard
                                key={pet.id}
                                {...pet}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                userId={user.id}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}

            <PetFormDialog
                isOpen={isFormDialogOpen}
                onClose={() => setIsFormDialogOpen(false)}
                pet={selectedPet}
                onSuccess={() => fetchPets(currentPage)}
                userId={user.id}
            />

            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default PetsCustomer;