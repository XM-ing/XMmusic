/// <reference types="vite/client" />

interface Window {
    electronAPI: {
        minWindow: () => void;
        unmaxWindow:() => void;
        maxWindow: () => void;
        isMaximized: () => boolean;
        closeWindow: () => void;
    };
}
