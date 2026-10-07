import React from 'react';
import ReactDOMServer from 'react-dom/server';
import AdminPanelModal from '../src/components/AdminPanelModal.jsx';

try {
  console.log('Testing AdminPanelModal isolated render...');
  const props = {
    isOpen: true,
    onClose: () => {},
    initialPackage: { title: 'Test', basePrice: 540 },
    installmentPlans: [],
    successfulTransactions: [],
    onSaveInstallmentPlan: () => {},
    onUpdateInstallmentStatus: () => {},
    onPreviewStudentCheckout: () => {}
  };
  const html = ReactDOMServer.renderToString(React.createElement(AdminPanelModal, props));
  console.log('AdminPanelModal HTML length:', html.length);
} catch (err) {
  console.error('❌ AdminPanelModal Isolated Render Failed:', err);
}
