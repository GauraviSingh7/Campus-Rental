from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Item
from app.schemas import ItemCreate
from uuid import uuid4

async def create_item(db: AsyncSession, item: ItemCreate):
    new_item = Item(
        id=uuid4(),
        title=item.title,
        sell_price=item.sell_price,
        rent_price_per_day=item.rent_price_per_day,
        is_for_sale=item.is_for_sale,
        is_for_rent=item.is_for_rent,
        owner_id=uuid4()  # temp
    )

    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item
