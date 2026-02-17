
from __future__ import annotations

import logging
from functools import lru_cache

import httpx
from fastapi import FastAPI, HTTPException

from app.models import IncidentInput, IncidentResponse
from app.services import IncidentAnalysisService, build_incident_analysis_service

app = FastAPI()
logger = logging.getLogger(__name__)


@lru_cache
def get_analysis_service() -> IncidentAnalysisService:
    # Cached composition root so we don't rebuild per request.
    return build_incident_analysis_service()


@app.post("/analyze", response_model=IncidentResponse)
async def analyze_incident(incident: IncidentInput):
    try:
        service = get_analysis_service()
        return await service.analyze(incident.description)
    except httpx.HTTPStatusError as e:
        logger.exception("Dify returned an HTTP error")
        raise HTTPException(status_code=502, detail="Upstream Dify error") from e
    except httpx.HTTPError as e:
        logger.exception("Network error calling Dify")
        raise HTTPException(status_code=502, detail="Network error calling upstream Dify") from e
    except Exception as e:
        logger.exception("Unexpected error analyzing incident")
        raise HTTPException(status_code=500, detail="Error analyzing incident") from e