from __future__ import annotations

from enum import Enum

from pydantic import BaseModel


class IncidentCategory(str, Enum):
    HARDWARE = "HARDWARE"
    SOFTWARE = "SOFTWARE"
    NETWORK = "NETWORK"
    DATABASE = "DATABASE"
    SECURITY = "SECURITY"
    OTHERS = "OTHERS"


class IncidentUrgency(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class IncidentInput(BaseModel):
    description: str
    reported_by: str
    source: str

class IncidentResponse(BaseModel):
    status: str
    category: IncidentCategory
    urgency: IncidentUrgency
    immediate_action: str
    analysis_summary: str