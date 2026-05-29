#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# FMCG Internal Portal — Git Init & Vercel Deployment Script
# ─────────────────────────────────────────────────────────────────────────────
#
# USAGE:
#   1. Set your GitHub remote URL:
#        export GITHUB_REMOTE="https://github.com/your-org/fmcg-portal.git"
#   2. Set your Vercel project name (optional):
#        export VERCEL_PROJECT="fmcg-portal"
#   3. Run: chmod +x deploy.sh && ./deploy.sh
#
# ENVIRONMENT SECRETS:
#   Never commit .env.local — it is already in .gitignore.
#   Set production secrets in Vercel dashboard:
#     https://vercel.com/your-org/fmcg-portal/settings/environment-variables
#
#   Required variables:
#     NEXT_PUBLIC_SUPABASE_URL
#     NEXT_PUBLIC_SUPABASE_ANON_KEY
#     NEXT_PUBLIC_USE_MOCK=false
# ─────────────────────────────────────────────────────────────────────────────

GITHUB_REMOTE="${GITHUB_REMOTE:-}"
BRANCH="${BRANCH:-main}"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   FMCG Portal — Deployment Automation   ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Step 1: Ensure .env.local is gitignored ──────────────────────────────────
if ! grep -qx ".env.local" .gitignore 2>/dev/null; then
  echo ".env.local" >> .gitignore
  echo "✓ Added .env.local to .gitignore"
fi

if ! grep -qx ".env*.local" .gitignore 2>/dev/null; then
  echo ".env*.local" >> .gitignore
fi

# Warn if .env.local has real credentials and git would track it
if git ls-files --error-unmatch .env.local >/dev/null 2>&1; then
  echo "⚠  WARNING: .env.local is tracked by git. Run:"
  echo "   git rm --cached .env.local"
  echo "   and commit before pushing."
  exit 1
fi

# ── Step 2: Git setup ─────────────────────────────────────────────────────────
if [ ! -d .git ]; then
  git init
  echo "✓ Git repository initialized"
fi

git add -A

if git diff --cached --quiet; then
  echo "→ No changes to commit."
else
  git commit -m "feat: initial FMCG Internal Portal implementation"
  echo "✓ Changes committed"
fi

# ── Step 3: Push to GitHub ────────────────────────────────────────────────────
if [ -n "$GITHUB_REMOTE" ]; then
  if ! git remote get-url origin >/dev/null 2>&1; then
    git remote add origin "$GITHUB_REMOTE"
    echo "✓ Remote 'origin' added: $GITHUB_REMOTE"
  fi

  git branch -M "$BRANCH"
  git push -u origin "$BRANCH"
  echo "✓ Pushed to GitHub: $GITHUB_REMOTE ($BRANCH)"
else
  echo "→ Skipping GitHub push. Set GITHUB_REMOTE to enable:"
  echo "  export GITHUB_REMOTE=https://github.com/your-org/fmcg-portal.git"
  echo "  ./deploy.sh"
fi

# ── Step 4: Vercel Deployment ─────────────────────────────────────────────────
echo ""
echo "─── Vercel Deployment ───────────────────────────────────"
if command -v vercel >/dev/null 2>&1; then
  echo "→ Deploying to Vercel..."
  vercel --prod --yes
  echo "✓ Vercel deployment complete"
else
  echo "→ Vercel CLI not found. Install it and deploy manually:"
  echo "   npm install -g vercel"
  echo "   vercel --prod"
  echo ""
  echo "  Or connect via Vercel Dashboard:"
  echo "   1. Go to https://vercel.com/new"
  echo "   2. Import your GitHub repository"
  echo "   3. Add environment variables:"
  echo "      NEXT_PUBLIC_SUPABASE_URL=<your-url>"
  echo "      NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>"
  echo "      NEXT_PUBLIC_USE_MOCK=false"
  echo "   4. Deploy — Vercel auto-detects Next.js and builds with 'next build'"
fi

echo ""
echo "═══════════════════════════════════════════"
echo "  Deployment script complete."
echo "═══════════════════════════════════════════"
