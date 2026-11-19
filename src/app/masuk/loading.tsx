import Image from "next/image";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Memuat"
      className="flex min-h-dvh items-center justify-center"
    >
      <Image
        src="/logo.png"
        alt=""
        width={96}
        height={96}
        priority
        className="animate-pulse"
      />
    </div>
  );
}
