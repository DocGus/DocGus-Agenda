import os
import sys

# Ensure 'src' is on sys.path so imports like `api.models` work
ROOT = os.path.dirname(os.path.dirname(__file__))
SRC = os.path.join(ROOT, 'src')
if SRC not in sys.path:
    sys.path.insert(0, SRC)

# The shared `client` fixture lives in `tests/conftest.py`.
from api.models import User


def test_register_login_and_private_flow(client):
    # 1) Register
    register_resp = client.post('/api/register', json={
        'email': 'test_user@example.com',
        'password': 'secure123'
    })
    assert register_resp.status_code == 201, register_resp.get_data(as_text=True)

    # 2) Login
    login_resp = client.post('/api/login', json={
        'email': 'test_user@example.com',
        'password': 'secure123'
    })
    assert login_resp.status_code == 200, login_resp.get_data(as_text=True)
    login_json = login_resp.get_json()
    assert 'token' in login_json and 'user' in login_json
    token = login_json['token']
    assert login_json['user']['email'] == 'test_user@example.com'

    # 3) Access private route with token
    headers = {'Authorization': f'Bearer {token}'}
    private_resp = client.get('/api/private', headers=headers)
    assert private_resp.status_code == 200, private_resp.get_data(as_text=True)
    private_json = private_resp.get_json()
    assert 'user' in private_json
    assert private_json['user']['email'] == 'test_user@example.com'
