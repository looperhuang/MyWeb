import axios from 'axios';

export interface News {
  status: string;
  totalResults: number;
  articles: [
    {
      source: {
        id: string;
        name: string;
      };
      author: string;
      title: string;
      description: string | null;
      url: string;
      urlToImage: string | null;
      publishedAt: Date;
      content: string | null;
    }
  ];
}

const newsApi = axios.create({
  baseURL: 'https://newsapi.org',
});

const getTwHeadlines = async () => {
  const apiKey = import.meta.env.VITE_APP_NEWSKEY;
  const url = `/v2/top-headlines?country=us&apiKey=${apiKey}`;
  const res = await newsApi.get<News>(url);
  return res.data;
};

export { getTwHeadlines };
