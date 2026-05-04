"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer, Header } from "@/components/design-system";
import { useLoginAPI } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth";
import { PublicOnlyRoute } from "@/components/auth";

export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <LoginPageContent />
    </PublicOnlyRoute>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const loginMutation = useLoginAPI();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginMutation.mutateAsync({ email, password });

      // Zustand store에 토큰 저장 (persist로 자동으로 localStorage에 저장됨)
      // refreshToken은 HttpOnly Cookie로 오므로 accessToken만 저장
      setAuth(response.data.accessToken);

      alert("로그인 성공!");
      router.push("/");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  const handleKakaoLogin = () => {
    // 현재 페이지 URL 저장 (로그인 후 돌아올 위치)
    const returnUrl = window.location.pathname;
    if (returnUrl !== "/login") {
      sessionStorage.setItem("returnUrl", returnUrl);
    }

    // OAuth 로그인 시작 - 루트 URL만 전달
    const clientRedirectUri = window.location.origin; // http://localhost:3000
    window.location.href = `https://api.pin-toss.com/api/oauth/login?loginType=KAKAO&clientRedirectUri=${clientRedirectUri}`;
  };

  const handleNaverLogin = () => {
    // 현재 페이지 URL 저장 (로그인 후 돌아올 위치)
    const returnUrl = window.location.pathname;
    if (returnUrl !== "/login") {
      sessionStorage.setItem("returnUrl", returnUrl);
    }

    // OAuth 로그인 시작 - 루트 URL만 전달
    const clientRedirectUri = window.location.origin; // http://localhost:3000
    window.location.href = `https://api.pin-toss.com/api/oauth/login?loginType=NAVER&clientRedirectUri=${clientRedirectUri}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header
        logoSrc="/logo.png"
        navItems={[
          { label: "고객센터", href: "/#notice", active: false },
          { label: "회원가입", href: "/signup", active: false },
          { label: "로그인", href: "/login", active: false },
        ]}
      />

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col items-center px-4 py-8 sm:px-8 md:pt-[107px] md:pb-20">
        <div className="w-full max-w-[640px]">
          {/* 제목 */}
          <h1 className="text-[24px] md:text-[32px] font-bold text-black mb-8 md:mb-12">로그인</h1>

          {/* 로그인 폼 */}
          <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
            {/* 이메일 입력 */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
              className="w-full h-11 md:h-12 bg-[#F5F5F5] rounded-[10px] px-4 md:px-6 text-[14px] md:text-[16px] text-[#212121] placeholder:text-[#9E9E9E]"
            />

            {/* 비밀번호 입력 */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className="w-full h-11 md:h-12 bg-[#F5F5F5] rounded-[10px] px-4 md:px-6 text-[14px] md:text-[16px] text-[#212121] placeholder:text-[#9E9E9E]"
            />

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full h-12 md:h-14 bg-[#0565FF] text-white rounded-[10px] text-[16px] md:text-[20px] font-semibold hover:bg-[#044CBF] transition-colors"
            >
              로그인
            </button>
          </form>

          {/* 구분선 */}
          <div className="h-[2px] bg-[#EEEEEE] rounded-[10px] my-6 md:my-8"></div>

          {/* 소셜 로그인 */}
          <div className="space-y-3 md:space-y-4">
            {/* 카카오 로그인 */}
            <button
              onClick={handleKakaoLogin}
              className="w-full h-12 md:h-14 bg-[#FEE500] rounded-[10px] flex items-center justify-center gap-2 md:gap-3 hover:bg-[#FDD835] transition-colors"
            >
              <div className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] flex items-center justify-center">
                <span className="text-[18px] md:text-[20px]">💬</span>
              </div>
              <span className="text-[16px] md:text-[20px] font-semibold text-[rgba(0,0,0,0.85)]">
                카카오 로그인
              </span>
            </button>

            {/* 네이버 로그인 */}
            <button
              onClick={handleNaverLogin}
              className="w-full h-12 md:h-14 bg-[#03C75A] rounded-[10px] flex items-center justify-center gap-2 md:gap-3 hover:bg-[#02B350] transition-colors"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <span className="text-white font-bold text-[14px] md:text-[16px]">N</span>
              </div>
              <span className="text-[16px] md:text-[20px] font-semibold text-white">
                네이버 로그인
              </span>
            </button>
          </div>

          {/* 하단 링크 */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 text-[12px] md:text-[14px]">
            <button
              onClick={() => router.push("/find-id")}
              className="text-[#757575] hover:text-[#212121]"
            >
              아이디 찾기
            </button>
            <div className="w-px h-4 md:h-5 bg-[#EEEEEE]"></div>
            <button
              onClick={() => router.push("/password-reset")}
              className="text-[#757575] hover:text-[#212121]"
            >
              비밀번호 재설정
            </button>
            <div className="w-px h-4 md:h-5 bg-[#EEEEEE]"></div>
            <button
              onClick={() => router.push("/signup")}
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
