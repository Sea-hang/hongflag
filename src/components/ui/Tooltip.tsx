import React from 'react';

interface TooltipProps {
  tooltipText?: string;
  buttonText?: string;
  href?: string;
}

const Tooltip = ({ tooltipText = "点击跳转", buttonText = "查看详情", href }: TooltipProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (href) {
      e.preventDefault();
      e.stopPropagation();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div onClick={handleClick}
      className="group relative flex justify-center items-center text-sm font-bold"
      style={{ color: "var(--color-ink-2)" }}
    >
      <div className="absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-[150%] -translate-y-[300%] duration-500 group-hover:delay-500 skew-y-[20deg] group-hover:skew-y-0 shadow-md pointer-events-none">
        <div className="flex items-center gap-1 p-2 rounded-md whitespace-nowrap"
          style={{ background: "var(--color-accent)", color: "white" }}
        >
          <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx={12} cy={12} r={9} strokeLinejoin="round" />
            <path d="M12 3C12 3 8.5 6 8.5 12C8.5 18 12 21 12 21" strokeLinejoin="round" />
            <path d="M12 3C12 3 15.5 6 15.5 12C15.5 18 12 21 12 21" strokeLinejoin="round" />
            <path d="M3 12H21" strokeLinejoin="round" />
            <path d="M19.5 7.5H4.5" strokeLinejoin="round" />
            <path d="M19.5 16.5H4.5" strokeLinejoin="round" />
          </svg>
          <span>{tooltipText}</span>
        </div>
        <div className="absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1"
          style={{ background: "var(--color-accent)" }}
        />
      </div>
      <div className="shadow-md flex items-center group-hover:gap-2 p-2.5 rounded-full cursor-pointer duration-300 transition-all"
        style={{ background: "var(--color-accent)" }}
      >
        <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.4306 7.70172C7.55045 7.99826 3.43929 15.232 2.17021 19.3956C2.07701 19.7014 2.31139 20 2.63107 20C2.82491 20 3.0008 19.8828 3.08334 19.7074C6.04179 13.4211 12.7066 12.3152 15.514 12.5639C15.7583 12.5856 15.9333 12.7956 15.9333 13.0409V15.1247C15.9333 15.5667 16.4648 15.7913 16.7818 15.4833L20.6976 11.6784C20.8723 11.5087 20.8993 11.2378 20.7615 11.037L16.8456 5.32965C16.5677 4.92457 15.9333 5.12126 15.9333 5.61253V7.19231C15.9333 7.46845 15.7065 7.69133 15.4306 7.70172Z" />
        </svg>
        <span className="text-[0px] group-hover:text-xs duration-300 whitespace-nowrap">{buttonText}</span>
      </div>
    </div>
  );
};

export default Tooltip;
