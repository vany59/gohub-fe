import axios from "axios";
import i18n from "../i18n";

const CONTENT_TYPE = "application/json";
const CONTENT_TYPE_FILE = "multipart/form-data";

export const upload = async ({ url, token, file, files }) => {
  const headers = {
    "Accept-Language": i18n.locale,
    "Content-Type": CONTENT_TYPE_FILE
  };
  if (token != null) headers["Authorization"] = "Bearer " + token;

  const body = new FormData();
  if (file) body.append("file", file);
  else if (files)
    for (const f of files) {
      body.append("files", f);
    }

  try {
    const { data } = await axios.post(process.env.VUE_APP_API + url, body, {
      headers
    });
    return data;
  } catch (e) {
    const { data } = e.response || {
      data: { code: 500, message: e.toString() }
    };
    return data;
  }
};

export const post = async ({
  url,
  token,
  body,
  page,
  limit,
  sorts,
  filters
}) => {
  const headers = {
    "Accept-Language": i18n.locale,
    "Content-Type": CONTENT_TYPE
  };
  if (token != null) headers["Authorization"] = "Bearer " + token;
  try {
    const { data } = await axios.post(
      process.env.VUE_APP_API + url,
      body ? body : { page, limit, sorts, filters },
      { headers }
    );
    return data;
  } catch (e) {
    const { data } = e.response || {
      data: { code: 500, message: e.toString() }
    };
    return data;
  }
};

export const put = async ({ url, token, body }) => {
  const headers = {
    "Accept-Language": i18n.locale,
    "Content-Type": CONTENT_TYPE
  };
  if (token != null) headers["Authorization"] = "Bearer " + token;
  try {
    const { data } = await axios.put(process.env.VUE_APP_API + url, body, {
      headers
    });
    return data;
  } catch (e) {
    const { data } = e.response || {
      data: { code: 500, message: e.toString() }
    };
    return data;
  }
};

export const get = async ({ url, token }) => {
  const headers = {
    "Accept-Language": i18n.locale,
    "Content-Type": CONTENT_TYPE
  };
  if (token != null) headers["Authorization"] = "Bearer " + token;
  try {
    const { data } = await axios.get(process.env.VUE_APP_API + url, {
      headers
    });
    return data;
  } catch (e) {
    const { data } = e.response || {
      data: { code: 500, message: e.toString() }
    };
    return data;
  }
};

export const del = async ({ url, token }) => {
  const headers = {
    "Accept-Language": i18n.locale,
    "Content-Type": CONTENT_TYPE
  };
  if (token != null) headers["Authorization"] = "Bearer " + token;
  try {
    const { data } = await axios.delete(process.env.VUE_APP_API + url, {
      headers
    });
    return data;
  } catch (e) {
    const { data } = e.response || {
      data: { code: 500, message: e.toString() }
    };
    return data;
  }
};
