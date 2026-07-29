export default function DecorativeBlobs({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 200"
      className={className}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="150" cy="40" r="26" fill="#8B5CF6" />
      <path d="M170 10c20-10 40 5 34 22-6 16-30 16-38 2-6-10-4-18 4-24Z" fill="#22C55E" />
      <rect x="40" y="70" width="40" height="40" rx="10" fill="#F97316" />
      <circle cx="120" cy="110" r="30" fill="#3B82F6" />
      <path d="M0 140c30-20 60 0 60 25 0 20-25 30-50 20-20-8-25-32-10-45Z" fill="#FACC15" />
      <circle cx="70" cy="170" r="22" fill="#16A34A" />
      <path d="M150 150c18-14 45-4 46 16 1 18-22 28-40 18-14-8-18-24-6-34Z" fill="#EC4899" />
      <circle cx="30" cy="30" r="14" fill="#A855F7" />
    </svg>
  );
}
