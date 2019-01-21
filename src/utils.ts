import _get from "lodash-es/get";

export function titleCase(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

export function keyedValue(
  data: Array<{ [key: string]: any }> = [],
  search: { [key: string]: any },
) {
  return (
    data.find(d =>
      Object.keys(search).every(key => _get(d, key) === search[key]),
    ) || {}
  );
}
