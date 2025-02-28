import { ContributionCalendar } from "react-contribution-calendar";

const contributionData = [
  {
    "2023-04-20": { level: 2 },
  },
  {
    "2023-07-08": { level: 1 },
  },
  {
    "2023-07-09": { level: 4 },
  },
  {
    "2024-03-31": { level: 3 },
  },
];

export const ContributionCalenderCard = () => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex row">
          <div className="col-11">
            <ContributionCalendar
              data={contributionData}
              dateOptions={{
                start: "2023-04-04",
                end: "2024-04-04",
                // daysOfTheWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                startsOnSunday: true,
                includeBoundary: true,
              }}
              styleOptions={{
                theme: "grass",
                cx: 20,
                cy: 20,
                cr: 2,
              }}
              // visibilityOptions={{
              //   hideDescription: false,
              //   hideMonthLabels: false,
              //   hideDayLabels: false,
              // }}
              scroll={false}
            />
          </div>
          <div className="col-1">
            <button type="button" className="btn btn-original w-100 mb-1">
              2025
            </button>
            <button type="button" className="btn btn-original w-100 mb-1">
              2024
            </button>
            <button type="button" className="btn btn-original w-100 mb-1">
              2023
            </button>
            <button type="button" className="btn btn-original w-100">
              2022
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
