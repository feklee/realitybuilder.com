@ECHO OFF
SETLOCAL ENABLEDELAYEDEXPANSION

REM Adjusts the JPEG quality, and thus the size, of all still frames
REM "clip_*.jpg".
REM
REM Requires GraphicsMagick 1.3.3 or compatible.
REM
REM Felix E. Klee <felix.klee@inka.de>

FOR %%A IN (clip_*.jpg) DO (
    echo %%A
    gm mogrify -quality 70 %%A
)
