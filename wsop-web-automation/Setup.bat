@echo off
setlocal
title WSOP Automation Suite Setup

cd /d "%~dp0"

echo ===================================================
echo [WSOP Automation Suite] Initial Setup Guide
echo ===================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if errorlevel 1 (
  echo [SYSTEM] Node.js가 설치되어 있지 않아 자동 다운로드 및 무소음 설치를 진행합니다...
  echo 관리자 권한 허용 팝업이 나타나면 '예(Yes)'를 선택해 주세요.
  echo.
  
  echo [1/3] Node.js LTS 인스톨러 다운로드 중 (https://nodejs.org)...
  powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.12.2/node-v20.12.2-x64.msi' -OutFile '%TEMP%\node-setup.msi'"
  if errorlevel 1 (
    echo [ERROR] Node.js 다운로드에 실패했습니다. 인터넷 연결을 확인해 주세요.
    pause
    exit /b 1
  )
  
  echo [2/3] 백그라운드 자동 설치 진행 중... (약 15초 소요)
  powershell -NoProfile -Command "Start-Process msiexec.exe -ArgumentList '/i', '%TEMP%\node-setup.msi', '/qn', '/norestart' -Verb RunAs -Wait"
  if errorlevel 1 (
    echo [ERROR] Node.js 설치가 중단되었습니다.
    pause
    exit /b 1
  )
  
  del "%TEMP%\node-setup.msi" >nul 2>&1
  
  :: Refresh path variables for current cmd session so that npm is immediately available
  set "PATH=%ProgramFiles%\nodejs\;%PATH%"
  
  where node >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] Node.js 설치가 완료되었으나 환경변수가 즉시 반영되지 않았습니다.
    echo cmd 창을 닫고 다시 Setup.bat를 실행해 주세요.
    pause
    exit /b 1
  )
  
  echo [✓] Node.js 자동 설치 및 PATH 반영 완료.
  echo.
) else (
  echo [✓] Node.js 감지 완료.
  echo.
)

:: 2. npm install
echo [2/3] 의존성 패키지 설치를 시작합니다 (npm install)...
call npm install
if errorlevel 1 (
  echo [ERROR] npm 패키지 설치 중 오류가 발생했습니다.
  pause
  exit /b 1
)
echo.

:: 3. Playwright browser install
echo [3/3] Playwright Chromium 브라우저를 설치합니다...
call npx playwright install chromium
if errorlevel 1 (
  echo [ERROR] Playwright 브라우저 설치 중 오류가 발생했습니다.
  pause
  exit /b 1
)
echo.

:: 4. Check sibling crawler directory structure
if not exist "..\WSOP-Player-Standings-Crawler-Improved" (
  echo [WARNING] 형제 디렉토리에 크롤러 프로젝트 폴더가 존재하지 않습니다!
  echo 크롤러 테스트가 정상 작동하려면 아래와 같이 폴더 구조를 배치해야 합니다:
  echo   - (상위 폴더)/
  echo       +- WSOP-Web-Automation/
  echo       +- WSOP-Player-Standings-Crawler-Improved/
  echo.
) else (
  echo [✓] 형제 크롤러 프로젝트 폴더 감지 완료.
)
echo.
echo ===================================================
echo [SETUP COMPLETED] 모든 개발환경 세팅이 완료되었습니다!
echo 이제 'Run.bat'를 실행하여 웹 대시보드를 구동할 수 있습니다.
echo ===================================================
echo.
pause
exit /b 0
