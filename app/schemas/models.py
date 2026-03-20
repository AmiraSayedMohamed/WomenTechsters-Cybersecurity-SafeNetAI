from enum import Enum
from typing import List

from pydantic import BaseModel, Field, field_validator


class SafetyMode(str, Enum):
    PHISHING = "PHISHING"
    NMAP = "NMAP"
    TUTOR = "TUTOR"


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "SafeNet AI API"


class ErrorResponse(BaseModel):
    error: str


class PhishingRequest(BaseModel):
    text: str = Field(..., description="Suspicious message, link, or email content")

    @field_validator("text")
    @classmethod
    def validate_text(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("Please enter a message to check")
        return value.strip()


class PhishingResponse(BaseModel):
    verdict: str
    explanation: str
    red_flags: List[str]
    actions: List[str]


class NmapRequest(BaseModel):
    scan_text: str = Field(..., description="Raw Nmap scan output")

    @field_validator("scan_text")
    @classmethod
    def validate_scan_text(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("Please paste your Nmap scan results")
        return value.strip()


class NmapResponse(BaseModel):
    summary: str
    open_ports: List[str]
    risk_level: str
    risk_explanation: str
    next_steps: List[str]


class TutorRequest(BaseModel):
    question: str

    @field_validator("question")
    @classmethod
    def validate_question(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("Please enter your question for the AI Tutor")
        return value.strip()


class TutorResponse(BaseModel):
    answer: str
