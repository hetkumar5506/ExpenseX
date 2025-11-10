Variable: baseURL
Initial Value: http://localhost:5050/api

-------

{
	"info": {
		"_postman_id": "a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d",
		"name": "ExpenseX API",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "🔐 Auth",
			"item": [
				{
					"name": "Register New User",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Status code is 201\", function () {",
									"    pm.response.to.have.status(201);",
									"});",
									"const jsonData = pm.response.json();",
									"pm.environment.set(\"token\", jsonData.token);"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Test User\",\n    \"email\": \"test@example.com\",\n    \"password\": \"password123\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseURL}}/auth/register",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"auth",
								"register"
							]
						}
					},
					"response": []
				},
				{
					"name": "Login User",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Status code is 200\", function () {",
									"    pm.response.to.have.status(200);",
									"});",
									"const jsonData = pm.response.json();",
									"pm.environment.set(\"token\", jsonData.token);"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"email\": \"test@example.com\",\n    \"password\": \"password123\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseURL}}/auth/login",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"auth",
								"login"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get My Info",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseURL}}/auth/me",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"auth",
								"me"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "🗂️ Categories",
			"item": [
				{
					"name": "Get All Categories",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseURL}}/categories",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"categories"
							]
						}
					},
					"response": []
				},
				{
					"name": "Create New Category",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Health\",\n    \"color\": \"#27ae60\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseURL}}/categories",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"categories"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "💸 Expenses",
			"item": [
				{
					"name": "Create Expense Manually",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"amount\": 45.50,\n    \"date\": \"2024-10-15\",\n    \"vendor\": \"Pharmacy\",\n    \"description\": \"Medicine\",\n    \"category_id\": 1\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseURL}}/expenses",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"expenses"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get All Confirmed Expenses",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseURL}}/expenses?limit=5",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"expenses"
							],
							"query": [
								{
									"key": "limit",
									"value": "5"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "Get Pending Scans",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseURL}}/expenses/pending",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"expenses",
								"pending"
							]
						}
					},
					"response": []
				},
				{
					"name": "Confirm a Pending Scan",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "PUT",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"amount\": 42.00,\n    \"date\": \"2024-10-20\",\n    \"vendor\": \"Corrected Cafe\",\n    \"category_id\": 1\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseURL}}/expenses/{{expense_id_to_confirm}}/confirm",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"expenses",
								"{{expense_id_to_confirm}}",
								"confirm"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "🤖 AI & Search",
			"item": [
				{
					"name": "Smart Scan (Creates Pending)",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "formdata",
							"formdata": [
								{
									"key": "receipt",
									"type": "file",
									"src": []
								}
							]
						},
						"url": {
							"raw": "{{baseURL}}/scan",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"scan"
							]
						}
					},
					"response": []
				},
				{
					"name": "NLP Search",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"query\": \"pharmacy last month\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseURL}}/search",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"search"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "⚙️ User & Settings",
			"item": [
				{
					"name": "Get User Settings",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseURL}}/users/settings",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"users",
								"settings"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Upcoming Payments",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "PUT",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"payments\": [\n        { \"id\": \"uuid-1\", \"name\": \"Rent\", \"amount\": 1200, \"dueDate\": \"2025-11-01\" },\n        { \"id\": \"uuid-2\", \"name\": \"Gym\", \"amount\": 50, \"dueDate\": \"2025-11-15\" }\n    ]\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseURL}}/users/settings/upcoming-payments",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"users",
								"settings",
								"upcoming-payments"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Profile (Name/Theme)",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "PUT",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Het Patel\",\n    \"theme\": \"dark\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseURL}}/users/profile",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"users",
								"profile"
							]
						}
					},
					"response": []
				},
				{
					"name": "Upload Profile Photo",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "PUT",
						"header": [],
						"body": {
							"mode": "formdata",
							"formdata": [
								{
									"key": "profile_photo",
									"type": "file",
									"src": []
								}
							]
						},
						"url": {
							"raw": "{{baseURL}}/users/profile-photo",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"users",
								"profile-photo"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "📄 Reports",
			"item": [
				{
					"name": "Generate PDF Report",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"format\": \"pdf\",\n    \"title\": \"October Spending Report\",\n    \"dateRange\": {\n        \"startDate\": \"2024-10-01\",\n        \"endDate\": \"2024-10-31\"\n    },\n    \"include_chart\": \"bar\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseURL}}/reports/generate",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"reports",
								"generate"
							]
						}
					},
					"response": []
				},
				{
					"name": "Generate Word Report",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{token}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"format\": \"word\",\n    \"title\": \"Q4 Report\",\n    \"dateRange\": {\n        \"startDate\": \"2024-10-01\",\n        \"endDate\": \"2024-12-31\"\n    }\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseURL}}/reports/generate",
							"host": [
								"{{baseURL}}"
							],
							"path": [
								"reports",
								"generate"
							]
						}
					},
					"response": []
				}
			]
		}
	],
	"auth": {
		"type": "bearer",
		"bearer": [
			{
				"key": "token",
				"value": "{{token}}",
				"type": "string"
			}
		]
	},
	"event": [
		{
			"listen": "prerequest",
			"script": {
				"type": "text/javascript",
				"exec": [
					""
				]
			}
		},
		{
			"listen": "test",
			"script": {
				"type": "text/javascript",
				"exec": [
					""
				]
			}
		}
	]
}