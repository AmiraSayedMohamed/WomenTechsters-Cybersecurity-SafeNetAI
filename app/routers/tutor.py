from fastapi import APIRouter, HTTPException, status

from app.schemas.models import ErrorResponse, TutorRequest, TutorResponse
from app.services.ai_service import AIServiceError, AIServiceTimeout, tutor_reply

router = APIRouter(prefix="/api/tutor", tags=["Tutor"])


@router.post(
    "/chat",
    response_model=TutorResponse,
    responses={
        400: {"model": ErrorResponse},
        502: {"model": ErrorResponse},
        504: {"model": ErrorResponse},
    },
)
async def chat_with_tutor(payload: TutorRequest) -> TutorResponse:
    try:
        return await tutor_reply(payload.question)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except AIServiceTimeout as exc:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(exc)) from exc
    except AIServiceError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
