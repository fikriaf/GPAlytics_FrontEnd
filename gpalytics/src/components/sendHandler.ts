let handleSendGlobal: ((text: string) => void) | null = null;

export const setHandleSend = (fn: (text: string) => void) => {
    handleSendGlobal = fn;
};

export const runHandleSend = (text: string) => {
    if (handleSendGlobal) handleSendGlobal(text);
};
