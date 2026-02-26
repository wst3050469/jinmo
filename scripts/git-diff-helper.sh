#!/bin/bash

# Git版本对比工具
# 用途：对比两个Git版本之间的差异
# 使用：bash scripts/git-diff-helper.sh <版本1> <版本2>

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

# 检查参数
if [ $# -lt 1 ]; then
    print_error "参数不足"
    echo "用法: $0 <版本1> [版本2]"
    echo ""
    echo "示例："
    echo "  对比两个版本: $0 v1.0.0 v1.0.1"
    echo "  对比当前版本与标签: $0 HEAD v1.0.1"
    echo "  列出所有版本: $0 --list"
    exit 1
fi

# 检查是否在Git仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "当前目录不是Git仓库"
    exit 1
fi

# 特殊命令：列出所有版本
if [ "$1" = "--list" ]; then
    print_info "================================"
    print_info "Git版本列表"
    print_info "================================"
    echo ""
    print_info "最近的提交："
    git log -10 --oneline
    echo ""
    print_info "版本标签："
    git tag -l --sort=-version:refname | head -20
    echo ""
    exit 0
fi

VERSION1=$1
VERSION2=${2:-"HEAD"}

# 检查版本是否存在
if ! git rev-parse $VERSION1 >/dev/null 2>&1; then
    print_error "版本不存在: $VERSION1"
    print_info "可用版本："
    git log -5 --oneline
    exit 1
fi

if ! git rev-parse $VERSION2 >/dev/null 2>&1; then
    print_error "版本不存在: $VERSION2"
    print_info "可用版本："
    git log -5 --oneline
    exit 1
fi

print_info "================================"
print_info "Git版本对比工具"
print_info "================================"
echo ""
print_info "版本1: $VERSION1"
print_info "版本2: $VERSION2"
echo ""

# 1. 显示版本1信息
print_info "1. 版本 $VERSION1 信息："
echo "--------------------------------"
git show $VERSION1 --no-patch --pretty=format:"提交哈希: %H
简短哈希: %h
提交信息: %s
提交作者: %an
提交时间: %ad
分支标签: %d"
echo ""

# 2. 显示版本2信息
print_info "2. 版本 $VERSION2 信息："
echo "--------------------------------"
git show $VERSION2 --no-patch --pretty=format:"提交哈希: %H
简短哈希: %h
提交信息: %s
提交作者: %an
提交时间: %ad
分支标签: %d"
echo ""

# 3. 显示文件变更统计
print_info "3. 文件变更统计："
echo "--------------------------------"
git diff --stat $VERSION1 $VERSION2
echo ""

# 4. 显示提交历史
print_info "4. 提交历史："
echo "--------------------------------"
git log $VERSION1..$VERSION2 --oneline
echo ""

# 5. 按类别统计变更
print_info "5. 变更分类统计："
echo "--------------------------------"

# 统计新增文件
ADDED_FILES=$(git diff $VERSION1 $VERSION2 --name-status | grep "^A" | wc -l)
# 统计修改文件
MODIFIED_FILES=$(git diff $VERSION1 $VERSION2 --name-status | grep "^M" | wc -l)
# 统计删除文件
DELETED_FILES=$(git diff $VERSION1 $VERSION2 --name-status | grep "^D" | wc -l)

echo "新增文件: $ADDED_FILES"
echo "修改文件: $MODIFIED_FILES"
echo "删除文件: $DELETED_FILES"
echo ""

# 6. 显示按类型统计的变更
print_info "6. 按文件类型统计："
echo "--------------------------------"
git diff $VERSION1 $VERSION2 --name-only | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -10
echo ""

# 7. 显示详细的文件变更
print_info "7. 详细文件变更："
echo "--------------------------------"
git diff --name-status $VERSION1 $VERSION2
echo ""

# 8. 询问是否查看详细代码差异
read -p "是否查看详细代码差异？(y/n): " SHOW_DIFF
if [ "$SHOW_DIFF" = "y" ] || [ "$SHOW_DIFF" = "Y" ]; then
    print_info "8. 详细代码差异："
    echo "--------------------------------"

    # 按文件显示差异
    FILES=$(git diff --name-only $VERSION1 $VERSION2)
    for FILE in $FILES; do
        echo ""
        print_info "文件: $FILE"
        echo "--------------------------------"
        git diff $VERSION1 $VERSION2 -- "$FILE" | head -100
        if [ $(git diff $VERSION1 $VERSION2 -- "$FILE" | wc -l) -gt 100 ]; then
            echo "..."
            print_warning "（输出被截断，完整差异请使用: git diff $VERSION1 $VERSION2 -- '$FILE'）"
        fi
    done
fi

echo ""

# 9. 生成对比报告
print_info "9. 生成对比报告..."
REPORT_FILE="git-diff-report-$(date +%Y%m%d-%H%M%S).txt"

cat > $REPORT_FILE << EOF
================================
Git版本对比报告
================================
生成时间: $(date '+%Y-%m-%d %H:%M:%S')
版本1: $VERSION1
版本2: $VERSION2

================================
版本1信息
================================
$(git show $VERSION1 --no-patch --pretty=format:"提交哈希: %H
简短哈希: %h
提交信息: %s
提交作者: %an
提交时间: %ad")

================================
版本2信息
================================
$(git show $VERSION2 --no-patch --pretty=format:"提交哈希: %H
简短哈希: %h
提交信息: %s
提交作者: %an
提交时间: %ad")

================================
变更统计
================================
新增文件: $ADDED_FILES
修改文件: $MODIFIED_FILES
删除文件: $DELETED_FILES

================================
文件变更列表
================================
$(git diff --name-status $VERSION1 $VERSION2)

================================
详细差异
================================
$(git diff $VERSION1 $VERSION2)

================================
================================
EOF

print_success "对比报告已生成: $REPORT_FILE"
echo ""

# 10. 显示总结
print_info "================================"
print_success "✅ 版本对比完成！"
print_info "================================"
echo ""
print_info "总结："
echo "  版本1: $VERSION1"
echo "  版本2: $VERSION2"
echo "  新增文件: $ADDED_FILES"
echo "  修改文件: $MODIFIED_FILES"
echo "  删除文件: $DELETED_FILES"
echo ""
print_info "其他命令："
echo "  查看所有版本: $0 --list"
echo "  查看完整差异: git diff $VERSION1 $VERSION2"
echo "  查看特定文件差异: git diff $VERSION1 $VERSION2 -- <文件名>"
echo ""
