$ErrorActionPreference = "Stop"
$phpDir = "C:\php"
if (-Not (Test-Path $phpDir)) {
    New-Item -ItemType Directory -Force -Path $phpDir | Out-Null
}

$phpUrl = "https://windows.php.net/downloads/releases/archives/php-8.2.20-nts-Win32-vs16-x64.zip"
$zipPath = "$phpDir\php.zip"

Write-Host "Mengunduh PHP 8.2..."
Invoke-WebRequest -Uri $phpUrl -OutFile $zipPath

Write-Host "Mengekstrak berkas PHP..."
Expand-Archive -Path $zipPath -DestinationPath $phpDir -Force
Remove-Item $zipPath

Write-Host "Mengaktifkan ekstensi pada php.ini..."
$iniPath = "$phpDir\php.ini"
Copy-Item "$phpDir\php.ini-development" $iniPath
(Get-Content $iniPath) -replace ';extension_dir = "ext"', 'extension_dir = "ext"' | Set-Content $iniPath
(Get-Content $iniPath) -replace ';extension=mbstring', 'extension=mbstring' | Set-Content $iniPath
(Get-Content $iniPath) -replace ';extension=curl', 'extension=curl' | Set-Content $iniPath
(Get-Content $iniPath) -replace ';extension=intl', 'extension=intl' | Set-Content $iniPath
(Get-Content $iniPath) -replace ';extension=pdo_mysql', 'extension=pdo_mysql' | Set-Content $iniPath
(Get-Content $iniPath) -replace ';extension=mysqli', 'extension=mysqli' | Set-Content $iniPath

Write-Host "Mengunduh Composer..."
Invoke-WebRequest -Uri "https://getcomposer.org/download/latest-stable/composer.phar" -OutFile "$phpDir\composer.phar"
Set-Content -Path "$phpDir\composer.bat" -Value '@php "%~dp0composer.phar" %*'

Write-Host "Mendaftarkan Environment Variable (PATH)..."
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($userPath -notmatch [regex]::Escape($phpDir)) {
    $newPath = "$userPath;$phpDir"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
}

Write-Host "Instalasi selesai. Anda perlu memuat ulang sesi terminal agar perintah 'php' dan 'composer' dapat dikenali."
