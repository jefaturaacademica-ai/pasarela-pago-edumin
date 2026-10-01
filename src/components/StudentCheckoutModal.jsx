import React from 'react';
import IzipayCheckoutModal from './IzipayCheckoutModal';

export default function StudentCheckoutModal({ isOpen, onClose, linkData }) {
  if (!isOpen) return null;

  const activeAmount = linkData?.amount || 540;
  const activePackage = linkData?.packageName || 'PROGRAMA DE ESPECIALIZACIÓN EDUMIN';

  const cartItems = [{
    id: linkData?.id || 'CUSTOM-LINK',
    title: activePackage,
    price: activeAmount
  }];

  const initialStudentData = {
    name: linkData?.clientName || '',
    email: linkData?.email || '',
    phone: linkData?.phone || ''
  };

  return (
    <IzipayCheckoutModal
      isOpen={isOpen}
      onClose={onClose}
      amount={activeAmount}
      cartItems={cartItems}
      onPaymentSuccess={() => {}}
      isAdminLoggedIn={false}
      initialStudentData={initialStudentData}
    />
  );
}
