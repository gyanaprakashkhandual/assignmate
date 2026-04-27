export default function BrandIcon({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.5 2.5C18.3284 1.67157 19.6716 1.67157 20.5 2.5C21.3284 3.32843 21.3284 4.67157 20.5 5.5L19.5 6.5L16.5 3.5L17.5 2.5Z"
        fill="currentColor"
      />
      <path d="M15 5L3 17V21H7L19 9L15 5Z" fill="currentColor" />
    </svg>
  );
}
