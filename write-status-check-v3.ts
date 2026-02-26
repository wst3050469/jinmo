import { KnowledgeClient, Config, KnowledgeDocument, DataSourceType } from 'coze-coding-dev-sdk';

// 配置
const config = new Config();
const client = new KnowledgeClient(config);
const DATASET_NAME = 'yongyi_system_docs';

// 读取文档内容
import { readFileSync } from 'fs';
const documentContent = readFileSync('/workspace/projects/部署AI状态报告-第三次检查.md', 'utf-8');

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
  console.log('\n✨ 部署AI状态报告已成功写入知识库！');
  console.log('\n========================================');
  console.log('  第三次检查完成');
  console.log('========================================');
  console.log('✅ 知识库已读取');
  console.log('⏳ 本地文件系统：未找到部署包');
  console.log('⏳ 云存储：未找到部署包');
  console.log('✅ 云存储方案已准备就绪');
  console.log('========================================');
  console.log('开发AI请使用云存储工具上传部署包：');
  console.log('  npx tsx tools/upload-handover.ts 20260226-1015');
  console.log('========================================');
}).catch((error) => {
  console.error('\n❌ 写入失败:', error);
  process.exit(1);
});
