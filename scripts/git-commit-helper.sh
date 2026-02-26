#!/bin/bash

# Git提交助手脚本
# 用途：帮助开发AI（扣子）快速提交代码到Git仓库
# 使用：bash scripts/git-commit-helper.sh

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 打印函数
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 检查是否在Git仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "当前目录不是Git仓库"
    exit 1
fi

print_info "================================"
print_info "Git提交助手"
print_info "================================"
echo ""

# 1. 检查远程仓库
print_info "1. 检查远程仓库..."
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "未配置")
if [ "$REMOTE_URL" = "未配置" ]; then
    print_error "未配置远程仓库"
    print_info "请先运行: git remote add origin <仓库地址>"
    exit 1
fi
print_success "远程仓库: $REMOTE_URL"
echo ""

# 2. 查看修改的文件
print_info "2. 查看修改的文件..."
CHANGED_FILES=$(git status --short)
if [ -z "$CHANGED_FILES" ]; then
    print_warning "没有修改的文件，无需提交"
    exit 0
fi
echo "$CHANGED_FILES"
echo ""

# 3. 输入提交信息
print_info "3. 输入提交信息..."
if [ $# -eq 0 ]; then
    echo "提交信息格式建议："
    echo "  feat: 新增功能描述"
    echo "  fix: 修复问题描述"
    echo "  docs: 文档更新说明"
    echo "  style: 代码格式调整"
    echo "  refactor: 代码重构说明"
    echo "  test: 测试相关修改"
    echo "  chore: 构建/工具相关"
    echo ""
    read -p "请输入提交信息: " COMMIT_MSG
else
    COMMIT_MSG="$*"
fi

if [ -z "$COMMIT_MSG" ]; then
    print_error "提交信息不能为空"
    exit 1
fi
echo ""

# 4. 添加文件
print_info "4. 添加文件到暂存区..."
git add .
print_success "文件添加完成"
echo ""

# 5. 查看暂存的修改
print_info "5. 查看暂存的修改（摘要）..."
git diff --stat --cached
echo ""

# 6. 提交代码
print_info "6. 提交代码..."
BEFORE_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "无")
git commit -m "$COMMIT_MSG"
AFTER_COMMIT=$(git rev-parse --short HEAD)
print_success "代码提交成功: $BEFORE_COMMIT -> $AFTER_COMMIT"
echo ""

# 7. 推送到远程仓库
print_info "7. 推送到远程仓库..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push origin $CURRENT_BRANCH
print_success "代码推送成功"
echo ""

# 8. 输出提交详情
print_info "================================"
print_info "提交详情"
print_info "================================"
echo "提交时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "提交信息: $COMMIT_MSG"
echo "提交哈希: $AFTER_COMMIT"
echo "远程仓库: $REMOTE_URL"
echo "分支: $CURRENT_BRANCH"
echo ""

# 9. 生成提交报告
cat > git-commit-report.txt << EOF
================================
Git提交报告
================================
提交时间: $(date '+%Y-%m-%d %H:%M:%S')
提交信息: $COMMIT_MSG
提交哈希: $AFTER_COMMIT
远程仓库: $REMOTE_URL
分支: $CURRENT_BRANCH

================================
修改文件
================================
$(git diff --stat HEAD~1 HEAD)

================================
================================
EOF

print_success "提交报告已生成: git-commit-report.txt"
echo ""

# 10. 创建版本标签（可选）
print_info "10. 是否创建版本标签？"
echo "版本号格式: v主版本号.次版本号.修订号"
echo "示例: v1.0.0, v1.0.1, v1.1.0, v2.0.0"
read -p "请输入版本号（留空跳过）: " VERSION_TAG

if [ -n "$VERSION_TAG" ]; then
    print_info "创建版本标签: $VERSION_TAG"
    git tag -a "$VERSION_TAG" -m "版本 $VERSION_TAG: $COMMIT_MSG"
    git push origin "$VERSION_TAG"
    print_success "版本标签创建成功: $VERSION_TAG"
    echo ""

    # 更新提交报告
    cat >> git-commit-report.txt << EOF
版本标签: $VERSION_TAG
EOF
fi
echo ""

# 11. 生成部署通知
print_info "================================"
print_info "部署通知（请复制此信息发送给部署AI）"
print_info "================================"
cat > deploy-notify.txt << EOF
【部署请求】
================================
项目: SCMS施工综合管理系统
仓库: $REMOTE_URL
分支: $CURRENT_BRANCH
提交: $AFTER_COMMIT
版本: ${VERSION_TAG:-无标签}
提交信息: $COMMIT_MSG
提交时间: $(date '+%Y-%m-%d %H:%M:%S')
================================
请部署AI执行以下操作：
1. 下载最新代码: git pull origin $CURRENT_BRANCH
2. 验证代码: git log -1
3. 部署到服务器: bash scripts/deploy-backend.sh && bash scripts/deploy-frontend.sh
4. 验证结果: 检查服务状态
5. 通知开发AI: 部署结果
================================
EOF

cat deploy-notify.txt
echo ""

print_success "部署通知已生成: deploy-notify.txt"
echo ""

print_info "================================"
print_success "✅ Git提交流程完成！"
print_info "================================"
echo ""
print_info "下一步："
echo "1. 查看 deploy-notify.txt"
echo "2. 将部署通知发送给部署AI"
echo "3. 等待部署AI完成部署"
echo "4. 接收部署结果反馈"
echo ""
