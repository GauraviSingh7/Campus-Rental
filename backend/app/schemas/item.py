from pydantic import BaseModel
from typing import Optional, List
from app.schemas.item_image import ItemImageResponse
from uuid import UUID

class ItemCreate(BaseModel):
    title: str
    sell_price: Optional[float] = None
    rent_price_per_day: Optional[float] = None
    is_for_sale: bool = False
    is_for_rent: bool = False
    description: Optional[str] = None

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
    description: Optional[str] = None

class OwnerInfo(BaseModel):
    full_name: str
    phone: str

    class Config:
        from_attributes = True

class ItemDetailResponse(ItemResponse):
    images: List[ItemImageResponse] = []
    owner: Optional[OwnerInfo] = None

class PaginatedItemsResponse(BaseModel):
    items: List[ItemDetailResponse]
    total: int
    limit: int
    offset: int
    has_more: bool