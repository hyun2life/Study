"""Minimal report profile loader.

The project intentionally avoids a YAML dependency for now. This loader supports
the simple two-level scalar YAML shape used by config/report_profiles.yaml.
"""

from __future__ import annotations

from pathlib import Path


def load_profile(profile_name: str, profile_file: str | Path) -> dict[str, str]:
    """Load a named profile from a simple YAML file."""
    path = Path(profile_file)
    if not path.exists():
        project_relative_path = Path(__file__).resolve().parents[1] / path
        if project_relative_path.exists():
            path = project_relative_path
        else:
            raise FileNotFoundError(f"Profile file not found: {path}")

    profiles: dict[str, dict[str, str]] = {}
    current_profile: str | None = None

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.split("#", 1)[0].rstrip()
        if not line:
            continue
        if not line.startswith(" ") and line.endswith(":"):
            current_profile = line[:-1].strip()
            profiles[current_profile] = {}
            continue
        if current_profile and ":" in line:
            key, value = line.strip().split(":", 1)
            profiles[current_profile][key.strip()] = value.strip().strip("\"'")

    if profile_name not in profiles:
        available = ", ".join(sorted(profiles)) or "none"
        raise KeyError(f"Profile '{profile_name}' not found. Available: {available}")

    return profiles[profile_name]
