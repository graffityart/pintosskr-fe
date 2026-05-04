import type { Metadata } from "next";
import { Toaster } from "sonner";

import { QueryProvider } from "@/lib/providers/query-provider";
import { AuthProvider } from "@/components/auth";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo";

import { pretendard } from "../lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pin-toss.com"),
  title: {
    default: "핀토스몰 - 상품권 휴대폰 소액결제, 신용 카드결제 | 24시간 발송",
    template: "%s | 핀토스몰",
  },
  description:
    "상품권소액결제, 상품권카드결제를 이용해 컬쳐랜드 문화상품권 구글기프트카드 등 다양한 상품권을 24시간 빠르게 구매할 수 있습니다. 안전한 인증 시스템과 즉시 발송 기능으로 편리한 이용이 가능합니다. 믿고 이용할 수 있는 상품권 전문 판매몰 핀토스몰입니다.",
  keywords: [
    "휴대폰 소액결제",
    "핸드폰 소액결제",
    "상품권소액결제",
    "상품권 소액결제",
    "소액결제 상품권",
    "휴대폰소액결제 상품권",
    "핸드폰소액결제 상품권",
    "상품권카드결제",
    "상품권 카드결제",
    "상품권 휴대폰결제",
    "핸드폰 상품권 구매",
    "휴대폰 상품권 구매",
    "컬쳐랜드",
    "문화상품권",
    "도서문화상품권",
    "구글기프트카드",
    "상품권 자동발송",
    "상품권 실시간 구매",
    "신용카드 상품권결제",
    "휴대폰 상품권결제",
    "핀토스몰",
    "상품권",
    "기프트카드",
    "모바일상품권",
    "온라인상품권",
    "기프티콘",
    "선물하기",
    "소액결제 현금화",
    "휴대폰결제 상품권",
  ],
  authors: [{ name: "핀토스몰" }],
  creator: "핀토스몰",
  publisher: "핀토스몰",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://pin-toss.com",
  },
  verification: {
    google: "J_OlDQR29PFRj2JfrnjLMOKpKPPyVtOw4e3tSFuxugw",
    other: {
      "naver-site-verification": "939e1d010661dc030c56e6c5ce520f51527e5efd",
    },
  },
  openGraph: {
    title: "핀토스몰 - 상품권 휴대폰 소액결제, 신용 카드결제 | 24시간 발송",
    description:
      "컬쳐랜드, 문화상품권, 구글기프트카드 등 다양한 상품권을 소액결제와 카드결제로 24시간 빠르게 구매하세요. 안전한 인증 시스템과 즉시 발송 서비스로 편리하게 이용할 수 있는 상품권 전문몰 핀토스몰.",
    url: "https://pin-toss.com",
    siteName: "핀토스몰 PinToss Mall",
    images: [
      {
        url: "https://pin-toss.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "핀토스몰 - 상품권 전문 판매몰",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "핀토스몰 - 상품권 휴대폰 소액결제, 신용 카드결제 | 24시간 발송",
    description:
      "상품권소액결제, 상품권카드결제로 컬쳐랜드·문화상품권·구글기프트카드를 24시간 빠르게 구매하세요. 안전한 인증과 즉시 발송으로 편리한 구매 경험을 제공하는 핀토스몰.",
    images: ["https://pin-toss.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Hero 이미지 preload (LCP 최적화) */}
        <link
          rel="preload"
          as="image"
          href="/Group 14.png"
          type="image/png"
          fetchPriority="high"
        />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className={`${pretendard.variable}`}>
        <div className="flex min-h-screen flex-col">
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-center" richColors offset={80} />
            </AuthProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
