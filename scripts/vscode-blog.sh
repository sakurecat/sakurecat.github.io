#!/usr/bin/env bash
set -eo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# VS Code may inherit a different Node version from the desktop session.
required_node="$(tr -d '\r\n' < .nvmrc)"
if [[ "$(node --version 2>/dev/null || true)" != "v${required_node}" ]]; then
  nvm_script="${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  if [[ -s "$nvm_script" ]]; then
    source "$nvm_script"
    nvm use
  else
    echo "需要 Node.js ${required_node}。请在终端安装后重新运行任务。" >&2
    exit 1
  fi
fi
export ASTRO_TELEMETRY_DISABLED=1

case "${1:-}" in
  new)
    node scripts/new-post.mjs "${2:-}" "${3:-新的技术笔记}"
    echo "打开文章：$PWD/src/content/blog/${2}.md"
    if [[ "${TERM_PROGRAM:-}" == "vscode" ]] && command -v code >/dev/null; then
      code --reuse-window "$PWD/src/content/blog/${2}.md" || true
    fi
    ;;
  check) npm run check && npm run build && npm run verify ;;
  start) npm run dev -- --background ;;
  stop) npm run dev -- stop ;;
  status) npm run dev -- status ;;
  logs) npm run dev -- logs ;;
  install) npm ci ;;
  *) echo "用法：bash scripts/vscode-blog.sh {new|check|start|stop|status|logs|install}" >&2; exit 2 ;;
esac
