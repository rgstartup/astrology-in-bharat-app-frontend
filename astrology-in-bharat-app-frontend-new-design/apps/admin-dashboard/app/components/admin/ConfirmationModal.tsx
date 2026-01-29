
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    type = 'danger',
    isLoading = false,
}) => {
    if (!isOpen) return null;

    const typeConfig = {
        danger: {
            icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
            iconBg: 'bg-red-100',
            buttonBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            border: 'border-red-100',
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
            iconBg: 'bg-yellow-100',
            buttonBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
            border: 'border-yellow-100',
        },
        info: {
            icon: <AlertTriangle className="w-6 h-6 text-blue-600" />, // Using AlertTriangle as placeholder, could use Info
            iconBg: 'bg-blue-100',
            buttonBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            border: 'border-blue-100',
        },
    };

    const config = typeConfig[type];

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg animate-in zoom-in-95 duration-300">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${config.iconBg} sm:mx-0 sm:h-10 sm:w-10 transition-transform duration-500 hover:rotate-12`}>
                                {config.icon}
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 className="text-xl font-bold leading-6 text-gray-900" id="modal-title">
                                    {title}
                                </h3>
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
                        <button
                            type="button"
                            disabled={isLoading}
                            className={`inline-flex w-full justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm sm:w-auto transition-all ${config.buttonBg} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95`}
                            onClick={onConfirm}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </div>
                            ) : confirmLabel}
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-all transform active:scale-95"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
