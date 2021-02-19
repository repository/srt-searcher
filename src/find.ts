import { readFile } from "fs/promises";
import parse, { Caption } from "parse-srt";

export interface Formatted {
  text: string;
  timings: {
    time: number;
    index: number;
  }[];
}

function format(captions: Caption[]) {
  const out: Formatted = {
    text: "",
    timings: [],
  };

  for (const i in captions) {
    const cap = captions[i];

    out.timings.push({
      time: cap.start,
      index: out.text.length,
    });
    out.text += (parseInt(i) === 0 ? "" : " ") + cap.text;
  }

  return out;
}

function search(pattern: RegExp, input: Formatted) {
  const indexes: number[] = [];

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(input.text)) !== null) {
    indexes.push(match.index);
  }

  const times: number[] = [];
  for (const index of indexes) {
    const timeIndex = input.timings.findIndex(
      ({ index: match }) => match >= index,
    );

    times.push(input.timings[timeIndex - 1].time);
  }

  return times;
}

export default async function (path: string, pattern: RegExp) {
  const data = await readFile(path, "utf-8");
  const parsed = parse(data);

  return search(pattern, format(parsed));
}
