@echo off
set /A percent=0
set /P twoFA="Please enter your 2fa auth code: "
echo %twoFA%
:percent
PING localhost -n 2 >NUL
set /A percent=%percent%+1
IF %percent%==3 echo  Random connection failure boohoo
IF %percent% GTR 9 set output= %percent%,00%% C:\Users\Familie\Downloads\testjs\Y1S1_BlackIce_1.1.0\Support\ReadMe\%percent%
IF %percent% LSS 10 set output= 0%percent%,00%% C:\Users\Familie\Downloads\testjs\Y1S1_BlackIce_1.1.0\Support\ReadMe\%percent%
echo %output%
IF %percent% == 100 goto EOF
GOTO percent

:EOF