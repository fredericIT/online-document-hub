#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
echo "Token: $TOKEN"
curl -i -X GET http://localhost:8081/api/documents -H "Authorization: Bearer $TOKEN"
