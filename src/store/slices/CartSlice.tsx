import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  itemCount: number;
  isLoading: boolean;
}

const initialState: CartState = {
  itemCount: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<number>) => {
      state.itemCount += action.payload;
    },
    setCartCount: (state, action: PayloadAction<number>) => {
      state.itemCount = action.payload;
      state.isLoading = false;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.itemCount = Math.max(0, state.itemCount - action.payload);
    },
    clearCart: (state) => {
      state.itemCount = 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { addToCart, setCartCount, removeFromCart, clearCart, setLoading } = cartSlice.actions;
export default cartSlice.reducer;