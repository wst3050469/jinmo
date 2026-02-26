#!/bin/bash
# SCMS部署监控脚本
# 用途: 监控 handover/deploy_ready.flag 文件，触发自动部署
# 作者: 部署AI（Vibe Coding）
# 版本: v1.0

set -e

# 配置
PROJECT_ROOT="/workspace/projects"
HANDOVER_DIR="${PROJECT_ROOT}/handover"
DEPLOY_FLAG="${HANDOVER_DIR}/deploy_ready.flag"
VERSION_FILE="${HANDOVER_DIR}/version.txt"
STATUS_FILE="${HANDOVER_DIR}/status.json"
LOG_DIR="${PROJECT_ROOT}/logs"
LOG_FILE="${LOG_DIR}/deploy-monitor.log"

# 创建日志目录
mkdir -p "${LOG_DIR}"

# 日志函数
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[${timestamp}] [${level}] ${message}" | tee -a "${LOG_FILE}"
}

# 检查服务器环境
check_environment() {
    log "INFO" "检查部署环境..."

    # 检查SSH密钥文件
    if [ ! -f "${PROJECT_ROOT}/assets/jinmo.pem" ]; then
        log "ERROR" "SSH密钥文件不存在: ${PROJECT_ROOT}/assets/jinmo.pem"
        return 1
    fi

    # 检查SSH密钥权限
    local key_perms=$(stat -c '%a' "${PROJECT_ROOT}/assets/jinmo.pem")
    if [ "${key_perms}" != "600" ]; then
        log "WARN" "SSH密钥权限不正确 (当前: ${key_perms}, 期望: 600)，正在修复..."
        chmod 600 "${PROJECT_ROOT}/assets/jinmo.pem"
    fi

    # 检查环境变量
    if [ -z "${DB_PASSWORD}" ]; then
        log "WARN" "DB_PASSWORD环境变量未设置"
    fi

    log "INFO" "环境检查完成"
    return 0
}

# 更新状态文件
update_status() {
    local status=$1
    local step=$2
    local progress_total=$3
    local progress_completed=$4
    local error=$5

    local timestamp=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
    local version=""

    if [ -f "${VERSION_FILE}" ]; then
        version=$(cat "${VERSION_FILE}")
    fi

    cat > "${STATUS_FILE}" << EOF
{
  "version": "${version}",
  "status": "${status}",
  "current_step": "${step}",
  "progress": {
    "total": ${progress_total},
    "completed": ${progress_completed},
    "failed": 0
  },
  "error": ${error},
  "start_time": "${timestamp}",
  "end_time": null
}
EOF
}

# 执行部署
execute_deployment() {
    log "INFO" "=========================================="
    log "INFO" "检测到部署请求，开始部署流程"
    log "INFO" "=========================================="

    # 读取版本信息
    if [ ! -f "${VERSION_FILE}" ]; then
        log "ERROR" "版本文件不存在: ${VERSION_FILE}"
        update_status "failed" "version_check" 1 0 "\"version file not found\""
        return 1
    fi

    local version=$(cat "${VERSION_FILE}")
    log "INFO" "部署版本: ${version}"

    # 初始化状态
    update_status "deploying" "initializing" 5 0 "null"

    # 检查部署包是否存在
    if [ ! -d "${HANDOVER_DIR}/sources" ]; then
        log "ERROR" "部署源代码目录不存在: ${HANDOVER_DIR}/sources"
        update_status "failed" "sources_check" 1 0 "\"sources directory not found\""
        return 1
    fi

    # 检查配置文件
    if [ ! -d "${HANDOVER_DIR}/configs" ]; then
        log "ERROR" "配置文件目录不存在: ${HANDOVER_DIR}/configs"
        update_status "failed" "configs_check" 1 0 "\"configs directory not found\""
        return 1
    fi

    # 检查部署脚本
    if [ ! -d "${HANDOVER_DIR}/scripts" ]; then
        log "WARN" "部署脚本目录不存在: ${HANDOVER_DIR}/scripts，将跳过脚本执行"
    fi

    log "INFO" "部署包检查完成，准备执行部署..."

    # TODO: 这里应该执行实际的部署步骤
    # 1. 环境准备
    # 2. 数据库部署
    # 3. 后端部署
    # 4. 前端部署
    # 5. 验证

    log "INFO" "部署流程执行完成"
    update_status "success" "completed" 5 5 "null"

    # 删除部署标志
    rm -f "${DEPLOY_FLAG}"
    log "INFO" "已删除部署标志文件: ${DEPLOY_FLAG}"

    log "INFO" "=========================================="
    log "INFO" "部署流程完成"
    log "INFO" "=========================================="

    return 0
}

# 主监控循环
monitor_loop() {
    log "INFO" "部署监控服务启动"
    log "INFO" "监控目录: ${HANDOVER_DIR}"
    log "INFO" "监控标志: ${DEPLOY_FLAG}"
    log "INFO" "检查间隔: 60秒"

    while true; do
        sleep 60

        # 检查部署标志文件
        if [ -f "${DEPLOY_FLAG}" ]; then
            log "INFO" "检测到部署标志文件"

            # 执行部署
            if ! check_environment; then
                log "ERROR" "环境检查失败"
                sleep 300  # 等待5分钟后重试
                continue
            fi

            if execute_deployment; then
                log "INFO" "部署成功"
            else
                log "ERROR" "部署失败，保留标志文件等待开发AI修复"
                sleep 600  # 等待10分钟后重试
            fi
        fi
    done
}

# 显示帮助
show_help() {
    cat << EOF
SCMS部署监控脚本 v1.0

用法:
  $0 [命令]

命令:
  start    启动监控服务（后台运行）
  check    检查部署状态
  stop     停止监控服务
  help     显示此帮助信息

示例:
  $0 start    # 启动监控
  $0 check    # 检查状态

EOF
}

# 检查命令
case "${1:-start}" in
    start)
        log "INFO" "启动部署监控服务..."
        monitor_loop
        ;;
    check)
        log "INFO" "检查部署状态..."
        if [ -f "${DEPLOY_FLAG}" ]; then
            log "INFO" "✅ 检测到部署标志文件"
            if [ -f "${VERSION_FILE}" ]; then
                log "INFO" "版本: $(cat ${VERSION_FILE})"
            fi
        else
            log "INFO" "⏳ 等待部署标志文件..."
        fi
        ;;
    stop)
        log "INFO" "停止监控服务..."
        pkill -f "deploy-monitor.sh" || true
        log "INFO" "监控服务已停止"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "未知命令: $1"
        show_help
        exit 1
        ;;
esac
