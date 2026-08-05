@echo off
setlocal
cd /d "%~dp0"

:menu
cls
echo Unified Japan Support Blogs
echo.
echo 1. Build all sites
echo 2. Verify public URLs
echo 3. Sync content to legacy mirror repositories
echo 4. Deploy all sites
echo 5. Preview a site
echo 6. Import accidental changes from a legacy repository
echo Q. Quit
echo.
set "ACTION="
set /p ACTION="Select: "

if /i "%ACTION%"=="q" exit /b 0
if "%ACTION%"=="1" call npm run build
if "%ACTION%"=="2" call npm run verify:urls
if "%ACTION%"=="3" call npm run sync:mirrors
if "%ACTION%"=="4" goto confirm_deploy
if "%ACTION%"=="5" goto preview
if "%ACTION%"=="6" goto import_legacy

echo.
pause
goto menu

:import_legacy
echo.
echo Sites: jpaiblog, jpiotblog, jpmlblog, jpwdkblog
echo The monorepo must be clean before importing.
set "SITE="
set /p SITE="Legacy site to import: "
call npm run import:legacy -- %SITE%
echo.
pause
goto menu

:confirm_deploy
echo.
echo This publishes all four existing GitHub Pages sites.
set "CONFIRM="
set /p CONFIRM="Type DEPLOY to continue: "
if not "%CONFIRM%"=="DEPLOY" goto menu
call npm run deploy
echo.
pause
goto menu

:preview
echo.
echo Sites: jpaiblog, jpiotblog, jpmlblog, jpwdkblog
set "SITE="
set /p SITE="Site: "
call npm run serve -- %SITE%
echo.
pause
goto menu
