interface Column<T> {
  header: string;
  key: keyof T | string; 
  render?: (item: T) => React.ReactNode;
}

export function TableRow<T extends { id: number | string }>({
  item,
  columns,
  onViewDetails,
  renderCell, 
}: {
  item: T;
  columns: Column<T>[];
  onViewDetails?: (item: T) => void;
  renderCell?: (item: T, key: string) => React.ReactNode; 
}) {
  const handleViewDetails = () => {
    onViewDetails?.(item);
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {columns.map((column, i) => (
        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        
          {renderCell 
            ? renderCell(item, column.key as string) 
            : column.render 
              ? column.render(item) 
              : String(item[column.key as keyof T] || "-")
          }
        </td>
      ))}
      {onViewDetails && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button 
            onClick={handleViewDetails}
            className="text-indigo-600 hover:text-indigo-900"
          >
            View Details
          </button>
        </td>
      )}
    </tr>
  );
}



