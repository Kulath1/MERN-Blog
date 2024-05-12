import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// a function that make sure the page is displayed from top to bottom
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default ScrollToTop;