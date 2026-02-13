from fastapi import FastAPI, UploadFile, File, Response # Import Response
from rembg import remove
from PIL import Image
import io

""" The endpoint accepts an uploaded image

The image is read into memory

The background is removed

The result is saved as a PNG with transparency

The image is returned to the client
 """
app = FastAPI()

@app.get("/health")
def health():
           return {"status": "ok"}
@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        output = remove(image)
        return Response(content=output, media_type="image/png")

"""         buffer = io.BytesIO()
        output.save(buffer, format="PNG")
        buffer.seek(0)

        return buffer.getvalue() """
        # Save the output image to a bytes buffer
        