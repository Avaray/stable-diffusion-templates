// I created this file spontaneously and I think it does not work properly
// I will work on it at the last stage of the project
// The idea is to get the list of files in the huggingface datasets
// It will be used in script generation time to make sure that remote files exist
// That's because I don't want to create scripts with broken links

const filesList = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    console.log(`Successfully fetched files list for ${url}`);
    const json = await response.json();
    const list = json.map((file: any) => file.path);
    return list;
  } catch (error) {
    console.error(`Error fetching files list for ${url}:`, error);
    return [];
  }
};

interface Dataset {
  [key: string]: {
    datasetUrl: string;
    files: { [key: string]: string };
  };
}

const data: Dataset = {
  sdxl: {
    datasetUrl: "https://huggingface.co/api/datasets/AddictiveFuture/sdxl-1-0-models-backup/",
    files: {},
  },
  pdxl: {
    datasetUrl: "https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/",
    files: {},
  },
};

export function getFilesList() {
  console.log("Fetching files lists from Huggingface");
  Object.keys(data).forEach(async (key) => {
    const list = await filesList(data[key].datasetUrl);
    console.log(`Fetched ${list.length} files for ${key}`);
    data[key].files = list;
  });
}
