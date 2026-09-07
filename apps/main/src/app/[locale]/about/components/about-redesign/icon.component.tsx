interface IIconBubble {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

const IconBubble: React.FC<IIconBubble> = ({ icon: Icon, className = "" }) => (
  <div
    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fff5ed] text-[#ff5c00] ring-1 ring-[#ffd5bd] ${className}`}
  >
    <Icon className="h-7 w-7" />
  </div>
);

export default IconBubble;
