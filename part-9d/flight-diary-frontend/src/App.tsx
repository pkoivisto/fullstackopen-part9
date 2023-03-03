import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

interface DiaryEntry {
  id: number;
  date: string;
  visibility: string;
  weather: string;
  comment: string;
}

type NewDiaryEntry = Omit<DiaryEntry, "id">;

const AddNewEntry = ({
  onEntryAdded,
}: {
  onEntryAdded: (entry: DiaryEntry) => void;
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [diaryEntry, setDiaryEntry] = useState<NewDiaryEntry>({
    date: "",
    visibility: "",
    weather: "",
    comment: "",
  });

  const postEntry = () => {
    setError(undefined);
    axios
    .post<DiaryEntry>("http://localhost:3001/api/diaries", diaryEntry)
    .then((response) => {
      onEntryAdded(response.data);
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data);
      }
    });
  }

  return (
    <>
      <h1>Add new entry</h1>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      <p>
        <label htmlFor="new-date">date</label>{" "}
        <input
          id="new-date"
          type="text"
          value={diaryEntry.date}
          onChange={(event) => {
            setDiaryEntry({ ...diaryEntry, date: event.target.value });
          }}
        />
      </p>
      <p>
        <label htmlFor="new-visibility">visibility</label>{" "}
        <input
          id="new-visibility"
          type="text"
          value={diaryEntry.visibility}
          onChange={(event) =>
            setDiaryEntry({ ...diaryEntry, visibility: event.target.value })
          }
        />
      </p>
      <p>
        <label htmlFor="new-weather">weather</label>{" "}
        <input
          id="new-weather"
          type="text"
          value={diaryEntry.weather}
          onChange={(event) =>
            setDiaryEntry({ ...diaryEntry, weather: event.target.value })
          }
        />
      </p>
      <p>
        <label htmlFor="new-comment">comment</label>{" "}
        <input
          id="new-comment"
          type="text"
          value={diaryEntry.comment}
          onChange={(event) =>
            setDiaryEntry({ ...diaryEntry, comment: event.target.value })
          }
        />
      </p>
      <button type="submit" onClick={postEntry}>
        Add entry
      </button>
    </>
  );
};

const DiaryEntries = ({
  diaryEntries,
}: {
  diaryEntries: Array<DiaryEntry>;
}) => {
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
  const [diaryEntries, setDiaryEntries] = useState<Array<DiaryEntry>>([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/diaries")
      .then((response: AxiosResponse<Array<DiaryEntry>>) => {
        setDiaryEntries(response.data);
      });
  }, []);

  return (
    <div className="App">
      <AddNewEntry
        onEntryAdded={(entry) => setDiaryEntries([...diaryEntries, entry])}
      />
      <DiaryEntries diaryEntries={diaryEntries} />
    </div>
  );
}

export default App;
