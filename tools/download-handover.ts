/**
 * SCMS部署包下载工具
 * 用途：部署AI使用此工具从云存储下载部署包
 * 作者：部署AI（Vibe Coding）
 * 版本：v1.0
 */

import { S3Storage } from "coze-coding-dev-sdk";
import fs from "fs";
import path from "path";

const storage = new S3Storage({
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

const FLAG_KEY = "workspace/projects/handover/deploy_ready_flag.txt";
const PREFIX = "workspace/projects/handover/";

/**
 * 检查并下载部署包
 * @returns {Object|null} 下载结果，包含localDir和version，或null表示无待部署任务
 */
async function downloadHandover(): Promise<{ localDir: string; version: string; files: string[] } | null> {
  console.log("==========================================");
  console.log("  SCMS部署包下载工具");
  console.log("==========================================\n");

  try {
    // 1. 检查部署标志
    console.log("🔍 检查部署标志文件...");
    const flagExists = await storage.fileExists({
      fileKey: FLAG_KEY
    });

    if (!flagExists) {
      console.log("⏳ 未检测到部署标志文件，等待中...");
      return null;
    }

    console.log("✓ 检测到部署标志文件\n");

    // 2. 读取版本信息
    console.log("📋 读取版本信息...");
    const versionData = await storage.readFile({
      fileKey: "workspace/projects/handover/version.txt"
    });
    const version = versionData.toString().trim();
    console.log(`✓ 部署版本: ${version}\n`);

    // 3. 创建本地临时目录
    const localBaseDir = "./tmp";
    if (!fs.existsSync(localBaseDir)) {
      fs.mkdirSync(localBaseDir, { recursive: true });
    }

    const localDir = path.join(localBaseDir, `handover-${version}`);
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    console.log(`📁 创建本地目录: ${localDir}\n`);

    // 4. 列出所有文件
    console.log("📋 获取文件列表...");
    const result = await storage.listFiles({
      prefix: PREFIX,
      maxKeys: 100
    });

    if (result.keys.length === 0) {
      console.log("⚠️  未找到任何部署文件");
      return null;
    }

    console.log(`✓ 找到 ${result.keys.length} 个文件\n`);

    // 5. 下载所有文件
    console.log("⬇️  开始下载文件...");
    const downloadedFiles: string[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const key of result.keys) {
      try {
        const data = await storage.readFile({ fileKey: key });
        const relativePath = key.replace(PREFIX, "");
        const localPath = path.join(localDir, relativePath);

        // 创建父目录
        const parentDir = path.dirname(localPath);
        if (!fs.existsSync(parentDir)) {
          fs.mkdirSync(parentDir, { recursive: true });
        }

        // 写入文件
        fs.writeFileSync(localPath, data);
        successCount++;
        downloadedFiles.push(relativePath);
        console.log(`  ✓ ${relativePath}`);
      } catch (error) {
        errorCount++;
        console.error(`  ✗ 下载失败: ${key}`, error);
      }
    }

    console.log("\n==========================================");
    console.log(`  ✨ 下载完成`);
    console.log(`  版本: ${version}`);
    console.log(`  本地目录: ${localDir}`);
    console.log(`  成功: ${successCount} 个文件`);
    console.log(`  失败: ${errorCount} 个文件`);
    console.log("==========================================\n");

    return { localDir, version, files: downloadedFiles };

  } catch (error) {
    console.error("❌ 下载失败:", error);
    return null;
  }
}

/**
 * 删除部署标志文件
 */
async function removeDeployFlag(): Promise<boolean> {
  console.log("🗑️  删除部署标志文件...");
  try {
    await storage.deleteFile({
      fileKey: FLAG_KEY
    });
    console.log("✓ 部署标志文件已删除\n");
    return true;
  } catch (error) {
    console.error("✗ 删除失败:", error);
    return false;
  }
}

/**
 * 主函数 - 检查并下载
 */
async function main() {
  const result = await downloadHandover();

  if (result) {
    console.log("✅ 准备执行部署流程");
    console.log(`本地目录: ${result.localDir}`);
    console.log(`版本: ${result.version}`);
    console.log(`文件数: ${result.files.length}`);
    console.log("\n下一步：执行部署脚本");

    // TODO: 在这里调用部署逻辑
    // const deploymentResult = await executeDeployment(result.localDir, result.version);

    // 部署成功后删除标志
    // if (deploymentResult.success) {
    //   await removeDeployFlag();
    // }

    return result;
  } else {
    console.log("⏳ 无待部署任务");
    return null;
  }
}

// 命令行使用
const args = process.argv.slice(2);
const command = args[0] || "check";

if (command === "check") {
  // 只检查不下载
  downloadHandover().then((result) => {
    if (result) {
      console.log("✅ 发现待部署任务");
      process.exit(0);
    } else {
      console.log("⏳ 无待部署任务");
      process.exit(1);
    }
  });
} else if (command === "download") {
  // 下载部署包
  main().then((result) => {
    if (result) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
} else if (command === "remove-flag") {
  // 删除部署标志
  removeDeployFlag().then((success) => {
    process.exit(success ? 0 : 1);
  });
} else {
  console.log("使用方式:");
  console.log("  npx tsx download-handover.ts check      # 检查是否有待部署任务");
  console.log("  npx tsx download-handover.ts download   # 下载部署包");
  console.log("  npx tsx download-handover.ts remove-flag # 删除部署标志");
  console.log("");
  console.log("默认: check");
  process.exit(1);
}
