Profiling instructions

1. Install dev dependencies:

   ```bash
   python -m pip install -r dev-requirements.txt
   ```

2. Run the profiler:

   ```bash
   python tools/profile_test.py
   ```

3. Open `profiles/profile.html` in your browser to inspect the flamegraph and hotspots.

Notes:
- This harness uses the Flask test client so it does not require a running server.
- For real load testing use `wrk` or `locust` against a deployed instance.
