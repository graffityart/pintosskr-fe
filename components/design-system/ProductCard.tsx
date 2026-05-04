'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import Image from 'next/image';

export interface ProductCardProps {
  /**
   * 브랜드 로고 이미지 경로
   */
  brandLogo?: string;

  /**
   * 브랜드 로고 alt 텍스트
   */
  brandLogoAlt?: string;

  /**
   * 상품명
   * @default "상품명"
   */
  productName?: string;

  /**
   * 가격
   * @default "00,000원"
   */
  price?: string;

  /**
   * 구매하기 버튼 텍스트
   * @default "구매하기"
   */
  buttonText?: string;

  /**
   * 호버 상태 (선택된 상태)
   * @default false
   */
  selected?: boolean;

  /**
   * 구매하기 버튼 표시 여부
   * @default true
   */
  showButton?: boolean;

  /**
   * 클릭 핸들러
   */
  onClick?: () => void;

  /**
   * 구매하기 버튼 클릭 핸들러
   */
  onPurchaseClick?: () => void;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  brandLogo,
  brandLogoAlt = '브랜드 로고',
  productName = '상품명',
  price = '00,000원',
  buttonText = '구매하기',
  selected = false,
  showButton = true,
  onClick,
  onPurchaseClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-[10px]',
        'flex flex-col items-center justify-center gap-4',
        'px-8 py-6',
        'box-border',
        'transition-all duration-200',
        'cursor-pointer',
        selected
          ? 'border-2 border-[#0565FF]'
          : 'border-[1.5px] border-[#E0E0E0] hover:border-[#0565FF]',
        className
      )}
    >
      {/* 브랜드 로고 */}
      {brandLogo ? (
        <div className="relative w-[104px] h-[104px] shrink-0 rounded-[10px] overflow-hidden bg-white">
          <Image
            src={brandLogo}
            alt={brandLogoAlt}
            fill
            className="object-contain p-[10px]"
          />
        </div>
      ) : (
        <div className="w-[104px] h-[104px] shrink-0 rounded-[10px] bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">로고</span>
        </div>
      )}

      {/* 상품 정보 */}
      <div className="flex flex-col gap-2 items-start w-[172px] shrink-0 text-center whitespace-nowrap">
        {/* 상품명 */}
        <p className="w-full text-[18px] font-medium leading-[1.3] tracking-[-0.45px] text-[#757575] overflow-ellipsis overflow-hidden">
          {productName}
        </p>

        {/* 가격 */}
        <p className="w-full text-[20px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#212121] overflow-ellipsis overflow-hidden">
          {price}
        </p>
      </div>

      {/* 구매하기 버튼 */}
      {showButton && (
        <div className="w-full">
          {selected ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPurchaseClick?.();
              }}
              className={cn(
                'w-full',
                'bg-[#DAE8FF] rounded-[10px]',
                'px-8 py-3',
                'flex items-center justify-center gap-1',
                'transition-all duration-200',
                'hover:bg-[#C8DEFF]'
              )}
            >
              <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.45px] text-[#0565FF]">
                {buttonText}
              </span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPurchaseClick?.();
              }}
              className={cn(
                'w-full',
                'border-[1.5px] border-[#0565FF] border-solid',
                'bg-transparent rounded-[10px]',
                'px-8 py-3',
                'flex items-center justify-center gap-1',
                'transition-all duration-200',
                'hover:bg-[#DAE8FF]'
              )}
            >
              <span className="text-[18px] font-semibold leading-[1.3] tracking-[-0.45px] text-[#0565FF]">
                {buttonText}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
