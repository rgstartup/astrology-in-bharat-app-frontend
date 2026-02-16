import React from "react";

interface NotificationsTabProps {
    loadingNotifications: boolean;
    notifications: any[];
    onMarkAsRead: (id: string | number) => void;
    onClearAll: () => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
    loadingNotifications,
    notifications,
    onMarkAsRead,
    onClearAll
}) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "rgba(242, 94, 10, 0.05)", color: "var(--primary)" }}>
                        <i className="fa-solid fa-bell"></i>
                    </span>
                    Notifications
                </h5>
                {notifications.length > 0 && (
                    <button
                        onClick={onClearAll}
                        className="btn btn-sm text-danger fw-bold hover:bg-red-50"
                    >
                        <i className="fa-solid fa-trash-can me-2"></i>
                        Clear All
                    </button>
                )}
            </div>
            <div className="card-body p-4">
                {loadingNotifications ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" role="status"></div>
                        <p className="text-muted">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <i className="fa-solid fa-bell-slash fa-3x text-light"></i>
                        </div>
                        <h6 className="fw-bold">No Notifications Yet</h6>
                        <p className="text-muted small">You'll see alerts about your orders and consultations here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif: any) => (
                            <div
                                key={notif.id}
                                className={`p-3 rounded-xl border transition-all hover:shadow-md cursor-pointer ${notif.isRead ? 'bg-white opacity-80' : 'bg-primary/5 border-primary/10 shadow-sm'}`}
                                onClick={() => !notif.isRead && onMarkAsRead(notif.id)}
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex gap-3">
                                        <div className={`mt-1 p-2 rounded-lg ${notif.isRead ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white'}`}>
                                            <i className={`fa-solid ${notif.isRead ? 'fa-envelope-open' : 'fa-envelope'}`}></i>
                                        </div>
                                        <div>
                                            <h6 className={`mb-1 ${notif.isRead ? 'text-gray-600' : 'text-gray-900 fw-bold'}`}>{notif.title}</h6>
                                            <p className="text-muted small mb-1" style={{ lineHeight: '1.4' }}>{notif.message}</p>
                                            <span className="text-[10px] text-primary font-medium uppercase tracking-wider">
                                                {new Date(notif.createdAt).toLocaleString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: 'numeric',
                                                    minute: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    {!notif.isRead && (
                                        <span className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50 animate-pulse"></span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsTab;
