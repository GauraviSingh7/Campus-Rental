from pydantic import BaseModel
from uuid import UUID

class ItemImageResponse(BaseModel):
    id: UUID
    image_url: str

    class Config:
        from_attributes = True
