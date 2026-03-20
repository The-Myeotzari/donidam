export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-2">개인정보처리방침</h1>
      <p className="text-gray-500 mb-8">최종 수정일: 2026년 3월 20일</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">1. 수집하는 개인정보 항목</h2>
        <p>
          돈이담은 카카오 소셜 로그인을 통해 아래 정보를 수집합니다.
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>이메일 주소</li>
          <li>닉네임 (카카오 프로필명)</li>
          <li>프로필 이미지 (선택)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">2. 개인정보 수집 및 이용 목적</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>회원 식별 및 서비스 로그인</li>
          <li>가계부, 용돈 관리 등 서비스 제공</li>
          <li>가족 간 연결 기능 제공</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">3. 개인정보 보유 및 이용 기간</h2>
        <p>
          회원 탈퇴 시 즉시 삭제합니다. 단, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">4. 개인정보의 제3자 제공</h2>
        <p>
          돈이담은 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
          다만, 이용자가 직접 동의한 경우 또는 법령에 의한 경우는 예외로 합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">5. 개인정보 처리 위탁</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Supabase Inc. — 인증 및 데이터 저장</li>
          <li>Kakao Corp. — 소셜 로그인 인증</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">6. 이용자의 권리</h2>
        <p>
          이용자는 언제든지 본인의 개인정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.
          요청은 아래 이메일로 연락해 주세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">7. 개인정보 보호책임자</h2>
        <ul className="list-none space-y-1">
          <li>이름: 조준형</li>
          <li>이메일: jojh0323@pukyong.ac.kr</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">8. 개인정보처리방침 변경</h2>
        <p>
          본 방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시 앱 내 공지를 통해 안내합니다.
        </p>
      </section>
    </div>
  )
}
