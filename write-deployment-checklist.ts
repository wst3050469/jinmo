import { KnowledgeClient, Config, KnowledgeDocument, DataSourceType } from 'coze-coding-dev-sdk';

// 配置
const config = new Config();
const client = new KnowledgeClient(config);
const DATASET_NAME = 'yongyi_system_docs';

// 文档内容
const documentContent = `
# SCMS部署文件清单

## 文档概述
本文档列出了SCMS系统部署所需的所有文件及其路径，供开发AI和部署AI使用。

## 一、核心配置文件

### 1.1 项目规划文件
**文件路径：** \`memory/spec.txt\`
**内容描述：** 项目规划、技术约束、部署经验
**部署用途：** 理解项目背景与特殊要求
**状态：** 待创建

### 1.2 修复方案文档
**文件路径：** \`outputs/部署/CSS与路由修复报告.md\`
**内容描述：** CSS加载与路由404问题解决方案
**部署用途：** 解决前端访问问题
**状态：** 待创建

**文件路径：** \`outputs/部署/前端CSS与路由修复报告.md\`
**内容描述：** 路由404修复方案
**部署用途：** 前端路由问题修复
**状态：** 待创建

**文件路径：** \`outputs/部署/SSH连接立即测试报告.md\`
**内容描述：** 连接测试结果
**部署用途：** 确认服务器连接状态
**状态：** 已完成

## 二、数据库脚本

### 2.1 完整DDL脚本
**文件路径：** \`outputs/数据库/SCMS完整数据库DDL.sql\`
**内容描述：** 全系统表结构、索引、约束
**部署用途：** 初始化RDS PostgreSQL数据库
**状态：** 待创建

### 2.2 模块级DDL脚本
**文件路径：** \`outputs/详细设计/各模块/数据库DDL脚本.sql\`
**内容描述：** 各模块独立的数据库脚本
**部署用途：** 分模块部署数据库
**状态：** 待创建

## 三、源代码

### 3.1 后端源代码
**文件路径：** \`src/scms-backend/\`
**技术栈：** Spring Boot
**内容描述：** 完整的Spring Boot后端项目
**部署用途：** 编译打包，生成可执行JAR
**状态：** 待创建

### 3.2 前端源代码
**文件路径：** \`src/scms-frontend/\`
**技术栈：** Vue 3
**内容描述：** 完整的Vue 3前端项目
**部署用途：** 构建生产版本，生成dist/目录
**状态：** 待创建

## 四、部署脚本

### 4.1 主部署脚本
**文件路径：** \`scripts/deploy.sh\`
**内容描述：** 自动化部署主脚本
**部署用途：** 执行一键部署
**状态：** 待创建

### 4.2 环境准备脚本
**文件路径：** \`scripts/setup_environment.sh\`
**内容描述：** 基础环境准备
**部署用途：** 安装必要软件和依赖
**状态：** 待创建

### 4.3 数据库初始化脚本
**文件路径：** \`scripts/init_database.sh\`
**内容描述：** 数据库初始化
**部署用途：** 执行DDL脚本
**状态：** 待创建

### 4.4 版本验证脚本
**文件路径：** \`scripts/verify_versions.sh\`
**内容描述：** 验证软件版本
**部署用途：** 确认环境配置正确
**状态：** 待创建

### 4.5 数据库连接测试脚本
**文件路径：** \`scripts/test_db_connection.sh\`
**内容描述：** 测试RDS连接
**部署用途：** 验证数据库连通性
**状态：** 待创建

### 4.6 表结构验证脚本
**文件路径：** \`scripts/verify_tables.sh\`
**内容描述：** 验证核心表结构
**部署用途：** 确认数据库初始化成功
**状态：** 待创建

### 4.7 后端启动脚本
**文件路径：** \`scripts/start_backend.sh\`
**内容描述：** 启动后端服务
**部署用途：** 启动Spring Boot应用
**状态：** 待创建

### 4.8 API测试脚本
**文件路径：** \`scripts/test_apis.sh\`
**内容描述：** 测试核心API
**部署用途：** 验证后端功能
**状态：** 待创建

### 4.9 基础访问验证脚本
**文件路径：** \`scripts/verify_basic_access.sh\`
**内容描述：** 基础连通性测试
**部署用途：** 验证服务可访问性
**状态：** 待创建

### 4.10 静态资源验证脚本
**文件路径：** \`scripts/verify_static_resources.sh\`
**内容描述：** CSS与静态资源验证
**部署用途：** 确认前端资源正常加载
**状态：** 待创建

### 4.11 业务逻辑验证脚本
**文件路径：** \`scripts/verify_business_logic.sh\`
**内容描述：** 业务功能验证
**部署用途：** 验证核心业务功能
**状态：** 待创建

### 4.12 微信集成测试脚本
**文件路径：** \`scripts/test_wechat_integration.sh\`
**内容描述：** 微信集成测试
**部署用途：** 验证小程序和公众号集成
**状态：** 待创建

## 五、配置文件

### 5.1 环境变量模板
**文件路径：** \`scripts/.env.example\`
**内容描述：** 所有必需的配置参数模板
**部署用途：** 生成生产环境配置文件
**状态：** 待创建

**包含配置项：**
- 数据库配置（HOST、PORT、NAME、USERNAME、PASSWORD）
- 阿里云OSS配置（ACCESS_KEY_ID、ACCESS_KEY_SECRET、BUCKET_NAME、ENDPOINT）
- Spring Boot配置（SERVER_PORT、SPRING_PROFILES_ACTIVE）
- 微信小程序配置（APP_ID、APP_SECRET、TOKEN、ENCODING_AES_KEY）
- 微信公众号配置（APP_ID、APP_SECRET、TOKEN、ENCODING_AES_KEY）

### 5.2 Nginx配置文件
**文件路径：** \`scripts/nginx/scms.conf\`
**内容描述：** Nginx代理与静态资源配置
**部署用途：** 配置Web服务器
**状态：** 待创建

**配置内容：**
- HTTP/HTTPS监听配置
- 静态资源处理
- Vue history模式支持
- 后端API代理
- 微信回调接口代理

## 六、系统服务配置

### 6.1 systemd服务文件
**文件路径：** \`/etc/systemd/system/scms-backend.service\`
**内容描述：** 后端服务配置
**部署用途：** 使用systemd管理后端服务
**状态：** 部署时生成

### 6.2 Nginx站点配置
**文件路径：** \`/etc/nginx/sites-available/scms\`
**内容描述：** Nginx站点配置
**部署用途：** Nginx虚拟主机配置
**状态：** 部署时生成

## 七、微信集成文件

### 7.1 微信小程序配置
**文件路径：** \`src/scms-backend/src/main/resources/wechat-miniprogram.properties\`
**内容描述：** 微信小程序配置参数
**部署用途：** 后端服务读取微信配置
**状态：** 待创建

### 7.2 微信公众号配置
**文件路径：** \`src/scms-backend/src/main/resources/wechat-official.properties\`
**内容描述：** 微信公众号配置参数
**部署用途：** 后端服务读取公众号配置
**状态：** 待创建

### 7.3 RSA私钥文件
**文件路径：** \`assets/jinmo.pem\`
**内容描述：** SSH登录私钥
**部署用途：** SSH连接服务器
**状态：** ✅ 已创建

## 八、临时测试文件

### 8.1 测试目录
**文件路径：** \`temp/\`
**内容描述：** 临时测试文件
**部署用途：** 开发过程中的测试文件
**状态：** 待创建

## 九、文档文件

### 9.1 协同开发协议
**文件路径：** \`assets/SCMS协同开发协议-e63900d949.docx\`
**内容描述：** 开发AI与部署AI协作协议
**部署用途：** 明确职责分工和协作流程
**状态：** ✅ 已创建

### 9.2 部署完整指南
**文件路径：** \`assets/SCMS部署完整指南-37d4e008fa.docx\`
**内容描述：** 详细的部署步骤与验证清单
**部署用途：** 指导部署流程执行
**状态：** ✅ 已创建

### 9.3 部署文件清单
**文件路径：** \`assets/部署文件清单-5eb00e47d4.docx\`
**内容描述：** 部署所需的所有文件路径清单
**部署用途：** 文件准备和验证
**状态：** ⚠️ 文件下载失败（使用知识库记录代替）

## 十、Git仓库文件

### 10.1 README文件
**文件路径：** \`README.md\`
**内容描述：** 项目说明文档
**部署用途：** 项目概览和快速开始
**状态：** 待创建

### 10.2 .gitignore文件
**文件路径：** \`.gitignore\`
**内容描述：** Git忽略文件配置
**部署用途：** 版本控制排除规则
**状态：** 待创建

## 十一、构建输出文件

### 11.1 后端JAR包
**文件路径：** \`src/scms-backend/target/scms-backend-1.0.0-SNAPSHOT.jar\`
**内容描述：** Spring Boot可执行JAR包
**部署用途：** 后端服务运行
**状态：** 编译后生成

### 11.2 前端dist目录
**文件路径：** \`src/scms-frontend/dist/\`
**内容描述：** Vue 3生产构建输出
**部署用途：** Nginx静态资源
**状态：** 构建后生成

## 十二、日志文件

### 12.1 后端日志
**文件路径：** \`/var/log/scms-backend/\`
**内容描述：** Spring Boot应用日志
**部署用途：** 问题诊断和监控
**状态：** 运行时生成

### 12.2 Nginx日志
**文件路径：** \`/var/log/nginx/\`
**内容描述：** Nginx访问和错误日志
**部署用途：** Web服务器监控
**状态：** 运行时生成

## 十三、备份文件

### 13.1 数据库备份
**文件路径：** \`backups/database/\`
**内容描述：** PostgreSQL数据库备份
**部署用途：** 数据恢复
**状态：** 定期生成

### 13.2 配置备份
**文件路径：** \`backups/config/\`
**内容描述：** 配置文件备份
**部署用途：** 配置恢复
**状态：** 部署前备份

## 文件优先级

### P0 - 必须文件（部署必备）
1. \`src/scms-backend/\` - 后端源代码
2. \`src/scms-frontend/\` - 前端源代码
3. \`outputs/数据库/SCMS完整数据库DDL.sql\` - 数据库脚本
4. \`scripts/.env.example\` - 环境变量模板
5. \`scripts/nginx/scms.conf\` - Nginx配置

### P1 - 重要文件（部署辅助）
1. \`scripts/deploy.sh\` - 主部署脚本
2. \`scripts/setup_environment.sh\` - 环境准备脚本
3. \`scripts/init_database.sh\` - 数据库初始化脚本
4. \`memory/spec.txt\` - 项目规划文件
5. \`outputs/部署/SCMS部署完整指南.md\` - 部署指南

### P2 - 辅助文件（测试验证）
1. \`scripts/test_db_connection.sh\` - 数据库连接测试
2. \`scripts/test_apis.sh\` - API测试
3. \`scripts/verify_basic_access.sh\` - 基础访问验证
4. \`scripts/verify_static_resources.sh\` - 静态资源验证
5. \`scripts/verify_business_logic.sh\` - 业务逻辑验证
6. \`scripts/test_wechat_integration.sh\` - 微信集成测试

### P3 - 参考文件（文档说明）
1. \`assets/SCMS协同开发协议-e63900d949.docx\` - 协同开发协议
2. \`assets/SCMS部署完整指南-37d4e008fa.docx\` - 部署完整指南
3. \`README.md\` - 项目说明
4. \`outputs/部署/CSS与路由修复报告.md\` - 修复方案

## 交付检查清单

### 开发AI交付前检查
- [ ] 所有源代码文件已创建
- [ ] 数据库DDL脚本语法正确
- [ ] 环境变量模板完整
- [ ] Nginx配置文件正确
- [ ] 部署脚本可执行
- [ ] 文档内容完整准确

### 部署AI执行前检查
- [ ] 服务器SSH连接正常
- [ ] 所有必需文件已接收
- [ ] 数据库连接已验证
- [ ] 环境变量已配置
- [ ] 安全组端口已开放
- [ ] 域名DNS解析正常

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
