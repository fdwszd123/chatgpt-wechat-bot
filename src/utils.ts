import config from "./config.js";
const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

const awaitErrorWrap = async <T, U = any>(
  promise: Promise<T>
): Promise<[U | null, T | null]> => {
  try {
    const data = await promise;
    return [null, data];
  } catch (err: any) {
    return [err, null];
  }
};

export const retryRequest = async <T>(
  promise: () => Promise<T>,
  retryTimes = 3,
  retryInterval = 10000
) => {
  let output: [any, T | null] = [null, null];

  for (let a = 0; a < retryTimes; a++) {
    output = await awaitErrorWrap(promise());

    if (output[1]) {
      break;
    }

    console.log(`retry ${a + 1} times, error: ${output[0]}`);
    await sleep(retryInterval);
  }

  if (output[0]) {
    throw output[0];
  }

  return output[1];
};

export const isSong = (receiver, room, content: string) => {
  let str = "";
  if (room) {
    const pattern = RegExp(`^@${receiver.name()}\\s+${config.groupKey}[\\s]*`);
    str = content.replace(pattern, "");
  } else {
    if (config.privateKey === "") {
      str = content.substring(config.privateKey.length).trim();
    }
  }
  let arr = str.split("-");
  if (arr.length == 2 && arr[0] == "点歌" && arr[1] != "") {
    return arr[1];
  } else {
    return false;
  }
};
