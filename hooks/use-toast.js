import { useState, useEffect } from 'react';

export default function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  const hideToast = () => {
    setToast(null);
  };

  return { toast, showToast, hideToast };
}