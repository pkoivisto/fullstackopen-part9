interface CourseExercises {
  name: string;
  exerciseCount: number;
}

const Header = ({ courseName }: { courseName: string }) => (
  <h1>{courseName}</h1>
);

const Content = ({ courseParts }: { courseParts: Array<CourseExercises> }) => {
  return (
    <>
      {courseParts.map(({ name, exerciseCount }, i) => (
        <p key={i}>
          {name} {exerciseCount}
        </p>
      ))}
    </>
  );
};

const Total = ({ courseParts }: { courseParts: Array<CourseExercises> }) => {
  return (
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
    },
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
