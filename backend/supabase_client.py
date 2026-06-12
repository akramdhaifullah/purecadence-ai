import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(".env.local")
load_dotenv()

# These will be loaded by python-dotenv
url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

def get_supabase_client() -> Client:
    if not url or not key:
        raise ValueError("Supabase credentials not found in environment variables.")
    return create_client(url, key)

# Create a singleton client instance
# For operations requiring elevated privileges, use the service role key
supabase: Client = get_supabase_client() if url and key else None
