import { Gender, Entry, HealthCheckRating } from "./types";

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export const genderSemanticUIIcon = (gender: Gender) => {
  switch (gender) {
    case "male":
      return "man";
    case "female":
      return "woman";
    default:
      return "other gender";
  }
};

export const entrySemanticUIIcon = (entry: Entry) => {
  switch (entry.type) {
    case "Hospital":
      return "hospital";
    case "OccupationalHealthcare":
      return "doctor";
    case "HealthCheck":
      return "stethoscope";
    default:
      return assertNever(entry);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRating = (number: any) => (Object as any).values(HealthCheckRating)
  .filter((prop: HealthCheckRating) => Number.isInteger(prop))
  .includes(number);

export const healthRatingColor = (rating: HealthCheckRating) => {
  switch (rating) {
    case 0:
      return "green";
    case 1:
      return "yellow";
    case 2:
      return "orange";
    case 3:
      return "red";
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasNonEmptyStringProp = (obj: any) => {
  return Object.values(obj)
    .some(prop => prop !== "");
};

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const isPeriod = (start: string, end: string): boolean => {
  return ![start, end].some(date => !isDate(date)) && Date.parse(start) <= Date.parse(end);
};

export const isYYYYMMDD = (date: string): boolean => {
  return /^\d{4}-(((0)[0-9])|((1)[0-2]))-([0-2][0-9]|(3)[0-1])$/.test(date);
};