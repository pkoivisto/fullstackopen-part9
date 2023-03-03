import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

enum Visibility {
  Great = "great",
  Good = "good",
  Ok = "ok",
  Poor = "poor",
}

enum Weather {
  Sunny = "sunny",
  Rainy = "rainy",
  Cloudy = "cloudy",
  Stormy = "stormy",
  Windy = "windy",
}

interface DiaryEntry {
  id: number;
  date: string;
  visibility: Visibility;
  weather: Weather;
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
    visibility: Visibility.Ok,
    weather: Weather.Cloudy,
    comment: "",
  });

  const setVisibility = (visibility: Visibility) =>
    setDiaryEntry({ ...diaryEntry, visibility });
  const setWeather = (weather: Weather) =>
    setDiaryEntry({ ...diaryEntry, weather });

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
  };

  return (
    <>
      <h1>Add new entry</h1>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      <p>
        <label htmlFor="new-date">date</label>{" "}
        <input
          id="new-date"
          type="date"
          value={diaryEntry.date}
          onChange={(event) => {
            setDiaryEntry({ ...diaryEntry, date: event.target.value });
          }}
        />
      </p>
      <fieldset>
          <legend>Visibility</legend>
          {Object.values(Visibility).map((visibility) => (
            <div key={visibility}>
              <label htmlFor={visibility}>{visibility}</label>
              <input
                type="radio"
                id={visibility}
                checked={diaryEntry.visibility === visibility}
                onChange={(event) => {
                  if (event.target.value) {
                    setVisibility(visibility);
                  }
                }}
              />
            </div>
          ))}
        </fieldset>
      <fieldset>
        <legend>Weather</legend>
        {Object.values(Weather).map((weather) => (
          <div key={weather}>
            <label htmlFor={weather}>{weather}</label>
            <input
              type="radio"
              id={weather}
              checked={diaryEntry.weather === weather}
              onChange={(event) => {
                if (event.target.value) {
                  setWeather(weather);
                }
              }}
            />
          </div>
        ))}
      </fieldset>
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
