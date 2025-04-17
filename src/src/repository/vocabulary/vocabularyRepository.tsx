import { http } from '@/utils/http';
import { AxiosResponse } from "axios";

interface VocabularyData {
  word: string;
  user_id: number;
}

interface Vocabulary {
  id: number;
  word: string;
  meaning: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

const vocabularyRepository = {
  index: async (userId: number) => {
    return await http.get('/api/vocabulary', { user_id: 1 });
  },
  // create: async () => {
  //   return await http.get(`/api/vocabulary/create`);
  // },
  store: async (data: VocabularyData) => {
    return await http.post(`/api/vocabulary`, data);
  },
  // show: async (id: string) => {
  //   return await http.get(`/api/vocabulary`);
  // },
}

export default vocabularyRepository;
