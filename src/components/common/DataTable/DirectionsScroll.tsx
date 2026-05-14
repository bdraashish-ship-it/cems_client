import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
import "./directionsScroll.css";

interface DirectionsScrollProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollStep?: number;
  topButtonThreshold?: number;
}

export const DirectionsScroll: React.FC<DirectionsScrollProps> = ({
  containerRef,
  scrollStep = 320,
  topButtonThreshold = 200,
}) => {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setShowLeft(el.scrollLeft > 10);
      setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
      setShowTop(el.scrollTop > topButtonThreshold);
    };

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef, topButtonThreshold]);

  return (
    <>
      {showLeft && (
        <button className="dir-btn left" onClick={() => elScroll(containerRef, -scrollStep)}>
          <ChevronLeft size={18} />
        </button>
      )}
      {showRight && (
        <button className="dir-btn right" onClick={() => elScroll(containerRef, scrollStep)}>
          <ChevronRight size={18} />
        </button>
      )}
      {showTop && (
        <button className="dir-btn top" onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}>
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
};

function elScroll(ref: React.RefObject<HTMLDivElement | null>, left: number) {
  ref.current?.scrollBy({ left, behavior: "smooth" });
}
