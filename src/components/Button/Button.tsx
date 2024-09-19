import React from "react";

export default function Button({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}) {
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <button
      className={className}
      onClick={async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
      }}
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        children
      )}
    </button>
  );
}
