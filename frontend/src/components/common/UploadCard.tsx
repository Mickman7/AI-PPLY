import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons"; // Use cloud upload icon

interface UploadCardProps {
  onFileSelected?: (file: File | null) => void;
  file?: File | null; // Add this prop to accept a pre-selected file
}

const UploadCard: React.FC<UploadCardProps> = ({ onFileSelected, file }) => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);

  // Sync with the external file prop
  useEffect(() => {
    if (file) {
      setAcceptedFiles([file]);
    } else {
      setAcceptedFiles([]);
    }
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
    onDrop: (files: File[]) => {
      if (files.length > 0) {
        setAcceptedFiles(files);
        if (onFileSelected) {
          onFileSelected(files[0]);
        }
      }
    },
  });

  const handleRemoveFile = () => {
    setAcceptedFiles([]);
    if (onFileSelected) {
      onFileSelected(null);
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`w-[95%] h-40 border border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <FontAwesomeIcon icon={faCloudUploadAlt} className="text-3xl text-gray-500 mb-2" /> {/* Add cloud upload icon */}
      <p className="text-gray-700 text-center">
        {isDragActive ? "Drop your file here..." : "Drag & drop your Job Description here, or click to browse"}
      </p>

      {acceptedFiles.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Selected file:</p>
          <ul>
            {acceptedFiles.map((file) => (
              <li key={file.name} className="flex items-center justify-between gap-2">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the dropzone
                    handleRemoveFile();
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadCard;