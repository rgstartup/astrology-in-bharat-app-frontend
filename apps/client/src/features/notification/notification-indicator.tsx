const NotificationCountIndicator = ({
  unreadCount,
}: {
  unreadCount: number;
}) => {
  if (unreadCount < 1) return null;

  return (
    <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#FF5500] text-white text-[9px] font-bold flex items-center justify-center border border-[#301118] shadow-xs animate-in zoom-in-50">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
};

export default NotificationCountIndicator;
