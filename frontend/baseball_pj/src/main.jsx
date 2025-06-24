import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 확대 제한 스크립트
const preventExcessiveZoom = () => {
  let currentZoom = 1;
  
  // 키보드 확대 방지 (Ctrl + +, Ctrl + -)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=' || e.key === '-')) {
      if (e.key === '+' || e.key === '=') {
        if (currentZoom >= 1.2) {
          e.preventDefault();
          return false;
        }
        currentZoom = Math.min(currentZoom + 0.1, 1.2);
      }
    }
  });

  // 마우스 휠 확대 방지
  document.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.deltaY < 0 && currentZoom >= 1.2) {
        e.preventDefault();
        return false;
      }
    }
  }, { passive: false });

  // 터치 핀치 확대 방지
  let lastTouchDistance = 0;
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      lastTouchDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
    }
  });

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      const currentDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      
      if (currentDistance > lastTouchDistance && currentZoom >= 1.2) {
        e.preventDefault();
        return false;
      }
    }
  }, { passive: false });
};

// DOM이 로드된 후 실행
if (typeof window !== 'undefined') {
  preventExcessiveZoom();
}

createRoot(document.getElementById('root')).render(
    <App />
)
