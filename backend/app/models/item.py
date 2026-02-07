import uuid
from sqlalchemy import Column, String, Numeric, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    sell_price = Column(Numeric, nullable=True)
    rent_price_per_day = Column(Numeric, nullable=True)
    is_for_sale = Column(Boolean, default=False)
    is_for_rent = Column(Boolean, default=False)
    owner_id = Column(UUID(as_uuid=True), nullable=False)
    images = relationship(
        "ItemImage",
        back_populates="item",
        cascade="all, delete-orphan"
    )
