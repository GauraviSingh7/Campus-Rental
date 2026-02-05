from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas import ItemCreate, ItemResponse
from app.crud.item import create_item

router = APIRouter(prefix="/items", tags=["Items"])

@router.post("/", response_model=ItemResponse)
async def create_item_api(
    item: ItemCreate,
    db: AsyncSession = Depends(get_db)
):
    return await create_item(db, item)
