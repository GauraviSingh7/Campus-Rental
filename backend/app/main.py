from fastapi import FastAPI
from app.api import items, items_images

app = FastAPI(title="Campus Rental API")

app.include_router(items.router)
app.include_router(items_images.router)
