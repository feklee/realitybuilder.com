@ECHO OFF
SETLOCAL ENABLEDELAYEDEXPANSION

REM Uploads all "clip_*.mp4" files in the current directory to YouTube.
REM
REM Felix E. Klee <felix.klee@inka.de>

REM Path of youtube-upload 0.6.2 or compatible (see:
REM <http://code.google.com/p/youtube-upload/>):
SET YOUTUBE_UPLOAD="C:\Programme\Python25\Scripts\youtube-upload"

SET LOG_FILE="Upload.log"

SET /P PASSWORD="Password: "
CLS

FOR %%A IN (clip_*.mp4) DO (
    ECHO %%A

    SET TITLE=%%~nA
    SET TITLE=!TITLE:clip_=!
    SET TITLE=Clip !TITLE!

    TIME /T
    ECHO Uploading %%A...
    ECHO %%A: >>%LOG_FILE%

    python "%YOUTUBE_UPLOAD%" ^
    --email=felix@realitybuilder.com ^
    --password="%PASSWORD%" ^
    --title="!TITLE!" ^
    --category="Entertainment" ^
    --private ^
    "%%A" >>%LOG_FILE%
)
