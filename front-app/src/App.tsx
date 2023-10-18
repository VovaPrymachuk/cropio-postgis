import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './Pages/HomePage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { AppBar, Button, Grid, Toolbar, Typography } from '@mui/material';
import { Field } from './components/Field';
import CreateField from './components/CreateField';
import EditField from './components/EditField';

function App() {
  return (
    <>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1, textDecoration: 'none' }}
            component={Link}
            to="/"
            color="textPrimary"
          >
            Home
          </Typography>
          <Button color="inherit" component={Link} to="/fields/new">
            Create new Field
          </Button>
        </Toolbar>
      </AppBar>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        my={4}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fields" element={<HomePage />} />
          <Route path="/fields/new" element={<CreateField />} />
          <Route path="/fields/:id" element={<Field />} />
          <Route path="/fields/:id/edit" element={<EditField />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Grid>
    </>
  );
}

export default App;
