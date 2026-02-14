
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from "../../../../shared/components/Button";

const AlertTriangleComp = AlertTriangle as any;
const XComp = X as any;

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
            icon: <AlertTriangleComp className="w-6 h-6 text-red-600" />,
            iconBg: 'bg-red-100',
            buttonBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            border: 'border-red-100',
        },
        warning: {
            icon: <AlertTriangleComp className="w-6 h-6 text-yellow-600" />,
            iconBg: 'bg-yellow-100',
            buttonBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
            border: 'border-yellow-100',
        },
        info: {
            icon: <AlertTriangleComp className="w-6 h-6 text-blue-600" />, // Using AlertTriangle as placeholder, could use Info
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
                        <XComp className="w-5 h-5" />
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
                        <Button
                            variant={type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : 'primary'}
                            onClick={onConfirm}
                            loading={isLoading}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                        >
                            {confirmLabel}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="mt-3 sm:mt-0 w-full sm:w-auto"
                        >
                            {cancelLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
