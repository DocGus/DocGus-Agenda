"""Compatibility shim for Werkzeug 3.x

Some versions of Flask or test helpers expect `werkzeug.__version__` to exist.
Werkzeug 3.x may not expose `__version__` as an attribute; this shim ensures
the attribute exists so code that inspects it doesn't crash.

This is intentionally minimal and temporary — the long-term fix is to
upgrade Flask and other dependencies for native compatibility.
"""
import importlib
import importlib.metadata

try:
    import werkzeug
except Exception:
    # If werkzeug isn't importable here, nothing to do.
    werkzeug = None

if werkzeug is not None:
    if not hasattr(werkzeug, "__version__"):
        try:
            # Prefer distribution metadata if available
            ver = importlib.metadata.version("werkzeug")
        except Exception:
            # Fallback to a safe default; it's better than missing attr
            ver = "3.0.0"
        # ensure __version__ exists and is a plain string
        try:
            setattr(werkzeug, "__version__", str(ver))
        except Exception:
            # If we can't set it for some reason, ignore — it's best-effort
            pass
