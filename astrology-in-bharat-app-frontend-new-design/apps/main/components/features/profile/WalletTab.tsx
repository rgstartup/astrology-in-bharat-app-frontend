import React from "react";

interface WalletTabProps {
    walletBalance: number;
    walletView: 'recharge' | 'history';
    setWalletView: (view: 'recharge' | 'history') => void;
    rechargeAmount: number;
    setRechargeAmount: (amount: number) => void;
    handleRecharge: () => void;
    isProcessing: boolean;
    rechargeOptions: number[];
    transactions: any[];
    loadingTransactions: boolean;
    walletPurpose: string | undefined;
    setWalletPurpose: (purpose: string | undefined) => void;
}

const WalletTab: React.FC<WalletTabProps> = ({
    walletBalance,
    walletView,
    setWalletView,
    rechargeAmount,
    setRechargeAmount,
    handleRecharge,
    isProcessing,
    rechargeOptions,
    transactions,
    loadingTransactions,
    walletPurpose,
    setWalletPurpose
}) => {
    return (
        <div className="card border-0 shadow-lg rounded-4 mb-4 overflow-hidden relative">
            {/* Wallet Card Header with Gradient */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 relative overflow-hidden">
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <i className="fa-solid fa-wallet text-orange-400 text-xl"></i>
                            </div>
                            <h5 className="font-bold text-white text-xl tracking-wide">My Wallet</h5>
                        </div>
                        <p className="text-gray-400 text-sm">Manage your balance & transactions</p>
                    </div>

                    <div className="flex gap-3 bg-white/10 p-1 rounded-xl backdrop-blur-sm">
                        <button
                            onClick={() => setWalletView('recharge')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${walletView === 'recharge'
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <i className="fa-solid fa-plus-circle"></i>
                            Add Money
                        </button>
                        <button
                            onClick={() => setWalletView('history')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${walletView === 'history'
                                ? 'bg-white text-gray-900 shadow-lg'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <i className="fa-solid fa-list-ul"></i>
                            History
                        </button>
                    </div>
                </div>

                {/* Balance Card floating */}
                <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:bg-white/15 transition-all duration-500">
                    <div className="relative z-10">
                        <p className="text-white/80 text-xs font-bold uppercase mb-2 tracking-wider">
                            <i className="fa-solid fa-circle-info mr-2"></i>
                            Available Balance
                        </p>
                        <div className="flex items-center justify-center mb-1">
                            <span className="text-white text-3xl mr-2">₹</span>
                            <h1 className="font-black text-white text-5xl">
                                {walletBalance?.toLocaleString() || '0'}
                            </h1>
                        </div>
                        <p className="text-white/70 text-sm">
                            Last updated: Just now
                        </p>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute -top-3 right-6 w-14 h-14 rounded-full bg-white/10 z-0"></div>
                    <div className="absolute -bottom-3 left-6 w-10 h-10 rounded-full bg-white/10 z-0"></div>
                </div>
            </div>

            {/* Card Body */}
            <div className="card-body p-6 pt-8">
                {walletView === 'recharge' ? (
                    <div className="mb-8">
                        {/* Section Header */}
                        <div className="mb-6">
                            <div className="flex items-center mb-2">
                                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3">
                                    <i className="fa-solid fa-money-bill-transfer text-orange-500"></i>
                                </div>
                                <h6 className="font-bold text-gray-800 text-lg">Add Money to Wallet</h6>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Select a package or enter custom amount. Minimum recharge: ₹100
                            </p>
                        </div>

                        {/* Custom Amount Input */}
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mb-6">
                            <div className="grid md:grid-cols-2 gap-4 items-center">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <i className="fa-solid fa-pencil text-gray-400 mr-2"></i>
                                        <label className="font-bold text-gray-700">Enter Custom Amount</label>
                                    </div>
                                    <p className="text-gray-500 text-sm">Enter any amount between ₹100 - ₹50,000</p>
                                </div>
                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 font-bold">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={rechargeAmount}
                                            onChange={(e) => setRechargeAmount(parseInt(e.target.value) || 0)}
                                            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl font-bold text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                            placeholder="0"
                                            min="100"
                                            max="50000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Recharge Options */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-lg mr-3">
                                    <i className="fa-solid fa-bolt text-amber-500"></i>
                                </div>
                                <h6 className="font-bold text-gray-800 text-lg">Quick Recharge Options</h6>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {rechargeOptions.map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setRechargeAmount(amt)}
                                        className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] group ${rechargeAmount === amt
                                            ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg'
                                            : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                                            }`}
                                    >
                                        {/* Active indicator */}
                                        {rechargeAmount === amt && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                <i className="fa-solid fa-check text-white text-xs"></i>
                                            </div>
                                        )}

                                        {/* Amount */}
                                        <div className="flex items-center mb-2">
                                            <span className="text-lg font-bold mr-1">₹</span>
                                            <span className={`text-3xl font-black ${rechargeAmount === amt ? 'text-orange-600' : 'text-gray-800'
                                                }`}>
                                                {amt}
                                            </span>
                                        </div>

                                        {/* Bonus for larger amounts */}
                                        {amt >= 1000 && (
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${rechargeAmount === amt
                                                ? 'bg-green-500 text-white'
                                                : 'bg-green-100 text-green-700'
                                                }`}>
                                                +{(amt * 0.05).toFixed(0)} bonus
                                            </span>
                                        )}

                                        {/* Hover effect */}
                                        <div className="absolute inset-0 rounded-2xl bg-orange-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="mb-6">
                            <button
                                type="button"
                                onClick={handleRecharge}
                                disabled={isProcessing || rechargeAmount < 100}
                                className={`w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-between shadow-lg ${isProcessing || rechargeAmount < 100
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-orange-500 hover:to-amber-500 hover:shadow-xl hover:-translate-y-0.5'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                            <span>Processing Recharge...</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mr-4">
                                                <i className="fa-solid fa-bolt text-white text-xl"></i>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-white">Recharge ₹{rechargeAmount.toLocaleString()}</div>
                                                <div className="text-white/80 text-sm font-normal">Click to proceed to payment</div>
                                            </div>
                                        </div>
                                        <i className="fa-solid fa-arrow-right text-xl"></i>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Validation message */}
                        {rechargeAmount > 0 && rechargeAmount < 100 && (
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center">
                                <i className="fa-solid fa-exclamation-triangle text-amber-500 mr-3 text-xl"></i>
                                <div>
                                    <p className="font-bold text-amber-700">Minimum recharge amount is ₹100</p>
                                    <p className="text-amber-600 text-sm mt-1">Please enter ₹100 or more to proceed</p>
                                </div>
                            </div>
                        )}


                    </div>
                ) : (
                    <div className="mt-0 pt-0">
                        <div className="flex items-center justify-between mb-6">
                            <h6 className="font-bold text-gray-800 text-lg flex items-center">
                                <i className="fa-solid fa-clock-rotate-left mr-3 text-orange-500 bg-orange-100 p-2 rounded-lg"></i>
                                Transaction History
                            </h6>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setWalletPurpose(undefined)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${!walletPurpose ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setWalletPurpose('recharge')}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${walletPurpose === 'recharge' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    Recharges
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/80 text-gray-700 text-xs uppercase tracking-wider font-bold border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Description</th>
                                            <th className="px-6 py-4 text-center">Type</th>
                                            <th className="px-6 py-4 text-right">Amount</th>
                                            <th className="px-6 py-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {loadingTransactions ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-3"></div>
                                                        <p>Loading transactions...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : !Array.isArray(transactions) || transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                    <p>No transactions found.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((tx: any, idx: number) => {
                                                // Robust amount handling - handles both objects and numbers
                                                const renderAmount = (amount: any) => {
                                                    if (typeof amount === 'object' && amount !== null) {
                                                        return amount.amount || amount.value || amount.total || 0;
                                                    }
                                                    return amount || 0;
                                                };

                                                return (
                                                    <tr key={tx.id || idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4 text-gray-600">
                                                            {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-800">
                                                            {tx.description || tx.reason || 'Wallet Transaction'}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${tx.type?.toLowerCase() === 'debit' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                                {tx.type || 'credit'}
                                                            </span>
                                                        </td>
                                                        <td className={`px-6 py-4 text-right font-bold ${tx.type?.toLowerCase() === 'debit' ? 'text-red-500' : 'text-green-500'}`}>
                                                            ₹{renderAmount(tx.amount)}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${(tx.status?.toLowerCase() === 'failed' || tx.status?.toLowerCase() === 'cancelled' || tx.status?.toLowerCase() === 'error')
                                                                ? 'bg-red-50 text-red-600'
                                                                : 'bg-green-50 text-green-600'
                                                                }`}>
                                                                {tx.status || 'Success'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletTab;
