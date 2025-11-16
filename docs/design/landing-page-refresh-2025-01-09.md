# Landing Page Refresh (2025-01-09)

最上流のヒーローセクションからサービス紹介セクションまで実装を大きく刷新したため、デザイン・挙動をここにまとめます。次回以降の改修時は本ノートを参照してください。

## Hero Section

- Framer Motion を利用した段階的アニメーション。
  - `headlineVariants` と `wordVariants` で「暮らしをもっと お得 / スマートに」の各語句を個別に登場させる。
  - CTA行にはグローを付与し、`motion.span` で背景ハイライトを遅延表示。
- CTA 文言の出し分け
  - PC: 「無料メルマガ会員登録はこちら」
  - 420px 以下: 「無料メルマガ会員登録」
  - ボタン・ログインリンクともに `max-[420px]` ブレークポイントで文字サイズとパディングを縮小。
- 見出しサイズ制御
  - `max-[420px]:text-[32px]` + `max-[420px]:leading-[1.2]` で小画面でも折り返し負荷を軽減。

## Latest Blogs Section

- 右カラムに「注目カテゴリ」ボードを配置。
  - microCMSレスポンスからカテゴリ集計し、最多 4 件を表示。
  - カテゴリカード全体を `<Link>` 化し、IDが無い場合は `/categories` に遷移。
- 左カラムはカードグリッドに変更済み（以前の縦並びを解消）。

## Highlight Section

- 横スクロールガードのグラデーションより手前に操作ボタンを表示するため、ボタンラッパーに `z-20` を追加。
- 横スクロールは `carouselRef` で制御し、左右グラデ操作は既存の `scrollByDirection`／`updateScrollState` を流用。

## Service Section（動画ブロック）

- `useScrollReveal` で可視状態を取得し、画面内に入ったタイミングでのみ `shouldPlay` を true にして動画再生。
- `isVideoReady` が true になるまではポスター画像を前面に表示し、フェードで切り替えてフラッシュを抑制。
- レイアウトは 2 カラム。
  - 左: コピー＋カテゴリチップ。
  - 右: 動画。`max-w-[520px] (md:540px)` を設定し、`md:ml-auto` で横並び時に右寄せ。
- 動画は `rounded-[28px]`、最小高さは `min-h-[220px]`（sm:300px, md:420px）。

## Workflow / Ops 備考

- AFB成果同期GitHub Actions は2025-01-09時点で停止。`.github/workflows/afb-sync.yml` をコメントアウトし、`docs/operations/afb-a8-hybrid-workflow.md` に注意書きを追加済み。

## 今後のメンテナンス指針

1. Hero を更新する際は Framer Motion の variants を忘れずに。分割パターンは `components/home/sections/hero-section.tsx` を参照。
2. カテゴリランキングに新しい並べ替えロジックを入れる場合は `LatestBlogsSection` 内の `categoryHighlights` を更新。
3. Service動画を差し替える際は `webm` と `poster` の両方を同時更新し、`isVideoReady` フラグ動作を保つこと。

作成日: 2025-01-09
担当: 開発チーム（Landing Page担当）
