from fastapi import APIRouter, HTTPException, status

from app.schemas.models import ErrorResponse, NmapRequest, NmapResponse
from app.services.ai_service import AIServiceError, AIServiceTimeout, analyze_nmap

router = APIRouter(prefix="/api/nmap", tags=["Nmap"])


@router.post(
    "/translate",
    response_model=NmapResponse,
    responses={
        400: {"model": ErrorResponse},
        502: {"model": ErrorResponse},
        504: {"model": ErrorResponse},
    },
)
async def translate_nmap(payload: NmapRequest) -> NmapResponse:
    try:
        return await analyze_nmap(payload.scan_text)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except AIServiceTimeout as exc:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(exc)) from exc
    except AIServiceError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
