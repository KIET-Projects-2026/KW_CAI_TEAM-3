const API_BASE_URL = "http://127.0.0.1:8000";

export const summarizeText = async (text, mode = "summarize") => {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
    });
    return response.json();
};

export const analyzeDocument = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/analyze-doc`, {
        method: "POST",
        body: formData,
    });
    return response.json();
};

export const chatWithAI = async (message, context) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context }),
    });
    return response.json();
};
