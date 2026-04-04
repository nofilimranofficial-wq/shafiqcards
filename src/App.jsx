import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import InvitationCards from './pages/InvitationCards';
import EnvelopesCards from './pages/EnvelopesCards';
import EnvelopesDetails from './pages/EnvelopesDetails';
import CorporateBoxes from './pages/CorporateBoxes';
import DigitalInvitation from './pages/DigitalInvitation';
import CardsDetails from './pages/CardsDetails';
import WebInvites from './pages/WebInvites';
import TemplatePreview from './pages/TemplatePreview';
import CreateInvitation from './pages/CreateInvitation';
import InvitationPage from './pages/InvitationPage';
import useGsap from './hooks/useGsap';

// Admin imports...
//...
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import CreateProduct from './pages/admin/CreateProduct';
import ProductList from "./pages/admin/ProductList";
import EditProduct from "./pages/admin/EditProduct";


const App = () => {
  useGsap();

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
        </Route>

        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/invitations" element={<InvitationCards />} />
          <Route path="/envelopes" element={<EnvelopesCards />} />
          <Route path="/envelope/:index" element={<EnvelopesDetails />} />
          <Route path="/box-packaging" element={<CorporateBoxes />} />
          <Route path="/digital-invites" element={<DigitalInvitation />} />
          <Route path="/web-invites" element={<WebInvites />} />
          <Route path="/preview/:templateId" element={<TemplatePreview />} />
          <Route path="/create-invitation" element={<CreateInvitation />} />
          <Route path="/card/:index" element={<CardsDetails />} />
          <Route path="/product/:type/:index" element={<CardsDetails />} />
        </Route>

        {/* Dynamic wedding invitation pages — MUST be last to avoid shadowing other routes */}
        <Route path="/:slug" element={<InvitationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
