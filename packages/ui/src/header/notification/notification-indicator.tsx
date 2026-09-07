const NotificationCountIndicator = ({
  unreadCount,
}: {
  unreadCount: number;
}) => {
  if (unreadCount < 1) return null;

  return (
    <span
      className="absolute inline-flex items-center justify-center rounded-full bg-red-500 text-white"
      style={{
        top: "-6px",
        right: "-10px",
        fontSize: "9px",
        padding: "2px 5px",
        minWidth: "15px",
        height: "15px",
        border: "1px solid #331a1a",
      }}
    >
      {unreadCount}
    </span>
  );
};

export default NotificationCountIndicator;
