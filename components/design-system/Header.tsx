'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import Image from 'next/image';

export interface HeaderNavItem {
  /**
   * 메뉴 텍스트
   */
  label: string;

  /**
   * 링크 URL
   */
  href?: string;

  /**
   * 활성화 상태
   */
  active?: boolean;

  /**
   * 클릭 핸들러 (href 대신 사용 가능)
   */
  onClick?: () => void;
}

export interface HeaderProps {
  /**
   * 로고 이미지 경로
   * @default "/logo.png"
   */
  logoSrc?: string;

  /**
   * 로고 클릭 시 이동할 경로
   * @default "/"
   */
  logoHref?: string;

  /**
   * 네비게이션 메뉴 아이템들
   */
  navItems?: HeaderNavItem[];

  /**
   * 로고 너비
   * @default 142
   */
  logoWidth?: number;

  /**
   * 로고 높이
   * @default 40
   */
  logoHeight?: number;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logoSrc = '/logo.png',
  logoHref = '/',
  navItems = [
    { label: 'text 1', href: '#', active: false },
    { label: 'text 2', href: '#', active: false },
    { label: 'text 3', href: '#', active: false },
  ],
  logoWidth = 142,
  logoHeight = 40,
  className,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          'bg-white',
          'w-full',
          'box-border',
          'flex items-center justify-between',
          'py-3 px-4 md:py-4 md:px-8 lg:px-[120px] xl:px-[200px]',
          'sticky top-0 z-50',
          'border-b border-[#EEEEEE]',
          className
        )}
      >
        {/* 로고 */}
        <Link href={logoHref} className="shrink-0 relative">
          <Image
            src={logoSrc}
            alt="pintoss logo"
            width={logoWidth}
            height={logoHeight}
            className="block w-[100px] h-[28px] md:w-[142px] md:h-[40px]"
            priority
          />
        </Link>

        {/* 데스크톱 네비게이션 메뉴 */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-16 shrink-0">
          {navItems.map((item, index) =>
            item.onClick ? (
              <button
                key={index}
                onClick={item.onClick}
                className={cn(
                  'text-[14px] lg:text-[16px] font-medium leading-[1.3] tracking-[-0.4px]',
                  'text-center',
                  'transition-colors duration-200',
                  item.active ? 'text-[#0565FF]' : 'text-[#616161]',
                  'hover:text-[#0565FF]'
                )}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={index}
                href={item.href || '#'}
                className={cn(
                  'text-[14px] lg:text-[16px] font-medium leading-[1.3] tracking-[-0.4px]',
                  'text-center',
                  'transition-colors duration-200',
                  item.active ? 'text-[#0565FF]' : 'text-[#616161]',
                  'hover:text-[#0565FF]'
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          aria-label="메뉴 열기"
        >
          <span
            className={cn(
              'block w-6 h-0.5 bg-[#424242] transition-all duration-300',
              isMenuOpen && 'rotate-45 translate-y-2'
            )}
          />
          <span
            className={cn(
              'block w-6 h-0.5 bg-[#424242] transition-all duration-300',
              isMenuOpen && 'opacity-0'
            )}
          />
          <span
            className={cn(
              'block w-6 h-0.5 bg-[#424242] transition-all duration-300',
              isMenuOpen && '-rotate-45 -translate-y-2'
            )}
          />
        </button>
      </header>

      {/* 모바일 메뉴 오버레이 */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-[52px] bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 모바일 메뉴 드로어 */}
      <div
        className={cn(
          'md:hidden fixed top-[52px] left-0 right-0 bg-white z-50 border-b border-[#EEEEEE] shadow-lg',
          'transition-all duration-300 ease-in-out',
          isMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <nav className="flex flex-col py-2">
          {navItems.map((item, index) =>
            item.onClick ? (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setIsMenuOpen(false);
                }}
                className={cn(
                  'px-6 py-4 text-[16px] font-medium text-left',
                  'transition-colors duration-200',
                  'active:bg-[#F5F5F5]',
                  item.active
                    ? 'text-[#0565FF] bg-[#F5F7FA]'
                    : 'text-[#424242] hover:bg-[#FAFAFA]'
                )}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={index}
                href={item.href || '#'}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'px-6 py-4 text-[16px] font-medium',
                  'transition-colors duration-200',
                  'active:bg-[#F5F5F5]',
                  item.active
                    ? 'text-[#0565FF] bg-[#F5F7FA]'
                    : 'text-[#424242] hover:bg-[#FAFAFA]'
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </>
  );
};
