/**
 * SCMS部署包上传工具
 * 用途：开发AI使用此工具将部署包上传到云存储共享目录
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

/**
 * 上传部署包到云存储
 * @param version 部署版本号（格式：YYYYMMDD-HHMM）
 * @param handoverDir 本地handover目录路径（默认：./handover）
 */
async function uploadHandover(version: string, handoverDir: string = "./handover") {
  console.log("==========================================");
  console.log(`  SCMS部署包上传工具`);
  console.log(`  版本: ${version}`);
  console.log("==========================================\n");

  // 检查版本格式
  const versionRegex = /^\d{8}-\d{4}$/;
  if (!versionRegex.test(version)) {
    console.error("❌ 版本格式错误，应为 YYYYMMDD-HHMM");
    process.exit(1);
  }

  // 检查本地目录
  if (!fs.existsSync(handoverDir)) {
    console.error(`❌ 本地目录不存在: ${handoverDir}`);
    process.exit(1);
  }

  const PREFIX = "workspace/projects/handover/";
  let uploadCount = 0;
  let errorCount = 0;

  try {
    // 1. 上传版本信息
    console.log("📤 上传版本信息...");
    await storage.uploadFile({
      fileContent: Buffer.from(version),
      fileName: `${PREFIX}version.txt`,
      contentType: "text/plain",
    });
    uploadCount++;
    console.log("✓ 版本信息已上传\n");

    // 2. 上传README（如果存在）
    const readmePath = path.join(handoverDir, "README.md");
    if (fs.existsSync(readmePath)) {
      console.log("📤 上传README...");
      await storage.uploadFile({
        fileContent: fs.readFileSync(readmePath),
        fileName: `${PREFIX}README.md`,
        contentType: "text/markdown",
      });
      uploadCount++;
      console.log("✓ README已上传\n");
    }

    // 3. 上传sources目录
    const sourcesDir = path.join(handoverDir, "sources");
    if (fs.existsSync(sourcesDir)) {
      console.log("📤 上传源代码包...");
      const files = fs.readdirSync(sourcesDir);
      for (const file of files) {
        const filePath = path.join(sourcesDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          await storage.uploadFile({
            fileContent: fs.readFileSync(filePath),
            fileName: `${PREFIX}sources/${file}`,
            contentType: "application/gzip",
          });
          uploadCount++;
          console.log(`  ✓ ${file}`);
        }
      }
      console.log(`✓ ${files.length} 个源代码包已上传\n`);
    }

    // 4. 上传configs目录
    const configsDir = path.join(handoverDir, "configs");
    if (fs.existsSync(configsDir)) {
      console.log("📤 上传配置文件...");
      const files = fs.readdirSync(configsDir);
      for (const file of files) {
        const filePath = path.join(configsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          const ext = path.extname(file);
          let contentType = "application/octet-stream";
          if (ext === ".yml" || ext === ".yaml") contentType = "text/yaml";
          else if (ext === ".json") contentType = "application/json";
          else if (ext === ".conf") contentType = "text/plain";
          else if (ext === ".sh") contentType = "application/x-sh";

          await storage.uploadFile({
            fileContent: fs.readFileSync(filePath),
            fileName: `${PREFIX}configs/${file}`,
            contentType: contentType,
          });
          uploadCount++;
          console.log(`  ✓ ${file}`);
        }
      }
      console.log(`✓ ${files.length} 个配置文件已上传\n`);
    }

    // 5. 上传scripts目录
    const scriptsDir = path.join(handoverDir, "scripts");
    if (fs.existsSync(scriptsDir)) {
      console.log("📤 上传部署脚本...");
      const files = fs.readdirSync(scriptsDir);
      for (const file of files) {
        const filePath = path.join(scriptsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          await storage.uploadFile({
            fileContent: fs.readFileSync(filePath),
            fileName: `${PREFIX}scripts/${file}`,
            contentType: "application/x-sh",
          });
          uploadCount++;
          console.log(`  ✓ ${file}`);
        }
      }
      console.log(`✓ ${files.length} 个脚本文件已上传\n`);
    }

    // 6. 上传docs目录
    const docsDir = path.join(handoverDir, "docs");
    if (fs.existsSync(docsDir)) {
      console.log("📤 上传文档...");
      const files = fs.readdirSync(docsDir);
      for (const file of files) {
        const filePath = path.join(docsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          const ext = path.extname(file);
          const contentType = ext === ".md" ? "text/markdown" : "text/plain";

          await storage.uploadFile({
            fileContent: fs.readFileSync(filePath),
            fileName: `${PREFIX}docs/${file}`,
            contentType: contentType,
          });
          uploadCount++;
          console.log(`  ✓ ${file}`);
        }
      }
      console.log(`✓ ${files.length} 个文档文件已上传\n`);
    }

    // 7. 最后创建部署标志（触发部署）
    console.log("📤 创建部署标志文件...");
    await storage.uploadFile({
      fileContent: Buffer.from("ready"),
      fileName: `${PREFIX}deploy_ready_flag.txt`,
      contentType: "text/plain",
    });
    uploadCount++;
    console.log("✓ 部署标志文件已上传\n");

    console.log("==========================================");
    console.log(`  ✨ 上传完成`);
    console.log(`  版本: ${version}`);
    console.log(`  上传文件数: ${uploadCount}`);
    console.log(`  错误数: ${errorCount}`);
    console.log("==========================================");
    console.log("\n部署AI将自动检测并开始部署。");
    console.log("云存储prefix: workspace/projects/handover/\n");

    return { success: true, uploadCount, errorCount };

  } catch (error) {
    errorCount++;
    console.error("❌ 上传失败:", error);
    return { success: false, uploadCount, errorCount, error };
  }
}

// 命令行使用
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log("使用方式:");
  console.log("  npx tsx upload-handover.ts <version> [handoverDir]");
  console.log("");
  console.log("示例:");
  console.log("  npx tsx upload-handover.ts 20260226-1015");
  console.log("  npx tsx upload-handover.ts 20260226-1015 ./handover");
  console.log("");
  console.log("版本格式: YYYYMMDD-HHMM");
  process.exit(1);
}

const version = args[0];
const handoverDir = args[1] || "./handover";

uploadHandover(version, handoverDir)
  .then((result) => {
    if (!result.success) {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("❌ 执行失败:", error);
    process.exit(1);
  });
