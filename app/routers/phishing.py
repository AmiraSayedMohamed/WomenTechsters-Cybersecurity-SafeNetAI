from fastapi import APIRouter, HTTPException, status

from app.schemas.models import ErrorResponse, PhishingRequest, PhishingResponse
from app.services.ai_service import AIServiceError, AIServiceTimeout, analyze_phishing

router = APIRouter(prefix="/api/phishing", tags=["Phishing"])


@router.post(
    "/check",
    response_model=PhishingResponse,
    responses={
        400: {"model": ErrorResponse},
        502: {"model": ErrorResponse},
        504: {"model": ErrorResponse},
    },
)
async def check_phishing(payload: PhishingRequest) -> PhishingResponse:
    try:
        return await analyze_phishing(payload.text)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except AIServiceTimeout as exc:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(exc)) from exc
    except AIServiceError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
