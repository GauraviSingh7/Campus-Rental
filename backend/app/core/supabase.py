from supabase import create_client
from app.core.config import settings

# Public (used for auth verification)
supabase_public = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_ANON_KEY
)

# Admin (used for storage + privileged ops)
supabase_admin = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY
)
