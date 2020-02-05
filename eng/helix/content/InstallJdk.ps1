<#
.SYNOPSIS
    Installs JDK into a folder in this repo.
.DESCRIPTION
    This script downloads an extracts the JDK.
.PARAMETER JdkVersion
    The version of the JDK to install. If not set, the default value is read from global.json
.PARAMETER Force
    Overwrite the existing installation
#>
param(
    [string]$JdkVersion
)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue' # Workaround PowerShell/PowerShell#2138

Set-StrictMode -Version 1

$installDir = ".\jdk"
$tempDir = ".\obj"
if (Test-Path $installDir) {
    Remove-Item -Force -Recurse $installDir
}

Remove-Item -Force -Recurse $tempDir -ErrorAction Ignore | out-null
mkdir $tempDir -ea Ignore | out-null
mkdir $installDir -ea Ignore | out-null
Write-Host "Starting download of JDK ${JdkVersion}"
Invoke-WebRequest -UseBasicParsing -Uri "https://netcorenativeassets.blob.core.windows.net/resource-packages/external/windows/java/jdk-${JdkVersion}_windows-x64_bin.zip" -OutFile "$tempDir/jdk.zip"
Write-Host "Done downloading JDK ${JdkVersion}"
Expand-Archive "$tempDir/jdk.zip" -d "$tempDir/jdk/"
Write-Host "Expanded JDK to $tempDir"
Write-Host "Installing JDK to $installDir"
Move-Item "$tempDir/jdk/jdk-${JdkVersion}/*" $installDir
Write-Host "Done installing JDK to $installDir"
