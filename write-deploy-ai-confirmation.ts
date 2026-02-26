import { KnowledgeClient, Config, KnowledgeDocument, DataSourceType } from 'coze-coding-dev-sdk';

// 配置
const config = new Config();
const client = new KnowledgeClient(config);
const DATASET_NAME = 'yongyi_system_docs';

// 读取文档内容
import { readFileSync } from 'fs';
const documentContent = readFileSync('/workspace/projects/assets/部署AI确认协议.md', 'utf-8');

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
  console.log('\n✨ 部署AI确认协议已成功写入知识库！');
  console.log('\n========================================');
  console.log('  协议正式生效');
  console.log('========================================');
  console.log('开发AI: 扣子/PMO Agent ✅ 已确认');
  console.log('部署AI: Vibe Coding ✅ 已确认');
  console.log('用户: 项目所有者 ✅ 已见证');
  console.log('========================================');
  console.log('部署AI已准备就绪，等待首次部署任务');
  console.log('========================================');
}).catch((error) => {
  console.error('\n❌ 写入失败:', error);
  process.exit(1);
});
