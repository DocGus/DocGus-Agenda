import pytest

# These tests reuse the `client` fixture defined in `tests/test_auth.py`


def test_register_duplicate(client):
    # first registration should succeed
    resp1 = client.post('/api/register', json={'email': 'dup@example.com', 'password': 'pwd'})
    assert resp1.status_code == 201

    # second registration with same email should return 409
    resp2 = client.post('/api/register', json={'email': 'dup@example.com', 'password': 'pwd'})
    assert resp2.status_code == 409


def test_login_invalid_password(client):
    # ensure user exists
    client.post('/api/register', json={'email': 'loginfail@example.com', 'password': 'rightpass'})

    # attempt login with wrong password
    resp = client.post('/api/login', json={'email': 'loginfail@example.com', 'password': 'wrong'})
    assert resp.status_code == 401


def test_private_no_token(client):
    # access private without token
    resp = client.get('/api/private')
    # Flask-JWT-Extended returns 401 or 422 depending on config; accept both
    assert resp.status_code in (401, 422)


def test_private_invalid_token(client):
    headers = {'Authorization': 'Bearer bad.token.value'}
    resp = client.get('/api/private', headers=headers)
    # invalid token should not be allowed
    assert resp.status_code in (401, 422)
