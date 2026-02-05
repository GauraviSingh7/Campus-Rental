from fastapi import FastAPI
from app.api import items

app = FastAPI(title="Campus Rental API")

app.include_router(items.router)
