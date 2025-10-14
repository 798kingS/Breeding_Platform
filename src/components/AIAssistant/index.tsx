import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Modal, theme } from 'antd';
import { useLocation } from 'umi';
import AIChat from '@/pages/AI/AIChat';
import routes from '../../../config/routes';

const AIAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 140, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasInitialized, setHasInitialized] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const hoverFullText = '你好，我是你的专属助手小埋，请问有什么可以帮到你的？';
  const hoverTimerRef = useRef<number | null>(null);
  const dragResetTimerRef = useRef<number | null>(null);

  const buttonRef = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();
  const location = useLocation();
  const placeBubbleRight = position.x < window.innerWidth / 2;

  const displayTitle = useMemo(() => {
    const pathname = location?.pathname || '';
    let bestMatchName: string | undefined;
    let bestMatchLen = -1;

    const dfs = (nodes: any[]) => {
      nodes?.forEach((n) => {
        if (n?.path) {
          const path: string = n.path;
          if (pathname.startsWith(path) && path.length > bestMatchLen && n?.name) {
            bestMatchName = n.name;
            bestMatchLen = path.length;
          }
        }
        if (n?.routes) dfs(n.routes);
      });
    };
    dfs(routes as any);
    return bestMatchName || '育小星';
  }, [location?.pathname]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setDragStartPosition({
        x: e.clientX,
        y: e.clientY,
      });
      setHasDragged(false);
      setIsHovering(false);
      setIsDragging(true);
    }
  };

	// 触摸开始（平板/手机）
	const handleTouchStart = (e: React.TouchEvent) => {
		if (buttonRef.current && e.touches && e.touches.length > 0) {
			const touch = e.touches[0];
			const rect = buttonRef.current.getBoundingClientRect();
			setDragOffset({
				x: touch.clientX - rect.left,
				y: touch.clientY - rect.top,
			});
			setDragStartPosition({
				x: touch.clientX,
				y: touch.clientY,
			});
			setHasDragged(false);
			setIsDragging(true);
		}
	};

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      // 计算移动距离
      const deltaX = Math.abs(e.clientX - dragStartPosition.x);
      const deltaY = Math.abs(e.clientY - dragStartPosition.y);
      
      // 如果移动距离超过5像素，认为是拖动
      if (deltaX > 5 || deltaY > 5) {
        setHasDragged(true);
      }
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // 限制在视窗内
      const el = buttonRef.current;
      const elW = el?.offsetWidth || 88;
      const elH = el?.offsetHeight || 88;
      const margin = 16;
      const maxX = window.innerWidth - elW - margin;
      const maxY = window.innerHeight - elH - margin;
      
      setPosition({
        x: Math.max(margin, Math.min(newX, maxX)),
        y: Math.max(margin, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (dragResetTimerRef.current) {
      window.clearTimeout(dragResetTimerRef.current);
      dragResetTimerRef.current = null;
    }
    // Delay resetting hasDragged to avoid click firing immediately after a drag
    // @ts-ignore
    dragResetTimerRef.current = window.setTimeout(() => {
      setHasDragged(false);
      dragResetTimerRef.current = null;
    }, 200);
  };

	// 触摸移动与结束（使用原生事件，便于 preventDefault）
	const handleTouchMove = (e: TouchEvent) => {
		if (isDragging && e.touches && e.touches.length > 0) {
			// 阻止页面滚动
			e.preventDefault();
			const touch = e.touches[0];
			
			// 计算移动距离
			const deltaX = Math.abs(touch.clientX - dragStartPosition.x);
			const deltaY = Math.abs(touch.clientY - dragStartPosition.y);
			
			// 如果移动距离超过5像素，认为是拖动
			if (deltaX > 5 || deltaY > 5) {
				setHasDragged(true);
			}
			
			const newX = touch.clientX - dragOffset.x;
			const newY = touch.clientY - dragOffset.y;

      const el = buttonRef.current;
      const elW = el?.offsetWidth || 88;
      const elH = el?.offsetHeight || 88;
      const margin = 16;
      const maxX = window.innerWidth - elW - margin;
      const maxY = window.innerHeight - elH - margin;
			setPosition({
				x: Math.max(margin, Math.min(newX, maxX)),
				y: Math.max(margin, Math.min(newY, maxY)),
			});
		}
	};

	const handleTouchEnd = () => {
		setIsDragging(false);
    if (dragResetTimerRef.current) {
      window.clearTimeout(dragResetTimerRef.current);
      dragResetTimerRef.current = null;
    }
    // Delay resetting hasDragged for touch as well
    // @ts-ignore
    dragResetTimerRef.current = window.setTimeout(() => {
      setHasDragged(false);
      dragResetTimerRef.current = null;
    }, 200);
	};

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // 使用 { passive: false } 以便在移动过程中阻止页面滚动
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove as EventListener);
        document.removeEventListener('touchend', handleTouchEnd as EventListener);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <>
      <div
        ref={buttonRef}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: 'auto',
          height: 'auto',
          background: 'transparent',
          boxShadow: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isDragging ? 'scale(1.1) translateZ(10px)' : 'scale(1) translateZ(0px)',
          border: 'none',
          backdropFilter: 'none',
          perspective: '1000px',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          if (!isDragging) return;
          const newX = e.clientX - dragOffset.x;
          const newY = e.clientY - dragOffset.y;
          const el = buttonRef.current;
          const elW = el?.offsetWidth || 88;
          const elH = el?.offsetHeight || 88;
          const margin = 16;
          const maxX = window.innerWidth - elW - margin;
          const maxY = window.innerHeight - elH - margin;
          setPosition({
            x: Math.max(margin, Math.min(newX, maxX)),
            y: Math.max(margin, Math.min(newY, maxY)),
          });
        }}
        onTouchStart={handleTouchStart}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = 'scale(1.05) translateZ(5px)';
            e.currentTarget.style.boxShadow = 'none';
            // 悬浮显示气泡问候
            setIsHovering(true);
            setHoverText('');
            if (hoverTimerRef.current) window.clearInterval(hoverTimerRef.current);
            let idx = 0;
            // @ts-ignore
            hoverTimerRef.current = window.setInterval(() => {
              idx += 1;
              setHoverText(hoverFullText.slice(0, idx));
              if (idx >= hoverFullText.length && hoverTimerRef.current) {
                window.clearInterval(hoverTimerRef.current);
                hoverTimerRef.current = null;
              }
            }, 35);
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = 'scale(1) translateZ(0px)';
            e.currentTarget.style.boxShadow = 'none';
            setIsHovering(false);
            if (hoverTimerRef.current) {
              window.clearInterval(hoverTimerRef.current);
              hoverTimerRef.current = null;
            }
            setHoverText('');
          }
        }}
        onClick={() => {
          if (!isDragging && !hasDragged) {
            setOpen(true);
            if (!hasInitialized) {
              setHasInitialized(true);
            }
          }
        }}
        title="育小星"
        onDragStart={(e) => e.preventDefault()}
      >
        <div style={{
          width: 'auto',
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          position: 'relative',
          animation: 'bounce 2s infinite',
        }}>
          {isHovering && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                ...(placeBubbleRight
                  ? { left: '100%', transform: 'translateY(-50%)', marginLeft: 10 }
                  : { right: '100%', transform: 'translateY(-50%)', marginRight: 10 }
                ),
                maxWidth: 'none',
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                padding: '10px 12px',
                borderRadius: 12,
                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                fontSize: 12,
                lineHeight: 1.5,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                wordBreak: 'keep-all',
                overflow: 'visible',
                display: 'inline-flex',
                alignItems: 'center',
                textAlign: 'left',
              }}
            >
              {hoverText}
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 14,
                  background: '#4fc3f7',
                  marginLeft: 4,
                  animation: 'blink 1s infinite',
                  verticalAlign: 'baseline',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 0,
                  height: 0,
                  ...(placeBubbleRight
                    ? { right: '100%', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '8px solid rgba(0,0,0,0.75)' }
                    : { left: '100%', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '8px solid rgba(0,0,0,0.75)' }
                  ),
                }}
              />
            </div>
          )}
          <img 
            src='https://breed-1258140596.cos.ap-shanghai.myqcloud.com/Breeding%20Platform/3D%20%E5%B0%8F%E5%9F%8B%20.png'
            alt="育小星"
            style={{
              width: '105px',
              height: '105px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.35)) drop-shadow(0 0 25px rgba(0,0,0,0.15))',
              transform: 'perspective(1200px) scale(1)',
              transition: 'all 0.3s ease',
            }}
            draggable={false}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1200px) scale(1.06) translateZ(6px)';
              e.currentTarget.style.filter = 'drop-shadow(0 14px 28px rgba(0,0,0,0.4)) drop-shadow(0 0 35px rgba(0,0,0,0.2))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1200px) scale(1) translateZ(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 10px 20px rgba(0,0,0,0.35)) drop-shadow(0 0 25px rgba(0,0,0,0.15))';
            }}
          />
        </div>
      </div>
      
      <style>{`
       @keyframes float3d {
          0%   { transform: translateZ(0) translateY(0); }
          50%  { transform: translateZ(6px) translateY(-3px); }
          100% { transform: translateZ(0) translateY(0); }
        }
      `}</style>

      <Modal
        title={null}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={880}
        styles={{
          mask: { backdropFilter: 'blur(2px)' },
          content: {
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            padding: 0,
          },
          body: { padding: 0 },
        }}
        destroyOnClose
      >
        <div
          style={{
            height: 640,
            background: token.colorBgContainer,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              height: 52,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              borderBottom: `1px solid ${token.colorSplit}`,
              fontWeight: 600,
            }}
          >
            {displayTitle}
          </div>
          <div style={{ flex: 1, overflow: 'hidden', padding: 16 }}>
            <AIChat embedded hasInitialized={hasInitialized} externalGreeting={hoverFullText} greetingSignal={0} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AIAssistant;