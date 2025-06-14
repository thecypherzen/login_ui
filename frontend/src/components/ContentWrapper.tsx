/**
 * ContentWrapper: a container to wrap component content
 */
import { cn } from "@/lib/utils";

const ContentWrapper: React.FC<{
  children: React.ReactNode;
  full?: boolean;
  className?: string;
}> = ({ children, full = false, className = "" }) => {
  return (
    <div
      className={cn(
        `m-auto ${full ? "w-full" : "w-96/100 md:w-94/100 xl:w-9/10 2xl:w-86/100"}`,
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ContentWrapper;
