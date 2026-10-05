import React, { createContext, useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


export const CartContext = createContext()

const CartProvider = ({children}) => {

    const { accessToken, userType } = useAuth();

    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    const [cartItemsLoading, setCartItemsLoading] = useState(false);
    const [cartErrors, setCartErrors] = useState({});

    const navigate = useNavigate();
    const location = useLocation()


    const fetchCart = async () => {
        try {
            const res = await api.get('/cart');

            if (res.data && res.data.length > 0) {
                setCart(res.data[0]); 
            }
            console.log('cart fetched');

        } catch (error) {
            console.log(error);
        }
    }

    const fetchCartItems = async () => {
        try {
            setCartItemsLoading(true)
            const res = await api.get('/cart-items/');

            setCartItems(res.data)
            console.log('cart items fetched');

        } catch (error) {
            console.log(error);
        } finally {
            setCartItemsLoading(false)
        }
    };

    const createCart = async () => {
        try {
            const res = await api.post('/cart/', {});

            setCart(res.data);
            return res.data;

        } catch (error) {
            console.log(error.response?.data);
        }
    };

    const addToCart = async (selection, onSuccess) => {
        
        // const accessToken = localStorage.getItem('accessToken')

        if (!accessToken) {
            toast('Please Login', { icon: '⚠️' })
            navigate('/auth', { state: { redirectTo: location.pathname } })
            // navigate('/login', { state: redirectTo })
            return 
        }
        let errors = {};
        if (!selection.color) errors.color = 'Please select a color.';
        if (!selection.size) errors.size = 'Please select a size.';

        // 2. If there are errors, update state and stop execution
        if (Object.keys(errors).length > 0) {
            setCartErrors(errors);
            // Toast the first error found
            return;
        }

        // 3. Clear errors if validation passes
        setCartErrors({});


        if (!selection.color) {
            // setCartErrors({color : 'Please select a color.'})
            return toast('Please select a color.', { icon: '⚠️' })
        }
        if (!selection.size) {
            // setCartErrors({size : 'Please select a size.'})
            return toast('Please select a size.', { icon: '⚠️' })
        }

        try {
            let currentCart = cart;

            // for to create new cart if the user doesnt created cart yet.
            if (!currentCart) {
                currentCart = await createCart();
            }


            const existing = cartItems.find(item =>
                item.product.id === selection.product.id &&
                item.color.id === selection.color.id &&
                item.size.id === selection.size.id
            );

            // for to updates the quantity if the user select same size and color for the product
            if (existing) {
                await api.patch(`/cart-items/${existing.id}/`, {
                    quantity: existing.quantity + selection.quantity
                });
            } else {
                await api.post('/cart-items/',{
                    cart: currentCart.id,
                    product: selection.product.id,
                    color: selection.color.id,
                    size: selection.size.id,
                    quantity: selection.quantity
                });
            }

            fetchCartItems();

            // for to call removeSelection if the product successfully added to cart 
            if (onSuccess) {
                onSuccess();
            }

            // toast.success('Product added to cart!')

            toast.custom((t) => (
                <div className="bg-white shadow-xl border rounded-lg p-4 flex items-center gap-4 min-w-[320px]">
                    <div className="flex-1">
                        <p className="text-black font-semibold">
                            Added to cart
                        </p>
                        <p className="text-sm">
                            Your product is in the cart.
                        </p>
                    </div>
                    <button onClick={() => {toast.dismiss(t.id); navigate("/my-cart");}} className="btn-primary px-3 py-2 text-sm">
                        View Cart
                    </button>
                    {/* <button onClick={() => toast.dismiss(t.id)} className="text-gray-400">
                        <FiX size={18} />
                    </button> */}
                </div>
            ),
            {duration:2000}
        );

        } catch (error) {
            console.log(error.response?.data);
            toast.error('Failed to add product to cart.')
        }
    };

    const removeFromCart = async (id) => {
        try {
                    // setCartItems(prevItems => prevItems.filter(item => item.id !== id));

            await api.delete(`/cart-items/${id}/`);

            // await fetchCartItems();

            setCartItems(prevItems =>
                prevItems.filter(item => item.id !== id)
            );

            toast.success("Item removed from cart.");
        } catch (error) {
            console.error(error);
            toast.error("Unable to remove item from cart.");
            // await fetchCartItems()
        }
    };

    const updateQuantity = async (id, quantity) => {

        await api.patch(`/cart-items/${id}/`,{
            quantity
        });

        // await fetchCartItems();
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: quantity }
                    : item
            )
        );

    };

    const increaseQuantity = (item) => {
        updateQuantity(item.id, item.quantity + 1);
    };

    const decreaseQuantity = (item) => {
        if(item.quantity <= 1) return;
        
        updateQuantity(item.id, item.quantity - 1);
    };

    const clearCart = async () => {
        if (!cartItems.length) {
            return;
        }
        // if (!window.confirm('Clear all items from cart?')) {
        //     return;
        // }
        try {
            await Promise.all(
                cartItems.map(item =>
                    api.delete(`/cart-items/${item.id}/`)
                )
            );
            toast.success('Cart cleared!')

            setCartItems([]);
        } catch (error) {
            console.log(error);
            toast.error('Failed to clear cart.')
        }
    };

    const totalItems = cartItems.reduce((total,item) => total + item.quantity, 0)

    const subtotal = cartItems.reduce((sum, item) => {
        const sellingPrice = item.product.discount_price !== null 
            ? Number(item.product.discount_price) 
            : Number(item.product.price);

        return sum + (sellingPrice * item.quantity);
    }, 0);

    const total = subtotal - 0;


    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if(accessToken && userType === 'wholesaler') {
            fetchCart();
        }
    }, [accessToken, userType]);

    useEffect(() => {
        if (accessToken && userType === 'wholesaler'  && cart) {
            fetchCartItems();
        }
    }, [accessToken, userType, cart]);
    
    return (
        <CartContext.Provider value={{cart, cartItems, cartItemsLoading, cartErrors, setCartErrors, setCartItems, fetchCart, fetchCartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart,
                            totalItems, subtotal : subtotal.toFixed(2), total : total.toFixed(2)}}>
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;
