import os from "os";
import path from "path";
import fsPromise from "fs/promises";

// 删除目录下的所有文件
async function FN_deleteFilesInDirectory() {
  // 获取CorelDRAW的缓存目录
  const userDir = os.homedir();
  const corelCachePath = path.join(userDir, "AppData", "Roaming", "Corel", "Messages");
  const dirList_message = await fsPromise.readdir(corelCachePath);
  // 获取CorelDRAW的错误日志目录
  // C:\Users\*\AppData\Local\Temp\Corel
  const corelErrorLogPath = path.join(userDir, "AppData", "Local", "Temp", "Corel");
  const fileList_error = await fsPromise.readdir(corelErrorLogPath);

  // 遍历清除
  const arr_folderList = [];
  for (const folder of dirList_message) {
    const targetPath = path.join(corelCachePath, folder);
    const stats = await fsPromise.stat(targetPath);
    if (stats.isDirectory()) {
      // 删除文件夹及其内容
      await fsPromise.rm(targetPath, { recursive: true });
      arr_folderList.push(targetPath);
    }
  }

  // 遍历清除
  const arr_fileList = [];
  for (const file of fileList_error) {
    const targetPath = path.join(corelErrorLogPath, file);
    const stats = await fsPromise.stat(targetPath);
    if (stats.isFile()) {
      // 删除文件
      try {
        await fsPromise.rm(targetPath, { recursive: true });
        arr_fileList.push(targetPath);
      } catch (err) {
        console.log(`CorelDRAW可能正在运行，请关闭CorelDRAW进程后执行清除`);
        console.log(err);
      }
    } else {
      // 删除文件夹及其内容
      try {
        await fsPromise.rm(targetPath, { recursive: true });
        arr_fileList.push(targetPath);
      } catch (err) {
        console.log(`CorelDRAW可能正在运行，请关闭CorelDRAW进程后执行清除`);
        console.log(err);
      }
    }
  }

  if (arr_folderList.length > 0) {
    console.log(`软件缓存: 已清除CorelDRAW缓存目录: \n${arr_folderList.join(`\n`)}`);
  } else {
    console.log("软件缓存: 没有需要清除的缓存文件");
  }
  if (arr_fileList.length > 0) {
    console.log(`错误日志已清除: \n${arr_fileList.join(`\n`)}`);
  } else {
    console.log("错误日志: 没有需要清除的错误日志");
  }
}

FN_deleteFilesInDirectory();
