import React from "react";
import { Landmark, BadgeCheck, Save, X, ChevronUp, ChevronDown, Pencil, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "react-toastify";

interface BankAccount {
    id: string;
    bank_name: string;
    account_number: string;
    account_holder: string;
    ifsc_code: string;
    is_primary: boolean;
    upi_id?: string;
}

interface BankDetailsCardProps {
    profile: any;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    onSave: (accounts: BankAccount[]) => void;
    saving: boolean;
}

export const BankDetailsCard: React.FC<BankDetailsCardProps> = ({
    profile,
    isEditing,
    setIsEditing,
    onSave,
    saving
}) => {
    const [accounts, setAccounts] = React.useState<BankAccount[]>([]);
    const [confirmAcc, setConfirmAcc] = React.useState("");
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    
    const [formData, setFormData] = React.useState({
        bank_name: "",
        account_number: "",
        account_holder: "",
        ifsc_code: "",
        upi_id: ""
    });

    React.useEffect(() => {
        if (profile?.bank_accounts && Array.isArray(profile.bank_accounts) && profile.bank_accounts.length > 0) {
            setAccounts(profile.bank_accounts);
        } else if (profile?.bankName) {
            setAccounts([{
                id: '1',
                bank_name: profile.bankName,
                account_number: profile.accountNumber,
                account_holder: profile.accountHolder,
                ifsc_code: profile.ifsc,
                is_primary: true
            }]);
        }
    }, [profile]);

    const handleEdit = (acc: BankAccount) => {
        setFormData({
            bank_name: acc.bank_name,
            account_number: acc.account_number,
            account_holder: acc.account_holder,
            ifsc_code: acc.ifsc_code,
            upi_id: acc.upi_id || ""
        });
        setConfirmAcc(acc.account_number);
        setEditingId(acc.id);
        setIsEditing(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.account_number !== confirmAcc) {
            toast.error("Account numbers do not match!");
            return;
        }

        let updatedAccounts = [...accounts];
        if (editingId) {
            updatedAccounts = accounts.map(a => a.id === editingId ? { ...a, ...formData } : a);
        } else {
            const newAcc: BankAccount = {
                id: Date.now().toString(),
                ...formData,
                is_primary: accounts.length === 0
            };
            updatedAccounts = [...accounts, newAcc];
        }

        onSave(updatedAccounts);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this bank account?")) {
            const newList = accounts.filter(a => a.id !== id);
            onSave(newList);
        }
    };

    const handleSetPrimary = (id: string) => {
        const newList = accounts.map(a => ({...a, is_primary: a.id === id}));
        onSave(newList);
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-xl">
            <div 
                className="p-7 bg-[#fd6410] flex items-center justify-between text-white relative overflow-hidden cursor-pointer"
                onClick={() => !isEditing && setIsCollapsed(!isCollapsed)}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                        <Landmark className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">Payout & Bank Info</h3>
                        <p className="text-sm font-medium text-white/90 mt-1">Manage withdrawal destinations</p>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                        {isCollapsed ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronUp className="w-5 h-5 text-white" />}
                    </div>
                </div>
            </div>

            {!isCollapsed && (
                <div className="p-8 space-y-6">
                    {isEditing ? (
                        <div className="space-y-8 animate-in zoom-in-95 duration-300">
                            <h4 className="text-base font-bold text-gray-900">
                                {editingId ? "Update Bank Account" : "Add New Bank Account"}
                            </h4>
                            
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Account Holder" value={formData.account_holder} onChange={(val: string) => setFormData({...formData, account_holder: val})} placeholder="Name as per Bank" />
                                    <InputGroup label="Bank Name" value={formData.bank_name} onChange={(val: string) => setFormData({...formData, bank_name: val})} placeholder="e.g. HDFC Bank" />
                                    <InputGroup label="Account Number" value={formData.account_number} onChange={(val: string) => setFormData({...formData, account_number: val})} placeholder="Account Number" />
                                    <InputGroup label="Confirm Account Number" value={confirmAcc} onChange={setConfirmAcc} placeholder="Confirm Account Number" />
                                    <InputGroup label="IFSC Code" value={formData.ifsc_code} onChange={(val: string) => setFormData({...formData, ifsc_code: val.toUpperCase()})} placeholder="IFSC Code"  />
                                    <InputGroup label="UPI ID (Optional)" value={formData.upi_id} onChange={(val: string) => setFormData({...formData, upi_id: val})} placeholder="e.g. user@okaxis" />
                                </div>
                                
                                <div className="flex items-center justify-end gap-4 pt-6">
                                    <button type="button" onClick={() => {setIsEditing(false); setEditingId(null);}} className="px-6 py-3 bg-gray-50 text-gray-400 rounded-xl font-bold text-[10px] hover:text-gray-600 transition-all">Cancel</button>
                                    <button type="submit" disabled={saving} className="bg-[#fd6410] text-white px-8 py-3 rounded-xl font-bold text-[10px] shadow-lg shadow-orange-100 transition-all active:scale-95">
                                        {saving ? "Saving..." : editingId ? "Update Account" : "Add Account"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            {accounts.map((acc) => (
                                <div key={acc.id} className="relative group p-6 rounded-[2rem] border-2 border-orange-50 bg-gray-50/30 hover:bg-white hover:border-orange-200 transition-all duration-500">
                                    {acc.is_primary && (
                                        <div className="absolute top-6 right-6 px-4 py-1.5 bg-green-500 text-white text-base font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-green-100">
                                            <BadgeCheck className="w-5 h-5" /> Primary
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-600 mb-1">Account Holder</p>
                                                <h5 className="text-lg font-bold text-gray-900">{acc.account_holder}</h5>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-600 mb-1">Account / IFSC</p>
                                                <div className="flex items-center gap-3 font-bold text-gray-600">
                                                    <span>•••• {acc.account_number.slice(-4)}</span>
                                                    <span className="w-1 h-4 bg-gray-200 rounded-full" />
                                                    <span className="text-[#fd6410]">{acc.ifsc_code}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-600 mb-1">Bank Name</p>
                                                <h5 className="text-lg font-bold text-gray-900">{acc.bank_name}</h5>
                                            </div>
                                            
                                            <div className="flex items-center justify-end gap-4 pt-2">
                                                {!acc.is_primary && (
                                                    <button 
                                                        onClick={() => handleSetPrimary(acc.id)}
                                                        className="text-sm font-bold text-green-600 hover:underline"
                                                    >
                                                        Set Primary
                                                    </button>
                                                )}
                                                <button onClick={() => handleEdit(acc)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(acc.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button 
                                onClick={() => {
                                    setFormData({bank_name: "", account_number: "", account_holder: "", ifsc_code: "", upi_id: ""});
                                    setConfirmAcc("");
                                    setEditingId(null);
                                    setIsEditing(true);
                                }}
                                className="w-full py-8 border-2 border-[#fd6410]/30 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-[#fd6410] hover:bg-orange-50/50 hover:border-[#fd6410] transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-bold">Add Another Bank Account</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const InputGroup = ({ label, value, onChange, placeholder, uppercase }: any) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-bold text-gray-700 ml-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-5 py-3.5 bg-gray-50 border border-gray-100 focus:border-orange-300 rounded-2xl text-sm font-bold text-gray-800 transition-all outline-none ${uppercase ? 'uppercase tracking-wider' : ''}`}
            required={label !== "UPI ID (Optional)"}
        />
    </div>
);
