import { S3Storage } from "coze-coding-dev-sdk";

const storage = new S3Storage({
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

async function checkCloudStorage() {
  console.log("==========================================");
  console.log("  检查云存储中的部署包");
  console.log("==========================================\n");

  const PREFIX = "workspace/projects/handover/";
  const FLAG_KEY = "workspace/projects/handover/deploy_ready_flag.txt";

  try {
    // 检查部署标志文件
    console.log("🔍 检查部署标志文件...");
    const flagExists = await storage.fileExists({
      fileKey: FLAG_KEY
    });

    if (!flagExists) {
      console.log("⏳ 云存储中未找到部署标志文件");
      console.log("\n尝试列出 handover/ 目录下的所有文件...");

      const result = await storage.listFiles({
        prefix: PREFIX,
        maxKeys: 100
      });

      if (result.keys.length === 0) {
        console.log("⏳ 云存储中未找到任何部署文件");
        console.log("\n建议：开发AI使用云存储上传工具创建部署包");
        console.log("  npx tsx tools/upload-handover.ts <version>");
      } else {
        console.log(`✓ 找到 ${result.keys.length} 个文件:`);
        result.keys.forEach(key => {
          console.log(`  - ${key.replace(PREFIX, "")}`);
        });
      }
    } else {
      console.log("✓ 找到部署标志文件！");

      // 读取版本信息
      try {
        const versionData = await storage.readFile({
          fileKey: "workspace/projects/handover/version.txt"
        });
        console.log(`✓ 部署版本: ${versionData.toString()}`);
      } catch (error) {
        console.log("⚠️  无法读取版本信息");
      }

      // 列出所有文件
      const result = await storage.listFiles({
        prefix: PREFIX,
        maxKeys: 100
      });

      console.log(`✓ 部署文件总数: ${result.keys.length}`);
    }

  } catch (error) {
    console.error("❌ 检查云存储时出错:", error);
  }
}

checkCloudStorage().catch(console.error);
