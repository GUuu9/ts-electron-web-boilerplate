import sys
import cv2
import json
import base64
import numpy as np

# 간단한 엣지 검출 예시
def process_image(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return {"error": "Could not read image"}
    
    # 엣지 검출
    edges = cv2.Canny(img, 100, 200)
    
    _, buffer = cv2.imencode('.png', edges)
    b64_str = base64.b64encode(buffer).decode('utf-8')
    
    return {"image": f"data:image/png;base64,{b64_str}"}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # 실제 환경에서는 파일 경로를 전달받음
        result = process_image(sys.argv[1])
        print(json.dumps(result))
