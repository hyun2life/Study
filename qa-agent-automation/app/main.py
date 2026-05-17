"""Command-line entry point for the QA Daily Report Bot."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

if __package__ in {None, ""}:
    sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.config_profiles import load_profile
from app.config import Settings
from app.orchestrator import QaReportOrchestrator
from app.schemas.state import AutomationState


def build_parser() -> argparse.ArgumentParser:
    """Build the command-line argument parser."""
    parser = argparse.ArgumentParser(description="Generate a mock QA daily report.")
    parser.add_argument("--owner", help="GitHub owner or organization name.")
    parser.add_argument("--repo", help="GitHub repository name.")
    parser.add_argument("--title", help="Report title.")
    parser.add_argument(
        "--scenario",
        choices=["normal", "release-risk", "quiet"],
        help="Mock issue scenario to render.",
    )
    parser.add_argument("--profile", help="Named report profile to load.")
    parser.add_argument(
        "--profile-file",
        default="config/report_profiles.yaml",
        help="Path to the simple YAML report profile file.",
    )
    parser.add_argument("--output-dir", help="Directory for generated reports.")
    parser.add_argument("--timezone", help="Report timezone, for example Asia/Seoul.")
    parser.add_argument(
        "--preview",
        choices=["markdown", "html", "html-ko", "paths"],
        default="markdown",
        help="Choose what to print to stdout after generation.",
    )
    parser.add_argument(
        "--show-paths",
        action="store_true",
        help="Print generated artifact paths after the preview output.",
    )
    parser.add_argument(
        "--open-html",
        choices=["en", "ko"],
        help="Print the generated HTML file path intended for browser or email preview.",
    )
    parser.add_argument(
        "--no-markdown",
        action="store_true",
        help="Do not save the Markdown report file.",
    )
    parser.add_argument(
        "--no-html",
        action="store_true",
        help="Do not save the English HTML report file.",
    )
    parser.add_argument(
        "--no-ko-html",
        action="store_true",
        help="Do not save the Korean HTML report file.",
    )
    parser.add_argument(
        "--ko-only",
        action="store_true",
        help="Save only the Korean HTML report and manifest.",
    )
    parser.add_argument(
        "--no-manifest",
        action="store_true",
        help="Do not save the generated artifact manifest JSON file.",
    )
    parser.add_argument(
        "--no-index",
        action="store_true",
        help="Do not save reports/index.html.",
    )
    parser.add_argument(
        "--no-email-payload",
        action="store_true",
        help="Do not save the mock email payload JSON file.",
    )
    return parser


def settings_from_args(args: argparse.Namespace) -> Settings:
    """Create settings by applying CLI overrides on top of environment settings."""
    settings = Settings.from_env()
    updates: dict[str, object] = {}

    if args.profile:
        profile = load_profile(args.profile, args.profile_file)
        profile_mapping = {
            "owner": "github_owner",
            "repo": "github_repo",
            "title": "report_title",
            "output_dir": "report_output_dir",
            "timezone": "report_timezone",
            "scenario": "mock_scenario",
        }
        for profile_key, settings_key in profile_mapping.items():
            if profile_key in profile:
                updates[settings_key] = profile[profile_key]

    if args.owner:
        updates["github_owner"] = args.owner
    if args.repo:
        updates["github_repo"] = args.repo
    if args.title:
        updates["report_title"] = args.title
    if args.scenario:
        updates["mock_scenario"] = args.scenario
    if args.output_dir:
        updates["report_output_dir"] = args.output_dir
    if args.timezone:
        updates["report_timezone"] = args.timezone

    if args.ko_only:
        updates["save_report_to_file"] = False
        updates["save_html_report_to_file"] = False
        updates["save_korean_html_report_to_file"] = True
    else:
        if args.no_markdown:
            updates["save_report_to_file"] = False
        if args.no_html:
            updates["save_html_report_to_file"] = False
        if args.no_ko_html:
            updates["save_korean_html_report_to_file"] = False

    if args.no_manifest:
        updates["save_manifest_to_file"] = False
    if args.no_index:
        updates["save_index_to_file"] = False
    if args.no_email_payload:
        updates["save_email_payload_to_file"] = False

    return settings.model_copy(update=updates)


def artifact_paths(state: AutomationState) -> dict[str, str]:
    """Return generated report artifact paths."""
    paths = {
        "markdown": state.report_path,
        "html": state.html_report_path,
        "html_ko": state.korean_html_report_path,
        "email_payload": state.email_payload_path,
        "manifest": state.manifest_path,
        "index": state.index_path,
    }
    return {key: value for key, value in paths.items() if value}


def render_preview(state: AutomationState, preview: str) -> str:
    """Render the requested preview output."""
    if state.report is None:
        raise RuntimeError("Report generation failed.")

    if preview == "html":
        return state.report.to_html()
    if preview == "html-ko":
        return state.report.to_korean_html()
    if preview == "paths":
        paths = artifact_paths(state)
        return "\n".join(f"{key}: {value}" for key, value in paths.items()) + "\n"
    return state.report.to_markdown()


def main() -> None:
    """Run the mock QA report workflow and print the requested preview."""
    parser = build_parser()
    args = parser.parse_args()
    settings = settings_from_args(args)
    orchestrator = QaReportOrchestrator.from_settings(settings)
    state = orchestrator.run()

    print(render_preview(state, args.preview), end="")

    if args.show_paths:
        print("\nGenerated artifacts:")
        for key, value in artifact_paths(state).items():
            print(f"- {key}: {value}")

    if args.open_html:
        selected_path = (
            state.korean_html_report_path if args.open_html == "ko" else state.html_report_path
        )
        if selected_path:
            print(f"\nHTML preview path: {selected_path}")
        else:
            print("\nHTML preview path was not generated for this run.")


if __name__ == "__main__":
    main()
