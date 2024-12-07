import bcrypt

def cache_password(password: str) -> (bytes, bytes):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed, salt

def verify_password(password: str, hashed: bytes, salt: bytes) -> bool:
    check_hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed == check_hashed