import { useDropzone } from "react-dropzone";

interface UploadCardProps {
  onFileSelected?: (file: File) => void;
}

const UploadCard: React.FC<UploadCardProps> = ({ onFileSelected }) => {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
    onDrop: (files: File[]) => {
      if (files.length > 0 && onFileSelected) {
        onFileSelected(files[0]); // ✅ Type-safe
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full max-w-lg border border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer transition ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-gray-700">
        {isDragActive ? "Drop your file here..." : "Drag & drop your resume file here"}
      </p>

      {acceptedFiles.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Selected file:</p>
          <ul>
            {acceptedFiles.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
