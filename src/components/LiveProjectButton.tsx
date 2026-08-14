type LiveProjectButtonProps = {
  className?: string;
};

export default function LiveProjectButton({
  className = '',
}: LiveProjectButtonProps) {
  return (
    <button
      className={`rounded-full border border-[#D7E2EA] sm:border-2 font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10 ${className ? className : 'px-6 py-2.5 text-xs sm:px-8 sm:py-3 sm:text-sm'}`}
    >
      View Project
    </button>
  );
}
