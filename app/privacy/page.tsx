import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "WIN×Ⅱの個人情報保護方針について説明しています。収集する情報の種類、利用目的、セキュリティ対策などの詳細をご確認ください。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: `${appUrl}/privacy`,
    siteName: "WIN×Ⅱ",
    title: "プライバシーポリシー | WIN×Ⅱ",
    description: "WIN×Ⅱの個人情報保護方針について説明しています。",
  },
  twitter: {
    card: "summary",
    title: "プライバシーポリシー | WIN×Ⅱ",
    description: "WIN×Ⅱの個人情報保護方針について説明しています。",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${appUrl}/privacy`,
  },
};

export default function PrivacyPage() {
  const lastUpdated = "2025年1月9日";

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-8">
          WIN×Ⅱ（以下「当サイト」といいます）は、ユーザーの皆様の個人情報保護の重要性について認識し、個人情報の保護に関する法律（以下「個人情報保護法」といいます）を遵守すると共に、以下のプライバシーポリシー（以下「本ポリシー」といいます）に従い、適切な取扱い及び保護に努めます。
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 収集する個人情報</h2>
          <p className="mb-4">当サイトでは、以下の個人情報を収集する場合があります。</p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">1.1 会員登録時に収集する情報</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>氏名</li>
            <li>メールアドレス</li>
            <li>パスワード（暗号化して保存）</li>
            <li>生年月日</li>
            <li>郵便番号</li>
            <li>電話番号</li>
            <li>登録日時</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">1.2 サービス利用時に収集する情報</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>会員ID（UUID）</li>
            <li>クリックログ（日時、会員ID、案件名、案件ID）</li>
            <li>非会員の方：ゲストUUID（guest:UUID形式）</li>
            <li>Cookieおよびセッション情報</li>
            <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 個人情報の利用目的</h2>
          <p className="mb-4">収集した個人情報は、以下の目的で利用いたします。</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>会員登録、認証、および会員管理</li>
            <li>キャッシュバックの計算および提供</li>
            <li>アフィリエイト成果の追跡（id1パラメータによる識別）</li>
            <li>サービスの提供、維持、改善</li>
            <li>お問い合わせへの対応</li>
            <li>利用状況の分析および統計データの作成</li>
            <li>重要なお知らせやサービス変更の通知</li>
            <li>不正利用の防止およびセキュリティ対策</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 外部サービスとの連携</h2>
          <p className="mb-4">当サイトは、以下の外部サービスと連携しています。</p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">3.1 アフィリエイトサービスプロバイダ（ASP）</h3>
          <p className="mb-4">
            当サイトは、A8.netをはじめとする各種ASPのアフィリエイトプログラムを利用しています。
            ユーザーが案件のリンクをクリックした際、ASPのサイトにid1パラメータ（会員IDまたはゲストUUID）が送信され、
            成果の追跡に使用されます。
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">3.2 Google Sheets API</h3>
          <p className="mb-4">
            会員データベースおよびクリックログの保存・管理にGoogle Sheets APIを使用しています。
            データは適切なアクセス制御のもとで管理され、サービスアカウント経由でのみアクセス可能です。
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">3.3 Google Tag Manager</h3>
          <p className="mb-4">
            サイトのアクセス解析および改善のため、Google Tag Managerを使用しています。
            収集されるデータは統計的な分析に使用され、個人を特定するものではありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookie・トラッキング技術の使用</h2>
          <p className="mb-4">当サイトでは、以下の技術を使用しています。</p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">4.1 セッション管理</h3>
          <p className="mb-4">
            Next-Authを使用したセッション管理により、ログイン状態の維持を行います。
            セッションCookieはHttpOnly、Secure属性を持ち、セキュアに管理されます。
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">4.2 非会員トラッキング</h3>
          <p className="mb-4">
            非会員の方が案件をクリックした際、ゲストUUID（guest:UUID形式）を生成し、
            Cookieに保存することで、成果の追跡を可能にします。
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">4.3 アフィリエイト追跡</h3>
          <p className="mb-4">
            案件リンクには、id1パラメータ（会員IDまたはゲストUUID）およびeventIdパラメータ（クリックごとのユニークID）が付与され、
            成果の正確な追跡に使用されます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. セキュリティ対策</h2>
          <p className="mb-4">当サイトでは、以下のセキュリティ対策を実施しています。</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>パスワードのbcrypt暗号化（salt rounds: 10）</li>
            <li>HTTPS通信による暗号化</li>
            <li>セッションCookieのHttpOnly、Secure属性設定</li>
            <li>CSRF保護（Next-Auth組み込み機能）</li>
            <li>Google Sheets APIアクセスの厳格な制御</li>
            <li>定期的なセキュリティアップデート</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 第三者への提供</h2>
          <p className="mb-4">
            当サイトは、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難である場合</li>
            <li>アフィリエイト成果追跡のため、ASPにid1パラメータ（会員IDまたはゲストUUID）を提供する場合</li>
          </ul>
          <p className="mb-4">
            なお、統計的なデータなど、個人を特定できない形式に加工した情報については、
            第三者への提供や公開を行うことがあります。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 個人情報の保管期間</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>会員情報：退会されるまで、または利用目的達成後、合理的な期間</li>
            <li>クリックログおよび成果データ：最大1年間</li>
            <li>アクセスログ：最大6ヶ月間</li>
          </ul>
          <p className="mb-4">
            保管期間経過後、または利用目的を達成した個人情報については、速やかに削除いたします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. ユーザーの権利</h2>
          <p className="mb-4">ユーザーは、当サイトに対して以下の権利を有します。</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>自己の個人情報の開示を請求する権利</li>
            <li>自己の個人情報の訂正、追加、または削除を請求する権利</li>
            <li>自己の個人情報の利用停止を請求する権利</li>
            <li>当サイトからの退会（アカウント削除）を請求する権利</li>
          </ul>
          <p className="mb-4">
            これらの権利を行使される場合は、下記のお問い合わせ先までご連絡ください。
            本人確認の上、合理的な期間内に対応いたします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. プライバシーポリシーの変更</h2>
          <p className="mb-4">
            当サイトは、本ポリシーを随時見直し、必要に応じて変更することがあります。
            変更後のプライバシーポリシーは、当サイトに掲載した時点で効力を生じるものとします。
            重要な変更がある場合には、サイト上で通知いたします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. お問い合わせ</h2>
          <p className="mb-4">
            本ポリシーに関するお問い合わせ、個人情報の開示・訂正・削除等のご請求は、
            以下の連絡先までお願いいたします。
          </p>
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <p className="font-semibold mb-2">WIN×Ⅱ 運営事務局</p>
            <p>メールアドレス: <a href="mailto:support@win2.jp" className="text-orange-600 hover:text-orange-700">support@win2.jp</a></p>
          </div>
        </section>

        <div className="text-right text-sm text-gray-600 mt-12">
          <p>制定日：2025年1月9日</p>
          <p>最終更新日：{lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}
