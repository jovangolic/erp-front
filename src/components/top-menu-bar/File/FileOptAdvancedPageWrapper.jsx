import { useParams } from "react-router-dom";
import FileOptAdvancedPage from "./FileOptAdvancedPage";

const FileOptAdvancedPageWrapper = () => {
  const { fileOptId } = useParams(); 
  return <FileOptAdvancedPage fileOptId={fileOptId} />;
};

export default FileOptAdvancedPageWrapper;