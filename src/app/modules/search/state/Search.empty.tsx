interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <div className="text-gray-400 dark:text-gray-500">{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
        {message}
      </p>
    </div>
  );
}
