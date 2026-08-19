import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@repo/ui';

interface BlockConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isBlocking: boolean;
  isLoading?: boolean;
}

export function BlockConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isBlocking,
  isLoading = false,
}: BlockConfirmModalProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputValue.trim().toLowerCase() === userName.trim().toLowerCase()) {
      onConfirm();
    }
  };

  const isMatched = inputValue.trim().toLowerCase() === userName.trim().toLowerCase();

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={!isLoading ? onClose : undefined} />
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300 border border-white">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isBlocking ? 'bg-rose-50 text-rose-500' : 'bg-green-50 text-green-500'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-black text-gray-900">
              {isBlocking ? 'Block User' : 'Unblock User'}
            </h4>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Please confirm your action
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4 font-medium">
            Are you sure you want to {isBlocking ? 'block' : 'unblock'} <span className="font-bold text-gray-900">{userName}</span>?
          </p>
          <p className="text-sm text-gray-600 mb-2">
            To confirm, type <span className="font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{userName}</span> below:
          </p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={userName}
            className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold text-gray-900 placeholder:text-gray-300 border border-gray-200 focus:ring-2 focus:ring-rose-500/20 transition-all outline-none"
            autoFocus
          />
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="secondary"
            className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isMatched || isLoading}
            loading={isLoading}
            variant={isBlocking ? 'danger' : 'primary'}
            className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
          >
            {isBlocking ? 'Block' : 'Unblock'}
          </Button>
        </div>
      </div>
    </div>
  );
}
