import axios from 'axios';

export interface Meme {
  id: number;
  url: string;
  src: string;
  author: {
    id: number;
    name: string;
  };
  title: string;
  pageview: number;
  total_like_count: number;
  created_at: {
    timestamp: number;
    date_time_string: string;
  };
  hashtag: string;
  contest: {
    id: number;
    name: string;
  };
}

const memeApi = axios.create({
  baseURL: 'https://memes.tw/wtf',
});

const getHotMeme = async (page: number | 'first' | 'last') => {
  const url = `/api?page=${page}`;
  const res = await memeApi.get<Meme[]>(url);
  return res.data;
};

export { getHotMeme };
