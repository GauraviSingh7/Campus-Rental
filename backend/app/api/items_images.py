from fastapi import APIRouter, Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID, uuid4
from sqlalchemy import select

from app.db import get_db
from app.core.security import get_current_user
from app.core.supabase import supabase_admin
from app.models import Item, ItemImage

router = APIRouter(prefix="/items", tags=["Item Images"])


@router.post("/{item_id}/images")
async def upload_item_image(
    item_id: UUID,
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 1️⃣ Fetch item
    result = await db.execute(
        select(Item).where(Item.id == item_id)
    )
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # 2️⃣ Ownership check
    if str(item.owner_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not allowed")

    # 3️⃣ Enforce 5-image limit
    count_res = await db.execute(
        select(ItemImage).where(ItemImage.item_id == item_id)
    )
    if len(count_res.scalars().all()) >= 5:
        raise HTTPException(status_code=400, detail="Maximum 5 images allowed")

    # 4️⃣ Prepare file path
    file_ext = file.filename.split(".")[-1]
    file_path = f"{item_id}/{uuid4()}.{file_ext}"

    content = await file.read()

    # 5️⃣ Upload to Supabase Storage (SERVICE ROLE)
    supabase_admin.storage.from_("item-images").upload(
        file_path,
        content,
        file_options={"content-type": file.content_type}
    )

    # 6️⃣ Get public URL
    public_url = supabase_admin.storage.from_("item-images").get_public_url(
        file_path
    )

    # 7️⃣ Save to DB
    image = ItemImage(
        item_id=item_id,
        image_url=public_url
    )

    db.add(image)
    await db.commit()
    await db.refresh(image)

    return {"image_url": public_url}
