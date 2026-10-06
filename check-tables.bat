@echo off
echo Listing tables in PostgreSQL database...
psql -U postgres -d mon-app -c "\dt"
pause
