"use client";

import { HeroSection } from "@/components/design-system";

export function HeroSectionWrapper() {
  return (
    <HeroSection
      title={["안전하고 빠른 결제,", "클릭 한 번이면 충분합니다"]}
      subtitle="구매 즉시 발급, 24시간 언제든 사용 가능"
      buttonText="즉시 구매하기"
      onButtonClick={() => {
        const element = document.querySelector("#products");
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }}
      imageSrc="/Group 14.png"
    />
  );
}
