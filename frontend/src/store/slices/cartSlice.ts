import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

interface CartItem {
  id: string; // Internal id for tracking
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
}

const ISSERVER = typeof window === "undefined";
const cartItemsFromStorage = !ISSERVER && localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems') as string)
  : [];

const initialState: CartState = {
  cartItems: cartItemsFromStorage,
  loading: false,
  error: null,
};

// If authenticated, we can fetch from backend
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userInfo = state.auth.userInfo;
      
      if (!userInfo) return rejectWithValue('Not logged in');
      
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cart`, config);
      
      // Transform backend cart items to match our frontend interface
      const items = data.data.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity
      }));
      
      localStorage.setItem('cartItems', JSON.stringify(items));
      return items;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartLocal: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.cartItems.find(x => x.productId === item.productId);

      if (existItem) {
        state.cartItems = state.cartItems.map(x => 
          x.productId === existItem.productId ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCartLocal: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(x => x.productId !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cartItems = action.payload;
    });
  }
});

export const { addToCartLocal, removeFromCartLocal, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
