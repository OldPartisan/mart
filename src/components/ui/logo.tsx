import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
  inverted = false,
}: {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex shrink-0 items-center", className)}
      aria-label="Ирбис Март — на главную"
    >
      <Image
        src="/images/figma/logo.png"
        alt="Ирбис Март"
        width={179}
        height={42}
        priority
        className={cn(
          "w-auto object-contain transition-opacity group-hover:opacity-90",
          compact ? "h-7" : "h-[38px] sm:h-[42px]",
          inverted && "rounded bg-white p-1",
        )}
      />
    </Link>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/figma/logo.png"
      alt=""
      width={179}
      height={42}
      className={cn("h-8 w-auto", className)}
      aria-hidden="true"
    />
  );
}
