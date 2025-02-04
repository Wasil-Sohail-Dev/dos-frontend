import { createSlice } from '@reduxjs/toolkit';
import { sendMessage } from './services';

const initialState = {
  messages: [
    {
      type: 'ai',
      content: "Hello! How's it going? What can I help you with today?"
    }
  ],
  isLoading: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = initialState.messages;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        console.log('Pending state:', state);
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        console.log('Fulfilled action:', action);
        state.isLoading = false;
        const userMessage = {
          type: 'user',
          content: action.meta.arg.message
        };
        const aiMessage = {
          type: 'ai',
          content: action.payload
        };
        state.messages = [...state.messages, userMessage, aiMessage];
        console.log('Updated messages:', state.messages);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        console.log('Rejected action:', action);
        state.isLoading = false;
        state.error = action.error.message;
        const userMessage = {
          type: 'user',
          content: action.meta.arg.message
        };
        const aiMessage = {
          type: 'ai',
          content: "Sorry, I'm having trouble processing your request right now. Please try again later."
        };
        state.messages = [...state.messages, userMessage, aiMessage];
      });
  },
});

export const { clearMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer; 