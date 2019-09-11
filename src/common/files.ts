import { join as joinPath, resolve as resolvePath, parse } from "path";
import { promisify } from "util";
import { curry } from "ramda";
import * as fs from "fs";
import log from "./log";

const DEFAULT_REPORT_PATH = `${Date.now().toString()}.json`;

////////////
/// Create

export const writeToNewFile = async (
  path: any,
  data: any,
  writeOptions: fs.WriteFileOptions = {}
) => {
  await createFolderForFile(path);
  await write(path, data, writeOptions).catch(e => {
    log(`Failed to save file to: ${path} with error: ${e}`);
    return e;
  });
};

export const writeObjectToFile = curry(
  async (filePath: string = DEFAULT_REPORT_PATH, object: object) => {
    const resolvedPath = resolvePath(process.cwd(), filePath);

    const file = await writeToNewFile(
      resolvedPath,
      JSON.stringify(object, null, 2)
    );
    return file;
  }
);

export const createFolderForFile = async (filePath: string) => {
  const { dir } = parse(filePath);
  return await mkdir(dir, { recursive: true }).catch(({ code }) => {
    if (code === "EEXIST") {
      // log(`${dir} already exists.`, "pending");
      return;
    }

    if (code === "EACCES") {
      // log(`${dir} cannot be accessed.`, "pending");
      return;
    }
  });
};

export const writeReport = (
  reportType: string = "misc",
  content: string | object,
  filePath: string = DEFAULT_REPORT_PATH
) => {
  if (typeof content === "object") {
    return writeObjectToFile(
      `${createPathForReport(reportType)}${filePath}`,
      content
    );
  } else {
    return write(`${createPathForReport(reportType)}${filePath}`, content);
  }
};

export const createPathForReport = reportType =>
  `./carmen-reports/${reportType}/`;

export const createReportWriter = (
  reportType: string,
  filePath: string = DEFAULT_REPORT_PATH
) => content => writeReport(reportType, content, filePath);

export const createFolderPathFromUrl = url => {
  const [urlWithoutParams] = url.split("?");
  const cleanUrl = urlWithoutParams
    .replace("http://", "")
    .replace("https://", "");
  return cleanUrl;
};

////////////
/// Read
export const getContents = async path => {
  const fullPath = joinPath(path);

  return await read(fullPath, { encoding: "utf-8" });
};

export const exists = async path => {
  return await access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(err => {
      return false;
    });
};

export const access = promisify(fs.access);
export const mkdir = promisify(fs.mkdir);
export const read = promisify(fs.readFile);
export const write = promisify(fs.writeFile);
export const sanitize = string => {
  const regex = /[<>:"\/\\|?*\x00-\x1F]/g;
  return string.replace(regex, "-");
  //TODO: Write a sanitize function to make filename safe
};
////////////
/// Update

////////////
/// Delete
