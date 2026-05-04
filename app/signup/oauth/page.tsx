'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Header, Footer } from '@/components/design-system';
import { FormInput, VerificationBox } from '@/components/form';
import { useOAuthSignupAPI } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';
import { PublicOnlyRoute } from '@/components/auth';

export default function OAuthSignupPage() {
  return (
    <PublicOnlyRoute>
      <OAuthSignupPageContent />
    </PublicOnlyRoute>
  );
}

function OAuthSignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthSignupMutation = useOAuthSignupAPI();
  const { setAuth } = useAuthStore();

  const [oauthSignupUuid, setOauthSignupUuid] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [niceVerified, setNiceVerified] = useState(false);

  // URL에서 oauthSignupUuid 가져오기
  useEffect(() => {
    const uuid = searchParams.get('oauthSignupUuid');
    if (!uuid) {
      toast.error('잘못된 접근입니다.');
      router.replace('/login');
      return;
    }
    setOauthSignupUuid(uuid);
  }, [searchParams, router]);

  // NICE 본인인증 완료 시 호출 (postMessage 수신)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // TODO: origin 검증 추가
      if (event.data?.name && event.data?.phoneNumber) {
        setFormData({
          name: event.data.name,
          phone: event.data.phoneNumber,
        });
        setNiceVerified(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // NICE 본인인증
  const handleNiceVerification = async () => {
    try {
      const { getNiceEncryptedData, openNiceVerificationPopup } = await import('@/lib/api/nice');
      const encryptedData = await getNiceEncryptedData('SIGNUP');
      openNiceVerificationPopup(encryptedData);
    } catch (error) {
      console.error('NICE 본인인증 실패:', error);
      toast.error('본인인증에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // OAuth 회원가입
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!niceVerified) {
      toast.error('본인인증을 완료해주세요.');
      return;
    }

    try {
      const response = await oauthSignupMutation.mutateAsync({
        oauthSignupUuid,
        name: formData.name,
        phone: formData.phone,
      });

      // 회원가입 성공
      toast.success('회원가입이 완료되었습니다!');

      // accessToken이 있으면 저장, 없으면 로그인 페이지로
      if (response.data?.accessToken) {
        setAuth(response.data.accessToken);
        setTimeout(() => {
          router.replace('/');
        }, 1500);
      } else {
        // accessToken이 없는 경우 로그인 페이지로 이동
        setTimeout(() => {
          router.replace('/login');
        }, 1500);
      }
    } catch (error) {
      console.error('OAuth 회원가입 실패:', error);
      toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const canSubmit = niceVerified && formData.name && formData.phone;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header
        logoSrc="/logo.png"
        navItems={[
          { label: '고객센터', href: '/#notice', active: false },
          { label: '회원가입', href: '/signup', active: false },
          { label: '로그인', href: '/login', active: false },
        ]}
      />

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col items-center px-4 py-8 sm:px-8 md:pt-[107px] md:pb-20">
        <div className="w-full max-w-[640px]">
          {/* 제목 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-8 md:mb-12">
            <h1 className="text-[24px] md:text-[32px] font-bold text-black">소셜 회원가입</h1>
            <span className="px-3 py-1.5 md:px-4 md:py-2 bg-[#FEE500] text-[12px] md:text-[14px] font-medium text-[#000000] rounded-[8px] self-start sm:self-auto">
              간편가입
            </span>
          </div>

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NICE 본인인증 */}
            <VerificationBox
              title="본인인증"
              buttonText="휴대폰 본인인증"
              description="회원가입을 위해 NICE 본인인증이 필요합니다"
              verified={niceVerified}
              onVerify={handleNiceVerification}
            />

            {/* 이름 (NICE 인증 후 자동 입력) */}
            <FormInput
              label="이름"
              name="name"
              value={formData.name}
              required
              readOnly
              placeholder="본인인증 후 자동으로 입력됩니다"
            />

            {/* 휴대폰 번호 (NICE 인증 후 자동 입력) */}
            <FormInput
              label="휴대폰 번호"
              name="phone"
              type="tel"
              value={formData.phone}
              required
              readOnly
              placeholder="본인인증 후 자동으로 입력됩니다"
            />

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={!canSubmit || oauthSignupMutation.isPending}
              className="w-full h-12 md:h-14 bg-[#0565FF] text-white rounded-[10px] text-[16px] md:text-[20px] font-semibold hover:bg-[#044CBF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 md:mt-8"
            >
              {oauthSignupMutation.isPending ? '처리 중...' : '회원가입'}
            </button>

            {/* 필수 입력 안내 */}
            {!canSubmit && (
              <div className="bg-[#FFF4E6] border border-[#FFA500] rounded-[10px] p-3 md:p-4">
                <p className="text-[12px] md:text-[14px] text-[#616161]">
                  <span className="text-[#FF6B6B]">*</span> 휴대폰 본인인증을 완료해주세요
                </p>
              </div>
            )}
          </form>

          {/* 하단 링크 */}
          <div className="flex items-center justify-center gap-2 mt-6 md:mt-8 text-[12px] md:text-[14px]">
            <span className="text-[#757575]">이미 계정이 있으신가요?</span>
            <button
              onClick={() => router.push('/login')}
              className="text-[#03C3FF] hover:text-[#0292BF] font-medium"
            >
              로그인
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
