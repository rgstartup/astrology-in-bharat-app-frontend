import React, { useEffect, useState } from "react";
import { CreditCard, Edit3, Save, ChevronDown, ChevronUp, Trash2, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import {
    getBankAccounts,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setPrimaryBankAccount
} from "@/lib/profile";
import { Button } from "@repo/ui";

interface BankAccount {
    id: string;
    account_holder_name: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    upi_id?: string;
    is_primary: boolean;
}

export default function PayoutInfo() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingAccountId, setEditingAccountId] = useState<string | 'new' | null>(null);
    const [confirmAccNo, setConfirmAccNo] = useState("");

    const [formData, setFormData] = useState<Partial<BankAccount>>({
        account_holder_name: '', bank_name: '', account_number: '', ifsc_code: '', upi_id: '', is_primary: false
    });

    // Fetch accounts from professional API
    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const data = await getBankAccounts();
            setAccounts(data);
        } catch (error) {
            console.error("Failed to fetch bank accounts:", error);
            toast.error("Could not load bank accounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleAddAccount = () => {
        setFormData({
            account_holder_name: '', bank_name: '', account_number: '', ifsc_code: '', upi_id: '', is_primary: accounts.length === 0
        });
        setEditingAccountId('new');
        setConfirmAccNo("");
    };

    const handleEditAccount = (acc: BankAccount) => {
        setFormData(acc);
        setEditingAccountId(acc.id);
        setConfirmAccNo(acc.account_number);
    };

    const handleDeleteAccount = async (id: string) => {
        if (confirm("Are you sure you want to remove this bank account?")) {
            try {
                const res = await deleteBankAccount(id);
                toast.success(res?.message || "Account removed successfully");
                fetchAccounts();
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to delete account");
            }
        }
    };

    const handleSetPrimary = async (id: string) => {
        try {
            const res = await setPrimaryBankAccount(id);
            toast.success(res?.message || "Primary account updated");
            fetchAccounts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to set primary account");
        }
    };

    const saveCurrentEdit = async () => {
        if (formData.account_number !== confirmAccNo) {
            toast.error("Account numbers do not match!");
            return;
        }

        try {
            if (editingAccountId === 'new') {
                const res = await addBankAccount(formData);
                toast.success(res?.message || "New bank account added");
            } else if (editingAccountId) {
                const res = await updateBankAccount(editingAccountId, formData);
                toast.success(res?.message || "Bank account updated");
            }
            setEditingAccountId(null);
            fetchAccounts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save bank details");
        }
    };

    const handleFieldChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className={`overflow-hidden rounded-2xl shadow-xl transition-all duration-300 border-2 ${editingAccountId ? 'border-orange-400 bg-white' : 'border-orange-400 bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30'}`}>
            <div
                className={`p-4 flex justify-between items-center cursor-pointer ${editingAccountId ? 'bg-amber-600 outline-none' : 'bg-gradient-to-r from-amber-600 to-yellow-600'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="flex items-center text-base sm:text-lg font-bold text-white">
                    <div className="bg-white/20 p-1.5 rounded-lg mr-2.5 backdrop-blur-sm">
                        {/* @ts-ignore */}
                        <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    Payout & Bank Info
                </h2>
                <div className="flex items-center space-x-3">
                    {/* @ts-ignore */}
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-white/70" /> : <ChevronDown className="w-5 h-5 text-white/70" />}
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 sm:p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    {editingAccountId ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-black text-[#800000] uppercase tracking-tighter">
                                    {editingAccountId === 'new' ? 'Add New Bank Account' : 'Edit Bank Account'}
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2 group">
                                    <label className="block text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1.5 ml-1">Account Holder Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-user text-amber-500/50 text-xs"></i>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.account_holder_name || ""}
                                            onChange={(e) => handleFieldChange('account_holder_name', e.target.value)}
                                            placeholder="Full Name as per Bank Records"
                                            className="w-full pl-9 pr-3 py-2.5 border-2 border-amber-50 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-sm text-gray-800 bg-white transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2 group">
                                    <label className="block text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1.5 ml-1">Bank Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-building-columns text-amber-500/50 text-xs"></i>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.bank_name || ""}
                                            onChange={(e) => handleFieldChange('bank_name', e.target.value)}
                                            placeholder="e.g. State Bank of India, HDFC, etc."
                                            className="w-full pl-9 pr-3 py-2.5 border-2 border-amber-50 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-sm text-gray-800 bg-white transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1.5 ml-1">Account Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-hashtag text-amber-500/50 text-xs"></i>
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.account_number || ""}
                                            onChange={(e) => handleFieldChange('account_number', e.target.value)}
                                            placeholder="Enter Bank Account Number"
                                            className="w-full pl-9 pr-3 py-2.5 border-2 border-amber-50 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-sm text-gray-800 bg-white transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1.5 ml-1">Confirm Account Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-check-double text-amber-500/50 text-xs"></i>
                                        </div>
                                        <input
                                            type="text"
                                            value={confirmAccNo}
                                            onChange={(e) => setConfirmAccNo(e.target.value)}
                                            placeholder="Re-enter Account Number"
                                            className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-xl focus:ring-4 outline-none text-sm text-gray-800 bg-white transition-all font-medium ${confirmAccNo && confirmAccNo !== formData.account_number ? 'border-red-200 focus:border-red-500 focus:ring-red-500/10' : 'border-amber-50 focus:border-amber-500 focus:ring-amber-500/10'}`}
                                        />
                                    </div>
                                    {confirmAccNo && confirmAccNo !== formData.account_number && (
                                        <p className="text-[10px] text-red-500 mt-1 font-bold ml-1">Account numbers do not match!</p>
                                    )}
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1.5 ml-1">IFSC Code</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-code text-amber-500/50 text-xs"></i>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.ifsc_code || ""}
                                            onChange={(e) => handleFieldChange('ifsc_code', e.target.value.toUpperCase())}
                                            placeholder="IFSC (e.g. SBIN0001234)"
                                            className="w-full pl-9 pr-3 py-2.5 border-2 border-amber-50 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-sm font-bold uppercase text-gray-800 bg-white transition-all ml-0"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1.5 ml-1">UPI ID (Optional)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-qrcode text-amber-500/50 text-xs"></i>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.upi_id || ""}
                                            onChange={(e) => handleFieldChange('upi_id', e.target.value)}
                                            placeholder="Optional UPI (name@upi)"
                                            className="w-full pl-9 pr-3 py-2.5 border-2 border-amber-50 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-sm text-gray-800 bg-white transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 justify-end pt-5">
                                <Button
                                    onClick={() => setEditingAccountId(null)}
                                    variant="secondary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={saveCurrentEdit}
                                    disabled={!formData.account_number || formData.account_number !== confirmAccNo}
                                    variant="primary"
                                    className="flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{editingAccountId === 'new' ? 'Add Account' : 'Update Account'}</span>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                                </div>
                            ) : accounts.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {accounts.map((acc) => (
                                        <div key={acc.id} className="relative overflow-hidden bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white shadow-inner group transition-all duration-300 hover:bg-white/60">
                                            {acc.is_primary && (
                                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-tighter flex items-center gap-1">
                                                    {/* @ts-ignore */}
                                                    <CheckCircle2 className="w-2.5 h-2.5" /> Primary
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 relative z-10">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-extrabold text-[#800000] uppercase tracking-widest">Account Holder</p>
                                                    <p className="text-sm font-bold text-gray-800">{acc.account_holder_name || 'N/A'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-extrabold text-[#800000] uppercase tracking-widest">Bank Name</p>
                                                    <p className="text-sm font-bold text-gray-800">{acc.bank_name || 'N/A'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-extrabold text-[#800000] uppercase tracking-widest">Account / IFSC</p>
                                                    <p className="text-xs font-mono font-bold text-gray-700">
                                                        •••• {acc.account_number.slice(-4)} | <span className="text-amber-700">{acc.ifsc_code}</span>
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0">
                                                    {!acc.is_primary && (
                                                        <Button
                                                            onClick={() => handleSetPrimary(acc.id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-emerald-600 hover:bg-emerald-50 text-[9px]"
                                                        >
                                                            Set Primary
                                                        </Button>
                                                    )}
                                                    <Button
                                                        onClick={() => handleEditAccount(acc)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="p-1.5 text-blue-500 hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeleteAccount(acc.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="p-1.5 text-red-500 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        onClick={handleAddAccount}
                                        variant="outline"
                                        fullWidth
                                        className="py-4 border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/20 hover:bg-amber-50/40 flex items-center justify-center gap-2 rounded-3xl"
                                    >
                                        <Plus className="w-4 h-4" /> Add Another Bank Account
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-10 relative z-10">
                                    <div className="bg-gradient-to-tr from-amber-100 to-yellow-100 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-12 shadow-lg shadow-amber-200/40">
                                        {/* @ts-ignore */}
                                        <CreditCard className="w-8 h-8 text-amber-600" />
                                    </div>
                                    <h3 className="text-gray-800 font-bold mb-1">No Accounts Added</h3>
                                    <p className="text-gray-400 text-xs font-medium px-4">
                                        Please add at least one bank account for payouts.
                                    </p>
                                    <Button
                                        onClick={handleAddAccount}
                                        variant="primary"
                                        className="mt-6 flex items-center gap-2 mx-auto"
                                    >
                                        <Plus className="w-4 h-4" /> Setup First Bank Account
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


