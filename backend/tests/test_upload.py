import requests

url = "http://localhost:8000/api/v1/voice-samples"
files = {'file': ('Đức.m4a', b'fake audio data', 'audio/m4a')}
data = {'speaker_label': 'Test Speaker'}
response = requests.post(url, files=files, data=data)
print(response.status_code)
print(response.text)
