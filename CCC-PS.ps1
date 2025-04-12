function Remove-CorelCache {
    $userHome = $env:USERPROFILE
    $corelCachePath = Join-Path $userHome "AppData\Roaming\Corel\Messages"
    $corelErrorLogPath = Join-Path $userHome "AppData\Local\Temp\Corel"
    $deletedFolders = @()
    $deletedFiles = @()
    try {
        $folders = Get-ChildItem -Path $corelCachePath -ErrorAction Stop | Where-Object { $_.PSIsContainer }
        foreach ($folder in $folders) {
            try {
                Remove-Item -Path $folder.FullName -Recurse -Force -ErrorAction Stop
                $deletedFolders += $folder.FullName
            }
            catch {
                Write-Host "CorelDRAW可能正在运行，请关闭CorelDRAW进程后执行"
                Write-Host $_.Exception.Message
            }
        }
    }
    catch {
        Write-Host "访问失败: E1"
    }

    try {
        # 处理Temp\Corel目录的所有内容
        $items = Get-ChildItem -Path $corelErrorLogPath -ErrorAction Stop
        foreach ($item in $items) {
            try {
                Remove-Item -Path $item.FullName -Recurse -Force -ErrorAction Stop
                $deletedFiles += $item.FullName
            }
            catch {
                Write-Host "CorelDRAW可能正在运行，请关闭CorelDRAW进程后执行"
                Write-Host $_.Exception.Message
            }
        }
    }
    catch {
        Write-Host "访问失败: E2"
    }

    # 输出结果
    if ($deletedFolders.Count -gt 0) {
        Write-Host "软件缓存: 已清除CorelDRAW缓存目录: `n$($deletedFolders -join "`n")"
    }
    else {
        Write-Host "软件缓存: 没有需要清除的缓存文件"
    }

    if ($deletedFiles.Count -gt 0) {
        Write-Host "错误日志已清除: `n$($deletedFiles -join "`n")"
    }
    else {
        Write-Host "错误日志: 没有需要清除的错误日志"
    }
}

# 执行清理函数
Remove-CorelCache