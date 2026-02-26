import { KnowledgeClient, Config, KnowledgeDocument, DataSourceType } from 'coze-coding-dev-sdk';

// 配置
const config = new Config();
const client = new KnowledgeClient(config);
const DATASET_NAME = 'yongyi_system_docs';

// 文档内容
const documentContent = `
# SCMS协同开发：数据共享与触发部署方案

## 1. 概述
本文档定义开发AI（扣子）与部署AI之间的数据共享协议、验收文件格式及触发部署机制，确保开发成果能平滑交接并自动化部署到生产环境。

## 2. 角色定义
- **开发AI（扣子）**: 负责代码开发、打包、配置准备和交接目录创建
- **部署AI**: 负责环境准备、服务部署、验证执行和回滚处理

## 3. 数据共享架构

### 3.1 共享目录结构
\`\`\`
handover/                          # 交接根目录（开发AI创建，部署AI读取）
├── deploy_ready.flag              # 部署就绪标志文件（空文件，存在即表示可部署）
├── README.md                      # 本次交接说明
├── version.txt                    # 版本信息（格式：YYYYMMDD-HHMM）
├── sources/                       # 源代码包
│   ├── scms-backend-{version}.tar.gz    # 后端Spring Boot应用
│   ├── scms-frontend-{version}.tar.gz   # 前端Vue应用
│   └── wechat-integration-{version}.tar.gz # 微信集成模块
├── configs/                       # 配置文件
│   ├── application-prod.yml       # 生产环境Spring Boot配置
│   ├── nginx-scms.conf           # Nginx站点配置
│   ├── wechat-config.json        # 微信小程序/公众号配置
│   ├── oss-config.json           # 阿里云OSS配置
│   └── database-init.sql         # 数据库初始化脚本（可选）
├── scripts/                       # 部署脚本
│   ├── deploy-backend.sh         # 后端部署脚本
│   ├── deploy-frontend.sh        # 前端部署脚本
│   ├── deploy-wechat.sh          # 微信集成部署脚本
│   ├── verify-deployment.sh      # 部署后验证脚本
│   └── rollback.sh               # 回滚脚本（紧急恢复）
├── docs/                          # 部署文档
│   └── deployment-checklist.md   # 部署检查清单
└── artifacts/                     # 构建产物（可选，用于快速部署）
    ├── scms-backend-{version}.jar
    └── scms-frontend-dist.tar.gz
\`\`\`

### 3.2 文件交接规范

**开发AI职责（交接前）：**
1. 代码完整性验证：确保所有模块编译通过，无语法错误
2. 配置分离：将生产环境配置提取到 configs/ 目录，与开发配置隔离
3. 依赖声明：在 handover/README.md 中明确：
   - 操作系统要求（Ubuntu 24.04 LTS）
   - 软件版本要求（Java 17, Node.js 18+, PostgreSQL 15+）
   - 网络要求（RDS白名单、OSS内网端点）
4. 验证脚本：提供 scripts/verify-deployment.sh，包含核心功能验证命令

**部署AI职责（交接后）：**
1. 环境准备：按 handover/README.md 要求配置服务器环境
2. 配置注入：将 configs/ 文件复制到对应服务目录
3. 服务部署：按顺序执行 scripts/deploy-*.sh 脚本
4. 验证执行：运行 scripts/verify-deployment.sh 确认部署成功
5. 清理标志：部署完成后删除 handover/deploy_ready.flag

## 4. 触发部署机制

### 4.1 标志文件触发（推荐）
开发AI完成模块开发并准备交接时，执行以下步骤：

\`\`\`bash
# 1. 创建交接目录
mkdir -p handover/{sources,configs,scripts,docs,artifacts}

# 2. 生成版本信息
echo "20260226-0951" > handover/version.txt

# 3. 创建部署就绪标志
touch handover/deploy_ready.flag

# 4. 复制部署相关文件到对应目录
# （具体复制逻辑由开发AI实现）
\`\`\`

**部署AI监控逻辑：**
- 定期扫描 handover/deploy_ready.flag 文件
- 文件存在 → 开始部署流程
- 部署成功后删除标志文件
- 部署失败则生成 handover/deploy_failed.log 并保留标志

### 4.2 手动触发（备用）
若标志文件机制不可用，部署AI可通过以下方式触发：
1. 文件系统监听：监控 handover/ 目录下 version.txt 的创建时间
2. API调用：开发AI调用部署AI的Webhook接口（需额外实现）
3. 消息队列：通过Redis/Kafka发布部署消息（需额外搭建）

## 5. 验收文件格式

### 5.1 部署包结构（sources/）
scms-backend-{version}.tar.gz 内容：
\`\`\`
├── pom.xml                      # Maven父POM
├── scms-common/                 # 通用模块
├── scms-system/                 # 系统管理模块
├── scms-customer/               # 客户管理模块
├── scms-project/                # 项目管理模块
├── scms-contract/               # 合同管理模块
├── scms-construction/           # 施工管理模块
├── scms-purchase/               # 采购管理模块
├── scms-marketing/              # 营销推广模块（待开发）
├── scms-template/               # 样板设计模块（待开发）
├── scms-product/                # 产品研发模块（待开发）
├── scms-budget/                 # 项目预算模块（待开发）
├── scms-article/                # 文章模块（待开发）
└── docker/                      # Docker相关文件
\`\`\`

### 5.2 配置模板（configs/）
- application-prod.yml：必须包含占位符 {{DB_PASSWORD}}、{{OSS_KEY}} 等
- nginx-scms.conf：域名使用 {{DOMAIN}} 变量，SSL证书路径使用变量
- 所有敏感信息通过环境变量注入，禁止硬编码

### 5.3 部署脚本（scripts/）
每个脚本必须包含：
1. 头部检查：检查必要环境变量、权限、依赖
2. 错误处理：每一步失败时明确退出码和错误信息
3. 日志输出：关键步骤输出时间戳和状态
4. 幂等设计：支持重复执行，不会造成系统不一致

**示例：deploy-backend.sh**
\`\`\`bash
#!/bin/bash
set -e

echo "[\$(date)] 开始部署SCMS后端..."

# 1. 环境检查
if [ -z "\$DB_PASSWORD" ]; then
    echo "错误：DB_PASSWORD环境变量未设置"
    exit 1
fi

# 2. 解压源代码
tar -xzf ../sources/scms-backend-*.tar.gz -C /tmp/

# 3. 编译打包
cd /tmp/scms-backend-*
mvn clean package -DskipTests -Pprod

# 4. 停止旧服务
systemctl stop scms-backend.service || true

# 5. 复制新JAR
cp target/scms-backend-*.jar /opt/scms/

# 6. 启动服务
systemctl start scms-backend.service

echo "[\$(date)] 后端部署完成"
\`\`\`

## 6. 验证协议

### 6.1 部署前验证（开发AI负责）
1. 编译验证：mvn clean compile 通过
2. 单元测试：关键模块单元测试通过率 >80%
3. 配置验证：生产配置文件无语法错误
4. 依赖检查：所有第三方依赖版本已锁定

### 6.2 部署后验证（部署AI负责）
运行 verify-deployment.sh 检查：

\`\`\`bash
#!/bin/bash
# 验证清单
curl -f http://localhost:8080/api/health           # 健康检查
curl -f http://localhost:8080/api/customers        # 客户API
curl -f http://localhost:8080/api/projects         # 项目API
curl -f http://localhost:8080/api/contracts        # 合同API
nginx -t                                          # Nginx配置语法
systemctl is-active nginx                         # Nginx服务状态
systemctl is-active scms-backend.service          # 后端服务状态
\`\`\`

### 6.3 验收标准
- 所有核心API返回200状态码
- Nginx配置语法正确
- 所有系统服务处于active状态
- 日志无严重错误（ERROR级别）

## 7. 异常处理与回滚

### 7.1 部署失败处理
1. 日志记录：错误信息写入 handover/deploy_failed.log
2. 状态保持：保留 deploy_ready.flag 文件
3. 通知机制：通过文件系统标记或消息通知开发AI

### 7.2 回滚流程
1. 自动回滚：scripts/rollback.sh 支持回滚到上一个可用版本
2. 手动干预：部署AI可手动执行回滚或联系开发AI修复

## 8. 通信协议（可选扩展）

### 8.1 实时状态同步
如需实时通信，可扩展以下机制：
1. WebSocket：开发AI与部署AI建立双向通信
2. 共享状态文件：handover/status.json 记录当前部署状态
3. 消息队列：通过Redis Pub/Sub发布部署事件

### 8.2 事件定义
\`\`\`json
{
  "event": "deploy_ready",
  "version": "20260226-0951",
  "modules": ["marketing", "template"],
  "timestamp": "2026-02-26T09:51:40Z"
}
\`\`\`

## 9. 实施时间线

### 9.1 立即实施（当前阶段）
- [x] 创建本共享方案文档
- [ ] 在 memory/spec.txt 中固化协同协议
- [ ] 创建初始交接目录结构

### 9.2 短期实施（1-2天内）
- [ ] 开发AI：实现自动化打包脚本
- [ ] 部署AI：配置标志文件监听逻辑
- [ ] 双方：执行首次模拟交接测试

### 9.3 长期优化（1-2周内）
- [ ] 引入版本管理（Git Tag与部署包关联）
- [ ] 实现部署验证自动化报告
- [ ] 扩展多环境支持（测试、预发、生产）

## 10. 附录

### 10.1 文件清单模板
每次交接应在 handover/README.md 中包含：

\`\`\`markdown
# 交接清单 v20260226-0951

## 本次更新模块
- 营销推广模块前端集成（主菜单+ECharts）
- 营销推广模块后端API（部分）

## 部署步骤
1. 执行 \`scripts/deploy-backend.sh\`
2. 执行 \`scripts/deploy-frontend.sh\`
3. 运行 \`scripts/verify-deployment.sh\`

## 环境要求
- Java: 17+
- Node.js: 18+
- PostgreSQL: 15+
- Nginx: 1.24+

## 已知问题
无
\`\`\`

### 10.2 参考文档
- SCMS部署完整指南.md
- SCMS协同开发协议.md
- 部署文件清单.md

## 版本记录
- v1.0 (2026-02-26): 初始版本，定义基础共享方案与触发机制
- 维护：开发AI（扣子）负责更新，部署AI负责执行反馈
`;

async function writeToKnowledgeBase() {
  try {
    console.log('开始写入知识库...');

    // 创建文档
    const document: KnowledgeDocument = {
      source: DataSourceType.TEXT,
      raw_data: documentContent,
    };

    // 写入文档
    const response = await client.addDocuments(
      [document],
      DATASET_NAME
    );

    if (response.code === 0) {
      console.log('✅ 知识库写入成功！');
      console.log('文档ID:', response.doc_ids);
      console.log('数据集:', DATASET_NAME);
    } else {
      console.error('❌ 知识库写入失败:', response.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 写入知识库时出错:', error);
    process.exit(1);
  }
}

// 执行写入
writeToKnowledgeBase().then(() => {
  console.log('\n✨ SCMS数据共享与触发部署方案已成功写入知识库！');
}).catch((error) => {
  console.error('\n❌ 写入失败:', error);
  process.exit(1);
});
