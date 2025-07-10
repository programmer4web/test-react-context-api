import React, { createContext, useContext, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Add, LocalOffer, Category } from '@mui/icons-material';

// Create Blog Context
const BlogContext = createContext();

// Blog Provider Component
const BlogProvider = ({ children }) => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Technology', count: 15 },
    { id: 2, name: 'Design', count: 8 },
    { id: 3, name: 'Programming', count: 12 }
  ]);

  const [tags, setTags] = useState([
    { id: 1, name: 'React', count: 10 },
    { id: 2, name: 'JavaScript', count: 18 },
    { id: 3, name: 'CSS', count: 7 },
    { id: 4, name: 'UI/UX', count: 5 }
  ]);

  const [posts] = useState([
    {
      id: 1,
      title: 'Getting Started with React Context API',
      excerpt: 'Learn how to manage state efficiently in React applications.',
      category: 'Technology',
      tags: ['React', 'JavaScript']
    },
    {
      id: 2,
      title: 'Modern CSS Techniques',
      excerpt: 'Explore advanced CSS features for better web design.',
      category: 'Design',
      tags: ['CSS', 'UI/UX']
    },
    {
      id: 3,
      title: 'JavaScript Best Practices',
      excerpt: 'Write cleaner and more maintainable JavaScript code.',
      category: 'Programming',
      tags: ['JavaScript']
    }
  ]);

  const addCategory = (name) => {
    const newCategory = {
      id: Date.now(),
      name,
      count: 0
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const addTag = (name) => {
    const newTag = {
      id: Date.now(),
      name,
      count: 0
    };
    setTags(prev => [...prev, newTag]);
  };

  const getPostsByCategory = (categoryName) => {
    return posts.filter(post => post.category === categoryName);
  };

  const getPostsByTag = (tagName) => {
    return posts.filter(post => post.tags.includes(tagName));
  };

  return (
    <BlogContext.Provider value={{
      categories,
      tags,
      posts,
      addCategory,
      addTag,
      getPostsByCategory,
      getPostsByTag
    }}>
      {children}
    </BlogContext.Provider>
  );
};

// Custom hook for using blog context
const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

// Aside Navigation Component
const AsideNavigation = () => {
  const { categories, tags } = useBlog();

  return (
    <Box sx={{ width: 300, p: 2 }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Category sx={{ mr: 1 }} />
          Categories
        </Typography>
        <List dense>
          {categories.map(category => (
            <ListItem key={category.id} divider>
              <ListItemText
                primary={category.name}
                secondary={`${category.count} posts`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalOffer sx={{ mr: 1 }} />
          Tags
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {tags.map(tag => (
            <Chip
              key={tag.id}
              label={`${tag.name} (${tag.count})`}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

// Main Content Component
const MainContent = () => {
  const { posts } = useBlog();

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Blog Posts
      </Typography>
      <Grid container spacing={3}>
        {posts.map(post => (
          <Grid item xs={12} md={6} key={post.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {post.excerpt}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={post.category}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {post.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Categories Management Component
const CategoriesManagement = () => {
  const { categories, addCategory } = useBlog();
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setOpen(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Categories Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Category
        </Button>
      </Box>

      <Grid container spacing={2}>
        {categories.map(category => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6">{category.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {category.count} posts
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCategory} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Main Blog App Component
const BlogDemo = () => {
  return (
    <BlogProvider>
      <Box sx={{ display: 'flex', minHeight: '60vh' }}>
        <AsideNavigation />
        <Divider orientation="vertical" flexItem />
        <MainContent />
      </Box>
      <Divider />
      <CategoriesManagement />
    </BlogProvider>
  );
};

export default BlogDemo;