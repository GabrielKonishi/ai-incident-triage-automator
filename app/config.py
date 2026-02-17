from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


@dataclass(frozen=True)
class DifyConfig:
    api_key: str
    workflow_url: str
    user: str
    response_mode: str


def load_dify_config() -> DifyConfig:
    """
    Loads Dify configuration from environment variables (and .env when present).

    Required:
      - DIFY_API_KEY

    Optional:
      - DIFY_API_URL (default: https://api.dify.ai/v1/workflows/run)
      - DIFY_USER (default: api-user)
      - DIFY_RESPONSE_MODE (default: blocking)
    """
    load_dotenv()

    api_key = os.getenv("DIFY_API_KEY")
    if not api_key:
        raise RuntimeError("DIFY_API_KEY is not set")

    return DifyConfig(
        api_key=api_key,
        workflow_url=os.getenv("DIFY_API_URL", "https://api.dify.ai/v1/workflows/run"),
        user=os.getenv("DIFY_USER", "api-user"),
        response_mode=os.getenv("DIFY_RESPONSE_MODE", "blocking"),
    )

