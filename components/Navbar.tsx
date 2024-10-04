"use client";

import {cn} from "@/lib/utils";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {useMediaQuery} from "react-responsive";

const Logo = ({isCard}: {isCard: boolean}) => {
  const [logoRef, {width: logoWidth}] = useResizeObserver();
  const [textRef, {width: textWidth}] = useResizeObserver();

  return (
    <Link
      href="/"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
      }}
    >
      <div
        className={cn(
          "flex overflow-hidden transition-[width] duration-&lsqb;450ms&rsqb;[transition-timing-function:cubic-bezier(.6,.6,0,1)]",
          "w-[--header-logo-width-mobile] lg:w-[--header-logo-width-desktop]"
        )}
        style={
          logoWidth && textWidth
            ? ({
                "--header-logo-width-mobile": `${logoWidth + textWidth}px`,
                "--header-logo-width-desktop": isCard
                  ? `${logoWidth}px`
                  : `${logoWidth + textWidth}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div ref={logoRef}>
          <LogoIcon />
        </div>
        <span ref={textRef} className="inline-block pl-[1px] font-semibold">
          Reworkd
        </span>
      </div>
    </Link>
  );
};

const LogoIcon = () => (
  <svg width="24" height="24" fill="none">
    <path
      fill="#272C30"
      d="M6.83 8a2.995 2.995 0 0 0 0-2H17a6 6 0 0 1 0 12h-1.17a2.997 2.997 0 0 0 0-2H17a4 4 0 0 0 0-8H6.83Z"
    />
    <path
      fill="#272C30"
      d="M13 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    />
  </svg>
);

const MenuIcon = ({isOpen}: {isOpen: boolean}) => (
  <span className="grid overflow-hidden">
    {isOpen ? (
      <svg
        className="col-start-1 row-start-1 transition-[transform,opacity] duration-300 ease-in-out translate-y-0 opacity-100"
        width="20"
        height="20"
        fill="none"
      >
        <path
          stroke="#272C30"
          strokeLinecap="round"
          strokeWidth="2"
          d="m6 6 8 8M14 6l-8 8"
        />
      </svg>
    ) : (
      <svg
        className="col-start-1 row-start-1 transition-[transform,opacity] duration-300 ease-in-out translate-y-0 opacity-100"
        width="20"
        height="20"
        fill="none"
      >
        <path
          stroke="#272C30"
          strokeLinecap="round"
          strokeWidth="2"
          d="M5 6h10M5 14h10"
        />
      </svg>
    )}
  </span>
);

const NavItem = ({
  href,
  badge,
  children,
}: {
  href: string;
  badge?: string;
  children: React.ReactNode;
}) => (
  <Link
    className={cn(
      "group flex items-center gap-x-1.5 rounded-lg px-2 py-[5px] text-shark-950",
      "transition-colors ease-in-out hover:bg-shark-950/[0.07] hover:text-shark-800",
      {"pr-1.5": !!badge}
    )}
    href={href}
  >
    <span className="text-sm">{children}</span>
    {!!badge && (
      <span
        className={cn(
          "flex min-w-5 justify-center rounded-md bg-shark-600 px-1.5 pb-[0.5px] pt-[1.5px]",
          "font-geist text-[11px] font-semibold leading-4 tracking-[0.02em] text-white",
          "transition-colors ease-in-out group-hover:bg-azure-500"
        )}
      >
        {badge}
      </span>
    )}
  </Link>
);

const navItems = [
  {label: "About", href: "#about"},
  {label: "Features", href: "#features"},
  {label: "Customers", href: "#customers"},
  {
    label: "Careers",
    href: "https://www.ycombinator.com/companies/reworkd/jobs",
    badge: "1",
  },
];

const DesktopNav = () => (
  <nav
    className={cn(
      "hidden transition-transform duration-500 ease-in-out lg:block"
    )}
  >
    <ul className="flex gap-x-2">
      {navItems.map(({label, href, badge}) => (
        <li key={label}>
          <NavItem href={href} badge={badge}>
            {label}
          </NavItem>
        </li>
      ))}
    </ul>
  </nav>
);

const MobileNav = ({
  isExpanded,
  onMenuClose,
}: {
  isExpanded: boolean;
  onMenuClose: () => void;
}) => {
  const [contentRef, {height}] = useResizeObserver();

  return (
    <div
      className="isolate w-full overflow-hidden transition-[height] duration-&lsqb;450ms&rsqb;[transition-timing-function:cubic-bezier(.6,.6,0,1)]"
      style={{height: isExpanded && height ? height : 0}}
    >
      <div ref={contentRef} className="flex flex-col px-4 pb-5">
        <hr className="border-shark-950/10" />
        <nav className="mt-2.5">
          <ul className="flex flex-col gap-y-1">
            {navItems.map(({label, badge, href}) => (
              <li key={label}>
                <Link
                  className="inline-flex w-full items-center gap-x-2 py-1.5"
                  href={href}
                  onClick={onMenuClose}
                >
                  <span>{label}</span>
                  {!!badge && (
                    <span
                      className={cn(
                        "flex min-w-5 justify-center rounded-md bg-shark-600 px-1.5 pb-[0.5px] pt-[1.5px]",
                        "font-geist text-[11px] font-semibold leading-4 tracking-[0.02em] text-white",
                        "transition-colors ease-in-out group-hover:bg-azure-500"
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-2.5 h-4 bg-[#BEC0C1]" />{" "}
        {/* Placeholder for Dots component */}
        <Link
          href="https://reworkd.typeform.com/to/qscfsOf1"
          className={cn(
            "mt-4 w-full text-center",
            "rounded-md bg-white px-3.5 py-2 text-sm font-medium text-shark-950",
            "transition-[box-shadow,background,color] duration-200 ease-out",
            "shadow-[0px_1px_0px_0px_rgba(255,_255,_255,_0.25)_inset,_0px_1px_3px_0px_rgba(26,_41,_61,_0.15),_0px_7px_11px_-5px_rgba(26,_41,_61,_0.11),_0px_0px_0px_1px_rgba(26,_41,_61,_0.08)]",
            "hover:shadow-[0px_1px_0px_0px_rgba(255,_255,_255,_0.25)_inset,_0px_1px_3px_0px_rgba(26,_41,_61,_0.15),_0px_7px_11px_-5px_rgba(26,_41,_61,_0.31),_0px_0px_0px_1px_rgba(26,_41,_61,_0.08)]",
            "active:bg-shark-950/[0.02] active:text-shark-700 active:shadow-[0px_0px_0px_1px_rgba(26,_41,_61,_0.12)]"
          )}
          onClick={onMenuClose}
        >
          <span>Get started</span>
        </Link>
      </div>
    </div>
  );
};

export default function NavigationMenu() {
  const [isCard, setIsCard] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLargeScreen = useMediaQuery({query: "(min-width: 1024px)"});

  useEffect(() => {
    if (isLargeScreen && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isLargeScreen, isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsCard(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [headerRef, {width: headerWidth}] = useResizeObserver();
  const [navRef, {width: navWidth}] = useResizeObserver();
  const [ctaRef, {width: ctaWidth}] = useResizeObserver();

  const ctaShift = (ctaWidth ?? 0) + 8;
  const desktopWidth = 88 + (navWidth ?? 0) + 40 + ctaShift;
  const logoShiftDesktop = 24 + ((headerWidth ?? 0) - desktopWidth) / 2;
  const ctaShiftDesktop = 8 + ((headerWidth ?? 0) - desktopWidth) / 2;

  return (
    <div
      className={cn(
        "container fixed left-0 right-0 top-0 z-50",
        "transition-[transform] duration-1000 [transition-timing-function:cubic-bezier(.6,.6,0,1)]",
        "translate-y-1.5 lg:translate-y-2",
        {
          "translate-y-4 lg:translate-y-6": isCard,
          "translate-y-3.5": isMenuOpen,
        }
      )}
    >
      <div ref={headerRef}>
        <div
          className={cn(
            "absolute left-1/2 h-full -translate-x-1/2 rounded-l-[26px] rounded-r-xl",
            {
              "bg-white/90 shadow-[0px_1px_1px_0px_rgba(39,_44,_48,_0.10),_0px_1px_1px_0px_rgba(255,_255,_255,_0.45)_inset,_0px_21px_28px_-18px_rgba(70,_81,_88,_0.20),_0px_21px_10px_-25px_rgba(0,_0,_0,_0.30),_0px_14px_40px_0px_rgba(39,_44,_48,_0.05),_0px_0px_0px_1px_rgba(39,_44,_48,_0.04),_0px_4px_9px_0px_rgba(39,_44,_48,_0.07)] backdrop-blur-[2px]":
                isCard || isMenuOpen,
              "h-[calc(100%+6px)] -translate-y-[6px] rounded-lg": isMenuOpen,
            },
            "w-[--base-header-surface-width-mobile] lg:w-[--base-header-surface-width-desktop]",
            "[transition:background_450ms_cubic-bezier(.6,.6,0,1),box-shadow_450ms_cubic-bezier(.6,.6,0,1),width_1000ms_cubic-bezier(.6,.6,0,1),height_1000ms_cubic-bezier(.6,.6,0,1),transform_1000ms_cubic-bezier(.6,.6,0,1),border-radius_1000ms_cubic-bezier(.6,.6,0,1),backdrop-filter_450ms_cubic-bezier(.6,.6,0,1)]",
            "lg:[transition:background_450ms_cubic-bezier(.6,.6,0,1),box-shadow_450ms_cubic-bezier(.6,.6,0,1),width_1000ms_cubic-bezier(.6,.6,0,1),backdrop-filter_450ms_cubic-bezier(.6,.6,0,1)]"
          )}
          style={
            {
              "--base-header-surface-width-mobile": `${headerWidth ?? 0}px`,
              "--base-header-surface-width-desktop": `${
                isCard ? desktopWidth : headerWidth ?? 0
              }px`,
            } as React.CSSProperties
          }
        />
        <header
          className={cn(
            "isolate grid w-full grid-cols-[1fr,auto,1fr] items-center gap-x-8 py-2 lg:py-2",
            "transition-[grid-template-columns] duration-1000 [transition-timing-function:cubic-bezier(.6,.6,0,1)]"
          )}
        >
          <div
            className={cn(
              "transition-transform duration-1000 [transition-timing-function:cubic-bezier(.6,.6,0,1)]",
              {
                "translate-x-[--logo-shift-mobile] lg:translate-x-[--logo-shift-desktop]":
                  isCard,
                "translate-x-[--logo-shift-mobile-card]": isMenuOpen,
              }
            )}
            style={
              {
                "--logo-shift-mobile": "24px",
                "--logo-shift-mobile-card": "16px",
                "--logo-shift-desktop": `${logoShiftDesktop}px`,
              } as React.CSSProperties
            }
          >
            <Logo isCard={isCard} />
          </div>
          <div
            ref={navRef}
            className="transition-transform duration-1000 [transition-timing-function:cubic-bezier(.6,.6,0,1)]"
            style={{
              transform:
                isCard || isMenuOpen
                  ? `translateX(${(48 - ctaShift) / 2}px)`
                  : undefined,
            }}
          >
            <DesktopNav />
          </div>
          <div className="flex justify-end">
            <div
              ref={ctaRef}
              className={cn(
                "transition-transform duration-1000 [transition-timing-function:cubic-bezier(.6,.6,0,1)]",
                "translate-x-[14px] lg:translate-x-0",
                {
                  "translate-x-[--cta-shift-mobile] lg:translate-x-[--cta-shift-desktop]":
                    isCard,
                  "translate-x-[--cta-shift-mobile-card]": isMenuOpen,
                }
              )}
              style={
                {
                  "--cta-shift-mobile": "-8px",
                  "--cta-shift-mobile-card": "-16px",
                  "--cta-shift-desktop": `-${ctaShiftDesktop}px`,
                } as React.CSSProperties
              }
            >
              <div className="hidden lg:block">
                <Link
                  href="https://reworkd.typeform.com/to/qscfsOf1"
                  className={cn(
                    "rounded-md bg-white px-3.5 py-2 text-sm font-medium text-shark-950",
                    "transition-[box-shadow,background,color] duration-200 ease-out",
                    "shadow-[0px_1px_0px_0px_rgba(255,_255,_255,_0.25)_inset,_0px_1px_3px_0px_rgba(26,_41,_61,_0.15),_0px_7px_11px_-5px_rgba(26,_41,_61,_0.11),_0px_0px_0px_1px_rgba(26,_41,_61,_0.08)]",
                    "hover:shadow-[0px_1px_0px_0px_rgba(255,_255,_255,_0.25)_inset,_0px_1px_3px_0px_rgba(26,_41,_61,_0.15),_0px_7px_11px_-5px_rgba(26,_41,_61,_0.31),_0px_0px_0px_1px_rgba(26,_41,_61,_0.08)]",
                    "active:bg-shark-950/[0.02] active:text-shark-700 active:shadow-[0px_0px_0px_1px_rgba(26,_41,_61,_0.12)]"
                  )}
                >
                  <span>Get started</span>
                </Link>
              </div>
              <button
                className={cn(
                  "lg:hidden",
                  "rounded-md px-3.5 py-2",
                  "transition-[box-shadow,background,color] duration-200 ease-out",
                  {
                    "bg-white shadow-[0px_1px_0px_0px_rgba(255,_255,_255,_0.25)_inset,_0px_1px_3px_0px_rgba(26,_41,_61,_0.15),_0px_7px_11px_-5px_rgba(26,_41,_61,_0.11),_0px_0px_0px_1px_rgba(26,_41,_61,_0.08)]":
                      isCard || isMenuOpen,
                  }
                )}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MenuIcon isOpen={isMenuOpen} />
              </button>
            </div>
          </div>
        </header>
        <MobileNav
          isExpanded={isMenuOpen}
          onMenuClose={() => setIsMenuOpen(false)}
        />
      </div>
    </div>
  );
}

function useResizeObserver() {
  const ref = useRef(null);
  const [size, setSize] = useState({width: 0, height: 0});

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const {width, height} = entry.contentRect;
        setSize({width, height});
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}
