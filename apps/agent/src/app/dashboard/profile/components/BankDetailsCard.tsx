import React from "react";
import { Button } from "@repo/ui";
import { Landmark, PiggyBank, UserCircle2, Hash, BadgeCheck, Save, X, ChevronUp, ChevronDown, Pencil, Trash2, Plus } from "lucide-react";

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
    agent: any;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    formData: any;
    setFormData: (data: any) => void;
    onSave: (e: React.FormEvent) => void;
    saving: boolean;
}

export const BankDetailsCard: React.FC<BankDetailsCardProps> = ({
    agent,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    onSave,
    saving
}) => {
    // Load accounts from DB (fallback to old single fields if array is empty)
    const [accounts, setAccounts] = React.useState<BankAccount[]>([]);

    React.useEffect(() => {
        if (agent?.bank_accounts && Array.isArray(agent.bank_accounts) && agent.bank_accounts.length > 0) {
            setAccounts(agent.bank_accounts);
        } else if (agent?.bank_name) {
            // Migrating old single field data to the new array format locally for first time
            setAccounts([{
                id: '1',
                bank_name: agent.bank_name,
                account_number: agent.account_number,
                account_holder: agent.account_holder,
                ifsc_code: agent.ifsc_code,
                is_primary: true
            }]);
        }
    }, [agent]);
    
    const [confirmAcc, setConfirmAcc] = React.useState("");
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);

    const handleEdit = (acc: BankAccount) => {
        setFormData({
            bank_name: acc.bank_name,
            account_number: acc.account_number,
            account_holder: acc.account_holder,
            ifsc_code: acc.ifsc_code,
            upi_id: acc.upi_id || "",
            bank_accounts: accounts
        });
        setConfirmAcc(acc.account_number);
        setEditingId(acc.id);
        setIsEditing(true);
    };

    const updateDB = async (updatedAccounts: BankAccount[]) => {
        // We call the onSave with the new accounts list
        // We'll wrap it in a mock event or just call updateAgentProfile directly if we had access
        // But since onSave is passed from parent, we'll use it to send the data
        setFormData({ ...formData, bank_accounts: updatedAccounts });
        // Since ProfilePage uses formData, we need a way to trigger save
        // For now, we'll assume the user clicks "Save" in the form, 
        // or we can auto-save on primary/delete
    };

    React.useEffect(() => {
        if (isEditing) setIsCollapsed(false);
    }, [isEditing]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.account_number !== confirmAcc) {
            alert("Account numbers do not match!");
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

        // Send to parent / backend
        // We override the event data to include our full list
        const customEvent = {
            preventDefault: () => {},
            target: { 
                ...formData,
                bank_accounts: updatedAccounts 
            }
        };
        
        await onSave(customEvent as any);
        setAccounts(updatedAccounts);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this bank account?")) {
            const newList = accounts.filter(a => a.id !== id);
            setAccounts(newList);
            // Auto-save delete to DB
            onSave({ preventDefault: () => {}, target: { bank_accounts: newList } } as any);
        }
    };

    const handleSetPrimary = (id: string) => {
        const newList = accounts.map(a => ({...a, is_primary: a.id === id}));
        setAccounts(newList);
        // Auto-save primary status to DB
        onSave({ preventDefault: () => {}, target: { bank_accounts: newList } } as any);
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-700 hover:shadow-2xl">
            <div 
                className="p-7 bg-[#F25E0A] flex items-center justify-between text-white relative overflow-hidden cursor-pointer active:bg-[#D94E00] transition-colors"
                onClick={() => !isEditing && setIsCollapsed(!isCollapsed)}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                        <Landmark className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight uppercase">Payout & Bank Info</h3>
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
                            <h4 className="text-[15px] font-black text-[#800000] uppercase tracking-wider">
                                {editingId ? "Update Bank Account" : "Add New Bank Account"}
                            </h4>
                            
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <div className="space-y-6">
                                    <InputGroup label="Account Holder Name" value={formData.account_holder} onChange={(val: string) => setFormData({...formData, account_holder: val})} placeholder="Full Name as per Bank Records" />
                                    <InputGroup label="Bank Name" value={formData.bank_name} onChange={(val: string) => setFormData({...formData, bank_name: val})} placeholder="e.g. State Bank of India, HDFC, etc." />
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Account Number" value={formData.account_number} onChange={(val: string) => setFormData({...formData, account_number: val})} placeholder="Enter Bank Account Number" />
                                        <InputGroup label="Confirm Account Number" value={confirmAcc} onChange={setConfirmAcc} placeholder="Re-enter Account Number" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="IFSC Code" value={formData.ifsc_code} onChange={(val: string) => setFormData({...formData, ifsc_code: val.toUpperCase()})} placeholder="IFSC (E.G. SBIN0001234)" uppercase />
                                        <InputGroup label="UPI ID (Optional)" value={formData.upi_id || ""} onChange={(val: string) => setFormData({...formData, upi_id: val})} placeholder="Optional UPI (name@okaxis)" />
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-end gap-4 pt-6">
                                    <button type="button" onClick={() => {setIsEditing(false); setEditingId(null);}} className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black uppercase text-[12px] tracking-widest hover:bg-gray-200 transition-all">Cancel</button>
                                    <Button type="submit" disabled={saving} className="bg-[#F25E0A] text-white px-10 py-4 h-auto rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-xl shadow-orange-100 transition-all active:scale-95 border-none">
                                        {saving ? "Processing..." : <span className="flex items-center gap-3"><Save className="w-5 h-5" /> {editingId ? "Update Account" : "Add Account"}</span>}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            {accounts.map((acc) => (
                                <div key={acc.id} className="relative group p-8 rounded-[2rem] border-2 border-orange-50/50 bg-gray-50/30 hover:bg-white hover:border-[#F25E0A]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-100/50">
                                    {acc.is_primary && (
                                        <div className="absolute top-6 right-6 px-3 py-1 bg-[#00C292] text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-lg shadow-green-100">
                                            <BadgeCheck className="w-3 h-3" /> PRIMARY
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1">Account Holder</p>
                                                <h5 className="text-lg font-black text-gray-900">{acc.account_holder}</h5>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1">Account / IFSC</p>
                                                <div className="flex items-center gap-3 font-bold text-gray-1000">
                                                    <span>•••• {acc.account_number.slice(-4)}</span>
                                                    <span className="w-1 h-4 bg-gray-300 rounded-full" />
                                                    <span className="text-[#F25E0A]">{acc.ifsc_code}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1">Bank Name</p>
                                                <h5 className="text-lg font-black text-gray-900">{acc.bank_name}</h5>
                                            </div>
                                            
                                            <div className="flex items-center justify-end gap-6 pt-2">
                                                {!acc.is_primary && (
                                                    <button 
                                                        onClick={() => handleSetPrimary(acc.id)}
                                                        className="text-[11px] font-black text-[#00C292] uppercase tracking-widest hover:underline underline-offset-4"
                                                    >
                                                        Set Primary
                                                    </button>
                                                )}
                                                <button onClick={() => handleEdit(acc)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm shadow-blue-100">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(acc.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm shadow-red-100">
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
                                className="w-full py-8 border-2 border-dashed border-orange-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-[#F25E0A] hover:bg-orange-50/50 hover:border-[#F25E0A]/40 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="text-[13px] font-black uppercase tracking-[0.2em]">Add Another Bank Account</span>
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
        <label className="block text-[10px] font-bold text-[#800000] uppercase tracking-widest ml-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-6 py-4 bg-white border border-orange-100/50 focus:border-[#F25E0A]/30 focus:bg-white rounded-2xl text-[14px] font-bold text-gray-800 transition-all outline-none shadow-sm placeholder:text-gray-300 ${uppercase ? 'uppercase' : ''}`}
            required={label !== "UPI ID (Optional)"}
        />
    </div>
);

const DisplayGroup = ({ label, value, icon: Icon }: any) => (
    <div className="group p-6 rounded-2xl bg-gray-50/50 border-2 border-transparent hover:border-orange-100 hover:bg-white transition-all duration-500">
        <div className="flex items-center gap-3 text-[9px] font-black text-gray-1000 uppercase tracking-[0.3em] mb-3">
            <Icon className="w-3.5 h-3.5 text-[#F25E0A]/40 group-hover:text-[#F25E0A] transition-colors" />
            {label}
        </div>
        <div className="text-[16px] font-black text-gray-900 tracking-tight">
            {value || <span className="text-gray-200 italic font-bold">Pending Setup</span>}
        </div>
    </div>
);
