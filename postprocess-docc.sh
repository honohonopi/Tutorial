#!/bin/bash

# 1. JSファイルをコピー
cp answer-tracker.js docs/

# 2. 各チュートリアルページに <script> タグを挿入
# ※ index.html を持つ全ディレクトリを検索
find docs/tutorials/tutorial -name "index.html" | while read html; do
  # すでに挿入済みならスキップ
  if grep -q "answer-tracker.js" "$html"; then
    echo "✅ Already added to $html"
    continue
  fi

  # </body> の直前に <script> タグを挿入
  sed -i '' 's#</body>#<script src="/Tutorial/answer-tracker.js"></script>\n</body>#' "$html"
  echo "🔧 Script added to $html"
done
