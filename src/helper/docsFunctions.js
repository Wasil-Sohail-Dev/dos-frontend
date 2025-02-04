// Function to extract filename from URL
export const getFileName = (url) => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const urlParts = decodedUrl.split("/");
    return urlParts[urlParts.length - 1];
  } catch (error) {
    return url.split("/").pop() || "Unknown File";
  }
};

export const getFileType = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  switch (extension) {
    case "pdf":
      return "pdf";
    case "jpg":
    case "jpeg":
    case "png":
      return "image";
    case "ppt":
    case "pptx":
      return "ppt";
    default:
      return "file";
  }
};
export const getTimeAgo = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInSeconds = Math.floor((now - created) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  } else {
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  }
};
