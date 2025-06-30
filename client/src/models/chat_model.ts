export interface ChatResponseModel {
    message: string;
    data:ChatDataModel | ChatDataModel[];
}

export interface ChatDataModel{
    id: string;
    user_id: string;
    message: string;
    sender: string;
    created_at: string;
}

export interface ChatRequestModel {
    message: string;
    sender: string;
}

/*
get all chat response model
{
  "message": "success",
  "data": [
    {
      "id": "4ad82790-723e-41a3-ab09-02f42acdc482",
      "user_id": "2f2fb588-62a7-4c6f-9f59-38ad6ca04b65",
      "message": "hello chat",
      "sender": "user",
      "created_at": "2025-06-28T17:06:58.412048Z"
    },
    {
      "id": "050bf70e-a9e1-4ae8-8c49-dfe6a6539cec",
      "user_id": "2f2fb588-62a7-4c6f-9f59-38ad6ca04b65",
      "message": "Hello! How can I help you today?\n",
      "sender": "ai",
      "created_at": "2025-06-28T17:07:00.114734Z"
    }
  ]
}

chat request model
{
  "message": "how are you",
  "sender": "user"
}

// fetch all chat and display 
// send message request model
// refetch all chat and display

*/