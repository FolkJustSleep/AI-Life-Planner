import { supabase, getCurrentSupabaseUserId, apiUrl } from '../utils/supabase';
import { ChatDataModel, ChatRequestModel, ChatResponseModel } from '../models/chat_model';

export class ChatService {

    // for sending chat data to api
    static async fetchAllChat(): Promise<ChatResponseModel> {
        const userId = await getCurrentSupabaseUserId();

        if (!userId) {
            throw new Error('User not authenticated. Cannot fetch chat data.');
        }

        try {
            const session = await supabase.auth.getSession();
            const accessToken = session.data.session?.access_token;
            if (!accessToken) {
                throw new Error('No active Supabase session found. Please log in.');
            }

            const response = await fetch(`${apiUrl}/api/v1/ai_gen/chat/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    'ngrok-skip-browser-warning': 'true',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch chat data: ${response.statusText}`);
            }

            return (await response.json()) as ChatResponseModel;
        } catch (error) {
            console.error('Error fetching chat data:', error);
            throw error;
        }
    }

    // for sending chat data to api
    static async sendChatMessage(chatRequest: ChatRequestModel): Promise<ChatResponseModel> {
        const userId = await getCurrentSupabaseUserId();

        if (!userId) {
            throw new Error('User not authenticated. Cannot send chat message.');
        }

        try {
            const session = await supabase.auth.getSession();
            const accessToken = session.data.session?.access_token;

            if (!accessToken) {
                throw new Error('No active Supabase session found. Please log in.');
            }

            const response = await fetch(`${apiUrl}/api/v1/ai_gen/chat/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(chatRequest),
            });

            if (!response.ok) {
                throw new Error(`Failed to send chat message: ${response.statusText}`);
            }

            return (await response.json()) as ChatResponseModel;
        } catch (error) {
            console.error('Error sending chat message:', error);
            throw error;
        }   
    }
}

