import React, { useEffect, useState } from "react";
import { CreditCard, Edit3, Save, ChevronDown, ChevronUp, Trash2, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { Profile } from "@/types/profile";
import {
    getBankAccounts,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setPrimaryBankAccount
} from "@/lib/profile";
import { getErrorMessage } from "@repo/lib";
import Button from "../ui/Button";
import { Loading } from "@repo/ui";

interface BankAccount {
    id: string;
    account_holder_name: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    upi_id?: string;
    is_primary: boolean;
}

export default function PayoutInfo({ isActive }: { isActive?: boolean }) {
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
        setLoading(true);
        const [data, error] = await getBankAccounts();
        if (!error && data) {
            setAccounts(data);
        } else if (error) {
            console.error("Failed to fetch bank accounts:", error);
            toast.error("Could not load bank accounts");
        }
        setLoading(false);
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
            const [res, error] = await deleteBankAccount(id);
            if (!error) {
                toast.success((res as any)?.message || "Account removed successfully");
                fetchAccounts();
            } else {
                toast.error(getErrorMessage(error) || "Failed to delete account");
            }
        }
    };

    const handleSetPrimary = async (id: string) => {
        const [res, error] = await setPrimaryBankAccount(id);
        if (!error) {
            toast.success((res as any)?.message || "Primary account updated");
            fetchAccounts();
        } else {
            toast.error(getErrorMessage(error) || "Failed to set primary account");
        }
    };

    const saveCurrentEdit = async () => {
        if (formData.account_number !== confirmAccNo) {
            toast.error("Account numbers do not match!");
            return;
        }

        let result: [any | null, any | null];
        if (editingAccountId === 'new') {
            result = await addBankAccount(formData);
        } else if (editingAccountId) {
            result = await updateBankAccount(editingAccountId, formData);
        } else {
            return;
        }

        const [res, error] = result;
        if (!error) {
            toast.success((res as any)?.message || (editingAccountId === 'new' ? "New bank account added" : "Bank account updated"));
            setEditingAccountId(null);
            fetchAccounts();
        } else {
            toast.error(getErrorMessage(error) || "Failed to save bank details");
        }
    };

    const handleFieldChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className={`overflow-hidden rounded-2xl shadow-xl transition-all duration-300 border-2 border-orange-400 bg-white`}>
            <div
                className={`p-4 flex justify-between items-center cursor-pointer transition-all duration-300 select-none ${
                    isActive 
                        ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white' 
                        : 'hover:bg-gray-50/50 text-gray-800'
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="flex items-center text-base sm:text-lg font-bold">
                    <CreditCard className={`w-5 h-5 mr-2.5 ${isActive ? 'text-white' : 'text-orange-600'}`} />
                    Payout & Bank Info
                </h2>
                <div className="flex items-center space-x-3">
                    {isExpanded ? (
                        <ChevronUp className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    ) : (
                        <ChevronDown className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 sm:p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    {editingAccountId ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-bold text-gray-900">
                                    {editingAccountId === 'new' ? 'Add New Bank Account' : 'Edit Bank Account'}
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2 group">
                                    <label className="block text-xs font-medium text-gray-900 mb-1">Account Holder Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name={`holder_${Math.random().toString(36).substring(7)}`}
                                            autoComplete="off"
                                            value={formData.account_holder_name || ""}
                                            onChange={(e) => handleFieldChange('account_holder_name', e.target.value)}
                                            placeholder="Full Name as per Bank Records"
                                            className="w-full pl-4 pr-3 py-2.5 border-2 border-orange-50 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-sm placeholder:text-gray-500 text-gray-800 bg-white transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2 group">
                                    <label className="block text-xs font-medium text-gray-900 mb-1">Bank Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name={`bank_${Math.random().toString(36).substring(7)}`}
                                            autoComplete="off"
                                            value={formData.bank_name || ""}
                                            onChange={(e) => handleFieldChange('bank_name', e.target.value)}
                                            placeholder="e.g. State Bank of India, HDFC, etc."
                                            className="w-full pl-4 pr-3 py-2.5 border-2 border-orange-50 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-sm placeholder:text-gray-500 text-gray-800 bg-white transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-medium text-gray-900 mb-1">Account Number</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name={`acc_no_${Math.random().toString(36).substring(7)}`}
                                            autoComplete="new-password"
                                            value={formData.account_number || ""}
                                            onChange={(e) => handleFieldChange('account_number', e.target.value)}
                                            placeholder="Enter Bank Account Number"
                                            className="w-full pl-4 pr-3 py-2.5 border-2 border-orange-50 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-sm placeholder:text-gray-500 text-gray-800 bg-white transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-medium text-gray-900 mb-1">Confirm Account Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name={`confirm_acc_no_${Math.random().toString(36).substring(7)}`}
                                            autoComplete="off"
                                            value={confirmAccNo}
                                            onChange={(e) => setConfirmAccNo(e.target.value)}
                                            placeholder="Re-enter Account Number"
                                            className={`w-full pl-4 pr-3 py-2.5 border-2 rounded-xl focus:ring-4 outline-none text-sm placeholder:text-gray-500 text-gray-800 bg-white transition-all font-medium ${confirmAccNo && confirmAccNo !== formData.account_number ? 'border-red-200 focus:border-red-500 focus:ring-red-500/10' : 'border-orange-50 focus:border-orange-500 focus:ring-orange-500/10'}`}
                                        />
                                    </div>
                                    {confirmAccNo && confirmAccNo !== formData.account_number && (
                                        <p className="text-[10px] text-red-500 mt-1 font-bold ml-1">Account numbers do not match!</p>
                                    )}
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-medium text-gray-900 mb-1">IFSC Code</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name={`ifsc_${Math.random().toString(36).substring(7)}`}
                                            autoComplete="off"
                                            value={formData.ifsc_code || ""}
                                            onChange={(e) => handleFieldChange('ifsc_code', e.target.value.toUpperCase())}
                                            placeholder="IFSC (e.g. SBIN0001234)"
                                            className="w-full pl-4 pr-3 py-2.5 border-2 border-orange-50 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-sm placeholder:text-gray-500 font-bold uppercase text-gray-800 bg-white transition-all ml-0"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-medium text-gray-900 mb-1">UPI ID (Optional)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.upi_id || ""}
                                            onChange={(e) => handleFieldChange('upi_id', e.target.value)}
                                            placeholder="Optional UPI (name@upi)"
                                            className="w-full pl-4 pr-3 py-2.5 border-2 border-orange-50 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-sm placeholder:text-gray-500 text-gray-800 bg-white transition-all font-medium"
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
                                    disabled={
                                        !formData.account_holder_name || 
                                        !formData.bank_name || 
                                        !formData.account_number || 
                                        !formData.ifsc_code || 
                                        formData.account_number !== confirmAccNo
                                    }
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
                                    <Loading size="md" />
                                </div>
                            ) : accounts.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {accounts.map((acc) => (
                                        <div key={acc.id} className="relative overflow-hidden bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white shadow-inner group transition-all duration-300 hover:bg-white/60">
                                            {acc.is_primary && (
                                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[12px] font-medium tracking-wide pl-3 pr-6 py-1.5 rounded-bl-xl flex items-center gap-1">
                                                    {/* @ts-ignore */}
                                                    <CheckCircle2 className="w-3 h-3" /> Primary
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 relative z-10">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-gray-900">Account Holder</p>
                                                    <p className="text-sm font-bold text-gray-800">{acc.account_holder_name || 'N/A'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-gray-900">Bank Name</p>
                                                    <p className="text-sm font-bold text-gray-800">{acc.bank_name || 'N/A'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-gray-900">Account / IFSC</p>
                                                    <p className="text-xs font-mono font-bold text-gray-900">
                                                        •••• {acc.account_number.slice(-4)} | <span className="text-gray-800">{acc.ifsc_code}</span>
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 col-span-1 sm:col-span-1">
                                                    {!acc.is_primary && (
                                                        <Button
                                                            onClick={() => handleSetPrimary(acc.id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-emerald-600 hover:bg-emerald-50 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
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
                                        className="py-4 border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/20 hover:bg-orange-50/40 flex items-center justify-center gap-2 rounded-3xl"
                                    >
                                        <Plus className="w-4 h-4" /> Add Another Bank Account
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-10 relative z-10">
                                    <div className="bg-gradient-to-tr from-orange-100 to-yellow-100 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-12 shadow-lg shadow-orange-200/40">
                                        {/* @ts-ignore */}
                                        <CreditCard className="w-8 h-8 text-orange-600" />
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


