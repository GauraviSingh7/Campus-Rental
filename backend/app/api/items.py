from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.db import get_db
from app.schemas import ItemCreate, ItemResponse, ItemUpdate, ItemDetailResponse
from app.crud.item import create_item, update_item, delete_item, get_item_with_images
from app.core.security import get_current_user
from uuid import UUID

router = APIRouter(prefix="/items", tags=["Items"])

@router.post("/", response_model=ItemResponse)
async def create_item_api(
    item: ItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await create_item(db, item, current_user.id)

@router.put("/{item_id}", response_model=ItemResponse)
async def update_item_api(
    item_id: UUID,
    item: ItemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await update_item(db, item_id, item, current_user.id)


@router.delete("/{item_id}", status_code=204)
async def delete_item_api(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    await delete_item(db, item_id, current_user.id)

@router.get("/{item_id}", response_model=ItemDetailResponse)
async def get_item(
    item_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    item = await get_item_with_images(db, item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    return item