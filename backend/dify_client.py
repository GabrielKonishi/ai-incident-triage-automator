from __future__ import annotations

from typing import Any, Mapping

import httpx

from config import DifyConfig


class DifyWorkflowClient:
    """
    Low-level client to call Dify workflow endpoint.
    Single responsibility: HTTP request/response.
    """

    def __init__(self, config: DifyConfig, client: httpx.AsyncClient | None = None) -> None:
        self._config = config
        self._client = client

    async def run(self, inputs: Mapping[str, Any]) -> dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {self._config.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "inputs": dict(inputs),
            "response_mode": self._config.response_mode,
            "user": self._config.user,
        }

        if self._client is None:
            async with httpx.AsyncClient(timeout=90) as client:
                response = await client.post(self._config.workflow_url, json=payload, headers=headers)
        else:
            response = await self._client.post(self._config.workflow_url, json=payload, headers=headers)

        response.raise_for_status()
        return response.json()

