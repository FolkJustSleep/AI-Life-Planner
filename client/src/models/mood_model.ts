export interface MoodResponseModel {
    message: string;
    data: MoodData | MoodData[];
}

export interface MoodData {
    user_id: string;
    mood: string;
    note: string;
    created_at: string;
    id: number;
}

export interface MoodRequestModel {
    mood: string;
    note: string;
    user_id?: string;
}

/*
post request model

{
  "mood": "Excellent",
  "note": "nothing to say",
}

post response model
{
  "message": "success",
  "data": {
    "user_id": "2f2fb588-62a7-4c6f-9f59-38ad6ca04b65",
    "mood": "Excellent",
    "note": "nothing to say",
    "created_at": "2025-06-28T22:28:16.4066963+07:00"
  }
}


get request model (query params = user_id)

get response model

single mood data
{
  "message": "success",
  "data": {
    "id": 2,
    "user_id": "2f2fb588-62a7-4c6f-9f59-38ad6ca04b65",
    "mood": "Excellent",
    "note": "nothing to say",
    "created_at": "2025-06-28T15:28:16.406696Z"
  }
}

multiple mood data
*/