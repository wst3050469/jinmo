import { KnowledgeClient, Config } from 'coze-coding-dev-sdk';

// 配置
const config = new Config();
const client = new KnowledgeClient(config);
const DATASET_NAME = 'yongyi_system_docs';

async function readKnowledgeBase() {
  try {
    console.log('================================================');
    console.log('  SCMS 知识库读取报告');
    console.log('================================================\n');

    // 读取项目基本信息
    console.log('📋 正在读取项目基本信息...');
    const basicInfo = await client.search(
      'SCMS项目信息 服务器配置 数据库信息 协议',
      [DATASET_NAME],
      3
    );

    if (basicInfo.code === 0 && basicInfo.chunks && basicInfo.chunks.length > 0) {
      console.log('✅ 项目基本信息获取成功：\n');
      basicInfo.chunks.forEach((item, index) => {
        console.log(`--- 文档 ${index + 1} ---`);
        console.log(`文档ID: ${item.doc_id}`);
        console.log(`相似度: ${(item.score * 100).toFixed(2)}%`);
        console.log(`内容预览:`);
        console.log(item.content.substring(0, 800));
        if (item.content.length > 800) {
          console.log('... (内容已截断)');
        }
        console.log('');
      });
    } else {
      console.log('⚠️  未找到项目基本信息\n');
    }

    // 读取部署指南
    console.log('\n📖 正在读取部署指南...');
    const deployGuide = await client.search(
      '部署指南 部署步骤 部署脚本',
      [DATASET_NAME],
      2
    );

    if (deployGuide.code === 0 && deployGuide.chunks && deployGuide.chunks.length > 0) {
      console.log('✅ 部署指南获取成功：\n');
      deployGuide.chunks.forEach((item, index) => {
        console.log(`--- 部署文档 ${index + 1} ---`);
        console.log(`文档ID: ${item.doc_id}`);
        console.log(`相似度: ${(item.score * 100).toFixed(2)}%`);
        console.log(`内容预览:`);
        console.log(item.content.substring(0, 600));
        if (item.content.length > 600) {
          console.log('... (内容已截断)');
        }
        console.log('');
      });
    } else {
      console.log('⚠️  未找到部署指南\n');
    }

    // 读取部署文件清单
    console.log('\n📦 正在读取部署文件清单...');
    const fileChecklist = await client.search(
      '部署文件清单 文件结构 优先级 注意事项',
      [DATASET_NAME],
      2
    );

    if (fileChecklist.code === 0 && fileChecklist.chunks && fileChecklist.chunks.length > 0) {
      console.log('✅ 部署文件清单获取成功：\n');
      fileChecklist.chunks.forEach((item, index) => {
        console.log(`--- 清单文档 ${index + 1} ---`);
        console.log(`文档ID: ${item.doc_id}`);
        console.log(`相似度: ${(item.score * 100).toFixed(2)}%`);
        console.log(`内容预览:`);
        console.log(item.content.substring(0, 600));
        if (item.content.length > 600) {
          console.log('... (内容已截断)');
        }
        console.log('');
      });
    } else {
      console.log('⚠️  未找到部署文件清单\n');
    }

    console.log('================================================');
    console.log('  知识库读取完成');
    console.log('================================================');
    console.log('数据集名称:', DATASET_NAME);
    const totalResults = (basicInfo.chunks?.length || 0) + (deployGuide.chunks?.length || 0) + (fileChecklist.chunks?.length || 0);
    console.log('检索到的文档数:', totalResults);

  } catch (error) {
    console.error('❌ 读取知识库时出错:', error);
    process.exit(1);
  }
}

// 执行读取
readKnowledgeBase().catch((error) => {
  console.error('❌ 读取失败:', error);
  process.exit(1);
});
