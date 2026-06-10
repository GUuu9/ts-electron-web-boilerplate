import sys
import cv2
import json
import base64
import numpy as np

def process_edge(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return {"error": "Could not read image"}
    edges = cv2.Canny(img, 100, 200)
    _, buffer = cv2.imencode('.png', edges)
    b64_str = base64.b64encode(buffer).decode('utf-8')
    return {"image": f"data:image/png;base64,{b64_str}"}

def find_template(screen_path, template_path, threshold=0.8):
    screen = cv2.imread(screen_path)
    template = cv2.imread(template_path)
    
    if screen is None or template is None:
        return {"error": f"Read error: screen={screen is not None}, template={template is not None}"}

    # 템플릿 매칭 수행
    res = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)

    # 성공 여부와 관계없이 최고 유사도 점수(max_val)를 반환
    if max_val >= threshold:
        h, w = template.shape[:2]
        center_x = max_loc[0] + w // 2
        center_y = max_loc[1] + h // 2
        return {"found": True, "x": int(center_x), "y": int(center_y), "confidence": float(max_val)}
    else:
        return {"found": False, "confidence": float(max_val)}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        mode = sys.argv[1]
        
        if mode == "FIND" and len(sys.argv) >= 5:
            try:
                screen_p = sys.argv[2]
                template_p = sys.argv[3]
                threshold = float(sys.argv[4])
                print(json.dumps(find_template(screen_p, template_p, threshold)))
            except Exception as e:
                print(json.dumps({"error": str(e)}))
        else:
            # 기본 엣지 검출 (기존 호환성)
            print(json.dumps(process_edge(sys.argv[1])))
