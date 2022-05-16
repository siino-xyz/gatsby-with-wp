# このタスクのゴール

Gatsby×WordPress で、シンプルなブログサイトを構築する。

- 404ページ
- ページネート可能な記事一覧ページ
- 記事ページ

上記 3 ページの実装完了をゴールとする。

## 概要

- Gatsby×WordPress で簡単なブログサイトのデモを作成する
- 今回は、カテゴリ・タグなどの絞り込み実装は行わない
- スタイリングも行わない
- 作るページ
  - 動的ページ
    - 記事一覧ページ
      - 前のページ/次のページ実装
      - 10 記事ごとにページを切る
    - 記事ページ
      - 前の記事/次の記事を実装
      - GatsbyImage を用いた画像の出力・最適化
- 作業の要点
  - 動的ページの生成が作業の要点
    - Gatsby.js の場合は、gatsby-node.js というファイルに、動的ページ生成の処理を書いていくことになる。
    - gatsby-node.js では、非同期で GraphQL クエリを取得し、ページを生成している

## MEMO

- gatsby-node.js は何をやっているのか？
  - createPages API を用いて、動的なページを生成している（詳しくは以下参照）
    [Sourcing from WordPress](https://www.gatsbyjs.com/docs/how-to/sourcing-data/sourcing-from-wordpress/#using-wordpress-data)
