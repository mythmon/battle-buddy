import _get from "lodash-es/get";

export function titleCase(s: string): string {
  return s
    .split(" ")
    .map(p => p.slice(0, 1).toUpperCase() + p.slice(1))
    .join(" ");
}

export function keyedValue(
  data: Array<{ [key: string]: any }> = [],
  search: { [key: string]: any },
): any {
  return (
    data.find(d =>
      Object.keys(search).every(key => _get(d, key) === search[key]),
    ) || {}
  );
}
