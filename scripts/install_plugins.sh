#!/usr/bin/env bash
# Стейджит плагины из config/plugins.json в moodle/staged/<path> (зеркало дерева Moodle),
# затем накладывает наши кастом-плагины. Dockerfile копирует moodle/staged/ поверх ядра.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$ROOT/config/plugins.json"
STAGE="$ROOT/moodle/staged"

command -v python3 >/dev/null || { echo "Нужен python3"; exit 1; }

echo "==> Очистка стейджинга"
rm -rf "$STAGE"; mkdir -p "$STAGE"

echo "==> Сторонние плагины из манифеста"
python3 -c '
import json,sys
d=json.load(open(sys.argv[1]))
for p in d["plugins"]:
    print("\t".join([p["name"],p["path"],p["git"],p["branch"]]))
' "$MANIFEST" | while IFS=$'\t' read -r name path git branch; do
  dest="$STAGE/$path"
  echo "  - $name -> $path ($branch)"
  mkdir -p "$(dirname "$dest")"
  git clone --depth 1 --branch "$branch" "$git" "$dest" >/dev/null 2>&1 \
    || { echo "    ! не удалось склонировать $name ($branch)"; continue; }
  rm -rf "$dest/.git"
done

echo "==> Наши кастом-плагины и темы (весь moodle/plugins/ с сохранением структуры)"
rsync -a --exclude '.git' "$ROOT/moodle/plugins/." "$STAGE/"

echo "==> Готово. Застейджено в: $STAGE"
find "$STAGE" -maxdepth 2 -type d | sed "s#$STAGE#  staged#"
