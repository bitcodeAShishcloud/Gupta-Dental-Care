@echo off
cls
echo ====================================
echo  Gallery Sync Utility
echo ====================================
echo.
echo Syncing Gallery folder with gallery-images.json...
echo.
node sync-gallery.js
echo.
echo ====================================
echo Press any key to exit...
pause > nul
