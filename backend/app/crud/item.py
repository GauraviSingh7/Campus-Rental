from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models import Item
from app.schemas import ItemCreate, ItemUpdate
from uuid import uuid4, UUID
from sqlalchemy import select, func
from typing import Optional
from fastapi import HTTPException, status

async def create_item(
    db: AsyncSession,
    item: ItemCreate,
    owner_id: str
):
    new_item = Item(
        id=uuid4(),
        title=item.title,
        sell_price=item.sell_price,
        rent_price_per_day=item.rent_price_per_day,
        is_for_sale=item.is_for_sale,
        is_for_rent=item.is_for_rent,
        owner_id=owner_id,
        description=item.description
    )

    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item

async def update_item(
    db: AsyncSession,
    item_id: UUID,
    item_data: ItemUpdate,
    user_id: str
):
    result = await db.execute(
        select(Item).where(Item.id == item_id)
    )
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    

    # 🔐 AUTHORIZATION CHECK
    if str(item.owner_id) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to update this item"
        )

    for field, value in item_data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    await db.commit()
    await db.refresh(item)
    return item

async def get_item_for_delete(db, item_id: UUID):
    result = await db.execute(
        select(Item).where(Item.id == item_id)
    )
    return result.scalar_one_or_none()

async def get_item_with_images(
    db: AsyncSession,
    item_id: UUID
):
    result = await db.execute(
        select(Item)
        .options(
            selectinload(Item.images),
            selectinload(Item.owner)
        )
        .where(Item.id == item_id)
    )
    return result.scalar_one_or_none()


async def get_items_paginated(
    db: AsyncSession,
    limit: int = 10,
    offset: int = 0,
    for_sale: Optional[bool] = None,
    for_rent: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rent: Optional[float] = None,
    max_rent: Optional[float] = None,
    search: Optional[str] = None,
    owner_id: Optional[str] = None
):
    """Get paginated items with optional filters"""
    
    # Build base query
    query = select(Item).options(selectinload(Item.images), selectinload(Item.owner))
    
    # Apply filters
    if for_sale is not None:
        query = query.where(Item.is_for_sale == for_sale)
    
    if for_rent is not None:
        query = query.where(Item.is_for_rent == for_rent)
    
    if min_price is not None:
        query = query.where(Item.sell_price >= min_price)
    
    if max_price is not None:
        query = query.where(Item.sell_price <= max_price)
    
    if min_rent is not None:
        query = query.where(Item.rent_price_per_day >= min_rent)
    
    if max_rent is not None:
        query = query.where(Item.rent_price_per_day <= max_rent)
    
    if search:
        query = query.where(Item.title.ilike(f"%{search}%"))
    
    if owner_id:
        query = query.where(Item.owner_id == owner_id)
    
    # Get total count
    count_query = select(func.count()).select_from(Item)
    
    if for_sale is not None:
        count_query = count_query.where(Item.is_for_sale == for_sale)
    if for_rent is not None:
        count_query = count_query.where(Item.is_for_rent == for_rent)
    if min_price is not None:
        count_query = count_query.where(Item.sell_price >= min_price)
    if max_price is not None:
        count_query = count_query.where(Item.sell_price <= max_price)
    if min_rent is not None:
        count_query = count_query.where(Item.rent_price_per_day >= min_rent)
    if max_rent is not None:
        count_query = count_query.where(Item.rent_price_per_day <= max_rent)
    if search:
        count_query = count_query.where(Item.title.ilike(f"%{search}%"))
    if owner_id:
        count_query = count_query.where(Item.owner_id == owner_id)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    query = query.order_by(Item.id.desc()).offset(offset).limit(limit)
    
    result = await db.execute(query)
    items = result.scalars().all()
    
    return {
        "items": items,
        "total": total,
        "limit": limit,
        "offset": offset,
        "has_more": (offset + limit) < total
    }