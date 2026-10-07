import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Navbar from '../src/components/Navbar.jsx';
import HeaderBanner from '../src/components/HeaderBanner.jsx';
import PackageCard from '../src/components/PackageCard.jsx';
import InstitutionalLogos from '../src/components/InstitutionalLogos.jsx';
import CartDrawer from '../src/components/CartDrawer.jsx';
import IzipayCheckoutModal from '../src/components/IzipayCheckoutModal.jsx';
import AdminPanelModal from '../src/components/AdminPanelModal.jsx';
import AsesoraLoginModal from '../src/components/AsesoraLoginModal.jsx';
import StudentRegisterModal from '../src/components/StudentRegisterModal.jsx';
import StudentCheckoutModal from '../src/components/StudentCheckoutModal.jsx';
import FloatingWhatsapp from '../src/components/FloatingWhatsapp.jsx';
import Footer from '../src/components/Footer.jsx';

const components = {
  Navbar,
  HeaderBanner,
  PackageCard,
  InstitutionalLogos,
  CartDrawer,
  IzipayCheckoutModal,
  AdminPanelModal,
  AsesoraLoginModal,
  StudentRegisterModal,
  StudentCheckoutModal,
  FloatingWhatsapp,
  Footer
};

for (const [name, Component] of Object.entries(components)) {
  try {
    let props = {};
    if (name === 'PackageCard') {
      props = { packageData: { title: 'Test', basePrice: 540, items: [] } };
    }
    if (name === 'IzipayCheckoutModal' || name === 'AdminPanelModal' || name === 'StudentCheckoutModal') {
      props = { isOpen: false, onClose: () => {} };
    }
    ReactDOMServer.renderToString(React.createElement(Component, props));
    console.log(`✅ Component ${name} rendered successfully!`);
  } catch (err) {
    console.error(`❌ Component ${name} FAILED:`, err);
  }
}
