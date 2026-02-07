from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Item
from app.schemas import ItemCreate, ItemUpdate
from uuid import uuid4, UUID
from sqlalchemy import select
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
        owner_id=owner_id
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


async def delete_item(
    db: AsyncSession,
    item_id: UUID,
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
            detail="You are not allowed to delete this item"
        )

    await db.delete(item)
    await db.commit()