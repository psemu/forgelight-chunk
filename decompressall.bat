@echo off
for %%S in (chunks\*.cnk1) do cnkdec d %%S decompressed\%%~nxS 
echo ALL DONE!
pause