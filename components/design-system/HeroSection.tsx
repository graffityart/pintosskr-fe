'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import Image from 'next/image';
import { Button } from './Button';

export interface HeroSectionProps {
  /**
   * 메인 제목 (2줄)
   * @default ["휴대폰 소액결제,신용카드 결제", "클릭 한번으로 손쉽운 상품권 구매"]
   */
  title?: string[];

  /**
   * 부제목
   * @default "구매 즉시 발급, 24시간 언제든 사용 가능,상품권 현금화까지 한번에"
   */
  subtitle?: string;

  /**
   * 버튼 텍스트
   * @default "바로 구매하기"
   */
  buttonText?: string;

  /**
   * 버튼 클릭 핸들러
   */
  onButtonClick?: () => void;

  /**
   * 히어로 이미지 경로
   * @default "/hero-image.png"
   */
  imageSrc?: string;

  /**
   * 이미지 alt 텍스트
   * @default "결제 일러스트레이션"
   */
  imageAlt?: string;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = ['휴대폰 소액결제,신용카드 결제,', '클릭 한번으로 손쉽운 상품권 구매'],
  subtitle = '구매 즉시 발급, 24시간 언제든 사용 가능,상품권 현금화까지 한번에',
  buttonText = '바로 구매하기',
  onButtonClick,
  imageSrc = '/hero-image.png',
  imageAlt = '결제 일러스트레이션',
  className,
}) => {
  return (
    <section
      className={cn(
        'bg-neutral-50',
        'flex flex-col items-center gap-6',
        'lg:flex-row lg:items-center lg:gap-[100px] xl:gap-[190px]',
        'box-border',
        className
      )}
    >
      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-6 items-center text-center w-full lg:items-start lg:text-left lg:gap-[42px] lg:w-[411px] lg:shrink-0">
        {/* 제목 + 부제목 */}
        <div className="flex flex-col gap-3 items-center w-full lg:items-start lg:gap-4 whitespace-pre-wrap">
          {/* 메인 제목 */}
          <div className="w-full text-[24px] font-bold leading-[1.3] tracking-[-0.6px] text-black sm:text-[28px] md:text-[32px] lg:text-[40px] lg:tracking-[-1px]">
            {title.map((line, index) => (
              <p key={index} className={index === 0 ? 'mb-0' : ''}>
                {line}
              </p>
            ))}
          </div>

          {/* 부제목 */}
          <p className="w-full text-[14px] font-medium leading-[1.3] tracking-[-0.35px] text-[#616161] sm:text-[16px] md:text-[18px] lg:text-[24px] lg:tracking-[-0.6px]">
            {subtitle}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-6 items-center justify-center w-full lg:justify-start">
          <Button
            size="large"
            variant="filled"
            status="primary"
            showIcon={false}
            onClick={onButtonClick}
            className="!py-3 !px-6 !text-[16px] sm:!py-4 sm:!px-8 sm:!text-[18px] lg:!py-5 lg:!px-8 lg:!text-[24px]"
          >
            {buttonText}
          </Button>
        </div>
      </div>

      {/* 이미지 영역 */}
      <div className="relative shrink-0 w-full max-w-[280px] h-[220px] sm:max-w-[320px] sm:h-[260px] md:max-w-[380px] md:h-[300px] lg:w-[439px] lg:max-w-none lg:h-[369.5px]">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
            priority
          />
        </div>
        {/* 하단 그라데이션 */}
        <div
          className="absolute bottom-0 left-0 w-full h-[40px] lg:h-[54.619px]"
          style={{
            background: 'linear-gradient(to bottom, rgba(250, 250, 250, 0), #FAFAFA)',
          }}
        />
      </div>
    </section>
  );
};
