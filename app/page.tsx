import Link from "next/link";
import { getBlogs } from "@/lib/microcms";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";

/**
 * トップページ
 * ヒーローセクション + 最新ブログ記事を表示
 */
export default async function Home() {
  // 最新6件のブログ記事を取得
  const { contents: recentBlogs } = await getBlogs({
    limit: 6,
  });

  return (
    <div className="w-full">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">WIN×Ⅱ</h1>
          <p className="text-xl mb-8">
            会員制アフィリエイトブログプラットフォーム
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            お得な案件情報をチェックして、キャッシュバックを受け取ろう。
            <br />
            会員登録で、成果承認時に報酬の20%をキャッシュバック。
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              <Link href="/blog">ブログを読む</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600"
            >
              <Link href="/register">新規会員登録</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 最新記事セクション */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">最新記事</h2>
            <p className="text-gray-600">お得な案件情報や攻略法をチェック</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/blog">すべて見る</Link>
          </Button>
        </div>

        {recentBlogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">まだブログ記事がありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>

      {/* CTA セクション */}
      <section className="bg-gray-50 py-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            今すぐ会員登録して、キャッシュバックを受け取ろう
          </h2>
          <p className="text-gray-600 mb-8">
            登録は無料。成果承認時に報酬の20%をキャッシュバックいたします。
          </p>
          <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
            <Link href="/register">無料で会員登録</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
