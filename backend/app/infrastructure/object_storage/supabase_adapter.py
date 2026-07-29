from supabase import create_client, Client
from app.bootstrap.config import settings

class SupabaseStorageAdapter:
    def __init__(self):
        if settings.SUPABASE_URL and settings.SUPABASE_SECRET_KEY:
            self.client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SECRET_KEY)
        else:
            self.client = None

    def upload_file(self, bucket_name: str, file_path: str, file_bytes: bytes, content_type: str):
        if not self.client:
            raise Exception("Supabase client not configured")
        
        try:
            return self.client.storage.from_(bucket_name).upload(
                file=file_bytes,
                path=file_path,
                file_options={"content-type": content_type}
            )
        except Exception as e:
            if "Bucket not found" in str(e):
                self.client.storage.create_bucket(bucket_name, options={"public": False})
                return self.client.storage.from_(bucket_name).upload(
                    file=file_bytes,
                    path=file_path,
                    file_options={"content-type": content_type}
                )
            raise e

    def get_signed_url(self, bucket_name: str, file_path: str, expires_in: int = 3600):
        if not self.client:
            return None
        res = self.client.storage.from_(bucket_name).create_signed_url(file_path, expires_in)
        return res.get("signedURL") if res else None

    def download_file(self, bucket_name: str, file_path: str) -> bytes:
        if not self.client:
            raise Exception("Supabase client not configured")
        
        # storage.from_().download() has a strict default timeout which fails for large files.
        # Bypass it by generating a signed URL and using requests with a high timeout.
        import requests
        signed_url = self.get_signed_url(bucket_name, file_path, expires_in=600)
        if not signed_url:
            raise Exception("Could not generate signed URL for download")
        
        response = requests.get(signed_url, timeout=600) # 10 minutes timeout for large files
        response.raise_for_status()
        return response.content

    def delete_file(self, bucket_name: str, file_path: str):
        if not self.client:
            raise Exception("Supabase client not configured")
        
        try:
            import requests
            headers = {
                "Authorization": f"Bearer {settings.SUPABASE_SECRET_KEY}",
                "Content-Type": "application/json"
            }
            url = f"{settings.SUPABASE_URL.rstrip('/')}/storage/v1/object/{bucket_name}"
            res = requests.delete(url, json={"prefixes": [file_path]}, headers=headers, timeout=30)
            if res.status_code in (200, 204, 404):
                return res.json() if res.status_code == 200 else None
        except Exception:
            pass

        return self.client.storage.from_(bucket_name).remove([file_path])

storage_adapter = SupabaseStorageAdapter()
