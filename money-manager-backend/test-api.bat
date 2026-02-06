@echo off
REM Money Manager API Test Script for Windows
REM This script tests the basic functionality of the API

set BASE_URL=http://localhost:5000/api
set EMAIL=test@example.com
set PASSWORD=test123456
set NAME=Test User

echo ================================
echo Money Manager API Test Script
echo ================================
echo.

REM Test 1: Health Check
echo 1. Testing Health Check...
curl -s "%BASE_URL%/health"
echo.
echo.

REM Test 2: Register User
echo 2. Testing User Registration...
curl -s -X POST "%BASE_URL%/auth/register" -H "Content-Type: application/json" -d "{\"name\":\"%NAME%\",\"email\":\"%EMAIL%\",\"password\":\"%PASSWORD%\"}"
echo.
echo.

REM Test 3: Login and save token
echo 3. Testing User Login...
curl -s -X POST "%BASE_URL%/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"%EMAIL%\",\"password\":\"%PASSWORD%\"}" > temp_login.json
echo Login response saved to temp_login.json
echo Please copy the token from temp_login.json and set it manually for further tests
echo.
echo.

REM Note: For automated token extraction, you would need jq or PowerShell
echo For remaining tests, please use Postman or manually set the TOKEN variable
echo.

REM Test 4: Get Categories (no auth required)
echo 4. Testing Get Categories...
curl -s "%BASE_URL%/categories"
echo.
echo.

echo ================================
echo Basic tests completed!
echo For authenticated tests, please use the token from temp_login.json
echo ================================

pause
