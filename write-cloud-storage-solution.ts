import { KnowledgeClient, Config, KnowledgeDocument, DataSourceType } from 'coze-coding-dev-sdk';

// 配置
const config = new Config();
const client = new KnowledgeClient(config);
const DATASET_NAME = 'yongyi_system_docs';

// 读取文档内容
import { readFileSync } from 'fs';
const documentContent = readFileSync('/workspace/projects/云存储共享目录协同方案.md', 'utf-8');

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
  console.log('\n✨ 云存储共享目录协同方案已成功写入知识库！');
  console.log('\n========================================');
  console.log('  方案设计完成');
  console.log('========================================');
  console.log('✅ 云存储共享目录方案');
  console.log('✅ 上传工具脚本');
  console.log('✅ 下载工具脚本');
  console.log('========================================');
  console.log('开发AI可使用上传工具创建部署包');
  console.log('部署AI可使用下载工具获取部署包');
  console.log('========================================');
}).catch((error) => {
  console.error('\n❌ 写入失败:', error);
  process.exit(1);
});
