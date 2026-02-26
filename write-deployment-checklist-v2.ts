import { KnowledgeClient, Config, KnowledgeDocument, DataSourceType } from 'coze-coding-dev-sdk';

// 配置
const config = new Config();
const client = new KnowledgeClient(config);
const DATASET_NAME = 'yongyi_system_docs';

// 文档内容（用户提供的简洁版本）
const documentContent = `
# SCMS部署文件清单

## 核心配置文件
1. memory/spec.txt - 项目规划、部署经验与执行策略
2. outputs/部署/SCMS部署完整指南.md - 完整部署手册
3. outputs/部署/CSS与路由修复报告.md - CSS加载错误修复方案
4. outputs/部署/前端CSS与路由修复报告.md - Vue路由404问题解决方案
5. outputs/部署/SSH连接立即测试报告.md - 服务器连接测试结果

## 数据库脚本
1. outputs/数据库/SCMS完整数据库DDL.sql - 全系统表结构脚本
2. outputs/详细设计/客户管理/数据库DDL脚本.sql - 客户模块DDL
3. outputs/详细设计/项目管理/数据库DDL脚本.sql - 项目模块DDL
4. outputs/详细设计/合同管理/数据库DDL脚本.sql - 合同模块DDL
5. outputs/详细设计/施工管理/数据库DDL脚本.sql - 施工模块DDL
6. outputs/详细设计/采购管理/数据库DDL脚本.sql - 采购模块DDL
7. outputs/详细设计/营销推广/数据库DDL脚本.sql - 营销模块DDL
8. outputs/详细设计/样板设计/数据库DDL脚本.sql - 样板模块DDL
9. outputs/详细设计/产品研发/数据库DDL脚本.sql - 产品研发模块DDL
10. outputs/详细设计/项目预算/数据库DDL脚本.sql - 预算模块DDL
11. outputs/详细设计/文章/数据库DDL脚本.sql - 文章模块DDL

## 前端源代码
1. src/scms-frontend/ - 完整Vue 3前端项目
   - package.json - 依赖定义
   - src/ - 源代码目录
   - public/ - 静态资源
   - dist/ - 构建产物（需构建后生成）

## 后端源代码
1. src/scms-backend/ - 完整Spring Boot后端项目
   - pom.xml - Maven依赖
   - src/main/java/ - Java源代码
   - src/main/resources/ - 配置文件
   - target/ - 编译产物（需编译后生成）

## 部署脚本示例
1. scripts/ - 自动化部署脚本目录
   - deploy.sh - 主部署脚本（示例）
   - setup_nginx.sh - Nginx配置脚本
   - init_database.sh - 数据库初始化脚本

## 微信集成文件
1. 微信小程序配置文件（RSA私钥已嵌入）
2. 微信公众号配置参数（在spec.txt中已定义）

## 环境变量模板
1. .env.example - 环境变量配置模板

## 验证脚本
1. scripts/verify_deployment.sh - 部署验证脚本

## 打包命令
\`\`\`bash
# 创建部署包
tar -czf scms-deployment-$(date +%Y%m%d).tar.gz \\
  memory/spec.txt \\
  outputs/部署/ \\
  outputs/数据库/ \\
  outputs/详细设计/ \\
  src/scms-frontend/ \\
  src/scms-backend/ \\
  scripts/ \\
  --exclude="*/node_modules" \\
  --exclude="*/target" \\
  --exclude="*/dist" \\
  --exclude="*/temp"
\`\`\`

## 文件结构总览
\`\`\`
scms-deployment/
├── memory/
│   └── spec.txt
├── outputs/
│   ├── 部署/
│   │   ├── SCMS部署完整指南.md
│   │   ├── CSS与路由修复报告.md
│   │   ├── 前端CSS与路由修复报告.md
│   │   └── SSH连接立即测试报告.md
│   ├── 数据库/
│   │   └── SCMS完整数据库DDL.sql
│   └── 详细设计/
│       ├── 客户管理/
│       ├── 项目管理/
│       ├── 合同管理/
│       ├── 施工管理/
│       ├── 采购管理/
│       ├── 营销推广/
│       ├── 样板设计/
│       ├── 产品研发/
│       ├── 项目预算/
│       └── 文章/
├── src/
│   ├── scms-frontend/
│   └── scms-backend/
└── scripts/
    ├── deploy.sh
    ├── setup_nginx.sh
    ├── init_database.sh
    └── verify_deployment.sh
\`\`\`

## 部署优先级
1. 基础环境 - 操作系统、软件包、网络配置
2. 数据库 - PostgreSQL RDS连接、表结构初始化
3. 后端服务 - Spring Boot应用部署与启动
4. 前端服务 - Vue构建、Nginx配置、HTTPS证书
5. 微信集成 - 小程序与公众号回调配置
6. 验证测试 - 核心功能验证、性能检查

## 注意事项
• 服务器密码：liu201314!@#
• SSH密钥：jinmo.pem（已上传）
• 数据库密码：WsT13575967132（来自环境变量）
• 维护窗口：每日02:00-06:00（Asia/Shanghai）
• 所有配置已针对PostgreSQL优化，无需MySQL组件
• 域名已指向：www.jinmojianshe.com

---

**文档版本：** v1.0
**创建日期：** 2026-02-26
**文档维护：** 开发AI（扣子/PMO Agent）
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
  console.log('\n✨ SCMS部署文件清单已成功写入知识库！');
}).catch((error) => {
  console.error('\n❌ 写入失败:', error);
  process.exit(1);
});
