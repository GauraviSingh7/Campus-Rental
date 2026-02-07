from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class ItemCreate(BaseModel):
    title: str
    sell_price: Optional[float] = None
    rent_price_per_day: Optional[float] = None
    is_for_sale: bool = False
    is_for_rent: bool = False

class ItemResponse(ItemCreate):
    id: UUID
    owner_id: UUID

    class Config:
        from_attributes = True

class ItemUpdate(BaseModel):
    title: Optional[str] = None
    sell_price: Optional[float] = None
    rent_price_per_day: Optional[float] = None
    is_for_sale: Optional[bool] = None
    is_for_rent: Optional[bool] = None