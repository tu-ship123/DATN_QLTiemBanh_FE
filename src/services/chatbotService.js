import apiClient from './apiService';

const BASE = '/api/v1/chatbot';

export const chatbotService = {
  /**
   * Hỏi trợ lý ảo AI.
   * @param {string} prompt
   * @param {File|null} file - tệp đính kèm tuỳ chọn (.txt/.pdf/.docx/.png/.jpg)
   */
  ask(prompt, file = null) {
    const formData = new FormData();
    formData.append('prompt', prompt);
    if (file) formData.append('file', file);

    return apiClient.post(`${BASE}/ask`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });
  },
};
