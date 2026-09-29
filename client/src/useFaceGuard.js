import { useEffect, useRef, useState } from 'react';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

export default function useFaceGuard(active = true) {
  const videoRef = useRef(null);
  const [camOn, setCamOn] = useState(false);
  const [faces, setFaces] = useState(0);

  useEffect(() => {
    if (!active) return;
    let stream, det, timer, dead = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (dead) return stream.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCamOn(true);
        stream.getVideoTracks()[0].onended = () => setCamOn(false);

        const fs = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm');
        det = await FaceDetector.createFromOptions(fs, {
          baseOptions: { modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite' },
          runningMode: 'VIDEO'
        });
        timer = setInterval(() => {
          const v = videoRef.current;
          if (v && v.readyState >= 2)
            setFaces(det.detectForVideo(v, performance.now()).detections.length);
        }, 700);
      } catch { setCamOn(false); }
    })();
    return () => { dead = true; clearInterval(timer); stream?.getTracks().forEach(t => t.stop()); };
  }, [active]);

  return { videoRef, camOn, faces };
}