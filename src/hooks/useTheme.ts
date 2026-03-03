import { useState, useEffect } from "react";
import { getStoredTheme, getSystemTheme } from "@/lib/theme";

/**
 * Хук для отслеживания текущей темы (dark/light)
 * Реагирует на изменения темы через MutationObserver и системные изменения
 */
export const useTheme = () => {
    const getEffectiveTheme = (): 'light' | 'dark' => {
        const stored = getStoredTheme();
        if (stored === 'system' || !stored) {
            return getSystemTheme();
        }
        return stored;
    };

    const [isDark, setIsDark] = useState(() => getEffectiveTheme() === 'dark');

    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => {
            const storedTheme = getStoredTheme();
            if (storedTheme === 'system' || !storedTheme) {
                updateTheme();
            }
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else {
            mediaQuery.addListener(handleSystemThemeChange);
        }

        return () => {
            observer.disconnect();
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleSystemThemeChange);
            } else {
                mediaQuery.removeListener(handleSystemThemeChange);
            }
        };
    }, []);

    return isDark;
};
