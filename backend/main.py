from typing import Any, Dict, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import psycopg2

app = FastAPI(
    title="MDR Certification Platform API",
    description=(
        "Backend API for a guided medical device "
        "certification platform based on EU MDR 2017/745."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use the service name `postgres` so containers can resolve it via Docker Compose network
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://mdr_user:mdr_password@postgres:5432/mdr_platform",
)


@app.get("/")
def root() -> Dict[str, Any]:
    return {
        "application": "MDR Certification Platform",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
def health() -> Dict[str, Any]:
    try:
        # simple connectivity check
        with psycopg2.connect(DATABASE_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
                cur.fetchone()

        return {"status": "healthy", "database": "connected"}
    except Exception as error:
        return {"status": "unhealthy", "database": "disconnected", "error": str(error)}


@app.get("/api/regulatory-sources")
def regulatory_sources() -> List[Dict[str, Any]]:
    try:
        with psycopg2.connect(DATABASE_URL) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        id,
                        title,
                        source_type,
                        reference,
                        url,
                        description
                    FROM regulatory_sources
                    ORDER BY title
                    """
                )
                rows = cur.fetchall()

        return [
            {
                "id": str(row[0]),
                "title": row[1],
                "source_type": row[2],
                "reference": row[3],
                "url": row[4],
                "description": row[5],
            }
            for row in rows
        ]
    except Exception as error:
        return [{"error": str(error)}]
