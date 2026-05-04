'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Header, Footer } from '@/components/design-system';
import {
  FormInput,
  InputWithButton,
  CheckboxWithLink,
  VerificationBox,
} from '@/components/form';
import { useCheckEmailAPI, useCheckPhoneAPI, useRegisterAPI } from '@/lib/api/auth';
import { PublicOnlyRoute } from '@/components/auth';

export default function SignupPage() {
  return (
    <PublicOnlyRoute>
      <SignupPageContent />
    </PublicOnlyRoute>
  );
}

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // OAuth 관련 상태
  const [isOAuth, setIsOAuth] = useState(false);
  const [loginType, setLoginType] = useState<'LOCAL' | 'KAKAO' | 'NAVER'>('LOCAL');

  // React Query Hooks
  const checkEmailMutation = useCheckEmailAPI();
  const checkPhoneMutation = useCheckPhoneAPI();
  const registerMutation = useRegisterAPI();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
  });

  const [verification, setVerification] = useState({
    emailChecked: false,
    phoneChecked: false,
    niceVerified: false,
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // OAuth 정보 확인 및 초기화 (searchParams에서 가져옴)
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const loginTypeParam = searchParams.get('loginType') as 'KAKAO' | 'NAVER' | null;

    if (emailParam && loginTypeParam) {
      setIsOAuth(true);
      setLoginType(loginTypeParam);
      setFormData(prev => ({ ...prev, email: emailParam }));
      setVerification(prev => ({ ...prev, emailChecked: true }));
    }
  }, [searchParams]);

  // NICE 본인인증 완료 시 호출 (postMessage 수신)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // TODO: origin 검증 추가
      if (event.data?.name && event.data?.phoneNumber) {
        setFormData((prev) => ({
          ...prev,
          name: event.data.name,
          phone: event.data.phoneNumber,
        }));
        setVerification((prev) => ({ ...prev, niceVerified: true }));
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

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    try {
      const response = await checkEmailMutation.mutateAsync(formData.email);

      // data가 true면 중복, false면 사용 가능
      if (response.data) {
        toast.error('이미 사용 중인 이메일입니다.');
      } else {
        toast.success('사용 가능한 이메일입니다.');
        setVerification((prev) => ({ ...prev, emailChecked: true }));
      }
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      toast.error('이메일 중복 확인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 이메일 재시도
  const handleRetryEmail = () => {
    setVerification((prev) => ({ ...prev, emailChecked: false }));
    setFormData((prev) => ({ ...prev, email: '' }));
  };

  // 전화번호 중복 확인 (NICE 인증 후)
  const handleCheckPhone = async () => {
    try {
      const response = await checkPhoneMutation.mutateAsync(formData.phone);

      // data가 true면 중복, false면 사용 가능
      if (response.data) {
        toast.error('이미 사용 중인 전화번호입니다.');
      } else {
        toast.success('사용 가능한 전화번호입니다.');
        setVerification((prev) => ({ ...prev, phoneChecked: true }));
      }
    } catch (error) {
      console.error('전화번호 중복 확인 실패:', error);
      toast.error('전화번호 중복 확인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 전화번호 재시도
  const handleRetryPhone = () => {
    setVerification((prev) => ({ ...prev, phoneChecked: false }));
  };

  // 회원가입
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        loginType: loginType,
      });

      toast.success('회원가입이 완료되었습니다!');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      console.error('회원가입 실패:', error);
      toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const canSubmit =
    formData.email &&
    verification.emailChecked &&
    formData.password &&
    formData.passwordConfirm &&
    formData.password === formData.passwordConfirm &&
    formData.name &&
    formData.phone &&
    verification.niceVerified &&
    agreeTerms &&
    agreePrivacy;

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
            <h1 className="text-[24px] md:text-[32px] font-bold text-black">회원가입</h1>
            {isOAuth && (
              <span className="px-3 py-1.5 md:px-4 md:py-2 bg-[#FEE500] text-[12px] md:text-[14px] font-medium text-[#000000] rounded-[8px] self-start sm:self-auto">
                {loginType === 'KAKAO' ? '카카오' : '네이버'} 간편가입
              </span>
            )}
          </div>

          {/* 회원가입 폼 */}
          <form onSubmit={handleSignup} className="space-y-6">
            {/* 이메일 */}
            {isOAuth ? (
              <FormInput
                label="이메일"
                name="email"
                type="email"
                value={formData.email}
                required
                disabled
                helpText="OAuth 로그인으로 가입하여 이메일은 변경할 수 없습니다"
              />
            ) : (
              <InputWithButton
                label="이메일"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력해주세요"
                required
                buttonText="중복확인"
                buttonDisabled={!formData.email}
                buttonCompleted={verification.emailChecked}
                onButtonClick={handleCheckEmail}
                onRetry={handleRetryEmail}
              />
            )}

            {/* 비밀번호 */}
            <FormInput
              label="비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요"
              required
            />

            {/* 비밀번호 확인 */}
            <FormInput
              label="비밀번호 확인"
              name="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요"
              required
            />

            {/* NICE 본인인증 */}
            <VerificationBox
              title="본인인증"
              buttonText="휴대폰 본인인증"
              description="회원가입을 위해 NICE 본인인증이 필요합니다"
              verified={verification.niceVerified}
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
            {verification.niceVerified ? (
              <InputWithButton
                label="휴대폰 번호"
                name="phone"
                type="tel"
                value={formData.phone}
                required
                readOnly
                buttonText="중복확인"
                buttonCompleted={verification.phoneChecked}
                onButtonClick={handleCheckPhone}
                onRetry={handleRetryPhone}
              />
            ) : (
              <FormInput
                label="휴대폰 번호"
                name="phone"
                type="tel"
                value={formData.phone}
                required
                readOnly
                placeholder="본인인증 후 자동으로 입력됩니다"
              />
            )}

            {/* 약관 동의 */}
            <div className="pt-4 space-y-3 border-t border-[#EEEEEE]">
              <CheckboxWithLink
                label="이용약관에 동의합니다"
                required
                checked={agreeTerms}
                onChange={setAgreeTerms}
                linkText="전문보기"
                onLinkClick={() => window.open('/terms', '_blank')}
              />
              <CheckboxWithLink
                label="개인정보 처리방침에 동의합니다"
                required
                checked={agreePrivacy}
                onChange={setAgreePrivacy}
                linkText="전문보기"
                onLinkClick={() => window.open('/privacy', '_blank')}
              />
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-12 md:h-14 bg-[#0565FF] text-white rounded-[10px] text-[16px] md:text-[20px] font-semibold hover:bg-[#044CBF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 md:mt-8"
            >
              {isOAuth
                ? `${loginType === 'KAKAO' ? '카카오' : '네이버'}로 회원가입`
                : '회원가입'}
            </button>

            {/* 필수 입력 안내 */}
            {!canSubmit && (
              <div className="bg-[#FFF4E6] border border-[#FFA500] rounded-[10px] p-3 md:p-4">
                <p className="text-[12px] md:text-[14px] text-[#616161]">
                  <span className="text-[#FF6B6B]">*</span> 필수 항목을 모두 입력해주세요
                </p>
                <ul className="text-[11px] md:text-[12px] text-[#757575] mt-2 space-y-1 list-disc list-inside">
                  {!verification.emailChecked && <li>이메일 중복 확인</li>}
                  {!verification.niceVerified && <li>휴대폰 본인인증</li>}
                  {verification.niceVerified && !verification.phoneChecked && <li>전화번호 중복 확인</li>}
                  {!agreeTerms && <li>이용약관 동의</li>}
                  {!agreePrivacy && <li>개인정보 처리방침 동의</li>}
                </ul>
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
