#!/bin/bash
# 推送到 GitHub 并启用 GitHub Pages

echo "🚀 准备推送到 GitHub..."
echo ""

# 检查远程仓库
if ! git remote | grep -q origin; then
    echo "添加远程仓库..."
    git remote add origin https://github.com/conanxin/digital-garden.git
fi

echo "推送代码到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "下一步：启用 GitHub Pages"
    echo ""
    echo "1. 访问 https://github.com/conanxin/digital-garden/settings/pages"
    echo ""
    echo "2. 选择 'GitHub Actions' 作为 Source"
    echo ""
    echo "3. 等待几分钟，访问："
    echo "   https://conanxin.github.io/digital-garden"
    echo ""
    echo "🎉 你的数字花园即将上线！"
else
    echo "❌ 推送失败，请检查："
    echo "   - GitHub 仓库是否已创建"
    echo "   - 是否有推送权限"
    echo "   - 网络连接"
fi
