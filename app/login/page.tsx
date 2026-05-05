"use client";

import { Footer, Header } from "@/components/design-system";
import { PublicOnlyRoute } from "@/components/auth";

const MAIN_SITE = "https://www.pin-toss.com";

export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <LoginPageContent />
    </PublicOnlyRoute>
  );
}

function LoginPageContent() {
  const goToMainLogin = () => {
    window.location.href = `${MAIN_SITE}/login`;
  };

  const goToMainSignup = () => {
    window.location.href = `${MAIN_SITE}/signup`;
  };

  const goToFindId = () => {
    window.location.href = `${MAIN_SITE}/find-id`;
  };

  const goToPasswordReset = () => {
    window.location.href = `${MAIN_SITE}/password-reset`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        logoSrc="/logo.png"
        navItems={[
          { label: "고객센터", href: "/#notice", active: false },
          { label: "회원가입", href: `${MAIN_SITE}/signup`, active: false },
          { label: "로그인", href: `${MAIN_SITE}/login`, active: false },
        ]}
      />

      <div className="flex flex-col items-center px-4 py-8 sm:px-8 md:pt-[107px] md:pb-20">
        <div className="w-full max-w-[640px]">
          <h1 className="text-[24px] md:text-[32px] font-bold text-black mb-8 md:mb-12">
            로그인
          </h1>

          <div className="space-y-3 md:space-y-4">
            <button
              type="button"
              onClick={goToMainLogin}
              className="w-full h-12 md:h-14 bg-[#0565FF] text-white rounded-[10px] text-[16px] md:text-[20px] font-semibold hover:bg-[#044CBF] transition-colors"
            >
              pin-toss.com에서 로그인하기
            </button>

            <button
              type="button"
              onClick={goToMainSignup}
              className="w-full h-12 md:h-14 bg-white border border-[#0565FF] text-[#0565FF] rounded-[10px] text-[16px] md:text-[20px] font-semibold hover:bg-[#F5F8FF] transition-colors"
            >
              회원가입
            </button>
          </div>

          <div className="h-[2px] bg-[#EEEEEE] rounded-[10px] my-6 md:my-8"></div>

          <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 text-[12px] md:text-[14px]">
            <button
              onClick={goToFindId}
              className="text-[#757575] hover:text-[#212121]"
            >
              아이디 찾기
            </button>

            <div className="w-px h-4 md:h-5 bg-[#EEEEEE]"></div>

            <button
              onClick={goToPasswordReset}
              className="text-[#757575] hover:text-[#212121]"
            >
              비밀번호 재설정
            </button>

            <div className="w-px h-4 md:h-5 bg-[#EEEEEE]"></div>

            <button
              onClick={goToMainSignup}
              className="text-[#03C3FF] hover:text-[#0292BF] font-medium"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
