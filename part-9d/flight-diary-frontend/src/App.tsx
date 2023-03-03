import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

interface DiaryEntry {
  id: number;
  date: string;
  visibility: string;
  weather: string;
}

const DiaryEntries = () => {
  const [diaryEntries, setDiaryEntries] = useState<Array<DiaryEntry>>([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/diaries")
      .then((response: AxiosResponse<Array<DiaryEntry>>) => {
        setDiaryEntries(response.data);
      });
  }, []);

  return (
    <>
      <h1>Diary entries</h1>
      {diaryEntries.map((diaryEntry) => (
        <div key={diaryEntry.id}>
          <h2>{diaryEntry.date}</h2>
          <p>
            visibility: {diaryEntry.visibility}
            <br />
            weather: {diaryEntry.weather}
          </p>
        </div>
      ))}
    </>
  );
};

function App() {
  return <div className="App">
    <DiaryEntries />
  </div>;
}

export default App;
