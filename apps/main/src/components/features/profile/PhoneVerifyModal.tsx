import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@repo/ui';
import http from '@/lib/api';
import { getErrorMessage } from "@repo/lib";

interface PhoneVerifyModalProps {
    isOpen: boolean;
    onClose: () => void;
    phone: string;
    onSuccess: () => void;
}

const PhoneVerifyModal: React.FC<PhoneVerifyModalProps> = ({ isOpen, onClose, phone, onSuccess }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Reset all state every time modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setOtp('');
            setError('');
            setSuccessMsg('');
        }
    }, [isOpen]);

    if (!isOpen || !isMounted) return null;

    const handleSendOtp = async () => {
        setLoading(true);
        setError('');
        setSuccessMsg('');
        const [res, err] = await http.post<any>('/client/profile/phone/send-otp', { phone });

        if (err) {
            setError(getErrorMessage(err) || 'Failed to send OTP.');
        } else {
            setSuccessMsg(res?.message || 'OTP sent successfully!');
            setStep(2);
        }
        setLoading(false);
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMsg('');
        const [res, err] = await http.post<any>('/client/profile/phone/verify-otp', { phone, code: otp });

        if (err) {
            setError(getErrorMessage(err) || 'Verification failed. Incorrect OTP.');
        } else {
            setSuccessMsg(res?.message || 'Phone verified successfully!');
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }
        setLoading(false);
    };

    const modalContent = (
        <div 
            style={{ 
                position: 'fixed', 
                inset: 0, 
                zIndex: 10000, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                padding: '20px'
            }}
        >
            <div 
                className="modal-content border-0 shadow" 
                style={{ 
                    borderRadius: '24px', 
                    maxWidth: '450px', 
                    width: '100%',
                    backgroundColor: '#fff',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div className="modal-header border-0 pb-0 pt-4 px-4 flex justify-between items-center">
                    <h5 className="modal-title fw-bold m-0" style={{ fontSize: '1.25rem' }}>Verify Phone Number</h5>
                    <button 
                        type="button" 
                        className="btn-close shadow-none" 
                        onClick={onClose}
                        style={{ backgroundSize: '0.8rem' }}
                    ></button>
                </div>
                <div className="p-4 text-center">
                    {step === 1 ? (
                        <>
                            <div className="mb-4">
                                <div 
                                    className="d-inline-flex rounded-circle p-4 mb-3"
                                    style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)', color: '#FF6B00' }}
                                >
                                    <i className="fa-solid fa-mobile-screen fs-2"></i>
                                </div>
                                <h6 className="fw-bold mb-2" style={{ fontSize: '1.1rem' }}>We will send an OTP to verify your number.</h6>
                                <p className="text-muted mb-0 fs-5 font-bold" style={{ color: '#FF6B00' }}>{phone}</p>
                            </div>
                            {error && <div className="alert alert-danger py-2 rounded-xl border-0 mb-4" style={{ backgroundColor: '#fff5f5', color: '#c53030' }}>{error}</div>}

                            <Button
                                loading={loading}
                                onClick={handleSendOtp}
                                className="w-100 mb-3 py-3 rounded-2xl shadow-premium border-0"
                                variant="primary"
                                style={{ backgroundColor: '#FF6B00', fontWeight: 'bold' }}
                            >
                                Send Verification Code
                            </Button>
                            <button 
                                className="btn w-100 py-3 fw-bold rounded-2xl border-0" 
                                onClick={onClose}
                                style={{ backgroundColor: '#f7fafc', color: '#4a5568' }}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <h6 className="fw-bold mb-1" style={{ fontSize: '1.1rem' }}>Enter Verification Code</h6>
                                <p className="text-muted small mb-4">We've sent a 6-digit code to <span className="fw-bold">{phone}</span></p>

                                <input
                                    type="text"
                                    className="form-control text-center py-3 fs-3 fw-bold border-2 rounded-2xl"
                                    style={{ letterSpacing: '0.5em', borderColor: '#edf2f7' }}
                                    maxLength={6}
                                    placeholder="------"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                />
                            </div>
                            {error && <div className="alert alert-danger py-2 rounded-xl border-0 mb-4" style={{ backgroundColor: '#fff5f5', color: '#c53030' }}>{error}</div>}
                            {successMsg && <div className="alert alert-success py-2 rounded-xl border-0 mb-4" style={{ backgroundColor: '#f0fff4', color: '#2f855a' }}>{successMsg}</div>}

                            <Button
                                loading={loading}
                                onClick={handleVerifyOtp}
                                className="w-100 mb-4 py-3 rounded-2xl shadow-premium border-0"
                                variant="primary"
                                style={{ backgroundColor: '#FF6B00', fontWeight: 'bold' }}
                            >
                                Verify Now
                            </Button>

                            <p className="text-muted small mb-0 fw-medium">
                                Didn't receive the code?{' '}
                                <button 
                                    className="btn btn-link p-0 fw-bold text-decoration-none" 
                                    onClick={handleSendOtp} 
                                    disabled={loading}
                                    style={{ color: '#FF6B00' }}
                                >
                                    Resend OTP
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default PhoneVerifyModal;
