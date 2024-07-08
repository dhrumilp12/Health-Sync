import os
secret_key = os.urandom(24).hex()
print(secret_key)
