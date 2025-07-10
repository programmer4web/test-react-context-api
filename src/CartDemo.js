import React, { createContext, useContext, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Badge,
  Box,
  IconButton,
  Container,
  Grid,
  Divider
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
  Delete
} from '@mui/icons-material';

// Create Cart Context
const CartContext = createContext();

// Cart Provider Component
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Gaming PC', price: 1299, quantity: 1 }
  ]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartValue = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartValue
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart context
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Header Component
const Header = () => {
  const { getCartTotal } = useCart();

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PC Store
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={getCartTotal()} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

// Product Display Component
const ProductDisplay = () => {
  const { addToCart, cartItems } = useCart();

  const products = [
    { id: 1, name: 'Gaming PC', price: 1299, description: 'High-performance gaming computer' },
    { id: 2, name: 'Office PC', price: 699, description: 'Reliable computer for office work' }
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Available Products
      </Typography>
      <Grid container spacing={3}>
        {products.map(product => {
          const inCart = cartItems.find(item => item.id === product.id);
          return (
            <Grid item xs={12} md={6} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    ${product.price}
                  </Typography>
                  <Typography variant="body2">
                    {product.description}
                  </Typography>
                  {inCart && (
                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                      In cart: {inCart.quantity}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    onClick={() => addToCart(product)}
                    startIcon={<Add />}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

// Cart Component
const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartValue } = useCart();

  if (cartItems.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <Typography>Your cart is empty</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      {cartItems.map(item => (
        <Card key={item.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6">{item.name}</Typography>
                <Typography color="textSecondary">${item.price} each</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  size="small"
                >
                  <Remove />
                </IconButton>
                <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center' }}>
                  {item.quantity}
                </Typography>
                <IconButton
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  size="small"
                >
                  <Add />
                </IconButton>
                <IconButton
                  onClick={() => removeFromCart(item.id)}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" color="textSecondary">
              Subtotal: ${item.price * item.quantity}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" align="right">
        Total: ${getCartValue()}
      </Typography>
    </Container>
  );
};

export const CartDemo = () => {

  return (
    <div style={{ 
      padding: '20px',  
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Shopping Cart with Header Integration</h1>
      <p>Our first example demonstrates a shopping cart system where the cart state is shared between the main product display and a header component showing the cart count.</p>
      
      <CartProvider>
        <Header />
        <ProductDisplay />
        <Cart />
      </CartProvider>
    </div>
  );
};

export default CartDemo;