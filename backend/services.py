from __future__ import annotations

from typing import Any

from backend.config import load_dify_config
from backend.dify_client import DifyWorkflowClient
from backend.models import IncidentCategory, IncidentResponse, IncidentUrgency


def _first_present(outputs: dict[str, Any], *keys: str, default: Any = None) -> Any:
    for key in keys:
        if key in outputs and outputs[key] is not None:
            return outputs[key]
    return default


def _to_enum(value: Any, enum_type: type[Any], *, default: Any) -> Any:
    """
    Best-effort conversion of Dify output values into enums.
    - accepts already-enum values
    - accepts strings (case-insensitive) matching enum members or values
    """
    if value is None:
        return default

    if isinstance(value, enum_type):
        return value

    if isinstance(value, str):
        normalized = value.strip().upper().replace(" ", "_").replace("-", "_")
        # Try by name (e.g. "CRITICAL") then by value
        try:
            return enum_type[normalized]  # type: ignore[index]
        except Exception:
            for member in enum_type:  # type: ignore[assignment]
                if str(member.value).upper() == normalized:
                    return member
        # Small compatibility aliases
        if enum_type is IncidentCategory and normalized in {"OTHER", "OTHERS"}:
            return IncidentCategory.OTHERS
    return default


class IncidentAnalysisService:
    """
    Application service (business logic).
    Single responsibility: orchestrate Dify call and map response into our API model.
    """

    def __init__(self, client: DifyWorkflowClient) -> None:
        self._client = client

    async def analyze(self, description: str) -> IncidentResponse:
        result = await self._client.run({"description": description})

        data = (result or {}).get("data", {}) or {}
        outputs = (data.get("outputs", {}) or {}) if isinstance(data, dict) else {}

        status = _first_present(outputs, "status", "STATUS", default="unknown")
        category_raw = _first_present(outputs, "category", "CATEGORY", default=None)
        urgency_raw = _first_present(outputs, "urgency", "URGENCY", default=None)
        analysis_summary = _first_present(outputs, "analysis_summary", "ANALYSIS_SUMMARY", default="")
        immediate_action = _first_present(outputs, "immediate_action", "IMMEDIATE_ACTION", default="")

        return IncidentResponse(
            status=str(status) if status is not None else "unknown",
            category=_to_enum(category_raw, IncidentCategory, default=IncidentCategory.OTHERS),
            urgency=_to_enum(urgency_raw, IncidentUrgency, default=IncidentUrgency.MEDIUM),
            immediate_action=str(immediate_action) if immediate_action is not None else "",
            analysis_summary=str(analysis_summary) if analysis_summary is not None else "",
        )


def build_incident_analysis_service() -> IncidentAnalysisService:
    """Composition root for the incident analysis service."""
    config = load_dify_config()
    client = DifyWorkflowClient(config)
    return IncidentAnalysisService(client)


async def analyze_with_dify(description: str) -> dict[str, Any]:
    """
    Backwards-compatible helper returning the raw Dify JSON.
    Prefer using IncidentAnalysisService.analyze().
    """
    config = load_dify_config()
    client = DifyWorkflowClient(config)
    return await client.run({"description": description})