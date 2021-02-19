declare module "parse-srt" {
  export interface Caption {
    id: number;
    start: number;
    end: number;
    text: string;
  }

  export default function (data: string): Caption[];
}
