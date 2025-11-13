# Create uploads directory if it doesn't exist
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from pathlib import Path
import shutil


app = FastAPI()

allowed_origins = [
    "http://localhost:3000",
    "https://app-billzynergy-frontend-dev.azurewebsites.net",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("version 1.2")
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "upload"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
CHUNK_SIZE = 1024 * 1024


def _cleanup_upload_dir() -> None:
    for path in UPLOAD_DIR.iterdir():
        if path.is_file() or path.is_symlink():
            path.unlink(missing_ok=True)
        elif path.is_dir():
            shutil.rmtree(path)


def _next_destination(extension: str) -> Path:
    base_name = "up_load"
    return UPLOAD_DIR / f"{base_name}{extension}"


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print("upload function called")
    try:
        if not file.filename:
            return JSONResponse(
                content={"error": "Filename is required."},
                status_code=400
            )

        safe_name = os.path.basename(file.filename)
        extension = Path(safe_name).suffix
        _cleanup_upload_dir()
        destination = _next_destination(extension)
        size = 0

        with destination.open("wb") as buffer:
            while True:
                chunk = await file.read(CHUNK_SIZE)
                if not chunk:
                    break
                size += len(chunk)
                buffer.write(chunk)

        await file.close()

        return JSONResponse(
            content={
                "filename": destination.name,
                "original_path": file.filename,
                "content_type": file.content_type,
                "size": size,
                "saved_path": str(destination.resolve())
            },
            status_code=200
        )
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

@app.get("/upload-contents")
async def get_upload_contents():
    """Get list of files and directories in the upload folder"""
    try:
        if not UPLOAD_DIR.exists():
            return JSONResponse(
                content={"contents": [], "total_size": 0},
                status_code=200
            )
        
        contents = []
        total_size = 0
        
        for path in UPLOAD_DIR.iterdir():
            if path.is_file():
                file_size = path.stat().st_size
                total_size += file_size
                contents.append({
                    "name": path.name,
                    "type": "file",
                    "size": file_size,
                    "path": str(path.resolve())
                })
            elif path.is_dir():
                contents.append({
                    "name": path.name,
                    "type": "directory",
                    "path": str(path.resolve())
                })
        
        return JSONResponse(
            content={
                "contents": contents,
                "total_size": total_size,
                "count": len(contents)
            },
            status_code=200
        )
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

@app.get("/")
async def root():
    return {"message": "File upload API is running"}
