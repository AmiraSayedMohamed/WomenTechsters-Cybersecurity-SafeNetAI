from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.routers import nmap, phishing, tutor
from app.schemas.models import HealthResponse

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.parsed_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(phishing.router)
app.include_router(nmap.router)
app.include_router(tutor.router)


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok", service=settings.app_name)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    first_error = exc.errors()[0] if exc.errors() else {}
    message = first_error.get("msg", "Invalid request payload")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"error": message},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    if isinstance(exc.detail, dict) and "error" in exc.detail:
        message = str(exc.detail["error"])
    elif isinstance(exc.detail, str):
        message = exc.detail
    else:
        message = "Request failed"

    return JSONResponse(
        status_code=exc.status_code,
        content={"error": message},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"error": "Something went wrong. Please try again.", "details": str(exc) if settings.debug else ""},
    )
