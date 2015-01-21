@echo off
for %%S in (decompressed\*.cnk1) do node cnktool.js textures %%S ./textures
echo ALL DONE!
pause
