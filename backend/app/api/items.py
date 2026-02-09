from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas import ItemCreate, ItemResponse, ItemUpdate, ItemDetailResponse, PaginatedItemsResponse
from app.crud.item import create_item, update_item, get_item_with_images, get_item_for_delete, get_items_paginated
from app.models import ItemImage
from app.core.security import get_current_user
from app.core.supabase import supabase_admin
from sqlalchemy import select
from typing import Optional
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

@router.get("/", response_model=PaginatedItemsResponse)
async def list_items(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    is_for_sale: Optional[bool] = None,
    is_for_rent: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rent: Optional[float] = None,
    max_rent: Optional[float] = None,
    search: Optional[str] = None,
    owner_id: Optional[str] = None
):
    return await get_items_paginated(
        db=db,
        limit=limit,
        offset=offset,
        for_sale=is_for_sale,
        for_rent=is_for_rent,
        min_price=min_price,
        max_price=max_price,
        min_rent=min_rent,
        max_rent=max_rent,
        search=search,
        owner_id=owner_id
    )


@router.get("/{item_id}", response_model=ItemDetailResponse)
async def get_item(
    item_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    item = await get_item_with_images(db, item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    return item

@router.delete("/{item_id}", status_code=204)
async def delete_item(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    item = await get_item_for_delete(db, item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if str(item.owner_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not allowed")

    images_res = await db.execute(
        select(ItemImage).where(ItemImage.item_id == item_id)
    )
    images = images_res.scalars().all()

    if images:
        paths = [
            img.image_url.split("/item-images/")[1]
            for img in images
        ]

        supabase_admin.storage.from_("item-images").remove(paths)

    for img in images:
        await db.delete(img)

    await db.delete(item)
    await db.commit()

    return