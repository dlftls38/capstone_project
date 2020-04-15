import requests, json

url = 'http://127.0.0.1:3001/abc'

data = {}
headers = {}

response = requests.post(url, data=json.dumps(data), headers=headers)

print(response.status_code)

print(response.text)

print(response.json)

