import time
import json

print(json.dumps({"tz": int(time.timezone / 60)}))

