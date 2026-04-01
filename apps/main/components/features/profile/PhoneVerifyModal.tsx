import React, { useState, useEffect } from 'react';
import { Button } from '@repo/ui';
import http from '@/lib/api';

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

    // Reset all state every time modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setOtp('');
            setError('');
            setSuccessMsg('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSendOtp = async () => {
        setLoading(true);
        setError('');
        setSuccessMsg('');
        const [res, err] = await http.post<any>('/client/profile/phone/send-otp', { phone });

        if (err) {
            setError(err.message || 'Failed to send OTP.');
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
            setError(err.message || 'Verification failed. Incorrect OTP.');
        } else {
            setSuccessMsg(res?.message || 'Phone verified successfully!');
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }
        setLoading(false);
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow" style={{ borderRadius: '16px' }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Verify Phone Number</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4 text-center">
                        {step === 1 ? (
                            <>
                                <div className="mb-4">
                                    <div className="d-inline-flex border border-primary text-primary rounded-circle p-3 mb-3">
                                        <i className="fa-solid fa-mobile-screen fs-3"></i>
                                    </div>
                                    <h6 className="fw-bold">We will send an OTP to verify your number.</h6>
                                    <p className="text-muted mb-0 fs-5">{phone}</p>
                                </div>
                                {error && <div className="alert alert-danger py-2">{error}</div>}

                                <Button
                                    loading={loading}
                                    onClick={handleSendOtp}
                                    className="w-100 mb-2 py-2"
                                    variant="primary"
                                >
                                    Send Verification Code
                                </Button>
                                <button className="btn btn-light w-100 py-2 fw-semibold" onClick={onClose}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <h6 className="fw-bold">Enter Verification Code</h6>
                                    <p className="text-muted small mb-3">We've sent a 6-digit code to {phone}</p>

                                    <input
                                        type="text"
                                        className="form-control text-center py-2 fs-4 fw-bold"
                                        style={{ letterSpacing: '0.5em' }}
                                        maxLength={6}
                                        placeholder="------"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    />
                                </div>
                                {error && <div className="alert alert-danger py-2">{error}</div>}
                                {successMsg && <div className="alert alert-success py-2">{successMsg}</div>}

                                <Button
                                    loading={loading}
                                    onClick={handleVerifyOtp}
                                    className="w-100 mb-3 py-2"
                                    variant="primary"
                                >
                                    Verify Now
                                </Button>

                                <p className="text-muted small mb-0">
                                    Didn't receive the code?{' '}
                                    <button className="btn btn-link p-0 fw-bold text-decoration-none" onClick={handleSendOtp} disabled={loading}>
                                        Resend OTP
                                    </button>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneVerifyModal;
