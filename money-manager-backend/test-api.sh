#!/bin/bash

# Money Manager API Test Script
# This script tests the basic functionality of the API

BASE_URL="http://localhost:5000/api"
EMAIL="test@example.com"
PASSWORD="test123456"
NAME="Test User"

echo "================================"
echo "Money Manager API Test Script"
echo "================================"
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
HEALTH=$(curl -s "$BASE_URL/health")
echo "Response: $HEALTH"
echo ""

# Test 2: Register User
echo "2. Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "Response: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""

# Test 3: Login
echo "3. Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "Response: $LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo ""

# Test 4: Get Current User
echo "4. Testing Get Current User..."
USER_RESPONSE=$(curl -s "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $USER_RESPONSE"
echo ""

# Test 5: Get Categories
echo "5. Testing Get Categories..."
CATEGORIES=$(curl -s "$BASE_URL/categories")
echo "Response: $CATEGORIES"
echo ""

# Test 6: Create Transaction
echo "6. Testing Create Transaction..."
TRANSACTION=$(curl -s -X POST "$BASE_URL/transactions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "expense",
    "amount": 50.00,
    "category": "Food & Dining",
    "division": "personal",
    "description": "Test transaction",
    "date": "2024-02-06"
  }')
echo "Response: $TRANSACTION"
TRANSACTION_ID=$(echo $TRANSACTION | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo ""

# Test 7: Get Transactions
echo "7. Testing Get Transactions..."
TRANSACTIONS=$(curl -s "$BASE_URL/transactions" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $TRANSACTIONS"
echo ""

# Test 8: Get Analytics Summary
echo "8. Testing Analytics Summary..."
ANALYTICS=$(curl -s "$BASE_URL/analytics/summary?period=month" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $ANALYTICS"
echo ""

# Test 9: Create Account
echo "9. Testing Create Account..."
ACCOUNT=$(curl -s -X POST "$BASE_URL/accounts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Account",
    "balance": 1000.00,
    "type": "bank"
  }')
echo "Response: $ACCOUNT"
echo ""

# Test 10: Get Accounts
echo "10. Testing Get Accounts..."
ACCOUNTS=$(curl -s "$BASE_URL/accounts" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $ACCOUNTS"
echo ""

echo "================================"
echo "All tests completed!"
echo "================================"
