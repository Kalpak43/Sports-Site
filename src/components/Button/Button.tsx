import React from "react";

export default function Button({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <button
      className={className}
      onClick={async (e) => {
        setLoading(true);
        await onClick(e);
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
