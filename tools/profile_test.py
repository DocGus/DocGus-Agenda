"""Simple profiling harness that exercises register->login->private using Flask test client.

Generates `profiles/profile.html` using pyinstrument when run via the CLI.
"""
import os
from pyinstrument import Profiler

ROOT = os.path.dirname(os.path.dirname(__file__))
import sys
SRC = os.path.join(ROOT, 'src')
if SRC not in sys.path:
    sys.path.insert(0, SRC)

from app import app as flask_app


def exercise_client():
    with flask_app.app_context():
        client = flask_app.test_client()

        # register
        client.post('/api/register', json={'email': 'profile_user@example.com', 'password': 'secret'})
        # login
        login_resp = client.post('/api/login', json={'email': 'profile_user@example.com', 'password': 'secret'})
        token = login_resp.get_json().get('token')
        headers = {'Authorization': f'Bearer {token}'}
        # private
        client.get('/api/private', headers=headers)


def main():
    profiler = Profiler()
    profiler.start()
    exercise_client()
    profiler.stop()

    out_dir = os.path.join(ROOT, 'profiles')
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, 'profile.html')
    with open(out_file, 'w') as f:
        f.write(profiler.output_html())
    print('Profile written to', out_file)


if __name__ == '__main__':
    main()
