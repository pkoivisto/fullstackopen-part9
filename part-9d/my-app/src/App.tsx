interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackround extends CoursePartWithDescription {
  backroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartWithDescription {
  requirements: Array<string>;
  kind: "special";
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackround
  | CoursePartSpecial;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic",
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group",
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic",
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backroundMaterial:
      "https://type-level-typescript.com/template-literal-types",
    kind: "background",
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    kind: "special",
  },
];

const GenericPartDescription = ({
  coursePart,
  children,
}: {
  coursePart: CoursePart;
  children: React.ReactNode;
}) => (
  <p>
    <b>
      {coursePart.name} {coursePart.exerciseCount}
    </b>
    <br />
    {children}
  </p>
);

const SpecificPartDescription = ({
  coursePart,
}: {
  coursePart: CoursePart;
}) => {
  switch (coursePart.kind) {
    case "basic":
      return <i>{coursePart.description}</i>;
    case "group":
      return <>project exercises {coursePart.groupProjectCount}</>;
    case "background":
      return (
        <>
          <i>{coursePart.description}</i>
          <br />
          submit to {coursePart.backroundMaterial}
        </>
      );
    case "special":
      return <>required skills: {coursePart.requirements.join(", ")}</>;
  }
};

const Part = ({ coursePart }: { coursePart: CoursePart }) => (
  <GenericPartDescription coursePart={coursePart}>
    <SpecificPartDescription coursePart={coursePart} />
  </GenericPartDescription>
);

const Header = ({ courseName }: { courseName: string }) => (
  <h1>{courseName}</h1>
);

const Content = ({ courseParts }: { courseParts: Array<CoursePart> }) => {
  return (
    <>
      {courseParts.map((part, i) => (
        <Part key={i} coursePart={part}></Part>
      ))}
    </>
  );
};

const Total = ({ courseParts }: { courseParts: Array<CoursePart> }) => {
  return (
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};

const App = () => {
  const courseName = "Half Stack application development";

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
