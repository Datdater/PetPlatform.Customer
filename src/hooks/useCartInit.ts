import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCartCount, setLoading } from '@/store/slices/CartSlice';
import { cartService } from '@/services/cart.service';
import { useContext } from 'react';
import { UserContext } from '@/store/contexts/UserContext';

export const useCartInit = () => {
    const dispatch = useDispatch();
    const user = useContext(UserContext);

    useEffect(() => {
        const initCart = async () => {
            console.log('initCart');
            if (!user) {
                dispatch(setCartCount(0));
                dispatch(setLoading(false));
                return;
            }

            try {
                const cart = await cartService.getCart(user.id);
                dispatch(setCartCount(cart.items.length));
            } catch (error) {
                console.error('Failed to load cart:', error);
                dispatch(setCartCount(0));
            } finally {
                dispatch(setLoading(false));
            }
        };

        initCart();
    }, [dispatch, user]);
}; 