import { Language } from "@repo/store";

interface LoadMoreNotificationProps {
  show: boolean;
  isLoading: boolean;
  lang: Language;
  fetchMoreAction: () => void;
}

const LoadMoreNotification = (props: LoadMoreNotificationProps) => {
  if (!props.show) return null;

  return (
    <div className="p-2 text-center border-t border-gray-50">
      <button
        onClick={(e) => {
          e.stopPropagation();
          props.fetchMoreAction();
        }}
        disabled={props.isLoading}
        className="w-full py-2 text-xs font-bold text-gray-500 hover:text-orange hover:bg-orange-50 rounded-lg transition-all border-0 bg-transparent flex items-center justify-center gap-2"
      >
        {props.isLoading ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin"></i>
            {props.lang === "hi" ? "और लोड हो रहा है..." : "Loading..."}
          </>
        ) : (
          <>
            <i className="fa-solid fa-chevron-down"></i>
            {props.lang === "hi" ? "और देखें" : "Load More"}
          </>
        )}
      </button>
    </div>
  );
};

export default LoadMoreNotification;
