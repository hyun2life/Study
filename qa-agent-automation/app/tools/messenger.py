"""Messenger abstraction for future Discord or Slack delivery."""

from __future__ import annotations


class Messenger:
    """Placeholder messenger that can later send reports to chat tools."""

    def __init__(self, enabled: bool = False) -> None:
        self.enabled = enabled

    def send(self, markdown: str) -> bool:
        """Pretend to send a Markdown report.

        Returns True only when sending is enabled. The actual Discord or Slack
        integration should be added behind this interface later.
        """
        if not self.enabled:
            return False

        _ = markdown
        raise NotImplementedError("Real messenger integration is not implemented yet.")

