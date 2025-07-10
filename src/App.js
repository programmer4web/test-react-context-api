import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import CartDemo from './CartDemo';
import BlogDemo from './BlogDemo';

// Complete Application Component
const App = () => {
  const [currentExample, setCurrentExample] = useState('shopping');

  return (
    <Box>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Button
          variant={currentExample === 'shopping' ? 'contained' : 'outlined'}
          onClick={() => setCurrentExample('shopping')}
          sx={{ mr: 2 }}
        >
          Shopping Cart Example
        </Button>
        <Button
          variant={currentExample === 'blog' ? 'contained' : 'outlined'}
          onClick={() => setCurrentExample('blog')}
        >
          Blog Management Example
        </Button>
      </Box>
      
      {currentExample === 'shopping' ? <CartDemo /> : <BlogDemo />}
    </Box>
  );
};

export default App;
